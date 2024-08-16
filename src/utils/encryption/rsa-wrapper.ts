import * as crypto from "crypto";
import * as fs from "fs";
import NodeRSA from "node-rsa";
import * as path from "path";

class RSAPrivateWrapper {
  private static instance: RSAPrivateWrapper;

  private serverPub: Buffer;
  private serverPrivate: Buffer;
  private clientPub: Buffer;

  constructor() {
    this.serverPub = Buffer.alloc(256);
    this.serverPrivate = Buffer.alloc(256);
    this.clientPub = Buffer.alloc(256);

    const keysDir = path.resolve(__dirname, "../../");
    this.initLoadServerKeys(keysDir);
  }

  public static getInstance(): RSAPrivateWrapper {
    if (!RSAPrivateWrapper.instance) {
      RSAPrivateWrapper.instance = new RSAPrivateWrapper();
    }

    return RSAPrivateWrapper.instance;
  }

  public initLoadServerKeys(basePath: string): void {
    this.serverPub = fs.readFileSync(
      path.resolve(basePath, "keys", "server.public.pem")
    );
    this.serverPrivate = fs.readFileSync(
      path.resolve(basePath, "keys", "server.private.pem")
    );
    this.clientPub = fs.readFileSync(
      path.resolve(basePath, "keys", "client.public.pem")
    );
  }

  public generate(direction: string): boolean {
    const key = new NodeRSA();
    key.generateKeyPair(2048, 65537);
    const keysDir = path.resolve(__dirname, "../../keys");

    if (!fs.existsSync(keysDir)) {
      fs.mkdirSync(keysDir, { recursive: true });
    }

    fs.writeFileSync(
      path.resolve(__dirname, "../../keys", `${direction}.private.pem`),
      key.exportKey("pkcs8-private-pem")
    );
    fs.writeFileSync(
      path.resolve(__dirname, "../../keys", `${direction}.public.pem`),
      key.exportKey("pkcs8-public-pem")
    );

    return true;
  }

  public serverExampleEncrypt(): string {
    const enc = this.encrypt("Server init hello");
    const dec = this.decrypt(enc);
    return dec;
  }

  public encrypt(message: string): string {
    const encrypted = crypto.publicEncrypt(
      {
        key: this.clientPub,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      },
      Buffer.from(message)
    );

    return encrypted.toString("base64");
  }

  public decrypt(encryptedMessage: string): string {
    const decrypted = crypto.privateDecrypt(
      {
        key: this.serverPrivate,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      },
      Buffer.from(encryptedMessage, "base64")
    );

    return decrypted.toString();
  }
}

export default RSAPrivateWrapper;
