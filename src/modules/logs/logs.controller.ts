import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import * as localizations from "@/utils/localizations";
import ILocalization from "@/utils/localizations/localizations.interface";

const filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const dirname = path.dirname(filename);

export class LogsController {
  private localizations: ILocalization;
  private logsPath = path.join(dirname, "@/../logs");

  constructor() {
    this.localizations = localizations["en"];
  }

  public list = async () => {
    const files = fs
      .readdirSync(this.logsPath, { withFileTypes: true })
      .filter((item) => !item.isDirectory())
      .map((item) => item.name);

    return files;
  };

  public get = async (name) => {
    const filePath = path.join(this.logsPath, name);
    const file = fs.readFileSync(filePath, { encoding: "utf8" });

    return file;
  };
}
