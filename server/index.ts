require('dotenv').config();

import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import ws from 'ws'
import bodyParser from 'body-parser';
import cors from 'cors';
import { serializeError } from 'serialize-error';

import { AppRoutes } from './routes';

import { getGuessService } from './Services/GuessService';

var dotenv = require('dotenv')
var dotenvExpand = require('dotenv-expand')

var myEnv = dotenv.config()
dotenvExpand(myEnv)

// Ideally the continuously running job would reside in a separate repository and run as a separate process.
// We would also use queues and make the job scalable. This is an oversimplified hackathon-quality implementation of a job runner.

const PORT = process.env.PORT || 5000;

// list of users
const clients = {};
const users = {};
// create and setup express app
const app = express();
getGuessService();

const wsServer = new ws.Server({ noServer: true });
wsServer.on('connection', socket => {
    let id = ""+Math.random();
    clients[id] = socket
    socket.on('message', message => {
        console.log(message);
        var p = message.split(":");
        p.length == 5 && getGuessService().then((gs) => {
            if (gs.submitGuessToRoom(p[0], p[1], Number(p[2]), Number(p[3]), p[4])) {
                Object.keys(clients).forEach(cid => {
                    cid != id && clients[cid].send(message);
                })
            }
        });
    });

    socket.on('close', function () {
        console.log('user ' + id + ' disconnected');
        delete clients[id];
    });
});

app.use(bodyParser.json());
app.use(cors());

// register all application routes
AppRoutes.forEach(route => {
    app[route.method](route.path, (req: Request, res: Response, next: Function) => {
        route
            .action(req, res)
            .then(() => next)
            .catch(err => next(err));
    });
});

const server = app.listen(PORT, () => console.log(`Express server running on port ${PORT}`));

server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
        wsServer.emit('connection', socket, request);
    });
});

// error handler
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
    const status = (err as any).status || 500;
    res.status(status)
        .type('application/json')
        .send({
            error: {
                code: status,
                innererror: serializeError(err),
                message: err.message,
            },
        });
    console.error(`Returned error ${status}: ${err.message}`);
});

