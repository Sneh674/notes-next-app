import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

import mongoose from "mongoose";

const MONGODB_URI = process.env.DB_URL;

if (!MONGODB_URI || MONGODB_URI==undefined) {
    throw new Error("DB_URL is not defined");
}

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    var mongooseCache: MongooseCache | undefined;
}

const cached = global.mongooseCache ?? {
    conn: null,
    promise: null,
};

global.mongooseCache = cached;

export async function connect() {
    if (cached.conn) {
        return cached.conn;
    }
    if (!MONGODB_URI || MONGODB_URI==undefined) {
        throw new Error("DB_URL is not defined");
    }

    if (!cached.promise) {
        console.log("Creating MongoDB connection...");

        cached.promise = mongoose
            .connect(MONGODB_URI, {
                serverSelectionTimeoutMS: 10000,
            })
            .then((mongooseInstance) => {
                console.log("MongoDB connected successfully");
                console.log(
                    "Database:",
                    mongooseInstance.connection.db?.databaseName
                );

                return mongooseInstance;
            })
            .catch((error) => {
                cached.promise = null;
                console.error("MongoDB connection failed:", error);
                throw error;
            });
    }

    return cached.promise;
}