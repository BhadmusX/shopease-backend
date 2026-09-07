const isAdmin = (req, res, next) =>{
    if(req.user.role !== "admin"){
        res.status(403).json({message: "You are not authorized to access this infomation"})
    }
    next();
}
module.exports = {isAdmin};