import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useForm } from 'react-hook-form';


function Test() {
  const [userInfo, setUserInfo] = useState({});
  const [totalAttemptedQuestions, setTotalAttemptedQuestions] = useState(0);
  const [section, setSection] = useState('A');
  const [selectedSerialNumber, setSelectedSerialNumber] = useState(null);
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState(0); // New state for correct answers
  const [totalWrongAnswers, setTotalWrongAnswers] = useState(0);
  const [submittedQuestions, setSubmittedQuestions] = useState(new Set());
  const [selectedOptions, setSelectedOptions] = useState({});
  const [questionData, setQuestionData] = useState({});
  const [count, setCount] = useState(1200);
  const [serialNumberRange, setSerialNumberRange] = useState({ start: 0, end: 0 });
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState({});
  const [randomNumber, setRandomNumber] = useState(null);
  
  const [correctAnswer, setCorrectAnswer] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false); // New state for submission tracking
  const {
    register,
    handleSubmit,
    getValues, // Extract getValues here
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();
  const generateRandomNumber = () => {
    const length = 8;
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10); // Generates a digit from 0 to 9
    }
    
    setRandomNumber(result);
    console.log('Generated Random Number:', result);
  };

  useEffect(() => {
    const savedSelectedOptions = JSON.parse(localStorage.getItem('selectedOptions')) || {};
    const savedSubmittedQuestions = new Set(JSON.parse(localStorage.getItem('submittedQuestions')) || []);
    const savedScore = localStorage.getItem('score') || 0;
    const savedIsCorrect = JSON.parse(localStorage.getItem('isCorrect')) || {};
    const savedCorrectAnswer = JSON.parse(localStorage.getItem('correctAnswer')) || {};
    setSelectedOptions(savedSelectedOptions);
    setSubmittedQuestions(savedSubmittedQuestions);
    setScore(Number(savedScore));
    setIsCorrect(savedIsCorrect);
    setCorrectAnswer(savedCorrectAnswer);
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedOptions', JSON.stringify(selectedOptions));
    localStorage.setItem('submittedQuestions', JSON.stringify(Array.from(submittedQuestions)));
    localStorage.setItem('score', score);
    localStorage.setItem('isCorrect', JSON.stringify(isCorrect));
    localStorage.setItem('correctAnswer', JSON.stringify(correctAnswer));
  }, [selectedOptions, submittedQuestions, score, isCorrect, correctAnswer]);

 
  
  

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // useEffect(() => {
  //   const preventBack = (event) => {
  //     event.preventDefault();
  //     event.stopImmediatePropagation();
  //     window.history.pushState(null, '', window.location.href);
  //   };

  //   window.history.replaceState(null, '', window.location.href);

  //   const pushStateLoop = () => {
  //     window.history.pushState(null, '', window.location.href);
  //     setTimeout(pushStateLoop, 100);
  //   };

  //   pushStateLoop();
  //   window.addEventListener('popstate', preventBack);

  //   return () => {
  //     window.removeEventListener('popstate', preventBack);
  //   };
  // }, []);


  const handleOptionChange = (serialNumber, selectedOption) => {
    setSelectedOptions(prevOptions => ({
      ...prevOptions,
      [serialNumber]: selectedOption
    }));
  };

  useEffect(() => {
    fetch('student.json')
        .then(response => response.json())
        .then(data => {
            setUserInfo(data[0]);
            setValue('t1', data[0].Student_Name);
            setValue('t2', data[0].Student_Id);
            setValue('t3', data[0].Email_Id);
        })
        .catch(error => console.error('Error fetching user info:', error));
  }, [setValue]);

  useEffect(() => {
    fetch('SectionA.json')
        .then(response => response.json())
        .then(data => {
            setUserInfo(data[0]);
            setValue('t4', data[0].Paper_Code);
        })
        .catch(error => console.error('Error fetching user info:', error));
  }, [setValue]);

  const fetchSectionData = async (section) => {
    try {
      const response = await axios.post(`http://localhost:3000/viewpaper${section === 'A' ? '' : 'sectionB'}`, {
        section,
      });
      const serialNumbers = response.data.map((question) => question.Serial_Number);
      const minSerialNumber = Math.min(...serialNumbers);
      const maxSerialNumber = Math.max(...serialNumbers);
      setSerialNumberRange({ start: minSerialNumber, end: maxSerialNumber });

      const formattedData = response.data.reduce((acc, question) => {
        acc[question.Serial_Number] = {
          serialNumber: question.Serial_Number,
          question: question.Add_Question,
          options: [question.Option_1, question.Option_2, question.Option_3, question.Option_4],
          rightAnswer: question.Right_Answer,
        };
        return acc;
      }, {});

      setQuestionData((prevData) => ({
        ...prevData,
        [section]: formattedData,
      }));
    } catch (error) {
      console.error(`Error fetching section ${section} data:`, error);
      toast.error('Failed to fetch section data. Please try again.');
    }
  };
