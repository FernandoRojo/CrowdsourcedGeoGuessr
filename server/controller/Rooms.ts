import { Request, Response } from 'express';
import { getGuessService } from '../Services/GuessService';
import { getRoomsService } from '../Services/RoomService';

export const createRoom = async (req: Request, res: Response) => {
    console.log(`GET /createRoom`, 'req.body:', req.body);
    let requestBody = req.body
    console.log(requestBody)
    let results = null;
    if (requestBody.username && requestBody.roomCode){
        const roomsService = await getRoomsService();
        results = await roomsService.createRoom(requestBody.roomCode,requestBody.username);
    }
    res.status(results ? 200 : 404).json({success: true, results: results});
}

