import axios from 'axios';

const searchUrl = ''

let queryParams: { [key: string]: string } =
{
    'api-version': '',
}
export default class Room {
    players: Set<string>;
    guesses: Map<string, [number, number]>;
    roomCode: string
    adminCode: string
    creatorName: string

    constructor(roomcode, adminCode, creatorName) {
        this.players = new Set([creatorName]);
        this.guesses = new Map();
        this.roomCode = roomcode;
        this.adminCode = adminCode;
        this.creatorName = creatorName;    }

    public getGuesses(){
        return this.guesses
    }

    public addGuess(playerName: string, lat: number, lng:number){
        this.guesses.set(playerName, [lat, lng])
    }

    public resetGuesses() {
        this.guesses = new Map();
        return true
    }

    public addPlayer(playerName){
        this.players.add(playerName)
    }

    public checkPlayer(playerName){
        return this.players.has(playerName)
    }
}
