import React, { useState, useEffect } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  useEffect(() => {
    setMode(history[history.length-1]);
  },[history]);

  function transition(newMode, replace = false) {
    let newHistory = [...history];
    if (replace) {
      newHistory.pop();
    };
    setHistory([...newHistory, newMode]);
  }

  function back() {
    let newHistory = [...history];
    if (newHistory.length > 1) {
      newHistory.pop();
    }
    
    setHistory(newHistory);
  }

  return { mode, transition, back };
};