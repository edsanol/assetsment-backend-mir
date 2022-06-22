"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: String,
    password: String,
    lists: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'List' }]
}, {
    timestamps: true
});
userSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});
exports.default = (0, mongoose_1.model)('User', userSchema);
