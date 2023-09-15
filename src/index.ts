import OpenAI from "openai";
import config from "./config/config";
import Server from "./custom_modules/server";


const server = new Server();

server.start();
