import { useState, useEffect } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/")
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <div>
      <h1>React + Vite + Express!</h1>
      <p>Backend Message: {message}</p>
    </div>
  );
}

export default App;
