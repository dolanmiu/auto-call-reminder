import os from "os";
import path from "path";
import { Storage } from "@google-cloud/storage";
import { Client, LocalAuth } from "whatsapp-web.js";
import { zip, COMPRESSION_LEVEL } from "zip-a-folder";
import fs from "fs";
import extract from "extract-zip";
import { Socket } from "socket.io";

const FIREBASE_SERVICE_ACCOUNT = process.env.FIREBASE_SERVICE_ACCOUNT ?? "";
const FIREBASE_STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET ?? "";

const credentials = JSON.parse(FIREBASE_SERVICE_ACCOUNT);
const storage = new Storage({ projectId: credentials.project_id, credentials });

const clients = new Map<string, { client: Client; sockets: Socket[] }>();

const socketEmit = (userUid: string, event: string, data: any): void => {
  const payload = clients.get(userUid);

  if (!payload || !payload.sockets) {
    return;
  }

  for (const socket of payload.sockets) {
    socket.emit(event, data);
  }
};

process.on("SIGINT", async () => {
  console.log("(SIGINT) Shutting down...");
  for (const [, payload] of clients) {
    await payload.client.destroy();
  }
  console.log("destroyed client");
  process.exit(0);
});

const getSessionUrl = (userUid: string) =>
  path.join(os.tmpdir(), `.wwebjs_auth/session-${userUid}`);
const getZipFilePath = (userUid: string) =>
  path.join(os.tmpdir(), `session-${userUid}.zip`);
const getStorageSessionUrl = (userUid: string) =>
  `users/${userUid}/whatsapp/session.zip`;

export const onJoin = async (
  userUid: string,
  socket: Socket,
): Promise<void> => {
  if (clients.has(userUid)) {
    const payload = clients.get(userUid);

    if (!payload) {
      return;
    }

    payload.sockets.push(socket);

    console.error(`Already has ${userUid} connected. Destroying first`);
  } else {
    await createClient(userUid, socket);
  }
};

export const onLeave = async (
  userUid: string,
  socket: Socket,
): Promise<void> => {
  if (clients.has(userUid)) {
    const payload = clients.get(userUid);
    if (!payload) {
      return;
    }

    let index = payload.sockets.indexOf(socket);
    if (index !== -1) {
      payload.sockets.splice(index, 1);
    }
  }
};

const createClient = async (userUid: string, socket: Socket) => {
  console.log("Launching WhatsApp client", userUid);

  const sessionUrl = getSessionUrl(userUid);
  const storageSessionUrl = getStorageSessionUrl(userUid);
  const zipFilePath = getZipFilePath(userUid);

  try {
    socket.emit("SIDE_AUTHENTICATED", {
      message: `Trying to find WhatsApp Link`,
    });

    const sessionFileResult = await storage
      .bucket(FIREBASE_STORAGE_BUCKET)
      .file(storageSessionUrl)
      .download({
        destination: zipFilePath,
      });

    console.log("Downloaded session file", sessionFileResult);
    console.log(`Attempting to un-zip now`, zipFilePath);
    await extract(path.resolve(zipFilePath), { dir: path.resolve(sessionUrl) });
    console.log("Extraction complete");
    socket.data.authRestored = true;
    socket.emit("SIDE_AUTHENTICATED", {
      message: `Found WhatsApp Link. Initializing...`,
    });
  } catch (e) {
    console.log(e);
    socket.emit("SIDE_AUTHENTICATED", {
      message: `No WhatsApp Link found, will need to create one`,
    });
    console.log(`Can't find session, this is fine, creating one later`);
  }

  const client = new Client({
    puppeteer: {
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--single-process", // <- this one doesn't works in Windows
        "--disable-gpu",
      ],
      handleSIGINT: false,
    },
    authStrategy: new LocalAuth({
      clientId: userUid,
      dataPath: path.join(os.tmpdir(), `.wwebjs_auth`),
    }),
  });

  clients.set(userUid, {
    client,
    sockets: [socket],
  });
  console.log(`Added client ${userUid} to list of clients`);

  client.on("qr", (qr) => {
    socket.data.authRestored = false;
    // Generate and scan this code with your phone
    console.log("QR RECEIVED", qr);
    socketEmit(userUid, "REQUIRE_AUTH", {
      qrCode: qr,
      status: "REQUIRE_AUTH",
      message: "Need to scan QR code to create WhatsApp Link",
    });
  });

  client.on("ready", async () => {
    console.log("Client is ready!");

    socketEmit(userUid, "GETTING_CHATS", {
      status: "GETTING_CHATS",
      message: "Initialized! Trying to retrieve chats",
    });

    const chats = await client.getChats();

    socketEmit(userUid, "SUCCESS", {
      chats: chats.map((c) => ({
        id: c.id,
        name: c.name,
      })),
      status: "SUCCESS",
      message: "Successful Authentication",
    });
  });

  client.on("auth_failure", async (msg) => {
    socketEmit(userUid, "FAILED", {
      message: msg,
      status: "FAILED",
    });
    destroyClient(userUid);
  });

  client.on("authenticated", async (session) => {
    console.log("authenticated!");

    socketEmit(userUid, "SIDE_AUTHENTICATED", {
      message: `Authenticated!`,
    });

    if (!socket.data.authRestored) {
      socketEmit(userUid, "SIDE_AUTHENTICATED", {
        message: `Persisting WhatsApp Link`,
      });

      while (true) {
        try {
          await zip(sessionUrl, zipFilePath, {
            compression: COMPRESSION_LEVEL.high,
          });
          break;
        } catch (e) {
          console.error(e);
        }
      }

      console.log(`Writing session data to Storage`, zipFilePath);

      const storageRes = await storage
        .bucket(FIREBASE_STORAGE_BUCKET)
        .upload(zipFilePath, {
          destination: storageSessionUrl,
        });

      socketEmit(userUid, "SIDE_AUTHENTICATED", {
        message: `Persisted WhatsApp Link`,
      });

      console.log("Written files to storage", storageRes);
    }
  });

  client.on("change_state", (state) => {
    console.log("State changed", state);
  });

  client.on("disconnected", () => {
    destroyClient(userUid);
  });

  console.log("Initializing client");
  await client.initialize();
};

const destroyClient = async (userUid: string) => {
  const payload = clients.get(userUid);

  if (!payload) {
    return;
  }

  fs.rmSync(getSessionUrl(userUid), {
    recursive: true,
    force: true,
  });

  console.log("Deleting zip file");
  fs.rmSync(getZipFilePath(userUid), { recursive: true, force: true });

  try {
    await payload.client.destroy();
  } catch {}

  clients.delete(userUid);

  console.log("destroyed client");
};
