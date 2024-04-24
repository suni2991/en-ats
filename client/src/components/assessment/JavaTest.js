import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import JavaQ from './JavaQ';
import './Quiz.css';
import LogoutTimer from './LogoutTimer';
import useAuth from '../../hooks/useAuth.js';
import Swal from 'sweetalert2';




const JavaTest = () => {
  const {auth} = useAuth()
  const navigate = useNavigate()
  const [activeQuestion, setActiveQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null)
  const [quizFinished, setQuizFinished] = useState(false)


  const [result, setResult] = useState({
    java: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  })

  const { questions } = JavaQ
  const { question, choices, correctAnswer } = questions[activeQuestion]

  const onClickNext = () => {

    setSelectedAnswerIndex(null)
    setResult((prev) =>
      selectedAnswer
        ? {
          ...prev,
          java: prev.java + 1,
          correctAnswers: prev.correctAnswers + 1,
        }
        : { ...prev, wrongAnswers: prev.wrongAnswers + 1 }
    )
    if (activeQuestion !== questions.length - 1) {
      setActiveQuestion((prev) => prev + 1)
    } else {
      setActiveQuestion(0)
      setShowResult(true)
      setQuizFinished(true)
    }
  }
 
  
  const Id = (auth._id);
  
  
  const updateJava = useCallback(() => {
    const updatedResult = {
     
      java: showResult ? result.correctAnswers : 0,
      correctAnswers: result.correctAnswers,
      wrongAnswers: result.wrongAnswers,
    };

    fetch(`http://localhost:5040/candidate/${Id}`, {
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
  }, [showResult, navigate, result.correctAnswers, result.wrongAnswers, Id]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };
  
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        updateJava();
        Swal.fire({
          title: 'As You have navigated from Assessment Page',
          text: 'Java Test has been Disabled',
          icon: 'warning',
          showCloseButton: true,
          confirmButtonColor: '#00B4D2',
          confirmButtonText: 'Ok',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/candidate/candidate');
          }
        });
      }
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
  
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [updateJava]);
 


  const onAnswerSelected = (answer, index) => {
    setSelectedAnswerIndex(index)
    if (answer === correctAnswer) {
      setSelectedAnswer(true)
    } else {
      setSelectedAnswer(false)
    }
  }

  const addLeadingZero = (number) => (number > 9 ? number : `0${number}`)

  return (
    <div className="quiz-container">
    <div className='heading-timer'>
      <h1 style={{fontSize : "22px"}}>Java Test</h1><br />
      
      {!quizFinished && <LogoutTimer initialTimer={900}  />}
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
          <h2 style={{fontWeight: 'bold'}}>{question}</h2>
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
            <button className='redirect' onClick={updateJava}>
              Go to Candidate
            </button>
          </div>
        )

      }
    </div>

  )



}

export default JavaTest;