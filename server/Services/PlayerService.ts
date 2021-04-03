import axios from 'axios';
import logMessage from './LogService'
var wsUrl = process.env.NODE_ENV == "production" ? process.env.REACT_APP_SERVER_URL : "ws://localhost:5000"; 

const searchUrl = ''

let queryParams: { [key: string]: string } =
{
    'api-version': '',
}

export default class PlayerService {
    players; 

    constructor() {
        this.players = new Set();
    }

    public init() {
    }

    public registerPlayer(playerName) {
        logMessage("Registering New Player", playerName)
        this.players.add(playerName)
        return true;
    }

    public checkPlayer(playerName){
        return this.players.has(playerName)
    }
}


let playerService: PlayerService;

export async function getPlayerService() {
    if (playerService) {
        return playerService;
    }
    playerService = new PlayerService();
    await playerService.init();
    return playerService;
}
