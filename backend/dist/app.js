"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const utils_1 = require("./utils");
const corsOptions = {
    origin: 'http://localhost:3000',
};
const app = (0, express_1.default)();
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
const port = 3001;
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: corsOptions,
});
const shotguns = [];
const bagarres = [];
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disckonnected');
    });
    // handle shotgun creation
    socket.on('create shotgun', ({ pseudo, name }) => {
        const shotgun = {
            name,
            id: (0, utils_1.generateRoomId)(),
            author: {
                id: socket.id,
                pseudo,
            },
            projects: [],
            users: [
                {
                    id: socket.id,
                    pseudo,
                },
            ],
        };
        shotguns.push(shotgun);
        console.log('create shotgun: ' + shotgun);
        socket.join(shotgun.id);
        socket.emit('create shotgun', shotgun);
    });
    // handle shotgun joining
    socket.on('join shotgun', ({ pseudo, id }) => {
        var _a;
        console.log('join shotgun: ' + pseudo + ' ' + id);
        shotguns.forEach((shotgun) => {
            if (shotgun.id === id) {
                shotgun.users.push({ id: socket.id, pseudo });
            }
        });
        socket.join(id);
        socket.emit('join shotgun', { pseudo, id });
        const users = (_a = shotguns.find((shotgun) => shotgun.id === id)) === null || _a === void 0 ? void 0 : _a.users;
        console.log({ users });
        io.to(id).emit('users', users);
    });
});
server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
// get shotgun data from id
app.get('/shotgun/:id', (req, res) => {
    console.log('get shotgun: ' + req.params.id);
    const shotgun = shotguns.find((shotgun) => shotgun.id === req.params.id);
    console.log({ shotguns, shotgun });
    if (!shotgun) {
        res.status(404).send('Shotgun not found');
        return;
    }
    res.send(shotgun);
});
// add project to shotgun
app.post('/shotguns/:id/projects', (req, res) => {
    console.log('add project to shotgun: ' + req.params.id);
    const shotgun = shotguns.find((shotgun) => shotgun.id === req.params.id);
    if (!shotgun) {
        res.status(404).send('Shotgun not found');
        return;
    }
    const project = {
        id: (0, utils_1.generateRoomId)(),
        name: req.body.name,
        candidates: [],
    };
    shotgun.projects.push(project);
    io.to(shotgun.id).emit('projects', shotgun.projects);
    res.send(project);
});
// create bagarre
app.post('/bagarres', (req, res) => {
    console.log('create bagarre');
    const bagarre = {
        id: (0, utils_1.generateRoomId)(),
        name: req.body.name,
        candidates: [],
    };
    bagarres.push(bagarre);
    res.send(bagarre);
});
