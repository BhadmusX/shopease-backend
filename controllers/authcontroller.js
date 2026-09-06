const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Auth = require('../models/authmodel');

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
        res.status(400).json({message: "fill in details"});
    };

    const userInfo = await Auth.findOne({email});

    if(!userInfo){
        res.status(404).json({message: "User not found"});
    };

    const isPasswordValid = await bcrypt.compare(password, userInfo.password);
    if(!isPasswordValid){
        res.status(401).json({message: "Inavlid email/password"})
    }
    const token = jwt.sign({id: userInfo._id}, process.env.APP_SECRET, {expiresIn: '7d'});

    res.cookie("access_token", token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        path: "/",
        maxAge: 7 * 24 * 60 *60 * 1000,
    })
    res.status(200).json({message: 'Sign in Successfull'})
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

        res.status(200).json(user);
    }catch(err){
        console.log(err);
        res.status(500).json({message: err.message})
    }
}
module.exports = {signIn, signUp, getMe};