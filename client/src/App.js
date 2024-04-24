import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import Sidebar from './components/Sidebar';
import RequireAuth from './components/RequiredAuth';
import { AuthProvider } from './context/AuthProvider';
import Credentials from './pages/Credentials.js';
import Hr from './pages/Hr.js';
import Candidate from './pages/Candidate'; 
import Home from './pages/Home.js';
import Registration from './components/Registration';
import PsychometricTest from './components/assessment/PsychometricTest.js';
import QuantitativeTest from './components/assessment/QuantitativeTest';
import VocabularyTest from './components/assessment/VocabularyTest.js';
import JavaTest from './components/assessment/JavaTest.js';
import Accounts from './components/assessment/AccountsTest.js';
import Excel from './components/assessment/ExcelTest.js'
import Reports from './pages/Reports.js';
import View from './pages/View.js';
import Edit from './pages/Edit.js';
import './App.css'
import Thankyou from './pages/Thankyou';
import { FadeLoader } from "react-spinners";
import TypingTest from './components/assessment/TypingTest.js';
import Jobs from './pages/Jobs.js'
import Statistics from './pages/Statistics.js';
import Monitor from './pages/Monitor.js';
import Admin from './pages/Admin.js';


const App = () => {
  const [isLoading, setIsLoading] = useState(false); 

  useEffect(() => {
      setIsLoading(true); 
  }, []);

  if (!isLoading) {
    return <div style={{ textAlign: 'center', margin: '200px auto' }}>
    <center><FadeLoader color={'#00B4D2'} size={20} /></center>
    <div>Please wait a moment</div>
  </div>
  }
  return (
    <BrowserRouter>
      <AuthProvider>
      <Sidebar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<RequireAuth />} >
            <Route path="/admins" element={<Admin />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/candidate/candidate" element={<Candidate />} />
            <Route path="/assessment/psychometric" element={<PsychometricTest />} />
            <Route path="/assessment/aptitude" element={<QuantitativeTest />} />
            <Route path="/assessment/vocabulary" element={<VocabularyTest />} />
            <Route path="/assessment/java" element={<JavaTest />} />
            <Route path="/assessment/accounts" element={<Accounts />} />
            <Route path="/assessment/excel" element={<Excel />} />
            <Route path="/assessment/typing" element={<TypingTest />} />
            <Route path='/jobs' element={<Jobs />} />
            <Route path='/hr' element={<Hr />}/>
            <Route path='/hr/view/:id' element={<View />}/>
            <Route path='/hr/edit/:id' element={<Edit />}/>
            <Route path='/thankyou' element={<Thankyou />} />
            <Route path='/statistics' element={<Statistics />} />
            <Route path='/dashboard' element={<Monitor />} />
            <Route path='/credentials' element={<Credentials />} />
          </Route>
        </Routes>
      </Sidebar>
        </AuthProvider>
    </BrowserRouter>
  );
};

export default App