import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './plansection.css';
import Serach from './serach';
import { useForm } from 'react-hook-form';
import PayPalButton from '../PayPalButton';
import Razer from '../Admin/razer.jsx'

function PlanSection() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  
  const onSubmit = async (data) => {
    const amount = data.t1; // Get the value from the form field
    try {
      let r = await fetch("http://localhost:3000/form3", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, amount }), // Include the amount in the body
      });
      let res = await r.text();
      navigate('/razer');
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit1 = async (data) => {
    const amount = data.t2; // Get the value from the form field
    try {
      let r = await fetch("http://localhost:3000/form4", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, amount }), // Include the amount in the body
      });
      let res = await r.text();
      navigate('/razer');
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit2 = async (data) => {
    const amount = data.t3; // Get the value from the form field
    try {
      let r = await fetch("http://localhost:3000/form5", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, amount }), // Include the amount in the body
      });
      let res = await r.text();
      navigate('/razer');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Serach/>
      <div className="image">
        <div>
          <img src="https://img1.wsimg.com/cdnassets/transform/c775c7a1-2eca-4e31-b44f-8d029a83872e/in-mrq-hp-landscape" alt="Person holding a camera" />
          <pre className='pre'>
            <h4>Subscription Names</h4>
            <h2>Get a study for ₹ 1.00*/1st yr.</h2>
            <p>Grab the world's most advanced popular Study.</p>
            <button type="button" class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Get It</button>          </pre>
        </div>
        <div className="hosting-offer">
          <h4>Web subscription</h4>
          <h2>Secured Study from ₹ 199.00/mo.</h2>
          <ul>
            <li>Improved Your Study</li>
            <li>24/7 Study</li>
            <li>30-day money back guarantee</li>
          </ul>
          <button>Learn More</button>
        </div>
      </div>
      <div className="pricing-section">
        <div className="pricing-card">
          <div className="popular-badge">BASIC</div>
          <h3>Basic Learning Plan</h3>
          <div className="price-section">
            <span className="original-price">₹ 999.00</span>
            <span className="save-percentage">SAVE 50%</span>
          </div>
          <div className="price">₹ 499.00/mo</div>
          <form onSubmit={handleSubmit(onSubmit)}>
          {/* <Razer value={499}/> */}
            <input type="text" placeholder='₹ 499.00/mo' value={499} readOnly {...register('t1')} hidden />
            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Select</button>
          </form>
          <div className="renew-price">Plan renews at ₹ 599.00/month</div>
          <ul className="features">
            <li>Access to 10 Courses</li>
            <li>Weekly Quizzes</li>
            <li>Monthly Assessments</li>
            <li>1:1 Mentor Support</li>
            <li>Community Access</li>
            <li>Certificate of Completion</li>
          </ul>
        </div>
        <div className="pricing-card">
          <div className="popular-badge">ADVANCE</div>
          <h3>Standard Learning Plan</h3>
          <div className="price-section">
            <span className="original-price">₹ 1999.00</span>
            <span className="save-percentage">SAVE 50%</span>
          </div>
          <div className="price">₹ 999.00/mo</div>
          <form onSubmit={handleSubmit(onSubmit1)}>
            <input type="text" placeholder='₹ 999.00/mo' value={999} readOnly {...register('t2')} hidden />
            {/* <Razer value={999}/>             */}
            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Select</button>
          </form>
          <div className="renew-price">Plan renews at ₹ 1199.00/month</div>
          <ul className="features">
            <li>Access to 25 Courses</li>
            <li>Weekly Quizzes</li>
            <li>Monthly Assessments</li>
            <li>1:1 Mentor Support</li>
            <li>Community Access</li>
            <li>Certificate of Completion</li>
          </ul>
        </div>
        <div className="pricing-card">
          <div className="popular-badge">PREMIUM</div>
          <h3>Premium Learning Plan</h3>
          <div className="price-section">
            <span className="original-price">₹ 3999.00</span>
            <span className="save-percentage">SAVE 50%</span>
          </div>
          <div className="price">₹ 1999.00/mo</div>
          <form onSubmit={handleSubmit(onSubmit2)}>
            <input type="text" placeholder='₹ 1999.00/mo' value={1999} readOnly {...register('t3')} hidden />
            {/* <Razer value={499}/>             */}
            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Select</button>
          </form>
          <div className="renew-price">Plan renews at ₹ 2399.00/month</div>
          <ul className="features">
            <li>Access to All Courses</li>
            <li>Weekly Quizzes</li>
            <li>Monthly Assessments</li>
            <li>1:1 Mentor Support</li>
            <li>Community Access</li>
            <li>Certificate of Completion</li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default PlanSection;
