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
exports.destroyUser = exports.getUser = exports.listUsers = exports.login = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = __importDefault(require("../models/user.model"));
const list_model_1 = __importDefault(require("../models/list.model"));
const favs_model_1 = __importDefault(require("../models/favs.model"));
const validateFields_1 = require("../middlewares/validateFields");
const jwt_1 = require("../utils/jwt");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = yield (0, validateFields_1.toNewUserEntry)(req.body);
        // Verificar que el email no exista
        const email = newUser.email;
        const emailExists = yield user_model_1.default.findOne({ email });
        if (emailExists) {
            throw new Error('the email already exists');
        }
        // Encrypta la contraseña
        const encryptPassword = yield bcrypt_1.default.hash(newUser.password, 8);
        const user = yield user_model_1.default.create(Object.assign(Object.assign({}, newUser), { password: encryptPassword }));
        // Generar el JWT
        const token = yield (0, jwt_1.JWTgenerator)(user.id);
        res.status(200).json({
            ok: true,
            message: 'User created',
            data: user,
            token
        });
    }
    catch (error) {
        res.status(404).json({
            ok: false,
            message: 'User coult not be create',
            data: error.message
        });
    }
});
exports.registerUser = registerUser;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Verificar si existe el correo
        const userFromDB = yield user_model_1.default.findOne({ email });
        if (!userFromDB) {
            throw new Error('the email does not exist');
        }
        // Validar el password
        const validPassword = bcrypt_1.default.compareSync(password, userFromDB.password);
        if (!validPassword) {
            throw new Error('the password is incorrect');
        }
        // Generar el JWT
        const token = yield (0, jwt_1.JWTgenerator)(userFromDB.id);
        res.json({
            ok: true,
            usuario: userFromDB,
            token,
            message: 'User logged'
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Incorrect Sesion',
            data: error.message
        });
    }
});
exports.login = login;
const listUsers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.default.find()
            .populate('lists');
        res.status(200).json({
            ok: true,
            message: 'Users found',
            data: users
        });
    }
    catch (error) {
        res.status(404).json({
            ok: false,
            message: 'Users coult not be found',
            data: error.message
        });
    }
});
exports.listUsers = listUsers;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { uid } = req;
    try {
        const user = yield user_model_1.default.findById(id)
            .select('-password')
            .populate('lists', 'id name favs');
        if (!user || user.id !== uid) {
            throw new Error('the user does not exist');
        }
        res.status(200).json({
            ok: true,
            message: 'User found',
            data: user
        });
    }
    catch (error) {
        res.status(404).json({
            ok: false,
            message: 'User coult not be found',
            data: error.message
        });
    }
});
exports.getUser = getUser;
const destroyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { uid } = req;
    try {
        const user = yield user_model_1.default.findById(id);
        if (!user || user.id !== uid) {
            throw new Error('the user does not exist here');
        }
        yield user_model_1.default.findByIdAndDelete(user.id);
        const listFromDB = yield list_model_1.default.find({ userId: user.id });
        if (listFromDB.length > 0) {
            yield list_model_1.default.deleteMany({ userId: user.id });
        }
        const favsFromDB = yield favs_model_1.default.find({ userId: user.id });
        if (favsFromDB.length > 0) {
            yield favs_model_1.default.deleteMany({ userId: user.id });
        }
        res.status(200).json({
            ok: true,
            message: 'User deleted'
        });
    }
    catch (error) {
        res.status(404).json({
            ok: false,
            message: 'User coult not be deleted',
            data: error.message
        });
    }
});
exports.destroyUser = destroyUser;
