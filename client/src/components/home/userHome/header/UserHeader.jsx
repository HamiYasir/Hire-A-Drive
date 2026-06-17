import React,{useEffect, useState} from "react"
import {Box, Typography} from "@mui/material"
import styles from "./userHeader.module.css"
import {useNavigate} from "react-router-dom"
import axios from "axios"

const UserHeader=({sendTabValueToHome})=>{
  const [tab, setTab]=useState(3)
  const [currentUserStatus, setCurrentUserStatus]=useState(false)
  const navigate=useNavigate()

  useEffect(()=>{
    const getAcceptedRequests=async()=>{
      // const accepted_request_status = await axios.get(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/acceptedUserRequests`, {params:{email: localStorage.getItem('email')}}) // LOCALHOST
      const accepted_request_status = await axios.get(`https://hire-a-drive-backend.onrender.com/acceptedUserRequests`, {params:{email: localStorage.getItem('email')}}) // DEPLOYMENT
      console.log("accepted request status="+accepted_request_status.data)
      if(accepted_request_status.data.length>0)
        setCurrentUserStatus(true)
      else
        setCurrentUserStatus(false)
    }

    getAcceptedRequests()
  })

  const logout=()=>{
    localStorage.removeItem('email')
    navigate("/")
  }

  return(
    <Box className={styles.header}>
        <Box className={styles.logo}>
          <img src="../../../pictures/hire_a_drive_logo.png" alt="Hire a Drive Logo" height={150} width={150} style={{marginTop:"-15px"}}/>
          <Typography variant="h6" sx={{fontSize:"20px", marginTop:"-30px", fontFamily:"impact"}}>Hire A Drive</Typography>
        </Box>
        <Box className={styles.navbar}>
          {
          currentUserStatus===false
          ?
          tab===1?<button onClick={()=>{sendTabValueToHome(1);setTab(1)}} className={styles.buttonsActive}>Request Driver</button>:<button onClick={()=>{sendTabValueToHome(1);setTab(1)}} className={styles.buttons}>Request Driver</button>
          :
          tab===2?<button onClick={()=>{sendTabValueToHome(2);setTab(2)}} className={styles.buttonsActive}>Your Requests</button>:<button onClick={()=>{sendTabValueToHome(2);setTab(2)}} className={styles.buttons}>Your Requests</button>
          } 
          {tab===3?<button onClick={()=>{sendTabValueToHome(3);setTab(3)}} className={styles.buttonsActive}>Your Profile</button>:<button onClick={()=>{sendTabValueToHome(3);setTab(3)}} className={styles.buttons}>Your Profile</button>}
          {tab===4?<button onClick={()=>{sendTabValueToHome(4);setTab(4)}} className={styles.buttonsActive}>Your Drivers</button>:<button onClick={()=>{sendTabValueToHome(4);setTab(4)}} className={styles.buttons}>Your Drivers</button>}
          {tab===5?<button onClick={()=>{sendTabValueToHome(5);setTab(5)}} className={styles.buttonsActive}>Payments</button>:<button onClick={()=>{sendTabValueToHome(5);setTab(5)}} className={styles.buttons}>Payments</button>}
          <button onClick={logout} className={styles.buttons}>Logout</button>
        </Box>
    </Box>
  )
}

export default UserHeader