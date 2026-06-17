import React,{useState, useEffect} from "react"
import styles from "./driverSidebar.module.css"
import {Box, Paper, Typography} from "@mui/material"
import axios from "axios"

const DriverSidebar=()=>{
  const [profilePic, setProfilePic]=useState("")
  const [username, setUsername]=useState("")
  const [email, setEmail]=useState("")
  const [today, setToday]=useState(null)
  const [address, setAddress]=useState("")
  const [currentDriverStatus, setCurrentDriverStatus]=useState(false)

  useEffect(()=>{
    setEmail(localStorage.getItem("email"))
    getSessionDetails()
    const fetchDate=()=>{
      const date = getToday()
      setToday(date);
  }

  const getApprovedRequests=async()=>{
    // const accepted_request_status = await axios.get(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/approvedUserRequests`, {params:{email: localStorage.getItem('email')}}) // LOCALHOST
    const accepted_request_status = await axios.get(`https://hire-a-drive-backend.onrender.com/approvedUserRequests`, {params:{email: localStorage.getItem('email')}}) // DEPLOYMENT
    if(accepted_request_status.data.active === true)
      setCurrentDriverStatus(true)
    else if(accepted_request_status.data.active === false)
      setCurrentDriverStatus(false)
  }

  // Fetch initial date and start interval for updates
  fetchDate()
  getApprovedRequests()
  const intervalId = setInterval(fetchDate, 5000) // Update every minute
  return () => clearInterval(intervalId) // Clear interval on component unmount
  },[])

  const getSessionDetails=async()=>{
    // const sessionDetails=await axios.get(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/getDetails`, {params:{email:localStorage.getItem("email")}}) // LOCALHOST
    const sessionDetails=await axios.get(`https://hire-a-drive-backend.onrender.com/getDetails`, {params:{email:localStorage.getItem("email")}}) // DEPLOYMENT
    setProfilePic(sessionDetails.data.details.profilePic)
    setUsername(sessionDetails.data.details.username)
    setAddress(sessionDetails.data.details.address)
  }

  const getToday=()=>{
    const today=new Date()
    let hour=today.getHours()
    const isPM = hour >= 12;

    // Convert hour to 12-hour format
    hour=hour%12 || 12; // Convert 0 to 12 for midnight

    return{
      day: String(today.getDate()).padStart(2, '0'),
      month: String(today.getMonth()+1).padStart(2, '0'),
      year: today.getFullYear(),
      minute: String(today.getMinutes()).padStart(2, '0'),
      hour: String(hour).padStart(2, '0'),
      period: isPM ? 'PM' : 'AM'
    }
  }

  return(
    <Box className={styles.sidebar}>
      <Paper sx={{borderRadius:"20px"}} className={styles.paper}>
        <Box className={styles.usernameContainer}>
          <Box sx={{marginRight:"45%"}}>
            <Typography sx={{fontSize:"30px"}}>{username}</Typography>
            <p style={{marginTop:"-10px", color:"green", fontSize:"15px", textAlign:"center"}}>{email}</p>
          </Box>
          <img src={profilePic} alt="user profile pic" style={{height:"100px", width:"100px", borderRadius:"50px", border:"3px solid black"}}/>
        </Box>
        
        <Box className={styles.currentDateAndTime}>{today?(<span>{today.day}-{today.month}-{today.year}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{today.hour}:{today.minute} {today.period}</span>):(<span>Loading date...</span>)}</Box>

        <Box className={styles.address}>{address}</Box>

        <Box sx={{backgroundColor: currentDriverStatus ? "rgba(17, 179, 87, 1)" : "rgba(255, 8, 8)"}} className={styles.currentStatus}>Current Status</Box>
      </Paper>
    </Box>
  )
}

export default DriverSidebar