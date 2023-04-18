const express = require('express')
const expressAsyncHandler = require('express-async-handler')
const User = require('../Models/UserModel.js')
const Barcode = require('../Models/BarcodeModel.js')
const Otp = require('../Models/OtpModel.js')
const md5 = require('md5');
const { v4: uuidv4 } = require('uuid');
const { generateToken, isAuth } = require('../util.js')
const Joi = require('@hapi/joi')
const mailer = require('../Helpers/Mailer')

const makeRandomDigit = (length) => {
   let result = ''
   const characters = '0123456789'
   const charactersLength = characters.length
   for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
   }
   return result
}

const UserRouter = express.Router();

UserRouter.get('/', isAuth, expressAsyncHandler(async (req, res) => {
   const keyword = req.query.search ? {
      email: { $regex: req.query.search, $options: "i" }
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
      // Validating the email and password
      const schema = Joi.object({
         email: Joi.string().trim().email().max(150).required(),
         password: Joi.string().trim().required().min(8)
      })
      const check = {
         email: req.body.email,
         password: req.body.password
      }
      const { error } = schema.validate(check)
      if (error) {
         throw new Error("Fill email/password properly")
      }

      // email verification
      const email_otp = makeRandomDigit(4);
      const locals = {
         username: req.body.name,
         appName: 'Watsapp',
         email: req.body.email,
         otp: email_otp
      }

      const mail = await mailer.sendMail(req.body.email, 'Email Verification', locals)

      if (mail) {
         let newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: md5(req.body.password),
            pic: req.body.image,
            verify: false
         });
         const user = await newUser.save()
         if (user) {
            let newOtp = new Otp({
               otp: email_otp,
               user: user._id
            })
            const result = await newOtp.save()
            return res.json({
               _id: user._id,
               name: req.body.name,
               email: req.body.email,
               pic: req.body.image,
               auth: result._id,
               token: generateToken(user),
            })
         }
      }
      else {
         throw new Error("Internal Server Error")
      }
   }
}))

UserRouter.post('/otp', expressAsyncHandler(async (req, res) => {
   let otp = req.body.otp
   let otpId = req.body.id
   let userId = req.body.userId
   const data = await Otp.findById(otpId)
   if (data) {
      if (data.otp != otp) {
         throw new Error("Check your OTP")
      }
      const user = await User.findById(userId)
      if (user) {
         user.verify = true
         await user.save()
         res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user),
         })
      }
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
            verify: check.verify,
            token: generateToken(check)
         })
      }
   }
}))

UserRouter.get('/login/barcode', isAuth, expressAsyncHandler(async (req, res) => {
   const uuid_user = uuidv4()
   let newData = new Barcode({
      uuid: uuid_user,
      user_id: req.user._id
   })
   const result = await newData.save()
   res.json(result)
}))

UserRouter.post('/check/barcode', expressAsyncHandler(async (req, res) => {
   const uuid = req.body.uuid;
   const data = await Barcode.findOne({ uuid })
   if (!data) {
      throw new Error("Invalid Authentication!");
   }

   const userData = await User.findById(data.user_id)
   const message = {
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      pic: userData.pic,
      verify: userData.verify,
      token: generateToken(userData),
   }
   res.json(message)
}))

module.exports = UserRouter;