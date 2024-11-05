//Definierar API-rutter för autentisering

const express = require ('express')
const {registerUser, loginUser} = require ('../Controllers/auth_controller');
const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser);
router.post('/token', authController.refreshToken);
router.delete('/logout', authController.logoutUser);

module.exports = router;