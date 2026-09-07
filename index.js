const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT;
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cors());
app.use(cookieParser());
 app.use('/uploads', express.static('uploads'));

const {connectDB} = require('./config/db');
connectDB();
const authrouter = require('./routes/authroutes');
app.use(authrouter);
const productroute = require('./routes/productroute');
app.use(productroute);
const favoriteroute = require('./routes/favoriteroute');
app.use(favoriteroute);



app.listen(port, () => {
    console.log(`server running at port ${port}`);
})