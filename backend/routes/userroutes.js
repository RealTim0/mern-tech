const express = require('express')
const {
    createUser,
    updateUser,
    deleteUser,
    getUser
} = require('../controllers/usercontroller')
const router = express.Router()


router.get('/',getUser)
router.post('/',createUser)
router.patch('/',updateUser)
router.delete('/',deleteUser)   

module.exports = router