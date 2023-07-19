const User = require("../models/user")
const Notes = require("../models/notemodel")
const asyncHandler = require("express-async-handler")

/////////////////////////////////////////////////////////
const getNotes =asyncHandler(async (req, res) =>{
    
    const notes = await Notes.find().lean()
     if(!notes?.length){
        return res.status(400).json({mesage:"no notes"})
     }
     res.status(200).json(notes)
})
/////////////////////////////////////////////////////////
const createNotes =asyncHandler(async (req, res) =>{
    const {user , title ,text} = req.body
        if(!user || !title || !text){
            return res.status(400).json({message:"All fields are required"})
        }

    const duplicate = await Notes.findOne({title}).lean().exec()
    if(duplicate){
        return res.status(400).json({message:"duplicate title name"})
    }

    const note = await Notes.create({user ,title ,text})
    if(!note){
        return res.status(409).json({message:"error"})
    }else{
         res.status(200).json({message: `${user} successfuly created ${title} note`})
    }
   
  
})
/////////////////////////////////////////////////////////
const updateNotes =asyncHandler( async(req, res) =>{
   
})
/////////////////////////////////////////////////////////
const deleteNotes =asyncHandler(async (req, res) =>{
    const {id } = req.body

    if(!id){
        return res.status(400).json({message:"invalid id"})
    }

    const note = await Notes.findById(id).exec()
    if(!note){
        return res.status(400).json({message:"note does not exist"})
    }

    const response = await note.deleteOne()
        if(!response){
            return res.status(400).json({message:"could not delete the note"})
        }

        res.status(200).json({message:`successfully deleted ${response.title} note with id: ${response._id}`})
})
/////////////////////////////////////////////////////////
module.exports = {
    getNotes,
    createNotes,
    updateNotes,
    deleteNotes
}