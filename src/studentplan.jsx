import React from 'react'
// import { Routes } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './plansection.css'
import Serach from './serach'
import { Link } from "react-router-dom";
import { useForm } from 'react-hook-form';
import PayPalButtonAcademy from '../PayPalButtonAcademy';

function plansection() {
  const navigate = useNavigate();
    const {
      register,
      handleSubmit,
      setError,
      formState: { errors, isSubmitting },
    } = useForm();
  
    const delay = (d) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, d * 1000);
      });
    };
  
    const onSubmit = async (data) => {
      try {
        let r = await fetch("http://localhost:3000/sliver", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        let res = await r.text();
        navigate('/studentregration');
      } catch (error) {
        console.error(error);
      }
    };
    
    const onSubmit1 = async (data) => {
      try {
        let r = await fetch("http://localhost:3000/gold", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        let res = await r.text();
        navigate('/studentregration');
      } catch (error) {
        console.error(error);
      }
    };
    const onSubmit2 = async (data) => {
      try {
        let r = await fetch("http://localhost:3000/plat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        let res = await r.text();
        navigate('/studentregration');
      } catch (error) {
        console.error(error);
      }
    };
    
    return (
        <>
            <Serach/>
        <div className="image">
            <div><img src="https://img1.wsimg.com/cdnassets/transform/c775c7a1-2eca-4e31-b44f-8d029a83872e/in-mrq-hp-landscape" alt="Person holding a camera"></img>
          <pre>
          <h4>subscription Names</h4>
            <h2>Get a .com for ₹ 1.00*/1st yr.</h2>
            <p>Grab the world's most popular domain.</p>
            <button>Get It Now</button>
            <p class="small-text">3-year purchase registerd. Additional year(s) ₹ 1,299.00*</p>
          </pre>
       

            </div>
            <div class="hosting-offer">
                    <h4>Web subscription</h4>
                    <h2>Secured Hosting from ₹ 199.00/mo.</h2>
                    <ul>
                        <li>Improved page loads and SEO</li>
                        <li>24/7 network security</li>
                        <li>30-day money back guarantee</li>
                    </ul>
                    <button>Learn More</button>
                </div>
        </div>
            <div class="pricing-section">
                <div class="pricing-card">
                    <div class="popular-badge">BASIC</div>
                    <h3>Basic Learning Plan</h3>
                    <div class="price-section">
                        <span class="original-price">₹ 999.00</span>
                        <span class="save-percentage">SAVE 50%</span>
                    </div>
                    <div class="price">₹ 499.00/mo</div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                    <input type="text" placeholder='₹ 499.00/mo' value={499}readOnly {...register('t1')} hidden/>
                    <PayPalButtonAcademy amount={199} /> {/* Pass the value here as a prop */}
                    <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Select</button>                    
                    </form>
                    <div class="renew-price">Plan renews at ₹ 599.00/month</div>
                    <ul class="features">
                        <li>Access to 10 Courses</li>
                        <li>Weekly Quizzes</li>
                        <li>Monthly Assessments</li>
                        <li>1:1 Mentor Support</li>
                        <li>Community Access</li>
                        <li>Certificate of Completion</li>
                    </ul>
                </div>

                <div class="pricing-card">
                    <div class="popular-badge">ADVANCE</div>
                    <h3>Standard Learning Plan</h3>
                    <div class="price-section">
                        <span class="original-price">₹ 1999.00</span>
                        <span class="save-percentage">SAVE 50%</span>
                    </div>
                    <div class="price">₹ 999.00/mo</div>
                    <form onSubmit={handleSubmit(onSubmit1)}>
                    <input type="text" placeholder='₹ 499.00/mo' value={999}readOnly {...register('t2')} hidden/>
                    <PayPalButtonAcademy amount={1999} /> {/* Pass the value here as a prop */}
                    <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Select</button>                    
                    {/* <Link to="/account"><button type="submit">Select</button></Link> */}
                    </form>                    
                    <div class="renew-price">Plan renews at ₹ 1199.00/month</div>
                    <ul class="features">
                        <li>Access to 50 Courses</li>
                        <li>Weekly Quizzes</li>
                        <li>Monthly Assessments</li>
                        <li>1:1 Mentor Support</li>
                        <li>Community Access</li>
                        <li>Certificate of Completion</li>
                        <li>Career Counseling</li>
                    </ul>
                </div>

                <div class="pricing-card popular">
                    <div class="popular-badge">MOST POPULAR</div>
                    <h3>Premium Learning Plan</h3>
                    <div class="price-section">
                        <span class="original-price">₹ 3999.00</span>
                        <span class="save-percentage">SAVE 50%</span>
                    </div>
                    <div class="price">₹ 1999.00/mo</div>
                    <form onSubmit={handleSubmit(onSubmit2)}>
                    <input type="text" value={1999} {...register('t3')} readOnly hidden/>
                    <PayPalButtonAcademy amount={2999} /> {/* Pass the value here as a prop */}

                    <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Select</button>                   
                     <Link to="/account"></Link>
                    
                    </form>                    
                    <div class="renew-price">Plan renews at ₹ 2399.00/month</div>
                    <ul class="features">
                        <li>Access to 100+ Courses</li>
                        <li>Weekly Quizzes</li>
                        <li>Monthly Assessments</li>
                        <li>1:1 Mentor Support</li>
                        <li>Community Access</li>
                        <li>Certificate of Completion</li>
                        <li>Career Counseling</li>
                        <li>Interview Preparation</li>
                        <li>Priority Support</li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default plansection
