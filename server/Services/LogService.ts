import axios from 'axios';

var debug = process.env.REACT_APP_DEBUG_MODE == "TRUE"


let queryParams: { [key: string]: string } =
{
    'api-version': '',
}

export default function logMessage(...message) {
    if (debug) {
        console.log(...message)
    }
}