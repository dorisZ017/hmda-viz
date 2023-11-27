import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Country, State, City }  from 'country-state-city';



export interface StateMapProps {
  data: any[],
  yKey: string
}

export const StateMap: React.FC<StateMapProps> = ({ data, yKey }) => {
  const maxY = Math.max(...data.map((entry) => entry[yKey]))
  return (
    <MapContainer center={[37.7749, -122.4194]} zoom={4} style={{ height: '500px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {data.map((row) => {
        const stateCode = row['state_code']
        const y = row[yKey]
        console.log(stateCode)
        const stateInfo = State.getStateByCodeAndCountry(stateCode, 'US');
        console.log(stateInfo)
        const latitude = Number(stateInfo?.latitude)
        const longitude = Number(stateInfo?.latitude)
        console.log(y)
        if (latitude & longitude) {
          return (
            <CircleMarker
              key={stateCode}
              center={[latitude, longitude]}
              radius={y / 100000000}
              fillColor="blue"
              fillOpacity={0.5}
            >
              <Popup>
                State: {stateCode} <br />
                Data: {y}
              </Popup>
            </CircleMarker>
          );
        } else {
          return null
        }

      })}
    </MapContainer>
  );
};
