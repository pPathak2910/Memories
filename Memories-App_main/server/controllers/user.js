import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import {sendMail} from "../utility/nodemailer.js";

export const signin = async(req, res) => {
   const{email, password} = req.body;
   
   try{
       const existingUser = await User.findOne({email});

       if(!existingUser) return res.status(404).json({message: "User does not exist"});

       const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

       if(!isPasswordCorrect) return res.status(400).json({message: "Invalid credentials"})

       const token = jwt.sign({email: existingUser.email, id: existingUser._id}, process.env.SECRET_KEY, {expiresIn: "1h"});

       return res.status(200).json({result: existingUser, token});
   }catch(error){
       return res.status(500).json({message: "Something went wrong"})
   }
}

export const signup = async(req, res) => {
   const {email, password, confirmPassword, firstName, lastName} = req.body;
   
   try{
      const existingUser = await User.findOne({email});

      if(existingUser) return res.status(400).json({message: "User already exists"});

      if(password !== confirmPassword) return res.status(400).json({message: "Passwords do not match"});

      const hashedPassword = await bcrypt.hash(password, 12);

      const result = await User.create({email, password: hashedPassword, name: `${firstName} ${lastName}`});

      const token = jwt.sign({email: result.email, id: result._id}, process.env.SECRET_KEY, {expiresIn: "1h"});

      sendMail("signup", result.name, result.email)

      return res.status(200).json({result, token});
   }catch(error){
      return res.status(500).json({message: "Something went wrong"})
   }
}

export const resetPassword = async(req, res)=>{
   const{id, token} = req.params
   const data = req.body
   const email = data.email
   const password = data.password
   const confirmPassword = data.confirmPassword

   try{
      const user = await User.findById(id)

      if(email!==user.email){
         return res.status(400).json({message: "Incorrect email"})
      } 
   
      if(password!==confirmPassword){
         return res.status(400).json({message: "Password and repeated password do not match"})
      }
   
      const secret = process.env.SECRET_KEY + user.password
      
      try{
         const payload = jwt.verify(token, secret)
   
         const hashedPassword = await bcrypt.hash(password, 12);
         user.password = hashedPassword
         await user.save()

         return res.status(200).json({message:"Password updated successfully"})
      }catch(error){
         return res.status(498).json({message: "Invalid url"})
      }
   }catch(error){
      return res.status(404).json({message:"User not found"})
   }
}

export const forgotPassword = async(req, res)=>{
   const{email} = req.body

   try{
      const existingUser = await User.findOne({email});

      if(existingUser){
         const email = existingUser.email
         const password = existingUser.password
         const id = existingUser._id

         const secret = process.env.SECRET_KEY + password // unique for every user
         const payload = {email, id}

         const token = jwt.sign(payload, secret, {expiresIn: '15m'})
         const link = `http://localhost:3000/resetPassword/${id}/${token}`

         sendMail("resetPassword", existingUser.name, existingUser.email, link)

         return res.status(200).json({message: "User found"})
         
      }else return res.status(404).json({message: "User not found"})
   }catch(error){
      res.status(500).json({message: "Something went wrong"})
   }
}