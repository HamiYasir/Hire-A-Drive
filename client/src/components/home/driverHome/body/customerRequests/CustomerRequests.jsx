import React, { useState } from 'react'
import {Box, Button} from "@mui/material"
import { useNavigate } from "react-router-dom"
import styles from "./customerRequests.module.css"
import axios from 'axios'

const CustomerRequests=()=>{
  const [location, setLocation]=useState("default")
  const [requests, setRequests]=useState([])

  const handleLocation=(event)=>{
    setLocation(event.target.value)
  }

  const AcceptRequest=async(requestId)=>{
    const enteredFare = prompt("Enter the fare: ")
    if (isNaN(enteredFare) || enteredFare <= 0) {
      alert("Please enter a valid fare amount.")
      return
    }
    // const accepted_status=await axios.put(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/acceptRequest/${requestId}`, {driverId: localStorage.getItem('email'), fare: enteredFare}) // LOCALHOST
    const accepted_status=await axios.put(`https://hire-a-drive-backend.onrender.com/acceptRequest/${requestId}`, {driverId: localStorage.getItem('email'), fare: enteredFare}) // DEPLOYMENT 
    console.log("accepted_status="+accepted_status.data.request)
    if (accepted_status.status === 200)
      setRequests((prevRequests) => prevRequests.filter(request => request.requestId !== requestId))
  }

  const RejectRequest=async(requestId)=>{
    // const rejected_status=await axios.put(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/rejectRequest/${requestId}`, {driverId: localStorage.getItem('email')}) // LOCALHOST
    const rejected_status=await axios.put(`https://hire-a-drive-backend.onrender.com/acceptRequest/rejectRequest/${requestId}`, {driverId: localStorage.getItem('email')}) // DEPLOYMENT
    console.log("rejected_status="+rejected_status)
    if (rejected_status.status === 200)
      setRequests((prevRequests) => prevRequests.filter(request => request.requestId !== requestId))
  }

  const getRequests=async()=>{
    // const requests_status=await axios.get(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/getUserRequests`, {params:{location:location}}) // LOCALHOST
    const requests_status=await axios.get(`https://hire-a-drive-backend.onrender.com/getUserRequests`, {params:{location:location}}) // DEPLOYMENT
    const filteredRequests = requests_status.data.filter(request => {
      const alreadyAcceptedByDriverRequest=!request.accepted?.includes(localStorage.getItem('email')) //Used to filter out already accepted requests by this driver
      const onGoingRequests=!request.driverId && request.userId
      return alreadyAcceptedByDriverRequest && onGoingRequests
    }) 
    setRequests(filteredRequests)
  }

  return (
    <Box className={styles.customerRequests}>
      <Box className={styles.search}>
        <select id="location" value={location} onChange={handleLocation} className={styles.inputFields}>
          <option value="default" style={{display:"none"}}>Select your location</option>
          <option value="Thiruvananthapuram">Thiruvananthapuram</option>
          <option value="Kollam">Kollam</option>
          <option value="Pathanamthitta">Pathanamthitta</option>
          <option value="Alappuzha">Alappuzha</option>
          <option value="Kottayam">Kottayam</option>
          <option value="Idukki">Idukki</option>
          <option value="Ernakulam">Ernakulam</option>
          <option value="Thrissur">Thrissur</option>
          <option value="Palakad">Palakad</option>
          <option value="Malappuram">Malappuram</option>
          <option value="Kozhikode">Kozhikode</option>
          <option value="Wayanad">Wayanad</option>
          <option value="Kannur">Kannur</option>
          <option value="Kasaragod">Kasaragod</option>
        </select>
        <button className={styles.searchButton} onClick={getRequests}>Search</button>

        <ul style={{marginLeft: "50px"}}>
        {requests
            .filter((request) => !request.rejected?.includes(localStorage.getItem('email')))
            .map((request) => (
              <li
                key={request.requestId}
                style={{ display: "flex", justifyContent: "space-between", backgroundColor: 'rgb(253, 253, 253, 0.700)', width: '100%', fontFamily: 'sans-serif', listStyle: 'none', borderRadius: '5px', marginLeft: '-1vw', padding: '10px', marginBottom: '10px' }}>
                <div>
                  <strong>{request.username}</strong> wants to go from <strong>{request.startingLocation}</strong> to <strong>{request.destination}</strong>
                </div>
                <div>
                  <Button color="success" variant="contained" sx={{ height: "55px", width: "20px", fontSize: "30px", marginLeft: "10px", marginRight: "10px" }} onClick={() => AcceptRequest(request.requestId)}>&#10003;</Button>
                  <Button color="error" variant="contained" sx={{ height: "55px", width: "20px", fontSize: "30px", marginLeft: "10px", marginRight: "10px" }} onClick={() => RejectRequest(request.requestId)}>x</Button>
                </div>
              </li>
            ))}
        </ul>
      </Box>
    </Box>
  )
}

export default CustomerRequests