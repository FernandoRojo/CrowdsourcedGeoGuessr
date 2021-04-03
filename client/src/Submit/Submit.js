import './Submit.css';

import React from 'react';

class Submit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: ""
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        let clickPos = "Click on the map to set your location guess"
        if (this.props.lastClick){
            let latlng = this.props.lastClick;
            let lat = latlng.lat.toFixed(2);
            let lng = latlng.lng.toFixed(2);
            clickPos = "Your marker is at " + lat + ", " + lng
        }
        return (
            <div className="SubmitField">
                <p> {clickPos} </p>
                <form onSubmit={this.handleSubmit}>
                    <input type="submit" value="Submit Guess" />
                </form>
            </div>

        );
    }

    handleSubmit(event) {
        console.log('A guess was submitted: ', this.state);
        event.preventDefault();
        this.props.submitGuess(this.props.username, this.props.lastClick, this.props.lastClickCountry)
    }
}

export default Submit;
