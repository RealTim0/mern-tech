const express = require("express")
const {
    getNotes,
    createNotes,
    updateNotes,
    deleteNotes
} = require("../controllers/notecontroller")
const router = express.Router()

router.get('/', getNotes)
router.post("/", createNotes)
router.patch('/', updateNotes)
router.delete('/', deleteNotes)

module.exports = router