const onSubmit = async () => {
  const { t1, t2, t3, t4 } = getValues();
  const payload = {
    studentInfo: {
      Student_Name: t1,
      Student_Id: t2,
      Email_Id: t3,
      Paper_Code: t4,
      attemptedQuestions: totalAttemptedQuestions,
      correctAnswers: totalCorrectAnswers,
      wrongAnswers: totalWrongAnswers,
      randomNumber: randomNumber,
    },
    score
  };

  try {
    const response = await fetch("http://localhost:3000/submitAnswers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.text();

    if (response.ok) {
      toast.success('Answers submitted successfully!');
    } else {
      toast.error('Failed to submit answers');
    }
  } catch (error) {
    console.error('Error submitting answers:', error);
    toast.error('An error occurred while submitting the answers');
  }
};

useEffect(() => {
  const generateRandomNumber = () => {
    const length = 8;
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10); // Generates a digit from 0 to 9
    }
    
    setRandomNumber(result);
    console.log('Generated Random Number:', result);
  };

  const onSubmit = async (randomNumber) => {
    const { t1, t2, t3, t4 } = getValues();
    const payload = {
      studentInfo: {
        Student_Name: t1,
        Student_Id: t2,
        Email_Id: t3,
        Paper_Code: t4,
        attemptedQuestions: totalAttemptedQuestions,
        correctAnswers: totalCorrectAnswers,
        wrongAnswers: totalWrongAnswers,
        randomNumber: randomNumber,
      },
      score
    };

    try {
      const response = await fetch("http://localhost:3000/submitAnswers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.text();

      if (response.ok) {
        toast.success('Answers submitted successfully!');
      } else {
        toast.error('Failed to submit answers');
      }
    } catch (error) {
      console.error('Error submitting answers:', error);
      toast.error('An error occurred while submitting the answers');
    }
  };

  const timer = setInterval(() => {
    setCount(prevCount => {
      const newCount = prevCount - 1;
      if (newCount <= 0 && !hasSubmitted) {
        toast.error("Time's up! Submitting answers...");
        
        // Generate random number
        const randomNumber = generateRandomNumber();
        
        // Call the onSubmit function and navigate
        onSubmit(randomNumber).then(() => {
          setHasSubmitted(true); // Ensure we only submit once
          navigate('/afterresult');
        });
        
        return 0;
      }
      return newCount;
    });
  }, 1000);

  // Cleanup interval on component unmount
  return () => clearInterval(timer);
}, [hasSubmitted, getValues, navigate, score, totalAttemptedQuestions, totalCorrectAnswers, totalWrongAnswers]);


  
 
  const handleSectionClick = (newSection) => {
    setSection(newSection);
    setSelectedSerialNumber(null); // Reset selected serial number when switching sections
    fetchSectionData(newSection);
  };

  const handleSubmitAnswer = (serialNumber) => {
    const question = questionData[section][serialNumber];
    if (!question) return;
  
    const selectedOption = selectedOptions[serialNumber];
    if (selectedOption === undefined) {
      toast.warn('Please select an option before submitting.');
      return;
    }
  
    const correctAnswer = question.rightAnswer;
    const isAnswerCorrect = selectedOption.toLowerCase() === correctAnswer.toLowerCase();
    setSubmittedQuestions(prev => new Set(prev.add(serialNumber)));
    setCorrectAnswer(prev => ({ ...prev, [serialNumber]: correctAnswer }));
    setIsCorrect(prev => ({ ...prev, [serialNumber]: isAnswerCorrect }));
  
    // Update total attempted, correct, and wrong questions
    setTotalAttemptedQuestions(prevCount => prevCount + 1);
    if (isAnswerCorrect) {
      setScore(prevScore => prevScore + 2);
      setTotalCorrectAnswers(prevCount => prevCount + 1); // Increment total correct answers
      toast.success('Correct answer!');
    } else {
      setTotalWrongAnswers(prevCount => prevCount + 1); // Increment total wrong answers
      toast.error('Incorrect answer.');
    }
  };
  

  const renderQuestions = () => {
    if (!selectedSerialNumber || !questionData[section] || !questionData[section][selectedSerialNumber]) {
      return <h2 style={{ color: '#555' }}>Please select a Section number and then Select Questions</h2>;
    }

    const question = questionData[section][selectedSerialNumber];

    if (!question || !question.question || !question.options) {
      return <h2 style={{ color: '#555' }}>Error loading question data</h2>;
    }

    return (
      <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#333', fontSize: '20px' }}>Question: {question.question}</h2>
        <h3 style={{ color: '#555', fontSize: '18px' }}></h3>
        {question.options.map((option, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <input
              type="radio"
              name={selectedSerialNumber}
              value={option.toLowerCase()}
              onChange={() => handleOptionChange(selectedSerialNumber, option)}
              checked={selectedOptions[selectedSerialNumber] === option}
              disabled={submittedQuestions.has(selectedSerialNumber)}
              style={{ marginRight: '8px' }}
            />
            <label style={{ fontSize: '16px' }}>{option}</label>
          </div>
        ))}
        <br />
        <input
          type="button"
          onClick={() => handleSubmitAnswer(selectedSerialNumber)}
          value="Submit"
          style={{
            backgroundColor: submittedQuestions.has(selectedSerialNumber) ? 'green' : '#4CAF50',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: submittedQuestions.has(selectedSerialNumber) ? 'not-allowed' : 'pointer',
            opacity: submittedQuestions.has(selectedSerialNumber) ? 0.5 : 1,
            fontSize: '16px'
          }}
          disabled={submittedQuestions.has(selectedSerialNumber)}
        />
        {submittedQuestions.has(selectedSerialNumber) && (
          <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e0f7fa', borderRadius: '5px' }}>
            <h3>Selected Option:</h3>
            <p>{selectedOptions[selectedSerialNumber]}</p>
            <h3>Correct Answer:</h3>
            <p>{correctAnswer[selectedSerialNumber]}</p>
            <p>{isCorrect[selectedSerialNumber] ? 'True' : 'False'}</p>
          </div>
        )}
      </div>
    );
  };

  const renderSectionButtons = () => {
    if (serialNumberRange.start > serialNumberRange.end) return null;

    const buttons = [];
    for (let i = serialNumberRange.start; i <= serialNumberRange.end; i++) {
      buttons.push(i);
    }

    return buttons.map(serialNumber => {
      const correctState = isCorrect[serialNumber];
      let backgroundColor = '#ddd';
      if (submittedQuestions.has(serialNumber)) {
        backgroundColor = correctState ? 'green' : 'red';
      } else if (serialNumber === selectedSerialNumber) {
        backgroundColor = 'blue';
      }
      
      return (
        <button
          key={serialNumber}
          style={{
            backgroundColor: backgroundColor,
            color: serialNumber === selectedSerialNumber || submittedQuestions.has(serialNumber) ? 'white' : '#333',
            border: 'none',
            padding: '10px 20px',
            margin: '5px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
          onClick={() => setSelectedSerialNumber(serialNumber)}
        >
          Question Number {serialNumber}
        </button>
      );
    });
  };

  return (
    <div>
      <nav>
        <div className="logo">
          <img
            src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/education-logo-best-teacher-logo-design-template-7e9b38bf124afd7bbeae2c4aaa59480a_screen.jpg?ts=1677768434"
            alt="Logo"
          />
          <a href="#" target="_blank" rel="noopener noreferrer">Rishabh</a>
        </div>
        <ul>
          <li><a href="#main">Home</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#about">About Me</a></li>
          <li><a href="#portfolio">Portfolio</a></li>
          <li><a href="#feedback">Feedback</a></li>
        </ul>
        <ul>
          <li><NavLink to="/studentlogin">Student Login</NavLink></li>
          <li><NavLink to="/Loginform">Company Login</NavLink></li>
          <li><NavLink to="/Otp">Otp</NavLink></li>
          <li><NavLink to="/addquestion">Add Question</NavLink></li>
          <li><NavLink to="/studentdashboard">Dashboard</NavLink></li>
        </ul>
      </nav>

      <main style={{ padding: '20px', backgroundColor: '#fff', minHeight: '100vh' }}>
  {/* Countdown Timer */}
  <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e0f7fa', borderRadius: '5px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
    <h2 style={{ fontSize: '24px', color: '#00796b' }}>Countdown: {Math.floor(count / 60)}:{String(count % 60).padStart(2, '0')}</h2>
  </div>
  <h1 style={{ marginBottom: '20px' }}>Section {section}</h1>
  {/* Section Buttons */}
  <button
    type="submit"
    onClick={() => handleSectionClick('A')}
    style={{
      backgroundColor: section === 'A' ? 'blue' : '#ddd',
      color: section === 'A' ? 'white' : '#333',
      border: 'none',
      padding: '10px 20px',
      margin: '5px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px'
    }}
  >
    Section A
  </button>
  <button
    type="submit"
    onClick={() => handleSectionClick('B')}
    style={{
      backgroundColor: section === 'B' ? 'blue' : '#ddd',
      color: section === 'B' ? 'white' : '#333',
      border: 'none',
      padding: '10px 20px',
      margin: '5px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px'
    }}
  >
    Section B
  </button>
  
  {/* Render Section Buttons */}
  <div style={{ marginTop: '20px' }}>
    {renderSectionButtons()}
  </div>

  {/* Render Questions */}
  <div style={{ marginTop: '20px' }}>
    {renderQuestions()}
  </div>

  {/* Marks */}
  <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e0f7fa', borderRadius: '5px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
    <h2 style={{ fontSize: '24px', color: '#00796b' }}>Marks: {score}</h2>
  </div>
  <form className="max-w-sm mx-auto" onSubmit={handleSubmit(onSubmit)} onClick={generateRandomNumber}>
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e0f7fa', borderRadius: '5px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '24px', color: '#d32f2f' }}>Total Atempt Question</h2>
        <input
          type="text"
          readOnly
          value={totalAttemptedQuestions}
          {...register('totalAttemptedQuestions')}
          style={{ fontSize: '24px', color: '#d32f2f', border: '1px solid #d32f2f', borderRadius: '4px', padding: '10px', marginBottom: '10px' }}
        />
        <h2 style={{ fontSize: '24px', color: '#00796b' }}>Total Right Answer</h2>
        <input
          type="text"
          readOnly
          value={totalCorrectAnswers}
          {...register('totalCorrectAnswers')}
          style={{ fontSize: '24px', color: '#00796b', border: '1px solid #00796b', borderRadius: '4px', padding: '10px', marginBottom: '10px' }}
        />
        
        <h2 style={{ fontSize: '24px', color: '#d32f2f' }}>Total Wrong Answer</h2>
        <input
          type="text"
          readOnly
          value={totalWrongAnswers}
          {...register('totalWrongAnswers')}
          style={{ fontSize: '24px', color: '#d32f2f', border: '1px solid #d32f2f', borderRadius: '4px', padding: '10px', marginBottom: '10px' }}
        />
        </div>
        <input
          type="text"
          style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ccc' }}
          defaultValue={userInfo.Student_Name}
          {...register('t1')} readOnly
        />
        <input
          type="text"
          style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ccc' }}
          defaultValue={userInfo.Student_Id}
          {...register('t2')} readOnly
        />
        
        <input
          type="text"
          style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ccc' }}
          defaultValue={userInfo.Email_Id}
          {...register('t3')} readOnly
        />
        <input
          type="text"
          style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ccc' }}
          defaultValue={userInfo.Paper_Code}
          {...register('t4')} readOnly
        />
                <input type="text" value={randomNumber} {...register('randomNumber')}/>

        <button
          type="submit" 
          className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          disabled={isSubmitting}
        >
          Submit Answers
        </button>
      </form>
      <div>
    </div>
</main>
    </div>
  );
}

export default Test;
