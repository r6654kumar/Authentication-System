import React, { useState } from 'react'
import '../App.css'
import axios from 'axios'
import { useNavigate,Link } from 'react-router-dom'
const SignUp = () => {
    const [username,setUsername]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const navigate =useNavigate()
    const handleSubmit=(e)=>{
        e.preventDefault();
        axios.post("http://localhost:5000/api/signup",{
            username,
            email,
            password
        }).then(response=>{
            if(response.data.status){
                navigate('/login');
            }
        }).catch(err=>{
            alert("Username / Email id already registered");
            console.log(err);
        })
    }
  return (
    <div className="sign-up-container">
        <form className="sign-up-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
            <label htmlFor="username">Username</label>
            <input type="text" 
            placeholder="Username" 
            onChange={(e)=>setUsername(e.target.value)}
            />
            <label htmlFor="email"></label>
            <input type="email" 
            placeholder="Email id" 
            onChange={(e)=>setEmail(e.target.value)}
            />
            <label htmlFor="password"></label>
            <input type="password" 
            placeholder='Password' 
            onChange={(e)=>setPassword(e.target.value)}
            />
            <button type="submit">Register</button>
            <p>Have an Account ?<Link to ="/login">Login</Link></p>
        </form>
    </div>
  )
}

export default SignUp