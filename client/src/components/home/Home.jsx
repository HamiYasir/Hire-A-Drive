import React,{useEffect, useState} from "react"
import {useNavigate} from "react-router-dom"
import styles from "./home.module.css"
import axios from "axios"

import UserHeader from "./userHome/header/UserHeader.jsx"
import UserSidebar from "./userHome/sidebar/UserSidebar.jsx"
import RequestDriver from "./userHome/body/requestDriver/RequestDriver.jsx"
import YourRequests from "./userHome/body/yourRequests/YourRequests.jsx"
import YourDrivers from "./userHome/body/yourDrivers/YourDrivers.jsx"
import UserProfile from "./userHome/body/userProfile/UserProfile.jsx"
import UserPayments from "./userHome/body/userPayments/UserPayments.jsx"

import DriverHeader from "./driverHome/header/DriverHeader.jsx"
import DriverSidebar from "./driverHome/sidebar/DriverSidebar.jsx"
import CustomerRequests from "./driverHome/body/customerRequests/CustomerRequests.jsx"
import YourJourneys from "./driverHome/body/yourJourneys/YourJourneys.jsx"
import DriverProfile from "./driverHome/body/yourProfile/DriverProfile.jsx"

const Home=()=>{
  const [email, setEmail]=useState("")
  const [tab, setTab]=useState(3)
  const navigate=useNavigate()
  const [homePageMode, setHomePageMode]=useState(null)
  const [isUserRequestValidatedFromUser, setIsUserRequestValidatedFromUser]=useState({isValid:null})
  const [isUserRequestValidatedFromDriver, setIsUserRequestValidatedFromDriver]=useState({isValid:null})

  useEffect(()=>{
    const initialize=async()=>{
      const getHomePageMode=async()=>{
        // const details=await axios.get(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/getDetails`,{params:{email:email}}) // LOCALHOST
        const details=await axios.get(`https://hire-a-drive-backend.onrender.com/getDetails`,{params:{email:email}}) // DEPLOYMENT
        setHomePageMode(details.data.type)
      }  

      setEmail(localStorage.getItem("email"))
      await getHomePageMode()
      if(homePageMode==="user"){
        // const validatedUserRequestFromUser=await axios.get(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/getValidatedUserRequestFromUser`,{params:{userId: localStorage.getItem('email')}}) // LOCALHOST
        const validatedUserRequestFromUser=await axios.get(`https://hire-a-drive-backend.onrender.com/getValidatedUserRequestFromUser`,{params:{userId: localStorage.getItem('email')}}) // DEPLOYMENT
        setIsUserRequestValidatedFromUser(validatedUserRequestFromUser.data)
        if (validatedUserRequestFromUser.data.isValid)
          navigate("/userJourney", {state: {userId: validatedUserRequestFromUser.data.validatedUserRequest.userId, driverId: validatedUserRequestFromUser.data.validatedUserRequest.driverId}})
      }
      else{
        // const validatedUserRequestFromDriver=await axios.get(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/getValidatedUserRequestFromDriver`,{params:{driverId: localStorage.getItem('email')}}) // LOCALHOST
        const validatedUserRequestFromDriver=await axios.get(`https://hire-a-drive-backend.onrender.com/getValidatedUserRequestFromDriver`,{params:{driverId: localStorage.getItem('email')}}) // DEPLOYMENT
        setIsUserRequestValidatedFromDriver(validatedUserRequestFromDriver.data)
        if (validatedUserRequestFromDriver.data.isValid)
          navigate("/driverJourney", {state: {userId: validatedUserRequestFromDriver.data.validatedUserRequest.userId, driverId: validatedUserRequestFromDriver.data.validatedUserRequest.driverId}})
      }
    }

    initialize()
  },[email, homePageMode, navigate])

  const receiveTabValueFromHeader=(value)=>{
    setTab(value)
  }

  return(
    (homePageMode==="user"?
      <div className={styles.homePageUser}>
        <div className={styles.headerContainer}>
            <UserHeader sendTabValueToHome={receiveTabValueFromHeader}/>
        </div>

        <div className={styles.mainContainer}>
          <div className={styles.sidebarContainer}>
            <UserSidebar/>
          </div>

          <div className={styles.bodyContainer}>
            {tab===1?
              <RequestDriver/>
            :tab===2?
              <YourRequests/>
            :tab===3?
              <UserProfile/>
            :tab===4?
              <YourDrivers/>
            :tab===5?
              <UserPayments/>    
            :
              setTab(1)
            } 
          </div>
        </div>

        <div className={styles.footerContainer}>
          
        </div>
      </div>
    :
      <div className={styles.homePageDriver}>
        <div className={styles.headerContainer}>
          <DriverHeader sendTabValueToHome={receiveTabValueFromHeader}/>
        </div>

        <div className={styles.mainContainer}>
          <div className={styles.sidebarContainer}>
            <DriverSidebar/>
          </div>

          <div className={styles.bodyContainer}>
            {tab===1?
              <CustomerRequests/>
            :tab===2?
              <YourJourneys/>
            :tab===3?
              <DriverProfile/>
            :
              setTab(1)
            }
          </div>
        </div>

        <div className={styles.footerContainer}>
          
        </div>
      </div>
    )
  )
}

export default Home