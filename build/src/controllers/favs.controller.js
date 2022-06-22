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
exports.destroyFavorite = exports.getFavsById = exports.showFavsByList = exports.createFavorite = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const list_model_1 = __importDefault(require("../models/list.model"));
const favs_model_1 = __importDefault(require("../models/favs.model"));
const validateFields_1 = require("../middlewares/validateFields");
const createFavorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid } = req;
        const { listId, title, description, url } = req.body;
        const newFav = yield (0, validateFields_1.toNewFavEntry)({ listId, uid, title, description, url });
        // Verificar que el usuario exista
        const user = yield user_model_1.default.findById(uid);
        if (!user) {
            throw new Error('Invalid user');
        }
        // Verificar que la lista exista
        const list = yield list_model_1.default.findById(newFav.listId);
        if (!list) {
            throw new Error('Invalid list');
        }
        // Crear la lista
        const fav = yield favs_model_1.default.create(newFav);
        yield list.updateOne({ $push: { favs: fav } });
        res.status(200).json({
            ok: true,
            message: 'Favs created',
            data: fav
        });
    }
    catch (error) {
        res.status(404).json({
            ok: false,
            message: 'Fav coult not be create',
            data: error.message
        });
    }
});
exports.createFavorite = createFavorite;
const showFavsByList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid } = req;
        const { listId } = req.params;
        const user = yield user_model_1.default.findById(uid);
        if (!user) {
            throw new Error('Invalid user');
        }
        const list = yield list_model_1.default.findById(listId)
            .populate('favs', 'title description url');
        if (!list) {
            throw new Error('Invalid list');
        }
        const favs = list.favs;
        res.status(200).json({
            ok: true,
            message: 'Favs found',
            data: favs
        });
    }
    catch (error) {
        res.status(404).json({
            ok: false,
            message: 'Fav coult not be found',
            data: error.message
        });
    }
});
exports.showFavsByList = showFavsByList;
const getFavsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid } = req;
        const { id } = req.params;
        const { listId } = req.body;
        const user = yield user_model_1.default.findById(uid);
        if (!user) {
            throw new Error('Invalid user');
        }
        const list = yield list_model_1.default.findById(listId);
        if (!list) {
            throw new Error('Invalid list');
        }
        const fav = yield favs_model_1.default.findById(id);
        if (!fav) {
            throw new Error('Invalid fav');
        }
        if (list.id !== fav.listId) {
            throw new Error('Fav not found');
        }
        res.status(200).json({
            ok: true,
            message: 'Fav founded',
            data: fav
        });
    }
    catch (error) {
        res.status(404).json({
            ok: false,
            message: 'Fav coult not be found',
            data: error.message
        });
    }
});
exports.getFavsById = getFavsById;
const destroyFavorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid } = req;
        const { id } = req.params;
        const { listId } = req.body;
        const user = yield user_model_1.default.findById(uid);
        if (!user) {
            throw new Error('Invalid user');
        }
        const list = yield list_model_1.default.findById(listId);
        if (!list) {
            throw new Error('Invalid list');
        }
        const fav = yield favs_model_1.default.findById(id);
        if (!fav) {
            throw new Error('Invalid fav');
        }
        yield favs_model_1.default.findByIdAndDelete(fav.id);
        yield list.updateOne({ $pull: { favs: fav.id } });
        res.status(200).json({
            ok: true,
            message: 'Favs deleted',
            data: fav
        });
    }
    catch (error) {
        res.status(404).json({
            ok: false,
            message: 'Fav coult not be deleted',
            data: error.message
        });
    }
});
exports.destroyFavorite = destroyFavorite;
