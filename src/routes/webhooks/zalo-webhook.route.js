import express from "express";

const routeForWebhook = express.Router();

routeForWebhook.post("/", () => {
    return;
});

export default routeForWebhook;
