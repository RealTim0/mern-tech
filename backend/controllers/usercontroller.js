const Note = require('../models/notemodel')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const asyncHandler = require("express-async-handler")

////////////////////////////////////////////////////////////
const createUser = asyncHandler( async (req, res) =>{
    const { username , password, roles } = req.body

    if(!username || !password || !Array.isArray(roles) || !roles.length){
        return res.status(400).json({mss:'all fields are required'})
    }
    const duplicate = await User.findOne({ username }).lean().exec()
    
    if(duplicate){
        return res.status(400).json({message:'username already taken'})
    }
    const hashPassword = await bcrypt.hash(password, 10)
    const userObject = {
        username,
        'password':hashPassword,
        roles
    }

    const user = await User.create(userObject)

    if(user){
        res.status(200).json({message:`New user ${username} created successfuly`})
    }else{
        res.status(400).json({message:"invalid user data received"})
    }

})

////////////////////////////////////////////////
const updateUser =asyncHandler( async (req, res) =>{
    const { username , active, id, password, roles } = req.body
    
    if(!username || !password || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean'){
        return res.status(400).json({mss:'all fields are required'})
    }

    user = await User.findById(id).exec()

    if(!user){
        return res.status(400).json({mess:'no such user'})
    }

    const duplicate = await User.findOne({ username }).lean().exec()
    if(duplicate && duplicate?._id.toString() !== id){
        return res.status(409).json({message:"duplicate username"})
    }
    user.username = username
    user.roles = roles
    user.active = active

    if (password) {
        // Hash password 
        user.password = await bcrypt.hash(password, 10) // salt rounds 
    }

    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated` })
})



/////////////////////////////////////////////////////
const getUser = asyncHandler( async (req, res) =>{
    const users = await User.find().select('-password').lean()
    if(!users?.length){
        return res.status(400).json({mss:'no users found'})
    }
    
    res.status(200).json(users)

}) 


//////////////////////////////////////////////
const deleteUser =asyncHandler( async (req, res) =>{
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'User ID Required' })
    }

    // Does the user still have assigned notes?
    const note = await Note.findOne({ user: id }).lean().exec()
    if (note) {
        return res.status(400).json({ message: 'User has assigned notes' })
    }

    // Does the user exist to delete?
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const result = await user.deleteOne()

    const reply = `Username ${result.username} with ID ${result._id} deleted`

    res.json(reply)

})
module.exports = {
    createUser,
    updateUser,
    deleteUser,
    getUser
}
