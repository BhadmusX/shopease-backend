const  express= require('express');
const router = express.Router();
const {signIn, signUp, getMe, refreshToken, signOut, forgotPassword, resetPassword} = require('../controllers/authcontroller');
const {verifyToken} = require('../middlewares/verifyToken');

router.post('/signup', signUp);
router.post("/signin", signIn);
router.get('/getme', verifyToken, getMe);
router.post('/refresh', refreshToken);
router.post('/signout', signOut);
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword', resetPassword);


module.exports = router;
