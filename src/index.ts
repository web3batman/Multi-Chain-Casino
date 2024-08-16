import "dotenv/config";

import cors from "cors";
import express from "express";
import { Server } from "http";
import path from "path";
import { Server as SocketIOServer } from "socket.io";
import customParser from "socket.io-msgpack-parser";
import { fileURLToPath } from "url";

import { ALLOW_HOSTS, PORT, SOCKET_ALLOW_HOSTS } from "@/config";
import authorize from "@/middleware/authorize";
import { errorHandler, routeNotFound } from "@/middleware/error-handler";
import logger from "@/middleware/logger";

import { CronJobs } from "./cron";
import RootRouter from "./root.router";
import SocketServer from "./root.socket";

const filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const dirname = path.dirname(filename);

const app = express();
app.use(
  cors({
    origin: ALLOW_HOSTS,
    methods: "OPTIONS,GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));

app.use("/api/v1", logger, authorize, new RootRouter().router);
app.use("/assets", express.static(path.join(dirname, "../assets")));

// install routers
app.get("/", (_, res) => {
  res.status(200).json({
    message: "Kartel backend is running",
  });
});

app.use([routeNotFound, errorHandler]);

const httpServer = new Server(app);

const socketServer = new SocketIOServer(httpServer, {
  cors: {
    origin: SOCKET_ALLOW_HOSTS,
    methods: ["GET", "POST"],
    credentials: true,
  },
  parser: customParser,
});

new SocketServer(socketServer);
app.set("socketio", socketServer);

CronJobs.customerUpdateCron.start();

httpServer.listen(PORT, () => console.info("Server listening on port " + PORT));
