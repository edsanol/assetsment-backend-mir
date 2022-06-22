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
exports.destoryList = exports.getListById = exports.showListByUser = exports.createList = void 0;
const validateFields_1 = require("../middlewares/validateFields");
const user_model_1 = __importDefault(require("../models/user.model"));
const list_model_1 = __importDefault(require("../models/list.model"));
const favs_model_1 = __importDefault(require("../models/favs.model"));
const createList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid } = req;
        const { name } = req.body;
        const newList = yield (0, validateFields_1.toNewListEntry)({ uid, name });
        // Verificar que el usuario exista
        const user = yield user_model_1.default.findById(newList.userId);
        if (!user) {
            throw new Error('Invalid user');
        }
        // Crear la lista
        const list = yield list_model_1.default.create(newList);
        yield user.updateOne({ $push: { lists: list } });
        res.status(200).json({
            ok: true,
            message: 'User created',
            data: list
        });
    }
    catch (error) {
        res.status(404).json({
            ok: false,
            message: 'List coult not be create',
            data: error.message
        });
    }
});
exports.createList = createList;
const showListByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid } = req;
        const user = yield user_model_1.default.findById(uid);
        if (!user) {
            throw new Error('Invalid user');
        }
        const lists = user.lists;
        res.status(200).json({
            ok: true,
            message: 'List founded',
            data: lists
        });
    }
    catch (error) {
        res.status(404).json({
            ok: false,
            message: 'List coult not be founded',
            data: error.message
        });
    }
});
exports.showListByUser = showListByUser;
const getListById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { uid } = req;
        const list = yield list_model_1.default.findById(id)
            .populate('favs', 'title description url');
        const user = yield user_model_1.default.findById(uid);
        if (!list) {
            throw new Error('Invalid list');
        }
        if (!user) {
            throw new Error('Invalid user');
        }
        if (list.userId !== user.id) {
            throw new Error('list not found');
        }
        res.status(200).json({
            ok: true,
            message: 'List found',
            data: list
        });
    }
    catch (error) {
        res.status(404).json({
            ok: false,
            message: 'List coult not be found',
            data: error.message
        });
    }
});
exports.getListById = getListById;
const destoryList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { uid } = req;
        const list = yield list_model_1.default.findById(id);
        const user = yield user_model_1.default.findById(uid);
        if (!list) {
            throw new Error('Invalid list here');
        }
        if (!user) {
            throw new Error('Invalid user');
        }
        if (list.userId !== user.id) {
            throw new Error('list not found');
        }
        yield list_model_1.default.findByIdAndDelete(list.id);
        const favsFromDB = yield favs_model_1.default.find({ listId: list.id });
        if (favsFromDB.length > 0) {
            yield favs_model_1.default.deleteMany({ listId: list.id });
        }
        yield user_model_1.default.updateOne({ $pull: { lists: list.id } });
        res.status(200).json({
            ok: true,
            message: 'List deleted',
            data: list
        });
    }
    catch (error) {
        res.status(404).json({
            ok: false,
            message: 'List coult not be deleted',
            data: error.message
        });
    }
});
exports.destoryList = destoryList;
