const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT;
const cors = require('cors');
const cookieParser = require('cookie-parser');

const allowedOrigins = [
    'http://localhost:5173',
    'https://shopeasexx.netlify.app',
    process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
 app.use('/uploads', express.static('uploads'));

const {connectDB} = require('./config/db');
connectDB();
const authrouter = require('./routes/authroutes');
app.use('/api', authrouter);
const productroute = require('./routes/productroute');
app.use('/api', productroute);
const favoriteroute = require('./routes/favoriteroute');
app.use('/api', favoriteroute);
const cartroute = require('./routes/cartroute');
app.use('/api', cartroute);
const paymentroute = require('./routes/paymentroute');
app.use('/api', paymentroute);
const analyticsroute = require('./routes/analyticsroute');
app.use('/api', analyticsroute);
const orderrouter = require('./routes/orderroute');
app.use('/api', orderrouter);



app.listen(port, () => {
    console.log(`server running at port ${port}`);
})