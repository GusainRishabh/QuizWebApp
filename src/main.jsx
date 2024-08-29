import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MasterPage from './masterpage';
import Loginform from './loginform.jsx';
import Account from './account.jsx';
import Studentregration from './studentregration.jsx';
import Studentlogin from './studentlogin.jsx';
import Dashboard from './dashboard.jsx';
import Addquestion from './addquestion.jsx';
import Studentdashboard from './studentdashboard.jsx';
import EditProfile from './editprofile.jsx';
import Myprofile from './myprofile.jsx';
import Otp from './otp.jsx';
import Studentprofile from './studentprofile.jsx';
import Regesterdstudents from '../regesteredstudents.jsx';
import Studentplan from './studentplan.jsx';
import Studentdetail from './studentdetail.jsx';
import Questionpagenew from './questionpagenew.jsx';
import Afterresult from './afterresult.jsx';
import Deletedata from './deletedata.jsx';
import './index.css'
import Success from '../Success.jsx';
import Failed from '../Failed.jsx';
import Payment from '../Payment.jsx';
import Academypayment from '../academypayment.jsx';
import Regesterclient from '../regesterclient.jsx';
import Academypaymentbutton from './academypaymentbutton.jsx';
import EducationalVideos from './EducationalVideos.jsx';
import SelectAcademy from '../selectAcademy.jsx';
import Contant from './contant.jsx';
import Downlodenotes from './downlodenotes.jsx';
import Uploadnotes from './uploadnotes.jsx';
import Adminlogin from '../Admin/adminlogin.jsx';
import Adminafterlogin from '../Admin/adminafterlogin.jsx';
import Academysection from '../Admin/academysection.jsx';
import BlogView from '../Admin/BlogView.jsx';
import Updateamount from './updateamount.jsx';
import Totalacademysection from '../Admin/totalacademysection.jsx'
import Postblog from '../Admin/postblog.jsx'
import Razer from '../Admin/razer.jsx'
import Purchaseplanacademy from './purchaseplanacademy.jsx';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MasterPage />} />
        <Route path="/Account" element={<Account />} />
        <Route path="/loginform" element={<Loginform />} />
        <Route path="/Studentregration" element={<Studentregration />} />
        <Route path="/studentlogin" element={<Studentlogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/addquestion" element={<Addquestion />} />
        <Route path="/studentdashboard" element={<Studentdashboard />} />
        <Route path="/EditProfile" element={<EditProfile />} />
        <Route path="/Myprofile" element={<Myprofile />} />
        <Route path="/Otp" element={<Otp />} />
        <Route path="/studentprofile" element={<Studentprofile />} />
        <Route path="/Regesterdstudents" element={<Regesterdstudents />} />
        <Route path="/studentplan" element={<Studentplan />} />
        <Route path="/Studentdetail" element={<Studentdetail />} />
        <Route path="/Questionpagenew" element={<Questionpagenew />} />
        <Route path="/Afterresult" element={<Afterresult />} />
        <Route path="/Deletedata" element={<Deletedata />} />
        <Route path="/Success" element={<Success />} />
        <Route path="/Failed" element={<Failed />} />
        <Route path="/Payment" element={<Payment />} />
        <Route path="/Academypayment" element={<Academypayment />} />
        <Route path="/Regesterclient" element={<Regesterclient />} />
        <Route path="/Academypaymentbutton" element={<Academypaymentbutton />} />
        <Route path="/EducationalVideos" element={<EducationalVideos />} />
        <Route path="/SelectAcademy" element={<SelectAcademy />} />
        <Route path="/Contant" element={<Contant />} />
        <Route path="/Downlodenotes" element={<Downlodenotes />} />
        <Route path="/Uploadnotes" element={<Uploadnotes />} />
        <Route path="/Adminlogin" element={<Adminlogin />} />
        <Route path="/Adminafterlogin" element={<Adminafterlogin />} />
        <Route path="/Academysection" element={<Academysection />} />
        <Route path="/BlogView" element={<BlogView />} />
        <Route path="/Updateamount" element={<Updateamount />} />
        <Route path="/Totalacademysection" element={<Totalacademysection />} />
        <Route path="/Postblog" element={<Postblog />} />
        <Route path="/Razer" element={<Razer />} />
        <Route path="/purchaseplanacademy" element={<Purchaseplanacademy />} />


        </Routes>
    </BrowserRouter>
    
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
