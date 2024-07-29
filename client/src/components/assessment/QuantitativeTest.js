import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Quant from './Quantitative';
import './Quiz.css';
import LogoutTimer from './LogoutTimer';
import useAuth from '../../hooks/useAuth.js';
import Swal from 'sweetalert2';

const URL = process.env.REACT_APP_API_URL;
const QuantitativeTest= () => {
  const {auth} = useAuth()
  const navigate = useNavigate()
  const [activeQuestion, setActiveQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null)
  const [quizFinished, setQuizFinished] = useState(false)

  const [result, setResult] = useState({
    quantitative: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  })

  const { questions } = Quant
  const { question, choices, correctAnswer } = questions[activeQuestion]

  const onClickNext = () => {

    setSelectedAnswerIndex(null)
    setResult((prev) =>
      selectedAnswer
        ? {
          ...prev,
          quantitative: prev.quantitative + 1,
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

 

  const updateAptitude = useCallback(() => {
    const updatedResult = {
     
      quantitative: showResult ? result.correctAnswers : 0,
      correctAnswers: result.correctAnswers,
      wrongAnswers: result.wrongAnswers,
    };

    fetch(`${URL}/candidate/${Id}`, {
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
  });

  

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        updateAptitude();
        Swal.fire({
          title: 'As You have navigated from Assessment Page',
          text: "Quantitative Test has been Disabled",
          icon: 'warning',
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
  }, [updateAptitude]);



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
      <h1 style={{fontSize : "22px"}}>Quantitative Test</h1><br />
      {!quizFinished && <LogoutTimer initialTimer={1200}  />}
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
      )
      : (
          <div className="click-finish">
            <button className='redirect' onClick={updateAptitude}>
              Go to Candidate
            </button>
          </div>
        )
      }
    </div>
  )
}

export default QuantitativeTest;