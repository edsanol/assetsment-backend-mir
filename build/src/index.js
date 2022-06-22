"use strict";
// import dotenv from 'dotenv'
// import Server from './models/server'
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// dotenv.config()
// const server = new Server()
// server.execute()
const app_1 = __importDefault(require("./app"));
const db_1 = require("./db");
const port = 8080;
void (0, db_1.connectDb)();
app_1.default.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
