import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Vocabulary_campus from './Vocabulary_Campus.js';
import Quantitative_campus from './Quantitative_Campus.js';
import Psychometric_campus from './Pyschometric_Campus.js';
import '../assessment/Quiz.css';
import LogoutTimer from '../assessment/LogoutTimer.js';
import useAuth from '../../hooks/useAuth.js';
import Swal from 'sweetalert2';

const URL = process.env.REACT_APP_API_URL;

const Test = ({ testType }) => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const getRandomQuestions = (questions, numQuestions) => {
      const shuffled = questions.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, numQuestions);
    };

    let selectedQuestions = [];
    if (testType === 'Vocabulary') {
      selectedQuestions = getRandomQuestions(Vocabulary_campus.questions, 10);
    } else if (testType === 'Quantitative') {
      selectedQuestions = getRandomQuestions(Quantitative_campus.questions, 10);
    } else if (testType === 'Psychometric') {
      selectedQuestions = getRandomQuestions(Psychometric_campus.questions, 10);
    }
    setQuestions(selectedQuestions);
  }, [testType]);

  const [result, setResult] = useState({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  });

  const onClickNext = () => {
    setSelectedAnswerIndex(null);
    setResult((prev) =>
      selectedAnswer
        ? {
            ...prev,
            score: prev.score + 1,
            correctAnswers: prev.correctAnswers + 1,
          }
        : { ...prev, wrongAnswers: prev.wrongAnswers + 1 }
    );
    if (activeQuestion !== questions.length - 1) {
      setActiveQuestion((prev) => prev + 1);
    } else {
      setActiveQuestion(0);
      setShowResult(true);
      setQuizFinished(true);
    }
  };

  const Id = auth._id;

  const updateTestResult = useCallback(() => {
    const totalQuestions = questions.length;
    const passingMark = Math.ceil(totalQuestions * 0.7); // 70% passing criteria
    const correctAnswers = result.correctAnswers;
    const status = correctAnswers >= passingMark ? 'Satisfatory' : 'Not Satisfatory';

    const updatedResult = {
      [testType.toLowerCase()]: { score: correctAnswers, status: status },
      correctAnswers: correctAnswers,
      wrongAnswers: result.wrongAnswers,
    };

    fetch(`${URL}/api/candidate/${Id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedResult),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'SUCCESS') {
          navigate('/candidate/candidate');
        } else {
          console.error('Failed to update candidate record:', data.message);
        }
      })
      .catch((error) => {
        console.error('Failed to update candidate record:', error);
      });
  }, [result, questions.length, navigate, Id]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        updateTestResult();
        Swal.fire({
          title: 'As You have navigated from Assessment Page',
          text: "Test has been Disabled",
          icon: 'warning',
          showCloseButton: true,
          confirmButtonColor: '#00B4D2',
          confirmButtonText: 'Ok'
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [updateTestResult]);

  const onAnswerSelected = (answer, index) => {
    setSelectedAnswerIndex(index);
    if (answer === questions[activeQuestion].correctAnswer) {
      setSelectedAnswer(true);
    } else {
      setSelectedAnswer(false);
    }
  };

  const addLeadingZero = (number) => (number > 9 ? number : `0${number}`);

  return (
    <div className="quiz-container">
      <div className='heading-timer'>
        <center><h1 style={{ fontSize: "22px" }}>{testType} Test</h1></center><br />
        {!quizFinished && <LogoutTimer initialTimer={600} />}
      </div>

      {!showResult ? (
        <div>
          <div>
            <span className="active-question-no">
              {addLeadingZero(activeQuestion + 1)}
            </span>
            <span className="total-question">
              /{addLeadingZero(questions.length)}
            </span>
          </div>
          <h1 style={{ fontWeight: 'bold', color: '#00B4D2', marginTop: '20px', marginBottom: '10px' }}>{questions[activeQuestion]?.question}</h1>
          <ul>
            {questions[activeQuestion]?.choices.map((answer, index) => (
              <li
                onClick={() => onAnswerSelected(answer, index)}
                key={answer}
                className={
                  selectedAnswerIndex === index ? 'selected-answer' : null
                }>
                {answer}
              </li>
            ))}
          </ul>
          <div className="flex-right">
            <button
              onClick={onClickNext}
              disabled={selectedAnswerIndex === null}>
              {activeQuestion === questions.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      ) : (
        <div className="click-finish">
          <button className='redirect' onClick={updateTestResult}>
            Go back To Assessment Page
          </button>
        </div>
      )}
    </div>
  );
};

export default Test;