const express=require('express')
const cors=require('cors')
const mongoose=require('mongoose')
const {UserB, Driver, UserRequests}=require('./models/models')

require('dotenv').config();

const app=express()
app.use(express.json())
app.use(cors())

PORT = process.env.REACT_APP_BACKEND_PORT

app.listen(PORT, ()=>{
    console.log("Server Started.")
})

const connect=async()=>{
    await mongoose.connect(process.env.REACT_APP_MONGO_API_URL)
    console.log("Database connected.")
}

connect()

//Used to check if a driver is assigned to any request and if it is, sets the status "isBooked" to true
const setDriverAvailability=async()=>{
    const userRequests=await UserRequests.find({driverId: { $exists: true, $ne: null}}) //Returns a collection of UserRequests whose "driverId" field has some value
    const assignedDriverIds=userRequests.map(request=>request.driverId) //Map the collection into a map
    if(assignedDriverIds.length > 0)
        await Driver.updateOne({ email: { $in: assignedDriverIds } }, { $set: { isBooked: true } }) //The drivers who have the same email as the email in"driverId" will be set to true

    await Driver.updateMany({ email: { $nin: assignedDriverIds} }, { $set: { isBooked: false } }) //The drivers who are not returned in assignedDriverIds "isBooked" is set to false
}
setInterval(setDriverAvailability, 5000)

//Used to get details from both user and driver database
app.get("/getDetails", async(req, res)=>{
    console.log("Get Details Request Recieved [GET].")
    const userDetails=await UserB.findOne({email:req.query.email}) 
    const driverDetails=await Driver.findOne({email:req.query.email})
    if(userDetails)
        res.json({type:"user", details:userDetails})
    if(driverDetails)
        res.json({type:"driver", details:driverDetails})
})

//Used to check if the user has sent a request that is waiting for driver approval
app.get("/userRequestApprovalStatus", async(req, res)=>{
    console.log("Get User Request Approval Status [GET].")
    const active_status=await UserRequests.find({userId: req.query.email})
    if(active_status.length > 0)
        return res.status(200).json({active: true})
    else
        return res.status(200).send({active: false})
})

//Used to get request count from userRequests table for taskId updation
app.get("/getRequestCount", async (req, res) => {
      const count = await UserRequests.countDocuments({});
      res.json({count})
    } 
)

//Used to get details from userRequests table for drivers
app.get("/getUserRequests", async(req, res)=>{
    console.log("Get Details Request Recieved [GET].")
    const userRequests=await UserRequests.find({startingLocation:req.query.location})
    res.json(userRequests)
})

//Used to fetch customer requests that have been accepted by a driver
app.get("/acceptedUserRequests", async(req, res)=>{
    console.log("Accepted User Request Fetch Request Recieved[GET].")
    const acceptedRequests=await UserRequests.find({
        userId: req.query.email,
        accepted: {$exists: true, $ne: []}
    })
    const driverIds = acceptedRequests.map(request => request.accepted).flat() // Get all accepted driver IDs
    const drivers = await Driver.find({email: {$in : driverIds}, isBooked: false}) // Find all drivers with these IDs

    const driverMap = drivers.reduce((map, driver) => {
        map[driver.email] = {
            username: driver.username,
            email: driver.email,
            profilePic: driver.profilePic,
            rating: driver.rating
        }
        return map
    }, {})

    const completeRequest = acceptedRequests.map(request => ({
        ...request.toObject(), // Convert to plain object
        driverResponse: request.accepted.map((driverEmail, index) => ({
            drivername: driverMap[driverEmail]?.username || "",
            fare: request.fare[index] || null,
            profilePic: driverMap[driverEmail]?.profilePic || "",
            rating: driverMap[driverEmail]?.rating || 0, // Default rating to 0 if not found
            email: driverEmail
        }))
    }))
    return res.status(200).send(completeRequest)
})

//Used to get requests that have been confirmed for a journey. This is acccesed by the driver.
app.get("/approvedUserRequests", async(req, res)=>{
    console.log("Get Approved User Request Status [GET].")
    const active_status=await UserRequests.find({driverId: req.query.email})
    if(active_status.length > 0)
        return res.status(200).json({active: true})
    else
        return res.status(200).send({active: false})
})

//Used to get user requests that have been set by inputting userId
app.get("/getValidatedUserRequestFromUser", async(req, res)=>{
    console.log("Get Validated User Request By User [GET].")
    const validatedUserRequest=await UserRequests.findOne({userId: req.query.userId, driverId: { $exists: true, $ne: null, $ne: ''}})
    if(validatedUserRequest != null)
        return res.status(200).send({validatedUserRequest,isValid:true}) 
    else
        return res.status(200).send({validatedUserRequest,isValid:false})
})

//Used to get user requests that have been set by inputting driverId
app.get("/getValidatedUserRequestFromDriver", async(req, res)=>{
    console.log("Get Validated User Request By Driver [GET].")
    const validatedUserRequest=await UserRequests.findOne({driverId: req.query.driverId, userId: { $exists: true, $ne: null, $ne: ''}})
    if(validatedUserRequest != null)
        return res.status(200).send({validatedUserRequest,isValid:true}) 
    else
        return res.status(200).send({validatedUserRequest,isValid:false})
})

