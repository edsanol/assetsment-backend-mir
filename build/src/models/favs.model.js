"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const favsSchema = new mongoose_1.Schema({
    listId: {
        type: mongoose_1.Schema.Types.String,
        ref: 'List',
        required: true
    },
    title: String,
    description: String,
    url: String
}, {
    timestamps: true
});
favsSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});
exports.default = (0, mongoose_1.model)('Favs', favsSchema);
