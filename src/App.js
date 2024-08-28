import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import questions from './components/questions';

function App() {
  const [username, setUsername] = useState('');
  const [showStart, setShowStart] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [optionsVisible, setOptionsVisible] = useState(false);

  const timerRef = useRef(null);

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setTimeLeft(30);
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
  };

  useEffect(() => {
    if (timeLeft <= 26 && !optionsVisible) {
      setOptionsVisible(true);
    }

    if (timeLeft <= 0) {
      clearInterval(timerRef.current);
      handleNextQuestion(); // Süre bitince otomatik olarak bir sonraki soruya geç
    }
  }, [timeLeft, optionsVisible]);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  const handleAnswerClick = (option) => {
    if (isAnswered) return;

    setSelectedOption(option);
    setIsAnswered(true);

    if (option === questions[currentQuestion].answer) {
      setScore((prevScore) => prevScore + 1);
    }

    clearInterval(timerRef.current);
    setTimeout(() => {
      handleNextQuestion();
    }, 1000);
  };

  const handleNextQuestion = () => {
    setOptionsVisible(false);
    setSelectedOption(null);
    setIsAnswered(false);

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      startTimer();
    } else {
      setShowScore(true);
    }
  };

  const handleStart = () => {
    if (username) {
      setShowStart(false);
      startTimer();
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  if (showStart) {
    return (
      <div className="start-screen">
        <h1>Test Başlıyor!</h1>
        <p>Teste başlamadan önce, lütfen adınızı girerek kimliğinizi belirleyin...</p>
        <input
          type="text"
          placeholder="Kullanıcı Adı"
          value={username}
          onChange={handleUsernameChange}
        />
        <button id="start" onClick={handleStart}>
          Teste Başla
        </button>
      </div>
    );
  }

  if (showScore) {
    return (
      <div className="score-section">
        <h1>Test Sonuçları</h1>
        <p>Kullanıcı Adı: {username}</p>
        <p>Doğru Sayısı: {score}/{questions.length}</p>
        <p>Yanlış Sayısı: {questions.length - score}</p>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="question-section">
        <div className="question-text">{questions[currentQuestion].question}</div>
        <div className="question-image">
          <img src={require(`./images/${questions[currentQuestion].media}`)} alt="question" />
        </div>
      </div>
      <div className="options-section">
        {optionsVisible &&
          questions[currentQuestion].options.map((option, index) => (
            <button key={index} onClick={() => handleAnswerClick(option)} disabled={isAnswered}>
              {option}
            </button>
          ))}
      </div>
      <div className="timer">Kalan Süre: {timeLeft} sn</div>
    </div>
  );
}

export default App;

