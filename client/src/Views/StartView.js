
import React from 'react';
import './Views.css'

class StartView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            mapContainer: null,
            popup: null,
            lastClick: null,
            userMarker: null,
            roomCode: "",
            userName: "",
        };
        this.onCreateRoom = this.onCreateRoom.bind(this);
        this.onEnterRoom = this.onEnterRoom.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }

    render() {
        return (
            <div id="start-view">
                <label>
                    Twitch Username:
                        <input type="text" value={this.state.userName} className='username-input' onChange={this.handleChange} />
                </label>
                <div className="forms">
                    <div className="enter-room-form">
                        <form onSubmit={this.onEnterRoom} action="/play">

                            <label >
                                Roomcode:
                        <input type="text" value={this.state.roomCode} className='roomcode-input' onChange={this.handleChange} />
                            </label>
                            <input type="submit" className='enter-room-submit' value="Enter Room" />
                        </form>
                    </div>
                    <div className="create-room-form">
                        <form onSubmit={this.onCreateRoom}>
                            <input type="submit" className='create-room-submit' value="Create New Room" />
                        </form>
                    </div>
                </div>
            </div>
        );
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

    onCreateRoom(event) {
        var roomCode = '_' + Math.random().toString(36).substr(2, 9);
        this.props.setView(roomCode, this.state.userName, 1)
        event.preventDefault();
    }

    onEnterRoom(event) {
        this.props.setView(this.state.roomCode, this.state.userName, 0)
        event.preventDefault();
    }
}


export default StartView;

