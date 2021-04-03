import { Request, Response } from 'express';
import { getGuessService } from '../Services/GuessService';

export const getAllGuesses = async (req: Request, res: Response) => {
    console.log(`GET /getAllGuesses`, 'req.query.params:', req.query, req.params);
    const username = req.query.username;
    const roomCode = req.query.roomCode;

    const guessService = await getGuessService();
    const results = await guessService.getAllGuessesForRoom(roomCode,username);
    console.log("results: ", results)
    res.status(results ? 200 : 404).json({success: true, results: results});
}

export const submitGuess = async (req: Request, res: Response) => {
    console.log(`POST /submitGuess`, 'req.query.params:', req.query, req.body);
    const guessService = await getGuessService();
    //var result = await guessService.submitGuess('')
    //res.status(result ? 200 : 404).json(result);
}

export const resetGuesses = async (req: Request, res: Response) => {
    console.log(`get /resetGuesses2`, 'req.query.params:', req.query, req.body);
    const guessService = await getGuessService();
    var result = await guessService.resetGuessesForRoom('test','test','test')
    //res.status(result ? 200 : 404).json(result);
}

