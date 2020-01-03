const nodemailer = require('nodemailer');

/**
* Here we're using Gmail to send 
*/
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'yourgmailaccount@gmail.com',
        pass: 'yourgmailaccpassword'
    }
});

const sendMail = (name, email, destination, subject , content) => {
        const mailOptions = {
            from: name + ' ' + email, // Something like: Jane Doe <janedoe@gmail.com>
            to: destination,
            subject: subject, // email subject
            html: content // email content in HTML
        };
  
        // returning result
        return transporter.sendMail(mailOptions, (error, info) => {
            if(error){
                console.error(error)
                return error.toString();
            }
            return 'Sent';
        });
};