import InteractiveMap from '../InteractiveMap/InteractiveMap.js';
import Submit from '../Submit/Submit.js';
import GuessTable from '../GuessTable/GuessTable.js'
import React from 'react';
import { Redirect } from 'react-router';

class PlayerView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            mapContainer: null,
            popup: null,
            lastClick: null,
            userMarker: null,
            usernameText: "",
            lastClickCountry: ""
        };
        this.handleChange = this.handleChange.bind(this)
        this.setLastClick = this.setLastClick.bind(this)

        this.handleUsernameSubmit = this.handleUsernameSubmit.bind(this)
    }

    render() {
        let { username, roomCode, guessToAdd } = { ...this.props }
        return (
            this.props.isLoaded && <div id="player-view">
                {!roomCode && <Redirect to="/main?error=2" />}
                {!username && this.usernameInput(this.props.setUsername)}
                {username && roomCode && 
                <div> <div className="player-view-success" >
                    <h1> Welcome {username}!</h1>
                    <InteractiveMap initialGuesses={this.props.initialGuesses} setLastClick={this.setLastClick} guessToAdd={guessToAdd} countryGuesses={this.props.countryGuesses}></InteractiveMap>
                    <Submit lastClick={this.state.lastClick} lastClickCountry={this.state.lastClickCountry} username={username} submitGuess={this.props.submitGuess}></Submit>
                </div>
                <GuessTable countryGuesses={this.props.countryGuesses} guessToAdd={guessToAdd}/>
                </div>
                }
           
            </div>
        );
    }

    usernameInput() {
        return (
            <div className="play-username-form">
                <form onSubmit={this.handleUsernameSubmit}>
                    <label>
                        <div className="label-text">
                            <strong> Set Your Twitch Username to participate: </strong>
                        </div>
                        <input type="text" value={this.state.userNameText} onChange={this.handleChange} className="username-input" />
                    </label>
                    <br />
                    <input type="submit" value="Set Username" />
                </form>
            </div>
        )
    }

    handleChange(event) {
        this.setState({ userNameText: event.target.value })
    }

    handleUsernameSubmit(event) {
        this.props.setUsername(this.state.userNameText)
        event.preventDefault();
    }

    setLastClick(lastClick, lastClickCountry) {
        this.setState({ lastClick: lastClick, lastClickCountry: lastClickCountry })
    }
}
export default PlayerView;

