import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapComponentProps {
  ballPosition: { lat: number; lng: number };
  goalPosition: { lat: number | null; lng: number | null };
}

const MapComponent: React.FC<MapComponentProps> = ({
  ballPosition,
  goalPosition,
}) => {
  const ballIcon = L.icon({
    iconUrl: "/ball.png",
    iconSize: [25, 41], // Adjust size as needed
    iconAnchor: [12, 41], // Adjust anchor as needed
  });

  const goalIcon = L.icon({
    iconUrl: "/goal.png",
    iconSize: [25, 41], // Adjust size as needed
    iconAnchor: [12, 41], // Adjust anchor as needed
  });

  return (
    <MapContainer
      center={ballPosition}
      zoom={13}
      style={{ height: "600px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={ballPosition} icon={ballIcon} />
      {goalPosition.lat !== null && goalPosition.lng !== null && (
        <Marker
          position={{ lat: goalPosition.lat, lng: goalPosition.lng }}
          icon={goalIcon}
        />
      )}
    </MapContainer>
  );
};

export default MapComponent;
