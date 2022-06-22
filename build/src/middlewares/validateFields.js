"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNewFavEntry = exports.toNewListEntry = exports.toNewUserEntry = void 0;
const parseEmail = (emailFromRequest) => {
    if (!isString(emailFromRequest) || !isEmail(emailFromRequest)) {
        throw new Error('the email format is incorrect');
    }
    return emailFromRequest;
};
const parsePassword = (passwordFromRequest) => {
    if (!isString(passwordFromRequest) || !isPassword(passwordFromRequest)) {
        throw new Error('the password format is incorrect');
    }
    return passwordFromRequest;
};
const parseUserId = (userIdFromRequest) => {
    if (!isString(userIdFromRequest)) {
        throw new Error('the userId format is incorrect');
    }
    return userIdFromRequest;
};
const parseString = (stringFromRequest) => {
    if (!isString(stringFromRequest)) {
        throw new Error('the userId format is incorrect');
    }
    return stringFromRequest;
};
const isString = (string) => {
    return (typeof string === 'string');
};
const isPassword = (password) => {
    const passwordFormat = /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
    return passwordFormat.test(password);
};
const isEmail = (email) => {
    const emailFormat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailFormat.test(email);
};
const toNewUserEntry = (object) => {
    const newUser = {
        email: parseEmail(object.email),
        password: parsePassword(object.password)
    };
    return newUser;
};
exports.toNewUserEntry = toNewUserEntry;
const toNewListEntry = (object) => {
    const newList = {
        userId: parseUserId(object.uid),
        name: parseString(object.name)
    };
    return newList;
};
exports.toNewListEntry = toNewListEntry;
const toNewFavEntry = (object) => {
    const newFav = {
        listId: parseUserId(object.listId),
        userId: parseUserId(object.uid),
        title: parseString(object.title),
        description: parseString(object.description),
        url: parseString(object.url)
    };
    return newFav;
};
exports.toNewFavEntry = toNewFavEntry;
