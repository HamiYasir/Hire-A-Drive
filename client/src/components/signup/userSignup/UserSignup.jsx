import React, {useState} from "react"
import {Box, Input, Stack, Button, InputLabel, TextareaAutosize, Select, MenuItem} from "@mui/material"
import styles from "./userSignup.module.css"
import defaultImage from "../../pictures/default_profile_pic_2.jpeg"
import axios from "axios"
import {useNavigate} from "react-router-dom"

const UserSignup=()=>{
  const [profileURL, setProfileURL]=useState("")
  const [username, setUsername]=useState("")
  const [email, setEmail]=useState("")
  const [password, setPassword]=useState("")
  const [confirmPassword, setConfirmPassword]=useState("")
  const [dateOfBirth, setDateOfBirth]=useState("")
  const [district, setDistrict]=useState("default")
  const [address, setAddress]=useState("")
  const [imageURL, setImageURL]=useState(defaultImage)
  const [selectedFile, setSelectedFile]=useState(null)
  const navigate=useNavigate()

  const handleImageChange=(event)=>{
    const file=event.target.files[0]
    setSelectedFile(file)
    if(file){
      const reader=new FileReader()
      reader.onload=()=>{
        setImageURL(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImageAndDownloadURL = async () => {
    if (!selectedFile) {
      alert("Please select an image")
      return null
    }

    const formData = new FormData()

    formData.append("file", selectedFile)
    formData.append(
      "upload_preset",
      process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
    )

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      )

      return response.data.secure_url
    }
    catch(error){
      console.error(error)
      return null
    }
  }

  const getCurrentDate=()=>{
    const today=new Date();
    return today.toISOString().split("T")[0]
  }

  const handleUsername=(event)=>{
    setUsername(event.target.value)
  }

  const handleEmail=(event)=>{
    setEmail(event.target.value)
  }

  const handlePassword=(event)=>{
    setPassword(event.target.value)
  }

  const handleConfirmPassword=(event)=>{
    setConfirmPassword(event.target.value)
  }

  const handleDateOfBirth=(event)=>{
    setDateOfBirth(event.target.value)
  }

  const handleDistrict=(event)=>{
    setDistrict(event.target.value)
  }

  const handleAddress=(event)=>{
    setAddress(event.target.value)
  }

  const signup=async()=>{
    if(username!=="" && email!=="" && password!=="" && confirmPassword!=="" && dateOfBirth!=="" && district!=="" && address!==""){
      if (password===confirmPassword){
        const downloadURL=await uploadImageAndDownloadURL()
        if(downloadURL){
          const dateOfJoining=getCurrentDate()
          // const submit=await axios.post(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/userSignup`, {profilePic:downloadURL, username:username, email:email, password:password, dateOfBirth:dateOfBirth, dateOfJoining:dateOfJoining, district:district, address:address}) // LOCALHOST
          const submit=await axios.post(`https://hire-a-drive-backend.onrender.com/userSignup`, {profilePic:downloadURL, username:username, email:email, password:password, dateOfBirth:dateOfBirth, dateOfJoining:dateOfJoining, district:district, address:address}) // DEPLOYMENT
          if(submit.data.userExists===true){
            alert("A user with the email "+email+" already exists.")
          }else{
            if(submit.data.driverExists===true){
              alert("A driver account with the email "+email+" already exists.")
            }else{
              alert("Successfully created account for "+email)
              setProfileURL("")
              setUsername("")
              setEmail("")
              setPassword("")
              setConfirmPassword("")
              setDateOfBirth("")
              setDistrict("default")
              setAddress("")
              navigate("/")
            }
          }
        }else{
          alert("Profile picture is not selected. Please select a profile picture.")
        }
      }else{
        alert("Passwords do not match. Please try again.")
      }
    }else{
      alert("Please ensure all fields are filled.")
    }
  }

  return (
    <div className={styles.mainContainer}>
      <Box className={styles.main}>
        <Box className={styles.forms}>
          <Stack className={styles.userLoginLeft}>
            <Box className={styles.profilePicture}>
              <Box className={styles.profilePictureComponentLeft}>
                <InputLabel sx={{fontSize:"15px"}}>Profile Picture</InputLabel>
                <input id="upload-button" type="file" accept="image/*" onChange={handleImageChange} style={{display:"none"}}/>
                <Button variant="contained" color="success" sx={{width:"150px"}}><label htmlFor="upload-button">Upload Image</label></Button>
              </Box>
              <Box className={styles.profilePictureComponentRight}>
                <output><img src={imageURL} alt="Uploaded" style={{maxWidth:"100px", maxHeight:"100px", borderRadius:"50px"}}/></output>
              </Box>
            </Box>

            <p>
              <br/>
            </p>

            <Input type="text" value={username} placeholder="Username" onChange={handleUsername} sx={{fontSize:"15px"}}/>
            
            <p>
              <br/>
            </p>

            <Input type="text" value={email} placeholder="Email" onChange={handleEmail} sx={{fontSize:"15px"}}/>

            <p>
              <br/>
            </p>

            <Input type="password" value={password} placeholder="Password" onChange={handlePassword} sx={{fontSize:"15px"}}/>

            <p>
              <br/>
            </p>

            <Input type="password" value={confirmPassword} placeholder="Confirm Password" onChange={handleConfirmPassword} sx={{fontSize:"15px"}}/>
          </Stack>

          <Stack className={styles.userLoginRight}>
            <InputLabel>Date of Birth</InputLabel>
            <Input type="date" value={dateOfBirth} onChange={handleDateOfBirth} sx={{fontSize:"15px"}}/>

            <p>
              <br/>
            </p>

            <InputLabel>District</InputLabel>
            <Select value={district} onChange={handleDistrict}>
              <MenuItem value="default" sx={{display:"none"}}>Select your District</MenuItem>
              <MenuItem value="Thiruvananthapuram">Thiruvananthapuram</MenuItem>
              <MenuItem value="Kollam">Kollam</MenuItem>
              <MenuItem value="Pathanamthitta">Pathanamthitta</MenuItem>
              <MenuItem value="Alappuzha">Alappuzha</MenuItem>
              <MenuItem value="Kottayam">Kottayam</MenuItem>
              <MenuItem value="Idukki">Idukki</MenuItem>
              <MenuItem value="Ernakulam">Ernakulam</MenuItem>
              <MenuItem value="Thrissur">Thrissur</MenuItem>
              <MenuItem value="Palakkad">Palakkad</MenuItem>
              <MenuItem value="Malappuram">Malappuram</MenuItem>
              <MenuItem value="Kozhikode">Kozhikode</MenuItem>
              <MenuItem value="Wayanad">Wayanad</MenuItem>
              <MenuItem value="Kannur">Kannur</MenuItem>
              <MenuItem value="Kasaragod">Kasaragod</MenuItem>
            </Select>

            <p>
              <br/>
            </p>

            <TextareaAutosize value={address} placeholder="Address" minRows={5} onChange={handleAddress} className={styles.textAreaAutoSize}/>
          </Stack>
        </Box>

        <Box className={styles.submitContainer}>
          <Button variant="contained" onClick={signup} sx={{fontSize:"20px", width:"500px"}}>Sign Up</Button>
          <a href="/" className={styles.signUpLink}>Already have an account?Login!</a>
        </Box>
      </Box>
    </div>
  )
}

export default UserSignup
