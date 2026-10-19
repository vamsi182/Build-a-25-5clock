
import React, { useEffect, useRef, useState } from "react";
import "./App.css";

export default function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timerType, setTimerType] = useState("Session");
  const [timeLeft, setTimeLeft] = useState(1500);
  const [running, setRunning] = useState(false);

  const beepRef = useRef(null);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setTimeLeft((time) => Math.max(0, time - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [running]);

  useEffect(() => {
    if (!running || timeLeft !== 0) return;

    if (beepRef.current) {
      beepRef.current.currentTime = 0;
      beepRef.current.play().catch(() => {});
    }

    if (timerType === "Session") {
      setTimerType("Break");
      setTimeLeft(breakLength * 60);
    } else {
      setTimerType("Session");
      setTimeLeft(sessionLength * 60);
    }
  }, [timeLeft, running, timerType, breakLength, sessionLength]);

  function changeLength(type, amount) {
    if (running) return;

    if (type === "break") {
      const next = Math.max(1, Math.min(60, breakLength + amount));
      setBreakLength(next);

      if (timerType === "Break") setTimeLeft(next * 60);
    } else {
      const next = Math.max(1, Math.min(60, sessionLength + amount));
      setSessionLength(next);

      if (timerType === "Session") setTimeLeft(next * 60);
    }
  }

  function reset() {
    setRunning(false);
    setBreakLength(5);
    setSessionLength(25);
    setTimerType("Session");
    setTimeLeft(1500);

    if (beepRef.current) {
      beepRef.current.pause();
      beepRef.current.currentTime = 0;
    }
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remaining
    ).padStart(2, "0")}`;
  }

  return (
    <main className="app">
      <h1>25 + 5 Clock</h1>
      <p className="subtitle">Focus on your work. Rest your mind.</p>

      <section className="settings">
        <div className="length-box">
          <h2 id="break-label">Break Length</h2>
          <div className="controls">
            <button
              id="break-decrement"
              onClick={() => changeLength("break", -1)}
            >
              −
            </button>
            <span id="break-length">{breakLength}</span>
            <button
              id="break-increment"
              onClick={() => changeLength("break", 1)}
            >
              +
            </button>
          </div>
        </div>

        <div className="length-box">
          <h2 id="session-label">Session Length</h2>
          <div className="controls">
            <button
              id="session-decrement"
              onClick={() => changeLength("session", -1)}
            >
              −
            </button>
            <span id="session-length">{sessionLength}</span>
            <button
              id="session-increment"
              onClick={() => changeLength("session", 1)}
            >
              +
            </button>
          </div>
        </div>
      </section>

      <section className="timer">
        <div className="timer-circle">
          <h2 id="timer-label">{timerType}</h2>
          <div id="time-left">{formatTime(timeLeft)}</div>
        </div>

        <div className="timer-buttons">
          <button
            id="start_stop"
            onClick={() => setRunning((previous) => !previous)}
          >
            {running ? "Pause" : "Start"}
          </button>
          <button id="reset" onClick={reset}>
            Reset
          </button>
        </div>
      </section>

      <audio
        id="beep"
        ref={beepRef}
        preload="auto"
        src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"
      />

      <footer>One task at a time ✦</footer>
    </main>
  );
}
