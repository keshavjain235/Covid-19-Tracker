import React from 'react';
import '../styles/Map.css';
import { MapContainer as LeafletMap, TileLayer, useMap } from 'react-leaflet';
import { showDataOnMap } from '../util';

function ChangeMap({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

function Map({casesType, countries, center, zoom}) {
    return (
        <div className="map">
            <LeafletMap>
                <ChangeMap center={center} zoom={zoom} />
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {showDataOnMap(countries, casesType)}
            </LeafletMap>
        </div>
    );
}

export default Map;