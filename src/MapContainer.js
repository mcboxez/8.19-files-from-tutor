import React, { Component } from "react";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";

export class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: null,
      map: null,
      // apiData: null
    };
  }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   console.log(prevState)
  //   console.log(this)
  // }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.selectedPlace !== this.props.selectedPlace) {
      const markers = this.refs;
      const marker = markers[nextProps.selectedPlace.name].marker;
      this.animateMarker(marker, this.state.map);
      this.setState({
        showingInfoWindow: true,
        selectedPlace: nextProps.selectedPlace,
        activeMarker: marker
      })
    }
  }

  handleMarkerClick = (props, marker, e) => {
    this.animateMarker(marker, props.map);
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  };

  handleMapClick = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

  animateMarker = (marker, map) => {
    map.setCenter(marker.position);
    marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
    setTimeout(function() {
      marker.setAnimation(null);
    }, 2000);
  };

  mapReady = (props, map) => {
    this.setState({
      map
    })
  };

  render() {
    const { places, google } = this.props;
    const { activeMarker, showingInfoWindow, selectedPlace } = this.state;
    const initialCenter = {
      lat: 39.90557676703715,
      lng: 116.40739630000007
    };
    const zoom = 13;

    return (
      <Map
        google={google}
        initialCenter={initialCenter}
        zoom={zoom}
        onClick={this.handleMapClick}
        onReady={this.mapReady}
      >
        {places.map(place => (
          <Marker
            key={place.name}
            onClick={this.handleMarkerClick}
            name={place.name}
            position={place.location}
            ref={place.name}
          />
        ))}

        <InfoWindow marker={activeMarker} visible={showingInfoWindow}>
          <h1>{selectedPlace ? selectedPlace.name : ""}</h1>
          {/* <p>{this.state.apiData ? this.state.apiData : "加载中"}</p> */}
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyApmoY54_QVp80zMhBn6K9phNui_6SbpL0"
})(MapContainer);
