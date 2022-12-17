const express = require('express')
const expressAsyncHandler = require('express-async-handler')
const User = require('../Models/UserModel.js')
const md5 = require('md5');
const { generateToken, isAuth } = require('../util.js')

const UserRouter = express.Router();

UserRouter.get('/', isAuth, expressAsyncHandler(async (req, res) => {
   const keyword = req.query.search ? {
      $or: [
         { name: { $regex: req.query.search, $options: "i" } },
         { email: { $regex: req.query.search, $options: "i" } }
      ]
   } : {}
   const user = await User.find(keyword).find({ _id: { $ne: req.user._id } })
   res.json(user)
}))

UserRouter.post('/signup', expressAsyncHandler(async (req, res) => {
   const exist = await User.findOne({ email: req.body.email })
   if (exist) {
      res.status(401)
      throw new Error("User already exist")
   }
   else {
      let newUser = new User({
         name: req.body.name,
         email: req.body.email,
         password: md5(req.body.password),
         pic: req.body.image
      });
      const user = await newUser.save()
      return res.json({
         _id: user._id,
         name: user.name,
         email: user.email,
         pic: user.pic,
         token: generateToken(user),
      })
   }
}))

UserRouter.post('/login', expressAsyncHandler(async (req, res) => {
   let { email, password } = req.body
   let check = await User.findOne({ email })
   if (!check) {
      res.status(401)
      throw new Error("Email does not exist")
   }
   else {
      if (md5(password) != check.password) {
         res.status(401)
         throw new Error("Wrong Password")
      }
      else {
         res.json({
            _id: check._id,
            name: check.name,
            email: check.email,
            pic: check.pic,
            token: generateToken(check)
         })
      }
   }
}))

module.exports = UserRouter;