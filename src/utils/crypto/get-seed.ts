// Require Dependencies
import { JsonRpc } from "eosjs";
import got from "got";
import fetch from "node-fetch"; // node only; not needed in browsers

import { BLOCKCHAIN_HTTPPROVIDER_API } from "@/config";

import logger from "../logger";

const rpc = new JsonRpc(BLOCKCHAIN_HTTPPROVIDER_API, { fetch });
const gpc = got.post;

// Grab EOS block with id
const getPublicSeed = async (): Promise<string> => {
  try {
    const info = await rpc.get_info();
    const blockNumber = info.last_irreversible_block_num + 1;
    const block = await rpc.get_block(blockNumber || 1);
    return block.id;
  } catch (error) {
    logger.error("[SEED]::: Error get public seed" + error);
  }
};

const getCrypto = async (crypto: string, mod: any): Promise<any> => {
  try {
    const res = await gpc(crypto, {
      json: { mod: typeof mod === "number" ? mod : Array.from(mod) },
    } as any);
    return res;
  } catch (error) {
    logger.error("[SEED]::: Error get crypto" + error);
  }
};

// Export functions
export { getCrypto, getPublicSeed };
