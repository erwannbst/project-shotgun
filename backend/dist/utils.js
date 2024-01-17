"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRoomId = void 0;
const generateRoomId = () => {
    return Math.random().toString(36).slice(2, 7).toLocaleUpperCase();
};
exports.generateRoomId = generateRoomId;
