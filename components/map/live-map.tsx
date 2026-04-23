"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useAppStore } from "@/lib/store/app-store";

// Fix for default Leaflet markers in Next.js
const customMarkerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const redMarkerIcon = new L.Icon({
  ...customMarkerIcon.options,
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
});

export default function LiveMap() {
  const [mounted, setMounted] = useState(false);
  const requests = useAppStore(state => state.requests);
  const volunteers = useAppStore(state => state.volunteers);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full h-[400px] bg-neutral-900 rounded-xl flex items-center justify-center text-neutral-500">Loading Map...</div>;
  }

  // New Delhi Center
  const center: [number, number] = [28.6139, 77.2090];

  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden border border-neutral-800 shadow-xl relative z-0">
      <MapContainer 
        center={center} 
        zoom={11} 
        style={{ height: "100%", width: "100%", backgroundColor: "#0a0a0a" }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {/* Plot Active Requests */}
        {requests.map(req => {
          if (!req.coordinates) return null;
          return (
            <Marker 
              key={req.id} 
              position={[req.coordinates.lat, req.coordinates.lng]}
              icon={redMarkerIcon}
            >
              <Popup className="text-black">
                <strong>{req.title}</strong><br/>
                Status: {req.status}<br/>
                Urgency: {req.urgencyLevel}
              </Popup>
            </Marker>
          );
        })}

        {/* Plot Available Volunteers */}
        {volunteers.map(vol => {
          if (!vol.lat || !vol.lng) return null;
          return (
            <Marker 
              key={vol.id} 
              position={[vol.lat, vol.lng]}
              icon={customMarkerIcon}
            >
              <Popup className="text-black">
                <strong>{vol.name}</strong><br/>
                Role: {vol.role}<br/>
                Status: {vol.availabilityStatus}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      <div className="absolute top-4 right-4 z-[400] bg-black/80 backdrop-blur border border-neutral-700 p-2 rounded-lg text-xs">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 bg-red-500 rounded-full" /> Open Requests
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full" /> Volunteers
        </div>
      </div>
    </div>
  );
}
