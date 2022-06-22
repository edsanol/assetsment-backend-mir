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
const supertest_1 = __importDefault(require("supertest"));
const db_1 = require("../db");
const app_1 = __importDefault(require("../app"));
const user_model_1 = __importDefault(require("../models/user.model"));
const list_model_1 = __importDefault(require("../models/list.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
describe('List', () => {
    let user;
    let token;
    let list;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, db_1.connectDb)();
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, db_1.cleanup)();
        const data = { email: 'test@test.com', password: '12345678Aa' };
        user = yield user_model_1.default.create(data);
        token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_KEY, { expiresIn: 60 * 60 * 24 * 365 });
        const newList = { name: 'courses', userId: user.id };
        list = yield list_model_1.default.create(newList);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, db_1.disconnected)();
    }));
    it('should create a list correctly', () => __awaiter(void 0, void 0, void 0, function* () {
        const list = { name: 'books', userId: user.id };
        const res = yield (0, supertest_1.default)(app_1.default).post('/api/list').send(list).set('x-token', token);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/User created/i);
    }));
    it('should not create a list because user is wrong', () => __awaiter(void 0, void 0, void 0, function* () {
        const list = { name: 'books', userId: user.id };
        const res = yield (0, supertest_1.default)(app_1.default).post('/api/list').send(list).set('x-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYjExYzczYTRiYWE1MjRiOTYyYmRmOSIsImlhdCI6MTY1NTg2MDg1OSwiZXhwIjoxNjU1OTQ3MjU5fQ.rJEreGFTYZOgZAhG6Jnm_TuHVun0QSjNmQDzWoBZZHI');
        expect(res.statusCode).toBe(404);
        expect(res.body.data).toMatch(/Invalid user/i);
    }));
    it("should search user's list", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get('/api/list').set('x-token', token);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/List founded/i);
    }));
    it("should not found user's wrong", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get('/api/list').set('x-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYjExYzczYTRiYWE1MjRiOTYyYmRmOSIsImlhdCI6MTY1NTg2MDg1OSwiZXhwIjoxNjU1OTQ3MjU5fQ.rJEreGFTYZOgZAhG6Jnm_TuHVun0QSjNmQDzWoBZZHI');
        expect(res.statusCode).toBe(404);
        expect(res.body.data).toMatch(/Invalid user/i);
    }));
    it('should get list by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get(`/api/list/${list.id}`).set('x-token', token);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/List found/i);
    }));
    it('should not found list by id, token wrong', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get(`/api/list/${list.id}`).set('x-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYjExYzczYTRiYWE1MjRiOTYyYmRmOSIsImlhdCI6MTY1NTg2MDg1OSwiZXhwIjoxNjU1OTQ3MjU5fQ.rJEreGFTYZOgZAhG6Jnm_TuHVun0QSjNmQDzWoBZZHI');
        expect(res.statusCode).toBe(404);
        expect(res.body.data).toMatch(/Invalid user/i);
    }));
    it('should not found get list by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get('/api/list/62b110ff56a236f82b9aa8b2').set('x-token', token);
        expect(res.statusCode).toBe(404);
        expect(res.body.data).toMatch(/Invalid list/i);
    }));
    it('should delete list by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).delete(`/api/list/delete/${list.id}`).set('x-token', token);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/List deleted/i);
    }));
});
