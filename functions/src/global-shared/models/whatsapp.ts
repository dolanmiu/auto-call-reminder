export enum WhatsAppAuthStatus {
  REQUIRE_AUTH = "REQUIRE_AUTH",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  PENDING = "PENDING",
  AUTHENTICATED = "SIDE_AUTHENTICATED",
  GETTING_CHATS = "GETTING_CHATS",
}

export interface WhatsAppChat {
  readonly id: {
    readonly server: string;
    readonly user: string;
    readonly _serialized: string;
  };
  readonly name: string;
}

interface WhatsAppAuthResponseBase {
  readonly status: WhatsAppAuthStatus;
  readonly message: string;
}

export interface WhatsAppRequireAuthAuthResponse
  extends WhatsAppAuthResponseBase {
  readonly status: WhatsAppAuthStatus.REQUIRE_AUTH;
  readonly qrCode: string;
}

export interface WhatsAppSuccessAuthResponse extends WhatsAppAuthResponseBase {
  readonly status: WhatsAppAuthStatus.SUCCESS;
  readonly chats: WhatsAppChat[];
}

export interface WhatsAppFailedAuthResponse extends WhatsAppAuthResponseBase {
  readonly status: WhatsAppAuthStatus.FAILED;
  readonly message: string;
}

export interface WhatsAppPendingAuthResponse extends WhatsAppAuthResponseBase {
  readonly status: WhatsAppAuthStatus.PENDING;
}

export interface WhatsAppGettingChatsAuthResponse
  extends WhatsAppAuthResponseBase {
  readonly status: WhatsAppAuthStatus.GETTING_CHATS;
}

export type WhatsAppAuthResponse =
  | WhatsAppRequireAuthAuthResponse
  | WhatsAppSuccessAuthResponse
  | WhatsAppFailedAuthResponse
  | WhatsAppPendingAuthResponse
  | WhatsAppGettingChatsAuthResponse;

export interface WhatsAppConfig {
  readonly cron: string;
  readonly to: string;
  readonly message?: string;
  readonly gpt3Prompt?: string;
  readonly enabled: boolean;
}

export interface WhatsAppMessage<T> {
  readonly createdAt: T;
  readonly status: string;
  readonly content: string;
}
