const express = require('express');
const router = express.Router();
const {Notes} = require('../models/note')
router.get('/addNotes',(req,res)=>{
    return res.render('addNotes',{
        user:req.user,
    })
})

router.post('/addNotes',async(req,res)=>{
    const {heading,description} = req.body;
    await Notes.create({
        heading,
        description,
        createdBy: req.user._id
    })
    return res.redirect('/')
})

router.get('/delete/:id',async(req,res)=>{
    const noteId = req.params.id;
    const deletedNote = await Notes.findByIdAndDelete(noteId)
    if(!deletedNote){
        return res.status(404).send('Data not found')
    }
    return res.status(200).redirect('/')
})

router.get('/update/:id', async(req,res)=>{
    try {
        const id = req.params.id;
        // Assuming you have some logic to fetch the note based on the id
        const note = await Notes.findById(id);
        res.render('update', {
            id: id,
            note: note
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
})

router.post('/edit/:id',async(req,res)=>{
    try {
        const noteId = req.params.id;
        const newData = req.body;
        console.log(newData);
        const updatedNote = await Notes.findByIdAndUpdate(noteId, newData, { new: true });
        if (!updatedNote) {
            return res.status(404).send('Note not found');
        }
        return res.status(200).send(updatedNote);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
})

module.exports=router