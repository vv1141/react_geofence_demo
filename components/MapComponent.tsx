'use client'

import React, { useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css";
import L, { LeafletEvent, LatLngTuple } from "leaflet";

import { Area, Location } from "../app/page"

const icon = new L.Icon({
  // iconUrl: "<basePath>/marker.png",
  iconUrl: "marker.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const positionFromLocation = (location: Location): LatLngTuple => {
  return [location.latitude, location.longitude];
};

const positionsFromLocations = (locations: { [key: string]: Location }): Array<LatLngTuple> => {
  return Object.keys(locations).map(key => positionFromLocation(locations[key]));
};

function DraggableMarker(props: { locationId: string, location: Location, selectedArea: string, handleLocationChange: Function }) {
  const onDrag = (event: LeafletEvent) => {
    const { lat, lng } = event.target.getLatLng();
    props.handleLocationChange(props.selectedArea, props.locationId, {latitude: lat, longitude: lng});
  };
  return (
    <Marker
      draggable={true}
      eventHandlers={{ drag: onDrag }}
      position={positionFromLocation(props.location)}
      icon={icon}
    >
      <Popup>
        {props.location.latitude}, {props.location.longitude}
      </Popup>
    </Marker>
  )
}

function FocusHandler(props: { focusRequest: boolean, setFocusRequest: Function, location: Location }) {
  const map = useMap();
  useEffect(() => {
    if (!map || !props.focusRequest) {
      return;
    }
    map.flyTo(positionFromLocation(props.location));
    props.setFocusRequest(false);
  }, [map, props])
  return null;
}

const MapComponent = (props: {
  areas: { [key: string]: Area },
  selectedArea: string,
  handleLocationChange: Function,
  focusRequest: boolean,
  setFocusRequest: Function,
  focusLocation: Location }) => {

  const mapRef = useRef(null);
  const latitude = 60.164976;
  const longitude = 24.9317387;
  return (
    <MapContainer center={[latitude, longitude]} zoom={14} ref={mapRef} style={{ height: "100vh", width: "100vw" }}>
      <FocusHandler
        focusRequest={props.focusRequest}
        setFocusRequest={props.setFocusRequest}
        location={props.focusLocation}
      />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {Object.keys(props.areas[props.selectedArea].locations).map((key => (
        <DraggableMarker
          key={key}
          locationId={key}
          location={props.areas[props.selectedArea].locations[key]}
          selectedArea={props.selectedArea}
          handleLocationChange={props.handleLocationChange}
        />
      )))}
      {Object.keys(props.areas).map((key => (
      <Polygon
        key={key}
        pathOptions={{ color: "#173ec0" }}
        positions={positionsFromLocations(props.areas[key].locations)}
      />
      )))}
    </MapContainer>
  );
};

export default MapComponent;
