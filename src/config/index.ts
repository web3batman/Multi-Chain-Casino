export enum ENVS {
  Production = "production",
  Development = "development",
  Local = "local",
}

// Load environment variables
export const IS_PRODUCTION: boolean = process.env.NODE_ENV === ENVS.Production;

export const BASE_URL: string = process.env.BASE_URL;
export const PORT: number = parseInt(process.env.PORT);
export const ALLOW_HOSTS: Array<string> = process.env.ALLOW_HOSTS?.split(",");
export const SOCKET_ALLOW_HOSTS: Array<string> =
  process.env.SOCKET_ALLOW_HOSTS?.split(",");
export const FILE_FOLDER: string = "files";

export const ENABLE_MAINTENANCE_ONSTART: boolean =
  process.env.ENABLE_MAINTENANCE_ONSTART === "true";
export const ENABLE_LOGIN_ONSTART: boolean =
  process.env.ENABLE_LOGIN_ONSTART === "true";

// Database configs
export const MONGO_URL: string = process.env.MONGO_URL;

// Security configs
export const TOKEN_SECRET: string = process.env.TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET: string = process.env.TOKEN_SECRET;
export const TOKEN_LIFE: number | string = process.env.TOKEN_LIFE;
export const ACCESS_TOKEN_LIFE = Number(process.env.ACCESS_TOKEN_LIFE);
export const REFRESH_TOKEN_LIFE = Number(process.env.REFRESH_TOKEN_LIFE);

export const SECURITY_CRYPTO_ENC_KEY: string =
  process.env.SECURITY_CRYPTO_ENC_KEY;
export const SECURITY_CRYPTO_SEC_KEY: string =
  process.env.SECURITY_CRYPTO_SEC_KEY;

// Email service configs
export const SENDGRID_API_KEY: string = process.env.SENDGRID_API_KEY;
export const SENDGRID_SENDER: string = process.env.SENDGRID_SENDER;
export const SENDGRID_SUPPORT: string =
  process.env.SENDGRID_SUPPORT || SENDGRID_SENDER;
export const SMTP_APP_PASSWORD: string = process.env.SMTP_APP_PASSWORD;
export const SMTP_APP_USER: string = process.env.SMTP_APP_USER;

export const POSTMARK_SERVER_TOKEN: string = process.env.POSTMARK_SERVER_TOKEN;

// Blockchain configs
export const BLOCKCHAIN_HTTPPROVIDER_API: string =
  process.env.BLOCKCHAIN_HTTPPROVIDER_API;
export const IS_MAINNET: boolean =
  process.env.BLOCKCHAIN_KUJIRA_NETWORK === "mainnet";

// Socket.io configs

// Site configs
export const ALLOW_GAME_LIST: Array<string> =
  process.env.ALLOW_GAME_LIST?.split(",") ?? [];
export const SITE_USER_ID: string = process.env.REVENUE_ID;

// Admin configs
export const ADMIN_WALLET_ADDRESS: string = process.env.ADMIN_WALLET_ADDRESS;
export const ADMIN_WALLET_MNEMONIC: string = process.env.ADMIN_WALLET_MNEMONIC;

export default process.env;
