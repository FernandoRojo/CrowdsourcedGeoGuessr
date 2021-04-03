import axios from 'axios';
import Room from '../Models/Room';

const searchUrl = ''

let queryParams: { [key: string]: string } =
{
    'api-version': '',
}
export default class RoomsService {
    rooms;

    constructor() {
        this.rooms = new  Map()
    }

    public init() {
    }


    public createRoom(roomCode, playerName) {
        var adminCode = '_' + Math.random().toString(36).substr(2, 9);
        var room = new Room(roomCode, adminCode, playerName)
        this.rooms.set(roomCode, room)
        return room
    }

    public getRoom(roomCode, playerName) {
        if (!roomCode || !playerName){
            return null;
        }
        var room = this.rooms.get(roomCode);
        if (room ){ //&& room.checkPlayer(playerName)
            return room
        }
        return null
    }

    public clearRooms(){
        this.rooms = {}
    }
}

let roomsService: RoomsService;

export async function getRoomsService() {
    if (roomsService) {
        return roomsService;
    }
    roomsService = new RoomsService();
    await roomsService.init();
    return roomsService;
}