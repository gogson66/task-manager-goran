const nodemailer = require("nodemailer");

const configTransporter = async function() {

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.TRANSPORTER_USER_NAME,
      pass: process.env.TRANSPORTER_PASSWORD
    },
  });

  return transporter

}

const sendGreetingMessage = async function(email, name) {
   try {
  const transporter = await configTransporter()
  let info = await transporter.sendMail({
    from: '<cvijanovicgoran78@gmail.com>', 
    to: email,
    subject: "Welcome ",
    text: `Welcome, dear ${name}`
  }); }catch(e) {
      console.log(e.message);
      
  }

}

const senteGoodbyeMessage = async function(email, name) {
    try { 
    const transporter = await configTransporter()
    let info = await transporter.sendMail({
        from: '<cvijanovicgoran78@gmail.com>',
        to: email,
        subject: "Sorry to say goodbye",
        text: `Sorry to see you go. Please, ${name} let us know reasons for deleting your account.`
    })}catch(e) {
        console.log(e.message);
        
    }


}

module.exports = {
    sendGreetingMessage,
    senteGoodbyeMessage
}

