const  express= require('express');
const router = express.Router();
const {signIn, signUp, getMe} = require('../controllers/authcontroller');
const {verifyToken} = require('../middlewares/verifyToken');

router.post('/signup', signUp);
router.post("/signin", signIn);
router.get('/getme', verifyToken, getMe)

module.exports = router;
