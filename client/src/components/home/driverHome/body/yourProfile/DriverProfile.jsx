import React, {useState, useEffect, Profiler} from "react"
import styles from "./driverProfile.module.css"
import {Box,Paper,Button,MenuItem,InputLabel,TextareaAutosize,Typography,Select} from "@mui/material"
import axios from 'axios'

const DriverProfile=()=>{
  const [details, setDetails]=useState("")
  const [password, setPassword]=useState("")
  const [confirmPassword, setConfirmPassword]=useState("")
  const [error, setError]=useState("")
  const [region, setRegion]=useState("")
  const [address, setAddress]=useState("")
  const [rating, setRating]=useState(0)
  const [profileURL, setProfileURL]=useState("")
  const [imageURL, setImageURL]=useState()
  const [selectedFile, setSelectedFile]=useState(null)

  useEffect(()=>{
    GetDetails()
  }, [])

  const GetDetails=async()=>{
    // const result=await axios.get(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/getDetails`, {params:{email:localStorage.getItem('email')}}) // LOCALHOST
    const result=await axios.get(`https://hire-a-drive-backend.onrender.com/getDetails`, {params:{email:localStorage.getItem('email')}}) // DEPLOYMENT
    setDetails(result.data.details)
    setRating(result.data.details.rating)
    console.log(rating)
  }

  const ExtractDateComponents=(dateOfJoining)=>{
    const date=new Date(dateOfJoining);
    return{
      day: date.getDate(),
      month: date.getMonth()+1,
      year: date.getFullYear(),
    }
  }

  const handleProfilePic=(event)=>{
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

  const handlePassword=(event)=>{
    setPassword(event.target.value)
  }

  const handleConfirmPassword=(event)=>{
    setConfirmPassword(event.target.value)
  }

  const handleRegion=(event)=>{
    setRegion(event.target.value)
  }

  const handleAddress=(event)=>{
    setAddress(event.target.value)
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
      const response = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, formData)
      return response.data.secure_url
    }
    catch(error){
      console.error(error)
      return null
    }
  }

  const changeProfilePic=async(event)=>{
    const profilePic=await uploadImageAndDownloadURL()
    if(profilePic){
      // const status_pfp=await axios.put(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/editDriver/${localStorage.getItem('email')}`, {profilePic}) // LOCALHOST
      const status_pfp=await axios.put(`https://hire-a-drive-backend.onrender.com/editDriver/${localStorage.getItem('email')}`, {profilePic}) // DEPLOYMENT
      window.location.reload()
    }
  }

  const changePassword=async()=>{
    if(!(password==="")&&!(confirmPassword===""))
    {
      if(password===confirmPassword)
      {
        // const status_password=await axios.put(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/editDriver/${localStorage.getItem('email')}`, {password:password}) // LOCALHOST
        const status_password=await axios.put(`https://hire-a-drive-backend.onrender.com/editDriver/${localStorage.getItem('email')}`, {password:password}) // DEPLOYMENT
        setPassword()
        setConfirmPassword()
        setError()
      }
      else
        setError("Password and Confirm Password does not match.")
    }
    else
      setError("Please make sure password or confirm password is filled.")
  }

  const changeRegion=async()=>{
    // const status_region=await axios.put(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/editDriver/${localStorage.getItem('email')}`, {district:region}) // LOCALHOST
    const status_region=await axios.put(`https://hire-a-drive-backend.onrender.com/editDriver/${localStorage.getItem('email')}`, {district:region}) // DEPLOYMENT
    setRegion()
  }

  const changeAddress=async()=>{
    // const status_address=await axios.put(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/editDriver/${localStorage.getItem('email')}`, {address:address}) // LOCALHOST
    const status_address=await axios.put(`https://hire-a-drive-backend.onrender.com/editDriver/${localStorage.getItem('email')}`, {address:address}) // DEPLOYMENT
    setAddress()
  }

  return(
    <Box className={styles.driverProfile}>
      <Box className={styles.rowContainer}>
        <div className={styles.snapStart}>snapStart</div>
        <Paper className={styles.overview}>
          <div style={{display:"flex",flexDirection:"row",height:"90%",paddingTop:"2%"}}>
            <Paper sx={{display:"flex",flexDirection:"column",justifyContent:"flex-start",alignItems:"center",height:"100%",width:"33.3%",padding:"10px 20px",marginRight:"5px",borderRadius:"20px",boxShadow:"2px 2px 10px black"}}>
              <img src={details.profilePic} alt="profile pic" style={{maxHeight:"75%",maxWidth:"75%",borderRadius:"50%",marginBottom:"5%",border:"2px ridge black"}}/>
              <div style={{backgroundColor:"rgb(200,200,200)",borderRadius:"20px",boxShadow:"2px 2px 5px black",width:"425px"}}>
                {[...Array(5)].map((_, index) => (
                  <span key={index} className={styles.star} style={{color: index <rating ? "gold" : "grey"}}>&#9734;</span>
                ))}
              </div>
              <div style={{display:"flex", justifyContent: "center"}}>
                <Button variant="contained" color="success" onClick={changeProfilePic} sx={{marginTop:"2%",borderRadius:"5px", height:"70%", width:"90%", marginRight:"1%"}}>Change Picture</Button><label htmlFor="profilePicUpload" style={{padding:"5px 5px 5px 5px", fontSize:"15px",backgroundColor:"#1976D2", color:"white", marginTop:"2%", borderRadius:"5px", height:"60%", width:"60%", marginLeft:"1%", textAlign:"center"}}>FILE UPLOAD<input id="profilePicUpload" type="file" onChange={handleProfilePic} style={{display:"none"}}/></label>
              </div>
            </Paper>
            <Paper sx={{height:"100%",marginLeft:"5px",backgroundColor:"white",width:"66.6%",marginRight:"5px",borderRadius:"20px",boxShadow:"2px 2px 10px black",padding:"10px 30px",textAlign:"center"}}>
              <Typography variant="h3">Details</Typography>
              <p style={{fontSize:"30px"}}>You joined Hire a Drive on {details.dateOfJoining?((()=>{const{day, month, year}=ExtractDateComponents(details.dateOfJoining);return `${day}/${month}/${year}`;})()):("N/A")}</p>
              <p style={{fontSize:"30px"}}>Name: {details.username}</p>
              <p style={{fontSize:"30px"}}>Date of Birth: {details.dateOfBirth?((()=>{const{day, month, year}=ExtractDateComponents(details.dateOfBirth);return `${day}/${month}/${year}`;})()):("N/A")}</p>
              <p style={{fontSize:"30px"}}>District: {details.district}</p>
              <p style={{fontSize:"30px"}}>Address: {details.address}</p>
            </Paper>
          </div>
        </Paper>
        <div className={styles.divider}>divider</div>
        <Box className={styles.editables}>
          <Box className={styles.columnContainer}>
            <Paper className={styles.paper1}>
              <Box className={styles.password}>
                <Typography variant="h4" sx={{padding:"0 5%",marginBottom:"3%"}}>Change Password:</Typography>
                <InputLabel htmlFor="password" sx={{fontSize:"35px",width:"100%",marginLeft:"30%",marginTop:"6%"}}>Password:&nbsp;&nbsp;<input id="password" type="text" onChange={handlePassword} style={{width:"25%",fontSize:"30px",backgroundColor:"rgb(234, 233, 233)"}}/></InputLabel>
                <p></p>
                <InputLabel htmlFor="confirmPassword" sx={{fontSize:"35px",width:"100%",marginLeft:"20%"}}>Confirm Password:&nbsp;&nbsp;<input id="password" type="text" onChange={handleConfirmPassword} style={{width:"25%",fontSize:"30px",backgroundColor:"rgb(234, 233, 233)"}}/></InputLabel>
                <p></p>
                <Typography variant="h4" sx={{color:"red",fontSize:"35px",width:"100%",marginLeft:"18%"}}>{error}</Typography>
                <Button variant="contained" color="success" onClick={changePassword} sx={{width:"22%",marginLeft:"75%",marginTop:"5%"}}>Change Password</Button>
              </Box>
            </Paper>
            <div className={styles.divider}>divider</div>
            <Paper className={styles.paper2}>
              <Box className={styles.address}>
                <Typography variant="h5" sx={{padding:"0 5%",marginBottom:"3%", marginRight:"65%"}}>Change Region & Address:</Typography>
                <InputLabel htmlFor="region" sx={{fontSize:"20px",marginLeft:"10%"}}>Region:</InputLabel>
                <Select id="region" value={region} onChange={handleRegion} style={{width:"50%",marginLeft:"10%",backgroundColor:"rgb(234, 233, 233)"}}>
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
                <Button variant="contained" color="success" onClick={changeRegion} sx={{width:"22%", marginLeft:"75%",marginTop:"-4%"}}>Change Region</Button>
                <p></p>
                <InputLabel htmlFor="address" sx={{fontSize:"22px", marginLeft:"10%"}}>Address:</InputLabel>
                <TextareaAutosize id="address" minRows={5} onChange={handleAddress} style={{width:"50%",marginLeft:"10%",backgroundColor:"rgb(234, 233, 233)"}}/>
                <Button variant="contained" color="success" onClick={changeAddress} sx={{width:"22%", marginLeft:"75%",marginTop:"-7%"}}>Change Address</Button>
              </Box>
            </Paper>
            <div className={styles.divider}>divider</div>
            {/* <Paper className={styles.paper3}>
              <Box className={styles.vehicleList}>
                <Typography variant="h5" sx={{padding:"0% 2%"}}>Add or Remove vehicles:</Typography>
                <Box className={styles.itemsContainer}>
                  <Box className={styles.list}>
                    <Paper sx={{display:"flex",flexDirection:"column",justifyContent:"center",border:"2px solid #2C84D1"}}>
                      <Typography variant="h5">Item Box</Typography>
                    </Paper>
                  </Box>
                  <Box className={styles.interface}>
                    <input type="text" placeholder="Type item name here..." style={{fontSize:"20px"}}/>
                    <Button variant="contained" sx={{marginTop:"3%"}}>Add Item</Button>
                    <Button variant="contained" color="error" sx={{marginTop:"3%"}}>Remove Item</Button>
                  </Box>
                </Box>
              </Box>
            </Paper> */}
          </Box>
        </Box>
        <div className={styles.snapEnd}>snapEnd</div>
      </Box>
    </Box>
  )
}

export default DriverProfile