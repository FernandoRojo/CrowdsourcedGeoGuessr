import InteractiveMap from '../InteractiveMap/InteractiveMap.js';
import Submit from '../Submit/Submit.js';

import React from 'react';

class AdminView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            mapContainer: null,
            popup: null,
            lastClick: null,
            userMarker: null
        };
        this.onMapClick = this.onMapClick.bind(this);
    }

    render() {
        return (
            <div id="admin-view">
                <InteractiveMap></InteractiveMap>
                <Submit lastClick={this.state.lastClick} submitGuess={this.props.submitGuess}></Submit>
            </div>
        );
    }
}
export default AdminView;

