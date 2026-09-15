const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Auth = require('../models/authmodel');
const redisClient = require('../config/redis');

const signUp = async (req, res) => {
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return res.status(400).json({message: "fill in details"});
    }

    const userInfo = await Auth.findOne({email});
    if(userInfo){
        return res.status(400).json({message: "Email has already been used"});
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = new Auth({
        name,
        email,
        password: hashedPassword
    });

    try{
        await user.save();
        res.status(201).json({message: "sign Up successfull"});
    }catch(err){
        console.log(err);
        res.status(500).json({message: err.message})
    }    
}

const signIn = async (req, res) => {
    try{
    const {email, password} = req.body;

    if(!email  || !password){
        return res.status(400).json({message: "fill in details"});
    };

    const userInfo = await Auth.findOne({email});

    if(!userInfo){
        return res.status(404).json({message: "User not found"});
    };

    const isPasswordValid = await bcrypt.compare(password, userInfo.password);
    if(!isPasswordValid){
        return res.status(401).json({message: "Inavlid email/password"})
    }
    const token = jwt.sign({id: userInfo._id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'});

    const refreshToken = jwt.sign({id: userInfo._id}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "7d"})

    userInfo.refreshToken = refreshToken;
    await userInfo.save();

    redisClient.set(`refreshToken:${userInfo._id}`, refreshToken, {'EX': 7 * 24 * 60 * 60});

    res.cookie("access_token", token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        path: "/",
        maxAge: 15 * 60 * 1000,
    })

    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });


    res.status(200).json({message: 'Sign in Successfull', data: {name: userInfo.name, email: userInfo.email}})
}catch(err){
    console.log(err);
    res.status(500).json({message: err.message});
}
}

const getMe = async (req, res) => {
    try{
        const user = await Auth.findById(req.user.id).select('-password -__v');

        if(!user){
        return res.status(404).json({message: "User not found"});
        }
        const newUser = {name: user.name, email: user.email, id: user._id};

        res.status(200).json(newUser);
    }catch(err){
        console.log(err);
        res.status(500).json({message: err.message})
    }
}

const refreshToken = async (req, res) => {
    try{
        const refreshToken = req.cookies?.refresh_token;

        if(!refreshToken){
            return res.status(401).json({message: "No refresh token provided"});
        }

        let decoded;
        try{
            decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

            const redisrefreshToken = await redisClient.get(`refreshToken:${decoded.id}`);

            if(redisrefreshToken !== refreshToken){
                return res.status(401).json({message: "Invalid refresh token"})
            }
        }catch(err){
            return res.status(403).json({message: "Invalid or expired refresh token"});
        }

        const user = await Auth.findById(decoded.id);
        if(!user || user.refreshToken !== refreshToken){
            return  res.status(403).json({message: "Refresh token is invalid or has been revoked"})
        }

        const newAccessToken = jwt.sign({id: user._id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"});

        res.cookie("access_token", newAccessToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            path: '/',
            maxAge: 15 * 60 * 1000
        });

        return res.status(200).json({message: "token refreshed successfully"});
    }catch(err){
        console.log(err);
        return res.status(500).json({message: err.message});
    }
}

const signOut = async (req, res)=> {
    try{
        const refreshToken = req.cookies?.refresh_token;

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        await redisClient.del(`refreshToken:${decoded.id}`);

     res.clearCookie("access_token", {path: '/'});
     res.clearCookie('refresh_token', {path: '/'});

     return res.status(200).json({messaage: "Logged out successfully"})
    }catch(err){
        return res.status(500).json({message: err.message});
    }
}
module.exports = {signIn, signUp, getMe, refreshToken, signOut};