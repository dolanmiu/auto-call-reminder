export enum WhatsAppAuthStatus {
  REQUIRE_AUTH = "REQUIRE_AUTH",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  PENDING = "PENDING",
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

export type WhatsAppAuthResponse =
  | WhatsAppRequireAuthAuthResponse
  | WhatsAppSuccessAuthResponse
  | WhatsAppPendingAuthResponse;
