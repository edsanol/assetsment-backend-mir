"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const listSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.String,
        ref: 'User',
        required: true
    },
    name: String,
    favs: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Favs' }]
}, {
    timestamps: true
});
listSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});
exports.default = (0, mongoose_1.model)('List', listSchema);
