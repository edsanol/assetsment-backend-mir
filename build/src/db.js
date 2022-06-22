"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanup = exports.disconnected = exports.connectDb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
let connection;
function connectDb() {
    return __awaiter(this, void 0, void 0, function* () {
        if (connection)
            return;
        const URI = process.env.DB_CNN_STRING || 'mongodb+srv://assetsment:assetsment@cluster0.hjkr2.mongodb.net/favs';
        connection = mongoose_1.default.connection;
        // console.log(connection.collections)
        connection.once('open', () => console.log('Connection established successfully'));
        connection.on('disconnected', () => console.log('Succesfully disconnected'));
        connection.on('error', (err) => console.log('Something went wrong', err));
        yield mongoose_1.default.connect(URI);
    });
}
exports.connectDb = connectDb;
function disconnected() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!connection)
            return;
        yield mongoose_1.default.disconnect();
    });
}
exports.disconnected = disconnected;
function cleanup() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!connection)
            return;
        for (const collection in connection.collections) {
            yield connection.collections[collection].deleteMany({});
        }
    });
}
exports.cleanup = cleanup;
