import React from "react";
import locationsData from "./data/locations.json";
import ChatUI from "./components/ChatUI";

function getDistance(lat1, lng1, lat2, lng2) {
  function toRad(x) { return x * Math.PI / 180; }
  const R = 6371e3;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lat2 - lat1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 2; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const shuffledLocations = shuffle(locationsData);
const DISTANCE_THRESHOLD = 50; // meters

export default function App() {
  const [step, setStep] = React.useState(0);
  const [messages, setMessages] = React.useState([
    { sender: "hacker", text: "De hacker beweegt zich door de stad. Aan jullie de vraag hem te volgen, de puzzels op te lossen en ons zo een stap dichter bij het ontmaskeren van de dader te brengen. Je krijgt een hint. Zodra je in de buurt van die coordinaten bent krijg je de vraag. Los alle vragen op." }
  ]);
  const [userLocation, setUserLocation] = React.useState(null);
  const questionSentRef = React.useRef(false);

  React.useEffect(() => {
    console.log("User location changed:", userLocation);
  }, [userLocation])

  // Watch user location
  React.useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      pos => setUserLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      }),
      err => setUserLocation(null),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Voeg hint toe bij elke nieuwe stap
  React.useEffect(() => {
    if (step < shuffledLocations.length) {
      setMessages(msgs => [
        ...msgs,
        { sender: "hacker", text: shuffledLocations[step].hint }
      ]);
      questionSentRef.current = false;
    }
    if (step === shuffledLocations.length) {
      fetch("/api/completed", { method: "POST" });
      setMessages(msgs => [
        ...msgs,
        { sender: "hacker", text: "🎉 Gefeliciteerd! Je hebt alle vragen afgerond." }
      ]);
    }
  }, [step]);

  // Stuur vraag als je dichtbij genoeg bent en nog niet gestuurd
  React.useEffect(() => {
    if (
      step < shuffledLocations.length &&
      !questionSentRef.current &&
      userLocation
    ) {
      const location = shuffledLocations[step];
      if (location.question.type === "end") {
        setMessages(msgs => [
          ...msgs,
          { sender: "hacker", text: location.question.text }
        ]);
        questionSentRef.current = true;
        return;
      }
      const distance = getDistance(
        userLocation.lat,
        userLocation.lng,
        location.lat,
        location.lng
      );
      if (distance <= DISTANCE_THRESHOLD) {
        setMessages(msgs => [
          ...msgs,
          {
            sender: "hacker", text: location.question.type === "multiple"
              ? location.question.text + "\nOpties: " + location.question.options.join(", ")
              : location.question.text
          }
        ]);
        questionSentRef.current = true;
      }
    }
  }, [userLocation, step]);

  const handleSend = (input) => {
    const location = shuffledLocations[step];

    // Alleen antwoorden als vraag gestuurd is
    if (!questionSentRef.current) {
      const distance = userLocation
        ? Math.round(getDistance(
          userLocation.lat,
          userLocation.lng,
          location.lat,
          location.lng
        ))
        : null;

      setMessages(msgs => [
        ...msgs,
        {
          sender: "hacker",
          text: distance !== null
            ? `Je bent nog niet dichtbij genoeg om het raadsel te beantwoorden. (${distance} meter)`
            : "Je bent nog niet dichtbij genoeg om het raadsel te beantwoorden."
        }
      ]);
      return;
    }

    setMessages(msgs => [...msgs, { sender: "user", text: input }]);

    if (location && (location.question.type === "multiple" || location.question.type === "text")) {
      const correct = input.trim().toLowerCase() === location.question.answer.trim().toLowerCase();

      if (correct) {
        setTimeout(() => setStep(s => s + 1), 1200);
        setMessages(msgs => [
          ...msgs,
          { sender: "hacker", text: "✅ Correct!" }
        ]);
      } else {
        setMessages(msgs => [
          ...msgs,
          { sender: "hacker", text: "❌ Niet juist. Probeer het opnieuw." }
        ]);
      }
    } else if (location && location.question.type === "end") {
      setTimeout(() => setStep(s => s + 1), 1200);
    }
  };

  return (
    <ChatUI messages={messages} onSend={handleSend} />
  );
}