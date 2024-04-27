const path = require('path')
const express = require('express')
const app = express();
const PORT = 8000;
const userRoute = require('./routes/user');
const { mongoose } = require('mongoose');
const cookieParser = require('cookie-parser');
const {checkForAuthenticationCookie} = require('./middleware/auth')
const notesRoute = require('./routes/note')
const {Notes} = require('./models/note')

mongoose.connect('mongodb://127.0.0.1:27017/notesApp').then(console.log('MongoDB connected'))

app.set('view engine','ejs')
app.set('views',path.resolve('./views'))
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(checkForAuthenticationCookie('Token'))      
app.use(express.static(path.resolve('./public')))  
app.use(express.static(path.resolve('./public/images')))   



app.get('/', async(req,res)=>{
     if(!req.user) return res.redirect('/user/login');
     const notes = await Notes.find({createdBy:req.user._id})
    res.render('home',{
        user: req.user,
        notes: notes
    })
})

app.use('/user',userRoute)
app.use('/notes',notesRoute)

app.listen(PORT,()=>console.log(`App is running at port number ${PORT}`))