const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
    const token = req.cookies?.access_token;

    if(!token){
        res.status(401).json({message: "Access denied, No  token provided"})
    }
    try{
        const decoded = jwt.verify(token, process.env.APP_SECRET);
        req.user = decoded;
        next();
    } catch(err){
        res.status(500).json({message: "Invalid token"})
    }
};

module.exports = {verifyToken};