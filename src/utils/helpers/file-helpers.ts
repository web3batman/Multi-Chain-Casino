import { promises as fsPromises } from "fs";
import multer from "multer";
import path from "path";

import { FILE_FOLDER } from "../../config";

//req path add
const storage = multer.diskStorage({
  destination: async function (req, _file, cb) {
    const dir = req.dir_for_files ? req.dir_for_files : "";
    const pathUploads = path.join(__dirname, "../../../../", FILE_FOLDER, dir);
    await fsPromises.mkdir(pathUploads, { recursive: true });
    cb(null, pathUploads);
  },

  filename: function (_req, file, cb) {
    const file_name = file.originalname.split(".");
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname +
        "-" +
        uniqueSuffix +
        "." +
        file_name[file_name.length - 1]
    );
  },
});

export const fileHelpers = multer({ storage: storage });
