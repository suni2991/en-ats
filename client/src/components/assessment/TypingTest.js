import React, { useState, useEffect } from 'react';

const marathiText = 'तुमचं स्वागत आहे! मराठीत टायपिंग टेस्ट घेऊया.';

const TypingTest = () => {
  const [userInput, setUserInput] = useState('');
  const [charactersTyped, setCharactersTyped] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timer, setTimer] = useState(null);

  const startTimer = () => {
    setTimer(setInterval(() => {
      setTimeElapsed((prevTime) => prevTime + 1);
    }, 1000));
  };

  const stopTimer = () => {
    clearInterval(timer);
  };

  useEffect(() => {
    startTimer();
    return () => {
      stopTimer();
    };
  }, []);

  const handleInputChange = (e) => {
    const inputText = e.target.value;
    setUserInput(inputText);

    const correctCharacters = marathiText.slice(0, inputText.length);
    const incorrectCharacters = inputText.slice(correctCharacters.length);
    const newAccuracy = (correctCharacters.length / marathiText.length) * 100;

    setCharactersTyped(inputText.length);
    setAccuracy(newAccuracy);

    if (inputText === marathiText) {
      stopTimer();
      alert(`Congratulations! You completed the typing test in ${timeElapsed} seconds.`);
    }
  };

  return (
    <div>
      <h1>Marathi Typing Test</h1>
      <p>{marathiText}</p>
      <textarea
        value={userInput}
        onChange={handleInputChange}
        placeholder="यहाँ टाइप करें..."
        lang="mr" // Set language attribute to Marathi
      />
      <p>Characters Typed: {charactersTyped}</p>
      <p>Accuracy: {accuracy.toFixed(2)}%</p>
      <p>Time Elapsed: {timeElapsed} seconds</p>
    </div>
  );
};

export default TypingTest;
