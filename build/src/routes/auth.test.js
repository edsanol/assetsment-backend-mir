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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
describe('user', () => {
    let user;
    let token;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, db_1.connectDb)();
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, db_1.cleanup)();
        const data = { email: 'test@test.com', password: '12345678Aa' };
        user = yield user_model_1.default.create(data);
        token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_KEY, { expiresIn: 60 * 60 * 24 * 365 });
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, db_1.disconnected)();
    }));
    it('should create a user correctly', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = { email: 'test21@test.com', password: '12345678Aa' };
        const res = yield (0, supertest_1.default)(app_1.default).post('/auth/register').send(user);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.token).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
    }));
    it('should not create user when there is no email', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = { password: '12345' };
        const res = yield (0, supertest_1.default)(app_1.default).post('/auth/register').send(user);
        expect(res.statusCode).toBe(404);
        expect(res.body.data).toMatch(/the email format is incorrect/i);
    }));
    it('should not create user when the email exists', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = { email: 'test@test.com', password: '12345678Aa' };
        yield (0, supertest_1.default)(app_1.default).post('/auth/register').send(user);
        const res = yield (0, supertest_1.default)(app_1.default).post('/auth/register').send(user);
        expect(res.statusCode).toBe(404);
        expect(res.body.data).toMatch(/the email already exists/i);
    }));
    it('should not create user when the email not exists', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = { email: 'test5@test.com', password: '12345678Aa' };
        const res = yield (0, supertest_1.default)(app_1.default).post('/auth/login').send(user);
        expect(res.statusCode).toBe(500);
        expect(res.body.data).toMatch(/the email does not exist/i);
    }));
    it('should not create user when password is wrong', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = { email: 'test5@test.com', password: '12345678Aa' };
        const userError = { email: 'test5@test.com', password: '1234567Aa' };
        yield (0, supertest_1.default)(app_1.default).post('/auth/register').send(user);
        const res = yield (0, supertest_1.default)(app_1.default).post('/auth/login').send(userError);
        expect(res.statusCode).toBe(500);
        expect(res.body.data).toMatch(/the password is incorrect/i);
    }));
    it('should login correctly', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = { email: 'test10@test.com', password: '12345678Aa' };
        yield (0, supertest_1.default)(app_1.default).post('/auth/register').send(user);
        const res = yield (0, supertest_1.default)(app_1.default).post('/auth/login').send(user);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.token).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
    }));
    it('should list users', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get('/auth');
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/Users found/i);
    }));
    it('should get user', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get(`/auth/${user.id}`).set('x-token', token);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/User found/i);
    }));
    it('should failed get user, wrong token', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get(`/auth/${user.id}`).set('x-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYjExYzczYTRiYWE1MjRiOTYyYmRmOSIsImlhdCI6MTY1NTg2MDg1OSwiZXhwIjoxNjU1OTQ3MjU5fQ.rJEreGFTYZOgZAhG6Jnm_TuHVun0QSjNmQDzWoBZZHI');
        expect(res.statusCode).toBe(404);
        expect(res.body.data).toMatch(/the user does not exist/i);
    }));
    it('should delete user by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).delete(`/auth/${user.id}`).set('x-token', token);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/User deleted/i);
    }));
});
