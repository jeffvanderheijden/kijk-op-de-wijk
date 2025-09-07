import React, { useState } from "react";

export default function Puzzle({ question, onSolved }) {
  const [answer, setAnswer] = useState("");
  const [photo, setPhoto] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [solved, setSolved] = useState(false);

  const handleMultipleChoice = () => {
    if (answer === question.answer) {
      setFeedback("✅ Goed gedaan!");
      setSolved(true);
      onSolved();
    } else {
      setFeedback("❌ Fout, probeer opnieuw.");
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
      setFeedback("✅ Foto geüpload!");
      setSolved(true);
      onSolved();
    }
  };

  if (solved) return <div>{feedback}</div>;

  return (
    <div>
      <p>{question.text}</p>
      {question.type === "multiple" && (
        <>
          {question.options.map((opt) => (
            <label key={opt} style={{ display: "block" }}>
              <input type="radio" name="answer" value={opt} onChange={(e) => setAnswer(e.target.value)} />
              {opt}
            </label>
          ))}
          <button onClick={handleMultipleChoice}>Bevestig</button>
        </>
      )}
      {question.type === "photo" && <input type="file" accept="image/*" onChange={handlePhotoUpload} />}
      {feedback && <p>{feedback}</p>}
    </div>
  );
}
