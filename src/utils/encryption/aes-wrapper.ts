import * as crypto from "crypto";

interface IvAndMessage {
  iv: Buffer;
  message: string;
}

class AESWrapper {
  // get list of supportable encryption algorithms

  private static instance: AESWrapper;

  public static getInstance(): AESWrapper {
    if (!AESWrapper.instance) {
      AESWrapper.instance = new AESWrapper();
    }

    return AESWrapper.instance;
  }

  public static getAlgorithmList(): void {
    console.log(crypto.getCiphers());
  }

  public static generateKey(): Buffer {
    return crypto.randomBytes(32);
  }

  public static generateIv(): Buffer {
    return crypto.randomBytes(16);
  }

  // separate initialization vector from message
  public static separateVectorFromData(data: string): IvAndMessage {
    const iv = Buffer.from(data.slice(-24), "base64");
    const message = data.substring(0, data.length - 24);

    return {
      iv,
      message,
    };
  }

  public static encrypt(key: Buffer, iv: Buffer, text: string): string {
    let encrypted = "";
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    encrypted += cipher.update(text, "utf8", "base64");
    encrypted += cipher.final("base64");

    return encrypted;
  }

  public static decrypt(key: Buffer, text: string): string {
    let decrypted = "";
    const data = AESWrapper.separateVectorFromData(text);
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, data.iv);
    decrypted += decipher.update(data.message, "base64", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  }

  // add initialization vector to message
  public static addIvToBody(iv: Buffer, encryptedBase64: string): string {
    encryptedBase64 += iv.toString("base64");
    return encryptedBase64;
  }

  public static createAesMessage(aesKey: Buffer, message: string): string {
    const aesIv = AESWrapper.generateIv();
    let encryptedMessage = AESWrapper.encrypt(aesKey, aesIv, message);
    encryptedMessage = AESWrapper.addIvToBody(aesIv, encryptedMessage);

    return encryptedMessage;
  }
}

export default AESWrapper;
