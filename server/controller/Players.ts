import { Request, Response } from 'express';
import { getPlayerService } from '../Services/PlayerService';


export const registerPlayer = async (req: Request, res: Response) => {
    console.log(`GET /registerPlayer`, 'req.query.params:', req.query, req.params);
    const playerService = await getPlayerService();
    const results = await playerService.registerPlayer(req.query)
    console.log("results: ", results)
    res.status(results ? 200 : 404).json({success: true, results: results});
}


