import { useState } from 'react' 
import './App.css'
import Masterpage from './masterpage';
import { useForm } from "react-hook-form"
 import stu from './stu';
 import { Link } from 'react-router-dom';

function App() { 
  const {
    register,
    handleSubmit,
    setError,    
    formState: { errors, isSubmitting },
  } = useForm();

  const delay = (d)=>{
    return new Promise((resolve, reject)=>{
      setTimeout(() => {
        resolve()
      }, d * 1000);
    })
  }

const onSubmit = async (data) => {
  try {
    let r = await fetch("http://localhost:3000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    let res = await r.text();
    console.log(data, res);
  } catch (error) {
    console.error("Error:", error);
  }
};


  return (
    <> 
   <Masterpage/>
    </>
  )
}

export default App