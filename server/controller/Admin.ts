import { Request, Response } from 'express';
import { getGuessService } from '../Services/GuessService';
import logMessage from '../Services/LogService';
import { getRoomsService } from '../Services/RoomService';

var debug = process.env.REACT_APP_DEBUG_MODE == "TRUE"


export const resetService = async (req: Request, res: Response) => {
    console.log(`GET /resetService`, 'req.query.params:', req.query, req.params);
    const roomsService = await getRoomsService()
    debug && roomsService.clearRooms()
    logMessage("Clearing rooms");
    return (debug);
}
