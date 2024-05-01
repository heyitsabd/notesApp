const express = require('express');
const router = express.Router();
const {Notes} = require('../models/note')
const HistorySchema = require('../models/historySchema')
const User=require('../models/user')


async function recordHistory(userId, noteId , action) {
    
    await HistorySchema.create({
      userId,
      noteId,
      action,
      timestamp: Date.now()
    });
  
  }

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

    await recordHistory(req.user._id, Notes._id,'created');
    return res.redirect('/')
})

router.get('/delete/:id',async(req,res)=>{
    const noteId = req.params.id;
    const deletedNote = await Notes.findByIdAndDelete(noteId)
    if(!deletedNote){
        return res.status(404).send('Data not found')
    }
    await recordHistory(req.user._id, Notes._id,'deleted');
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
        console.log(noteId)
        const updatedNote = await Notes.findByIdAndUpdate(noteId, newData, { new: true });
        if (!updatedNote) {
            return res.status(404).send('Note not found');
        }
        return res.status(200).redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
})

router.post('/share/:id',async(req,res)=>{
    try {
        const noteId = req.params.id;
        const {email} = req.body;
        const note = await Notes.findById(noteId)
        console.log(note)

        if (!note) {
            return res.status(404).send('Note not found');
        }
        const user = await User.findOne({ email });
        console.log(user)
        if(!user){
            return res.send('Invalid User')
        }

        if (note.sharedWith.includes(user._id)) {
            return res.status(400).send('Note already shared with this user');
        }
      
        note.sharedWith.push(user);
        await note.save();

        return res.status(200).send('Note shared successfully');

    } catch (error) {
        console.error(error);
    }

   
})

module.exports=router