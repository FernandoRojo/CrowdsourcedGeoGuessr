import React from 'react';
import { getClient } from './Clients/Clients'
import { withRouter } from "react-router";
import './App.css';
import InteractiveMap from './InteractiveMap/InteractiveMap.js';
import { Redirect, Route, Switch } from "react-router-dom";


import { StartView, PlayerView } from './Views/Views'

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: null,
      initialGuesses: [],
      guessToAdd: [],
      view: 0,
      roomCode: "",
      username: "",
      adminCode: "",
      isLoaded: false,
      errorCode: 0,
      countryGuesses: new Map()
    };
    this.mapComponent = new InteractiveMap()
    this.submitGuess = this.submitGuess.bind(this);
    this.setView = this.setView.bind(this);
    this.setUsername = this.setUsername.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addCountryVote = this.addCountryVote.bind(this);


    this.addGuess = this.addGuess.bind(this);
  }

  render() {
    let { username, roomCode } = { ...this.state }
    let params = new URLSearchParams(this.props.location.search)
    let errorCode = params.get("error")
    return (
      <div className="App">
        <header className="App-header">
        </header>
        {errorCode > 0 && <div className="error-text"> {this.printError(errorCode)} </div>} 
        <Switch>
          <Redirect exact from="/" to="/main" />
          <Route path="/main">
            <StartView setView={this.setView} />
          </Route>
          <Route path="/play">
            <PlayerView username={username}
              roomCode={roomCode}
              submitGuess={this.submitGuess}
              initialGuesses={this.state.initialGuesses}
              countryGuesses={this.state.countryGuesses}
              guessToAdd={this.state.guessToAdd}
              isLoaded={this.state.isLoaded}
              setUsername={this.setUsername}></PlayerView>
          </Route>
        </Switch>
      </div>
    );
  }

  printError(code) {
    switch (code) {
      case "1":
        return <h1 color="red">Must provide a username to create a new room</h1>
      case "2":
        return <h1 color="red">The room does not exist</h1>
      default:
        return <h1 color="red">an error occured</h1>
    }
  }

  handleChange(event) {
    switch (event.target.className) {
      case "username-input":
        this.setState({ userName: event.target.value });
        break;
      case "roomcode-input":
        this.setState({ roomCode: event.target.value });
        break;
      default:
        break
    }
    event.preventDefault();
  }

  async setView(roomCode, username, createRoom) {
    console.log("settingview", roomCode, username, createRoom)
    const history = this.props.history
    if (createRoom === 0) {
      history.push(
        {
          pathname: '/play',
          search: new URLSearchParams([["roomCode", roomCode], ["username", username]]).toString()
        })
      this.setState({ username: username, roomCode: roomCode })
    }
    else {
      var roomCreated = await this.createNewRoom(username, roomCode)
      if (roomCreated) {
        history.push(
          {
            pathname: '/play',
            search: new URLSearchParams([["roomCode", roomCode], ["username", username]]).toString()
          })
        this.setState({ username: username, roomCode: roomCode })
      }
      else{
        history.push(
          {
            pathname: '/main',
            search: new URLSearchParams([["error", 1]]).toString()
          })
      }
    }
  }

  async componentDidMount() {
    var client = await getClient();
    client.wsClient.onmessage = this.addGuess
    let params = new URLSearchParams(this.props.location.search)
    let username = params.get("username")
    let roomCode = params.get("roomCode")
    var guesses = username && roomCode && await client.getAllGuesses(username, roomCode);
    if (username && roomCode && !guesses){
      const history = this.props.history
      this.setState({  username: null, roomCode: null, isLoaded: true })

      history.push(
        {
          pathname: '/main',
          search: new URLSearchParams([["error", 2]]).toString()
        })
    }
    else{
      let countryCounts = this.initializeCountryCounts(guesses)
      this.setState({ initialGuesses: guesses, countryGuesses: countryCounts, iter: 3, username: username, roomCode: roomCode, isLoaded: true })

    }


  }
  initializeCountryCounts(guesses){
    let countryCounts = new Map()
    guesses && Object.keys(guesses).forEach(g => {
      let votes = countryCounts.get(guesses[g][2]) ?? 0
      countryCounts.set(guesses[g][2],votes+1)
    });
    return countryCounts
  }

  async submitGuess(username, latlng,country) {
    (await getClient()).submitGuess(this.state.roomCode, username, latlng, country);
    this.addCountryVote(country);
    this.setState({ guessToAdd: [latlng.lat, latlng.lng]})


  }

  async createNewRoom(username, roomCode) {
    if (!username || username === "" || !roomCode|| roomCode === "") {
      return false
    }
    var newRoom = (await getClient()).CreateNewRoom(username, roomCode);
    newRoom && this.setState({username: username, roomCode:roomCode, adminCode: newRoom.adminCode})
    return true
  }

  async addGuess(guess) {
    console.log("receivedMessage:", guess.data,2);
    let p = guess.data.split(":")
    this.addCountryVote(p[4]);
    this.setState({ guessToAdd: [Number(p[2]), Number(p[3])]})

  }

  async setUsername(username) {
    this.setView(this.state.roomCode, username, 0)
  }

  addCountryVote(country){
    if (country === ""){
      return
    }
    let votes = this.state.countryGuesses.get(country) ?? 0
    this.state.countryGuesses.set(country,votes+1)
    
  }

}
const AppWithRouter = withRouter(App);
export default AppWithRouter
