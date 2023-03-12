import express from 'express';
import {signin, signup, resetPassword, forgotPassword} from '../controllers/user.js'

const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.post('/forgotPassword', forgotPassword)
router.post('/resetPassword/:id/:token', resetPassword)

export default router;