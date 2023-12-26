import crypto from 'crypto'
import nodemailer from 'nodemailer'

import { dev } from '../config'

export function generateActivationToken() {
  return crypto.randomBytes(32).toString('hex')
}

// service to send emails in your behalf i.e. Node.js library for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: dev.email.user,
    pass: dev.email.pass,
  },
})

export async function sendActivationEmail(
  userEmail: string,
  activationToken: string,
  firstName: string | undefined
) {
  const activationLink = `${dev.email.domain}/api/auth/activateUser/${activationToken}`

  const htmlEmailTemplate = `<div style="font-family:Raleway,sans-serif; display: flex; justify-content: center; align-items: center; flex-direction: column; background-color: #ebebeb; padding: 126px 261px; background-image: url(https://i.ebayimg.com/images/g/2-4AAOSwTSpeVjmK/s-l1600.jpg);">
  <div style="display: flex; justify-content: center; align-items: center; flex-direction: column; background-color: #ffffff; padding: 35px 85px ;">

  
  <div style="margin-top: 8px;">
  <div style="padding-bottom: 20px; border-radius: 20px ;">
      <a href="#">
          <img style="width: 400px; height: 90px; " src="https://majedah-bucket.s3.eu-west-2.amazonaws.com/greenPlantsWhiteLogo-1703597304054-405621210.png" alt="greenPlantLogo">
      </a>
  </div>
  <h2 style="color: #335e33; font-size: 20px;">Hi ${firstName},</h2>
  
      <p style="font-size: 15px; margin-top: 2px; line-height: loose; color: #335e33; ">
        Thank you for choosing GreenPlant!  <br>
        Your account has been created. To activate your account and start shopping, 
      <p style="font-size: 15px; color: #335e33;"> click the button below..
      </p>
      </p>
      
      <button style="  margin-top: 20px;  background-color: #FFFFFF;
      border: 1px solid rgb(209,213,219);
      border-radius: .5rem;
      box-sizing: border-box;
      color: #111827;
      font-family: sans-serif;
      font-size: .875rem;
      font-weight: 600;
      line-height: 1.25rem;
      padding: .75rem 1rem;
      text-align: center;
      text-decoration: none #D1D5DB solid;
      text-decoration-thickness: auto;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      cursor: pointer;
      user-select: none;
      -webkit-user-select: none;
      touch-action: manipulation;">
         <a href="${activationLink}" style="color: inherit; text-decoration: none;font-size: 15px;">  Activate your account 
         </a> 
      </button>
      

      <p style="font-size: 14px;margin-top: 49px; color: #335e33; ">
      If you have any questions or need further assistance, please contact our <br>
      support team at <a href="mailto:greenowls2023@gmail.com ">greenowls2023@gmail.com </a>
      </p>

      <p style="font-size: 14px; margin-top: 30px; color: #335e33; ">
       Thanks,<br>
       GreenPlant Team
      </p>

      <div style="margin-top: 8px; margin: 0px 0px; font-size: 11px; ">
          <p style="color: #335e33; ">
          This email was sent to <a href="#" style="color: blue-600; " target="_blank">${userEmail}</a>. 
              If you'd rather not receive this kind of email, you can <a href="#" style="color: blue-600; ">unsubscribe</a> or <a href="#" style="color: blue-600; ">manage your email preferences</a>.
          </p>
      
          <p style="margin-top: 30px; color: #335e33; ">© ${new Date().getFullYear()}  GreenPlant. All Rights Reserved.</p>
      </div>
  </div>
  
  
</div>

</div>`

  const mailOptions = {
    from: dev.email.user,
    to: userEmail,
    subject: 'GreenPlant| Account Activation ',
    html: htmlEmailTemplate,
  }
  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('info', info)
    return info
  } catch (error) {
    console.error("can't send the email")
  }
}

export async function sendForgotPasswordEmail(
  userEmail: string,
  forgotPasswordCode: string,
  firstName: string | undefined
) {
  const activationLink = `${dev.email.frontEndDomain}/resetPassword/${forgotPasswordCode}`

  const htmlEmailTemplate = `<div style="font-family:Raleway,sans-serif; display: flex; justify-content: center; align-items: center; flex-direction: column; background-color: #ebebeb; padding: 126px 261px; background-image: url(https://i.ebayimg.com/images/g/2-4AAOSwTSpeVjmK/s-l1600.jpg);">
  <div style="display: flex; justify-content: center; align-items: center; flex-direction: column; background-color: #ffffff; padding: 35px 85px ;">

  
  <div style="margin-top: 8px;">
  <div style="padding-bottom: 20px; border-radius: 20px ;">
      <a href="#">
          <img style="width: 400px; height: 90px; " src="https://majedah-bucket.s3.eu-west-2.amazonaws.com/greenPlantsWhiteLogo-1703597304054-405621210.png" alt="greenPlantLogo">
      </a>
  </div>
  <h2 style="color: #335e33; font-size: 20px;">Hi ${firstName},</h2>
  
      <p style="font-size: 15px; margin-top: 2px; line-height: loose; color: #335e33; ">
        We received a request to reset the password for your account. If you did not make <br>
        request, you can ignore this email. No changes will be made to your account. 
      <p style="font-size: 15px; color: #335e33;"> To reset your password, please click on the following link:
      </p>
      </p>
      
      <button style="  margin-top: 20px;  background-color: #FFFFFF;
      border: 1px solid rgb(209,213,219);
      border-radius: .5rem;
      box-sizing: border-box;
      color: #111827;
      font-family: sans-serif;
      font-size: .875rem;
      font-weight: 600;
      line-height: 1.25rem;
      padding: .75rem 1rem;
      text-align: center;
      text-decoration: none #D1D5DB solid;
      text-decoration-thickness: auto;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      cursor: pointer;
      user-select: none;
      -webkit-user-select: none;
      touch-action: manipulation;">
         <a href="${activationLink}" style="color: inherit; text-decoration: none;font-size: 15px;">  Reset Password Link
         </a> 
      </button>
      

      <p style="font-size: 14px;margin-top: 49px; color: #335e33; ">
        If you have any questions or need further assistance, please contact our <br>
        support team at <a href="mailto:greenowls2023@gmail.com ">greenowls2023@gmail.com </a>
      </p>

      <p style="font-size: 14px; margin-top: 30px; color: #335e33; ">
       Thanks,<br>
       GreenPlant Team
      </p>

      <div style="margin-top: 8px; margin: 0px 0px; font-size: 11px; ">
          <p style="color: #335e33; ">
          This email was sent to <a href="#" style="color: blue-600; " target="_blank">${userEmail}</a>. 
              If you'd rather not receive this kind of email, you can <a href="#" style="color: blue-600; ">unsubscribe</a> or <a href="#" style="color: blue-600; ">manage your email preferences</a>.
          </p>
      
          <p style="margin-top: 30px; color: #335e33; ">© ${new Date().getFullYear()}  GreenPlant. All Rights Reserved.</p>
      </div>
  </div>
  
  
</div>

</div>`

  const mailOptions = {
    from: dev.email.user,
    to: userEmail,
    subject: 'GreenPlant| Reset Password Link ',
    html: htmlEmailTemplate,
  }
  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('info', info)
    return info
  } catch (error) {
    console.error("can't send the email of resetPassword")
  }
}
