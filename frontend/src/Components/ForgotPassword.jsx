import React, { useState } from 'react'
import '../App.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const ForgotPassword = () => {
    const [email,setEmail]=useState('');
    const navigate =useNavigate()
    const handleSubmit=(e)=>{
        e.preventDefault();
        axios.post("http://localhost:5000/api/forgot-password",{
            email,
        }).then(response=>{
            if(response.data.status){
                alert("Password reset link has been sent to your Email id")
                navigate('/login');
            }
        }).catch(err=>{
            console.log(err);
        })
    }
  return (
    <div className="sign-up-container">
        <form className="sign-up-form" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>
            <label htmlFor="email"></label>
            <input type="email" 
            placeholder="Email id" 
            onChange={(e)=>setEmail(e.target.value)}
            />
            <button type="submit">Submit</button>
        </form>
    </div>
  )
}

export default ForgotPassword