//Used to make user account in the database
app.post("/userSignup", async(req, res)=>{
    console.log("User Sign Up Request Received[POST].")
    const existingUser=await UserB.findOne({email:req.body.email})
    const existingDriver=await Driver.findOne({email:req.body.email})
    if(!existingUser){
        if(!existingDriver){
            await UserB.insertMany([req.body])
            res.json({userExists:false, driverExists:false})
        }else{
            res.json({userExists:false, driverExists:true})
        }
    }else{
        res.json({userExists:true, driverExists:false})
    }
})

//Used to make driver signup in the database
app.post("/driverSignup", async(req, res)=>{
    console.log("Driver Sign Up Request Received[POST].")
    const existingDriver=await Driver.findOne({email:req.body.email})
    const existingUser=await UserB.findOne({email:req.body.email})
    if(!existingDriver){
        if(!existingUser){
            await Driver.insertMany([req.body])
            res.json({driverExists:false, userExists:false})
        }else{
            res.json({driverExists:false, userExists:true})
        }
    }else{
        res.json({driverExists:true, userExists:false})
    }
})

//Used to login for both drivers and users
app.post("/login", async(req, res)=>{
    console.log("Login Request Received[POST].")
    const user=await UserB.findOne({email:req.body.email})
    const driver=await Driver.findOne({email:req.body.email})
    if(!driver){
        if(!user){
            res.json({doesExist:false})
        }else{
            if(user.password===req.body.password){
                res.json({doesExist:true, passwordCheck:true})
            }else{
                res.json({doesExist:true, passwordCheck:false})
            }
        }
    }else{
        if((driver.password===req.body.password)){
            res.json({doesExist:true, passwordCheck:true})
        }else{
            res.json({doesExist:true, passwordCheck:false})
        }
    }
})

//Used to store incoming user requests
app.post("/submitUserRequest", async(req, res)=>{
    console.log("Submit User Request Received [POST].")
    const user = await UserB.findOne({ email: req.body.userId })
    const latestRequest = await UserRequests.findOne().sort({ requestId: -1 })
    const requestId = latestRequest ? latestRequest.requestId + 1 : 1

    const completeRequest = {
        ...req.body,
        requestId,
        username: user.username || "",
    }
    const request = await UserRequests.create(completeRequest)
    return res.status(200).send({ message: "Submitted user request.", request })
})

//Used to make edits in the driver database
app.put("/editDriver/:email", async(req, res)=>{
    console.log("Edit Request Recieved [PUT].")
    const detail=await Driver.findOneAndUpdate({email:req.params.email}, req.body)
    console.log("Updated details of driver.[PUT]")
    return res.status(200).send({message: "Driver edited successfully.", detail})
})

//Used to make edits in the user database
app.put("/editUser/:email", async(req, res)=>{
    console.log("Edit Request Recieved [PUT].")
    const detail=await UserB.findOneAndUpdate({email:req.params.email}, req.body)
    console.log("Updated details of user.[PUT]")
    return res.status(200).send({message: "User edited successfully.", detail})
})

//Used to accept user requests from driver
app.put("/acceptRequest/:requestId", async(req, res)=>{
    console.log("Accept User Request Recieved [PUT].")
    const request = await UserRequests.findOne({requestId: req.params.requestId})

    if(!request.accepted){
        request.accepted = req.body.driverId
        request.fare = req.body.fare
    }else{
        if(!request.accepted.includes(req.body.driverId)){
            request.accepted.push(req.body.driverId)
            request.fare.push(req.body.fare)
        }
    }
    await request.save()
    console.log("Accepted customer request.[PUT]")
    return res.status(200).send({message: "Request accepted successfully.", request})
})

//Used to reject user request from driver
app.put("/rejectRequest/:requestId", async(req, res)=>{
    console.log("Reject User Request Recieved [PUT].")
    const request = await UserRequests.findOne({requestId: req.params.requestId})

    if(!request.rejected){
        request.rejected = req.body.driverId
    }else{
        if(!request.rejected.includes(req.body.driverId)){
            request.rejected.push(req.body.driverId)
        }
    }
    await request.save()
    console.log("Rejected customer request.[PUT]")
    return res.status(200).send({message: "Request rejected successfully.", request})
})

//Used to confirm the driver by the user
app.put("/confirmDriver/:requestId", async(req, res)=>{
    console.log("Confirm Driver Request Recieved [PUT].")
    const currentRequest = await UserRequests.findOneAndUpdate({requestId: req.params.requestId}, req.body)
    console.log("Confirmed customer request [PUT].")
    return res.status(200).send({message: "User request confirmed successfully.", currentRequest})
})

//Used to delete user requests by inputting userId and driverId
app.delete("/deleteUserRequest/:userId/:driverId", async(req, res)=>{
    console.log("Delete User Request Recieved [DELETE].")
    await UserRequests.findOneAndDelete({userId: req.params.userId, driverId: req.params.driverId})
    return res.status(200).send({message: "User request deleted successfully."})
})