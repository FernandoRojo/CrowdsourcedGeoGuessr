import L from 'leaflet'
import './InteractiveMap.css';


import React from 'react';

class InteractiveMap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            mapContainer: null,
            popup: null,
            lastClick: null,
            userMarker: null,
            geojson: null,
            countryGuesses: new Map()
        };
        this.onMapClick = this.onMapClick.bind(this);
        this.countryStyle = this.countryStyle.bind(this);
        this.resetHighlight = this.resetHighlight.bind(this);
        this.determineCountry = this.determineCountry.bind(this);

        this.highlightFeature = this.highlightFeature.bind(this);
        this.onEachFeature = this.onEachFeature.bind(this);
        this.setCountryClick = this.setCountryClick.bind(this);
        
    }

    render() {
        return (
            <div className="InteractiveMap">
                <div id="FullMap">
                </div>
            </div>
        );
    }

    async componentDidMount() {
        var mapContainer = L.map('FullMap').setView([15.0, 0.0], 3);
        var popup = L.popup();
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'sk.eyJ1IjoicmVkZmVybjE2IiwiYSI6ImNrbTc4a2hkMTB2eTQydXByMW5veXB3cjMifQ.DAqrmpQJJFxWbOJgXTSqZw'
        }).addTo(mapContainer);
        mapContainer.on('click', this.onMapClick, {
            mapContainer: mapContainer,
            popup: popup
        })

        let geojson;

        let features = await (await fetch('/countrygeo.json')).json()
        geojson = L.geoJson(features, {
            clickable: true,
            style: this.countryStyle,
            onEachFeature: this.onEachFeature
        }).addTo(mapContainer);
 
        this.setState({
            mapContainer: mapContainer,
            popup: popup,
            geojson: geojson
        })

        let guesses = this.props.initialGuesses
        guesses && Object.keys(guesses).forEach(g => {
            console.log(guesses[g])
            L.marker([guesses[g][0], guesses[g][1]], { opacity: 0.5 }).addTo(this.state.mapContainer);
        });
        
    }

    onEachFeature(feature, layer) {
        layer.on({
            mouseover: this.highlightFeature,
            mouseout: this.resetHighlight,
            click: this.setCountryClick
        });
    }

    resetHighlight(e) {
        this.state.geojson.resetStyle(e.target);
    }

    highlightFeature(e) {
        var layer = e.target;
        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.0
        });
    
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
    }

    setCountryClick(e) {
        var layer = e.target;
        layer.setStyle({
            weight: 5,
            color: '#FFFFFF',
            dashArray: '',
            fillOpacity: 0.2
        });
    }

    countryStyle(feature){
        var count = this.props.countryGuesses && this.props.countryGuesses[feature.properties.geounit]
         return {
            fillColor: this.getColor(count),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.2
        };
    
    }
    
    getColor(d){
        return d > 250 ? '#800026' :
           d > 100  ? '#BD0026' :
           d > 50  ? '#E31A1C' :
           d > 25  ? '#FC4E2A' :
           d > 10  ? '#FD8D3C' :
           d > 5   ? '#FEB24C' :
           d > 1   ? '#FED976' :
                      '#AAAAAA';
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.lastClick !== this.state.lastClick) {
            prevState.userMarker && prevState.userMarker.remove()
            this.state.userMarker.addTo(this.state.mapContainer);
        }
        if (prevProps.guessToAdd !== this.props.guessToAdd) {
            L.marker([this.props.guessToAdd[0], this.props.guessToAdd[1]], { opacity: 0.5 }).addTo(this.state.mapContainer);
        }
    }

    onMapClick(e) {
        console.log(this.props.countryGuesses)

        var userMarker = L.marker(e.latlng, { opacity: 1.0 });
        this.setState({ userMarker: userMarker, lastClick: e.latlng})
        this.props.setLastClick(e.latlng, this.determineCountry(e.latlng))
    }

    determineCountry(latlng){
        var p = this.state.mapContainer.latLngToLayerPoint(latlng)
        let country = this.state.geojson.getLayers().find((layer) => 
            layer._containsPoint(p))?.feature.properties.geounit
 
        return country
    }

   

}

export default InteractiveMap;
