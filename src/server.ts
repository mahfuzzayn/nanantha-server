import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import config from "./app/config";

let server: Server | null = null;

// Database connection
async function connectToDatabase() {
    try {
        await mongoose.connect(config.db_url as string);
        console.log("🔹Nanantha Database connected successfully");
    } catch (err) {
        console.error("Failed to connect to database:", err);
        process.exit(1);
    }
}

// Graceful shutdown
function gracefulShutdown(signal: string) {
    console.log(`Received ${signal}. Closing server...`);
    if (server) {
        server.close(() => {
            console.log("Nanantha Server closed gracefully");
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
}

// Application bootstrap
async function ignition() {
    try {
        await connectToDatabase();
        //await seed();

        server = app.listen(config.port, () => {
            console.log(
                `🍁 Nanantha Server is running on port ${config.port}\n\t<- https://nanantha-server.vercel.app/ OR http://localhost:5000/ ->`
            );
        });

        // Listen for termination signals
        process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
        process.on("SIGINT", () => gracefulShutdown("SIGINT"));

        // Error handling
        process.on("uncaughtException", (error) => {
            console.error("Uncaught Exception:", error);
            gracefulShutdown("uncaughtException");
        });

        process.on("unhandledRejection", (error) => {
            console.error("Unhandled Rejection:", error);
            gracefulShutdown("unhandledRejection");
        });
    } catch (error) {
        console.error("Error during bootstrap:", error);
        process.exit(1);
    }
}

// Start the application
ignition();
