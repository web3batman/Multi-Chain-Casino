// Import Dependencies
import { Socket } from "socket.io";

import {
  IClientToServerEvents,
  IInterServerEvents,
  IServerToClientEvents,
  ISocketData,
} from "@/constant/socket";

import logger from "../logger";

// Declare variables
const TIME_LIMIT = 100; // How often the socket can emit an event (ms)

// Define a type for the packet to improve type safety
type PacketType = [string, ...any[]];

// Socket.io socket middleware
const throttleConnections =
  (
    socket: Socket<
      IClientToServerEvents,
      IServerToClientEvents,
      IInterServerEvents,
      ISocketData
    >
  ) =>
  (packet: PacketType, next: (err?: any) => void) => {
    if (canBeServed(socket, packet)) {
      return next();
    } else {
      return socket.emit(
        "notify-error",
        "Slow down! You must wait a while before doing that again."
      );
    }
  };

// If socket connection can be served
const canBeServed = (
  socket: Socket<
    IClientToServerEvents,
    IServerToClientEvents,
    IInterServerEvents,
    ISocketData
  >,
  packet: PacketType
) => {
  // If socket is marked for disconnect, deny access
  if (socket.data.markedForDisconnect) {
    return false;
  }

  // Get last request timestamp
  const previous = socket.data.lastAccess;
  const now = Date.now();

  // If socket had previous interaction
  if (previous) {
    // Get time difference
    const diff = now - previous;

    // If it was an auth packet
    if (packet[0] === "auth") {
      // Else add a last access timestamp and move on
      socket.data.lastAccess = now;
      return true;
    }

    // Check the time difference and disconnect if needed
    if (diff < TIME_LIMIT) {
      // Set socket as not serveable
      socket.data.markedForDisconnect = true;

      const clientIp = socket.handshake.headers["x-real-ip"];

      // Timeout to disconnect the socket
      setTimeout(() => {
        logger.info(
          `Socket:: IP: ${clientIp} Packet: [${packet.toString()}] NSP: ${socket.nsp.name} Disconnected, reason: TOO_MANY_EMITS`
        );
        logger.error(
          `Socket:: connection kicked due to too many emits in a short time. IP: ${clientIp}`
        );
        // Disconnect the underlying connection
        socket.disconnect(true);
      }, 1000);

      // Deny access
      return false;
    }
  }

  // Else add a last access timestamp and move on
  socket.data.lastAccess = now;
  return true;
};

// Export the functions
export default throttleConnections;
