import { submitGuess, getAllGuesses, resetGuesses } from './controller/Guesses';
import { createRoom } from './controller/Rooms';
import { Response, Request } from 'express';

type Route = {
    path: string;
    method: 'get' | 'put' | 'post' | 'delete' | 'patch' | 'options';
    action: (req: Request, res: Response) => Promise<void>;
};

export const AppRoutes: Route[] = [
    {
        path: '/submitGuess',
        method: 'post',
        action: submitGuess
    },

    {
        path: '/getAllGuesses',
        method: 'get',
        action: getAllGuesses
    },

    {
        path: '/resetGuesses2',
        method: 'get',
        action: resetGuesses
    },

    {
        path: '/createNewRoom',
        method: 'post',
        action: createRoom
    },
];
