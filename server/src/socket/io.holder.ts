import type { Server as SocketIOServer } from "socket.io";

let io: SocketIOServer | null = null;

export const setIO = (server: SocketIOServer) => {
  io = server;
};

export const getIO = () => io;
