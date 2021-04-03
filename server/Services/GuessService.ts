import axios from 'axios';
import logMessage from './LogService';
import { getRoomsService } from './RoomService';

const searchUrl = ''

let queryParams: { [key: string]: string } =
{
    'api-version': '',
}
export default class GuessService {

    constructor() {
    }

    public init() {
    }


    public async getAllGuessesForRoom(roomCode, userName) {
        let roomsService = await getRoomsService();
        let room = roomsService.getRoom(roomCode,userName)
        logMessage(room)
        function strMapToObj(strMap) {
            let obj = Object.create(null);
            for (let [k,v] of strMap) {
              obj[k] = v;
            }
            return obj;
          }

        if (room){
            return strMapToObj(room.getGuesses());
        }
        return null;

    }

  

    public async resetGuessesForRoom(roomCode, userName, adminCode) {
        let roomsService = await getRoomsService();
        let room = roomsService.getRoom(roomCode,userName)
        if (room){
            if (room.AdminCode == adminCode){
                room.guesses = {}
            }
            return room.guesses = {}
        }
        return false
    }

    public async submitGuessToRoom(roomCode, playerName, lat, lng, country) {
        let roomsService = await getRoomsService();
        let room = roomsService.getRoom(roomCode,playerName)
        logMessage(room)
        if (room){
            var oldGuess = room.guesses.get(playerName);
                logMessage(oldGuess, playerName, lat, lng, country, room.guesses)

            if (!oldGuess || (oldGuess && oldGuess[0] !== lat && oldGuess[1] !== lng)){
                room.guesses.set(playerName,[lat,lng, country])
                return [playerName,lat,lng]
            } 
        }
        return false
    }
}

let guessService: GuessService;

export async function getGuessService() {
    if (guessService) {
        return guessService;
    }
    guessService = new GuessService();
    await guessService.init();
    return guessService;
}