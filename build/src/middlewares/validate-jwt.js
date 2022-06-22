"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateJWT = (req, res, next) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            ok: false,
            message: 'No token provided'
        });
    }
    try {
        const { id } = jsonwebtoken_1.default.verify(token, process.env.JWT_KEY);
        req.uid = id;
    }
    catch (error) {
        return res.status(401).json({
            ok: false,
            message: 'Invalid token'
        });
    }
    next();
};
exports.validateJWT = validateJWT;
