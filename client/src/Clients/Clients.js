import axios from 'axios';

var serverUrl = process.env.NODE_ENV === "production"  ?  process.env.REACT_APP_SERVER_URL : "http://localhost:5000";   
var wsUrl = process.env.NODE_ENV === "production" ? process.env.REACT_APP_SERVER_URL : "ws://localhost:5000"; 
class Clients {

    async initClients(){
        //console.log("connecting to "+wsUrl,process.env)
        let ws  =  new WebSocket(wsUrl);
        this.wsClient = ws;

        this.wsClient.onopen = function (event) {
            ws.send("hello c:")
        };
    }

    async submitGuess(roomCode, username, latlng,country) {
        if (!roomCode || !username || !latlng || !country) {
            return
        }
        let lat = latlng.lat.toFixed(2);
        let lng = latlng.lng.toFixed(2);
        //console.log("Submitting Guess", { roomCode: roomCode, name: username, Lat: lat, lng: lng, country: country} )
        this.wsClient.send(roomCode+":"+username+":"+lat+":"+lng+":"+country)
        return "";
    }

    async getAllGuesses(username,roomCode) {
        if (!username || !roomCode){
            return {}
        }
        var query = new URLSearchParams([["username",username],["roomCode",roomCode]]).toString()

        let result = await axios.get(serverUrl+'/GetAllGuesses?'+query).then((response) => {
            
            return response.data['results']
        }).catch((_) => {
            return null
        });
        return result;
    }
    
    async CreateNewRoom(username,roomCode) {
         let result = await axios.post(serverUrl+'/createNewRoom', { roomCode: roomCode, username: username }).then((response) => {
             return response.data['results']
         });
         return result;
     }
 



}
let client;

export async function getClient() {
    if (client) {
        return client;
    }
    client = new Clients();
    await client.initClients();
    return client
}
