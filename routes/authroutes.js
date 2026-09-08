const  express= require('express');
const router = express.Router();
const {signIn, signUp, getMe, refreshToken, signOut} = require('../controllers/authcontroller');
const {verifyToken} = require('../middlewares/verifyToken');

router.post('/signup', signUp);
router.post("/signin", signIn);
router.get('/getme', verifyToken, getMe);
router.post('/refresh', refreshToken);
router.post('/signout', signOut);


module.exports = router;
