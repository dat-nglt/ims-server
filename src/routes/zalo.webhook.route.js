import express from "express";
import { handleZaloWebhook } from "../controllers/chatboxAI/webhook.controller";

const routeForWebhook = express.Router();

routeForWebhook.post("/", handleZaloWebhook);

export default routeForWebhook;
