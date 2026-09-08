const jwt = require('jsonwebtoken');
const Auth =  require('../models/authmodel');
const verifyToken = async (req, res, next) => {
    const token = req.cookies?.access_token;

    if(!token){
        return res.status(401).json({message: "Access denied, No  token provided"})
    }
    try{
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const userinfo = await Auth.findById(decoded.id).select('-password')

        if(!userinfo){
            return res.status(404).json({message: "User not found"})
        }
        req.user = {id: userinfo._id, role: userinfo.role};
        next();
    } catch(err){
        if(err.name === 'TokenExpiredError'){
            return res.status(401).json({message: "Access token expired"});
        }
        return res.status(500).json({message: "Invalid token"})
    }
};

module.exports = {verifyToken};