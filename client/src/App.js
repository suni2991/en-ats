import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import RequireAuth from "./components/RequiredAuth";
import { AuthProvider } from "./context/AuthProvider";
import HR from "./pages/Hr.js";
import Candidate from "./pages/Candidate";
import Home from "./pages/Home.js";
import Registration from "./components/Registration";
import PsychometricTest from "./components/assessment/PsychometricTest.js";
import QuantitativeTest from "./components/assessment/QuantitativeTest";
import VocabularyTest from "./components/assessment/VocabularyTest.js";
import JavaTest from "./components/assessment/JavaTest.js";
import Accounts from "./components/assessment/AccountsTest.js";
import Excel from "./components/assessment/ExcelTest.js";
import Reports from "./pages/Reports.js";
import "./App.css";
import Thankyou from "./pages/Thankyou";
import { FadeLoader } from "react-spinners";
import Statistics from "./pages/Statistics.js";
import Admin from "./pages/Admin.js";
import Postjob from "./components/Postjob.js";
import Createhr from "./components/Createhr.js";
import Feedback from "./pages/Feedbacks.js";
import ProfilePage from "./components/ProfilePage.js";
import Panelist from "./components/Panelist.js";
import Dashboard from "./pages/Dashboard.js";
import Applicant from "./pages/Applicant.js";
import ApproveJobDetails from "./pages/Approve.js";
import Explore from "./pages/Explore.js";
import Schedule from "./pages/Schedule.js";
import Availability from "./pages/Availability.js";
import ImageCarousel from "./components/ImageCarousel.js";
import JobRegistration from "./pages/JobRegistration.js";
import BulkUpload from "./components/BulkUpload.js";
import EditCandidate from "./components/EditCandidate.js";
import Questionaire from "./pages/Questionaire.js";
import QuestionList from "./components/QuestionList.js";
import QuestionForm from "./components/QuestionForm.js";
import EditTopic from './components/EditTopic.js';
import Test from './components/campus/Test';
const App = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
  }, []);

  if (!isLoading) {
    return (
      <div style={{ textAlign: "center", margin: "200px auto" }}>
        <center>
          <FadeLoader color={"#00B4D2"} size={20} />
        </center>
        <div>Please wait a moment</div>
      </div>
    );
  }
  return (
    <BrowserRouter>
      <AuthProvider>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/login" element={<Home />} />
          <Route path="/job/:id" element={<ApproveJobDetails />} />
          <Route path="/register-job/:positionId" element={<JobRegistration />} />
          {/* <Route path="/bulkupload" element={<BulkUpload />}/> */}


          <Route element={<RequireAuth />}>
            <Route path="/editCandidate" element={<Sidebar><EditCandidate /></Sidebar>} />
            <Route path="/help" element={<ImageCarousel />} />
            <Route path="/admins" element={<Sidebar><Admin /></Sidebar>} />
            <Route path="/registration" element={<Sidebar><Registration /></Sidebar>} />
            <Route path="/reports" element={<Sidebar><Reports /></Sidebar>} />
            <Route path="/candidate/candidate" element={<Candidate />} />
            <Route path="/assessment/psychometric" element={<PsychometricTest />} />
            <Route path="/assessment/quantitative" element={<QuantitativeTest />} />
            <Route path="/assessment/vocabulary" element={<VocabularyTest />} />
            <Route path="/assessment/java" element={<JavaTest />} />
            <Route path="/assessment/accounts" element={<Accounts />} />
            <Route path="/assessment/excel" element={<Excel />} />
            <Route path="/hr" element={<Sidebar><HR /></Sidebar>} />
            <Route path="/thankyou" element={<Thankyou />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/dashboard" element={<Sidebar><Dashboard /></Sidebar>} />
            <Route path="/schedule" element={<Sidebar><Schedule /></Sidebar>} />
            <Route path="/postjob" element={<Sidebar><Postjob /></Sidebar>} />
            <Route path="/create-hr" element={<Sidebar><Createhr /></Sidebar>} />
            <Route path="/feedbacks" element={<Sidebar><Feedback /></Sidebar>} />
            <Route path="/slots" element={<Sidebar><Availability /></Sidebar>} />
            <Route path="/editProfile" element={<Sidebar><ProfilePage /></Sidebar>} />
            <Route path="/panelist/:id" element={<Sidebar><Panelist /></Sidebar>} />
            <Route path="/applicants" element={<Sidebar><Applicant /></Sidebar>} />
            <Route path='/provideFeedback/:id' element={<Sidebar><Panelist /></Sidebar>} />
            <Route path="/bulkupload" element={<Sidebar><BulkUpload /></Sidebar>} />
            <Route path="/editCandidate" element={<Sidebar><EditCandidate /></Sidebar>} />
            <Route path='/questionaire' element={<Sidebar><Questionaire /></Sidebar>} />
            <Route path='/questions/all' element={<Sidebar><QuestionList /></Sidebar>} />
            <Route path='/topic/edit/:id' element={<EditTopic />} />
            <Route path='/question/edit/:id' element={<Sidebar><QuestionForm /></Sidebar>} />
            <Route path="/campus/Quantitative" element={<Test testType="Quantitative" />} />
        <Route path="/campus/Vocabulary" element={<Test testType="Vocabulary" />} />
        <Route path="/campus/Psychometric" element={<Test testType="Psychometric" />} />
          </Route>
          {/* <Route path="/editCandidate" element={<EditCandidate />}/> */}
        </Routes>

      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
