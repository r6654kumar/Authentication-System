import React, { useState } from 'react'
import '../App.css'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
const ResetPassword = () => {
    const [password,setPassword]=useState('');
    const navigate =useNavigate()
    const {token}=useParams();
    const handleSubmit=(e)=>{
        e.preventDefault();
        axios.post("http://localhost:5000/api/reset-password/"+token,{
            password,
        }).then(response=>{
            if(response.data.status){
                alert("Password updated")
                navigate('/login');
            }
        }).catch(err=>{
            console.log(err);
        })
    }
  return (
    <div className="sign-up-container">
        <form className="sign-up-form" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>
        <label htmlFor="password">Enter a new password</label>
            <input type="password" 
            placeholder='Password' 
            onChange={(e)=>setPassword(e.target.value)}
            />
            <button type="submit">Submit</button>
        </form>
    </div>
  )
}

export default ResetPassword