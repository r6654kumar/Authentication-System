import axios from 'axios'
import React from 'react'
import {Link} from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
const Home = () => {
  const navigate=useNavigate();
  axios.defaults.withCredentials=true;
  const handleLogout=()=>{
    axios.get('http://localhost:5000/api/logout')
      .then(res=>{
        if(res.data.status){
          alert("Logged Out")
          navigate('/login')
        }
      }).catch(err=>{
        console.log(err);
      })
  }
  return (
    <div>Home
      <button><Link to='/dashboard'>Dashboard</Link></button>
      <br />
      <br />
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Home