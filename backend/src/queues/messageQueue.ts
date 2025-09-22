import Queue from "bull";

export const messageQueue = new Queue("message-queue", {
    redis: { host: "127.0.0.1", port: 6379 }
});