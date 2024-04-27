const express = require('express')
const {Router} =  require('express')
const router = express.Router();
const multer = require('multer')
const path = require('path')
const User = require('../models/user')

router.get('/login', async(req,res)=>{
    res.render('login')
})

router.get('/signup', async(req,res)=>{
    res.render('signup')
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve('./public/uploads'))
    },
    filename: function (req, file, cb) {
      const filename = `${file.originalname}`
      cb(null,filename);
    },
    
  });
  
  const upload = multer({ storage: storage })

router.post('/signup',upload.single('profileImage'),async (req,res)=>{
    const {fullName,email,password} = req.body;
    await User.create({
      fullName,
      email,
      password,
      profileImage: `/uploads/${req.file.filename}`
    })
   
    return res.redirect('/user/login')
})

router.post('/login',async(req,res)=>{
  const {email,password} = req.body;

  try {
      const token = await User.matchPasswordAndGenerateToken(email,password);

      return res.cookie("Token",token).redirect('/')
  } catch (error) {
      res.render('login',{
          error:'Incorrect email or password'
      })
  }
})

router.get('/logout',async(req,res)=>{
  res.clearCookie('Token').redirect('/')
})

module.exports= router;