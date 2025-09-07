import React from "react";
import { useNavigate } from "react-router-dom";

export default function StartScreen() {
  const navigate = useNavigate();
  return (
    <div className="card">
      <h1>Kijk op de Wijk</h1>
      <p>Welkom bij de missie. Volg de hints en los de puzzels op.</p>
      <button onClick={() => navigate("/map/0")}>Start</button>
    </div>
  );
}
