import React, { useEffect, useState } from "react";
import Puzzle from "./Puzzle";
import { useNavigate } from "react-router-dom";

function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function Checkpoint({ location, locIndex, total }) {
  const [distance, setDistance] = useState(null);
  const [atLocation, setAtLocation] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("GPS wordt niet ondersteund.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const dist = getDistanceFromLatLonInM(
          pos.coords.latitude,
          pos.coords.longitude,
          location.lat,
          location.lng
        );
        setDistance(dist);
        if (dist < 50) setAtLocation(true);
      },
      (err) => setError("Fout bij GPS: " + err.message),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [location.lat, location.lng]);

  const handleSolved = () => {
    if (locIndex + 1 < total) navigate(`/map/${locIndex + 1}`);
    else navigate("/end");
  };

  if (error) return <div className="card">{error}</div>;
  if (atLocation)
    return (
      <div className="card">
        <h2>{location.title}</h2>
        <Puzzle question={location.question} onSolved={handleSolved} />
      </div>
    );

  return (
    <div className="card">
      <h2>Ga naar de locatie</h2>
      <p>Hint: {location.hint}</p>
      {distance !== null && <p>Afstand: {Math.round(distance)} meter</p>}
    </div>
  );
}
