import { Server } from "socket.io";

declare module "socket.io" {
    interface Socket {
        userId?: string;
    }
}

let io: Server | undefined;
const connectedUser = new Map();

// Initializing Socket Server
export const initializeSocket = (httpServer: any) => {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL,
            credentials: true
        }
    });

    // Authentication middleware - INSIDE initializeSocket
    io.use((socket, next) => {
        const userId = socket.handshake.auth.userId;
        if (!userId) {
            return next(new Error('Invalid User'));
        }
        socket.userId = userId;
        next();
    });

    // Connection handling - INSIDE initializeSocket
    io.on('connection', (socket) => {
        console.log(`User is connected to socket Id of: ${socket.id}`);
        connectedUser.set(socket.userId, socket.id);

        // Disconnection handling - INSIDE connection callback
        socket.on('disconnect', () => {
            console.log(`User is disconnected on: ${socket.id}`);
            connectedUser.delete(socket.userId);
        });
    });
}

// Utility functions
export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io is not properly initialized');
    }
    return io;
}

export const getConnectedUsers = () => {
    return connectedUser;
}