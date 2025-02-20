
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PsychometricQ from './Question.js';
import './Quiz.css';
import LogoutTimer from './LogoutTimer';
import useAuth from '../../hooks/useAuth.js';
import Swal from 'sweetalert2';

const URL = process.env.REACT_APP_API_URL;

const PsychometricTest = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);

  const [result, setResult] = useState({
    psychometric: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  });

  const { questions } = PsychometricQ;
  const { question, choices, correctAnswer } = questions[activeQuestion];

  const onClickNext = () => {
    setSelectedAnswerIndex(null);
    setResult((prev) =>
      selectedAnswer
        ? {
            ...prev,
            psychometric: prev.psychometric + 1,
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
  // 80% passing criteria (round up)

  const updatepsychometric = useCallback(() => {
    const correctAnswers = result.correctAnswers;
    const totalQuestions = questions.length;
  const passingMark = Math.ceil(totalQuestions * 0.8); 
    const status = correctAnswers >= passingMark ? 'Pass' : 'Fail';// 80% passing criteria

    const updatedResult = {
      psychometric: { 
        score: correctAnswers, 
        status: status 
      },
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
  

  const onAnswerSelected = (answer, index) => {
    setSelectedAnswerIndex(index);
    if (answer === correctAnswer) {
      setSelectedAnswer(true);
    } else {
      setSelectedAnswer(false);
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        updatepsychometric();
        Swal.fire({
          title: 'As You have navigated from Assessment Page',
          text: "Psychometric Test has been Disabled",
          icon: 'error',
          showCloseButton: true,
          confirmButtonColor: '#00B4D2',
          confirmButtonText: 'Ok'
        })
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [updatepsychometric]);
  

  const addLeadingZero = (number) => (number > 9 ? number : `0${number}`)

  return (
    <div className="quiz-container">
      <div className='heading-timer'>
       <center> <h1 style={{fontSize : "22px"}}>Psychometric Test</h1></center><br />
     
        {!quizFinished && <LogoutTimer initialTimer={600}  />}
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
          <h1 style={{fontWeight: 'bold', marginTop:'10px',marginBottom:'10px', color:'#00B4D2'}}>{question}</h1>
          <ul>
            {choices.map((answer, index) => (
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
      ) :
        (
          <div className="click-finish">
            <button className='redirect' onClick={updatepsychometric}>
              Go back To Assessment Page
            </button>
          </div>
        )
      }
    </div>
  )
}

export default PsychometricTest;