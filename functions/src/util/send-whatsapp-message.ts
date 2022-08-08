/* eslint no-async-promise-executor: "off" */
import * as admin from "firebase-admin";
import * as path from "path";
import * as os from "os";
import { Client, LocalAuth } from "whatsapp-web.js";
import * as extract from "extract-zip";

const getSessionUrl = (userUid: string) =>
  path.join(os.tmpdir(), `.wwebjs_auth/session-${userUid}`);
const getZipFilePath = (userUid: string) =>
  path.join(os.tmpdir(), `session-${userUid}.zip`);

export const sendWhatsAppMessageToChat = async (
  userUid: string,
  chatId: string,
  message: string,
): Promise<void> => {
  const sessionUrl = getSessionUrl(userUid);
  const storageSessionUrl = `users/${userUid}/whatsapp/session.zip`;
  const zipFilePath = getZipFilePath(userUid);

  try {
    const sessionFileResult = await admin
      .storage()
      .bucket()
      .file(storageSessionUrl)
      .download({
        destination: zipFilePath,
      });

    console.log("Downloaded session file", sessionFileResult);
    console.log("Attempting to un-zip now", zipFilePath);
    await extract(path.resolve(zipFilePath), {
      dir: path.resolve(sessionUrl),
    });
    console.log("Extraction complete");
  } catch (e) {
    console.error("Can't find session", e);
    return;
  }

  console.log(userUid);
  console.log("Launching WhatsApp client");

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
      dataPath: path.join(os.tmpdir(), ".wwebjs_auth"),
    }),
  });

  return new Promise((resolve, reject) => {
    client.on("qr", async () => {
      await client.destroy();
      reject(new Error("Require QR code"));
    });

    client.on("ready", async () => {
      const chat = await client.getChatById(chatId);
      await chat.sendMessage(message);
      resolve();
    });

    client.on("auth_failure", async () => {
      await client.destroy();
      reject(new Error("Failed to authenticate"));
    });

    console.log("Initializing client");
    client.initialize();
  });
};
