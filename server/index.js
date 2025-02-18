const express = require('express')
const dotenv = require('dotenv').config()
const cors = require('cors')
const {mongoose} = require('mongoose')
const cookieparser = require('cookie-parser')

const app = express();

// Configure CORS middleware (replace '*' with specific origins if needed) it is not secure
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend origin
    credentials: true // Enable credentials
}));

//databse connection
mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log('database connected'))
.catch((err)=>console.log('database not connected',err))

app.use(express.json())
app.use(cookieparser());
app.use(express.urlencoded({extended:false}))


app.use('/',require('./routes/authRouter'));
app.use("/",require('./routes/applyRoute'));
app.use("/",require('./routes/bussPassRoute'));


const port = 3000;
app.listen(port,()=> console.log(`server is listening on port ${port}`))