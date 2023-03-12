import nodemailer from 'nodemailer'

export const sendMail = async(str, userName, email, link="")=>{
    let transporter = nodemailer.createTransport({
       host: "smtp.gmail.com",
       port: 587,
       secure: false,
       auth: {
          user: process.env.USER,
          pass: process.env.PASSWORD
       }
    })

    var subject, text, html;
       
    if(str==="signup"){    
        subject =`Thank you for signing up, ${userName}`;
        html=`
        <h1>WELCOME TO MEMORIES, ${userName.toUpperCase()}!</h1>
        Hope you have a good time!`
    }else if(str==="resetPassword"){
        subject = `Reset password link`
        html=`
        <h1>MEMORIES</h1>
        Hello ${userName}, here is your link to reset your password: ${link} .
        Note that this is a one time link and will expire in 15 minutes.`
    }

    let info = await transporter.sendMail({
        from: process.env.USER,
        to: email,
        subject,
        html
    })
}
