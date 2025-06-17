const express = require('express')
const dotenv = require('dotenv').config()
const cors = require('cors')
const {mongoose} = require('mongoose')
const cookieparser = require('cookie-parser')
const profileRoutes = require('./routes/profileRoutes');
const applicationHistoryRoutes = require("./routes/applicationHistory");

const app = express();

// Configure CORS middleware (replace '*' with specific origins if needed) it is not secure
app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173', 'http://15.206.117.255:5173']
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
app.use("/",require('./routes/schoolBussPassRoute'));
app.use('/api/profile', profileRoutes);
app.use("/api/application-history", applicationHistoryRoutes);




const PORT = process.env.PORT || 3000;
app.listen(PORT,()=> console.log(`server is listening on port ${PORT}`))