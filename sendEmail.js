const nodemailer = require("nodemailer");

const Email = (options) => {
  let transpoter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.USER, // email
      pass: process.env.PASSWORD, //password
    },
  });
  transpoter.sendMail(options, (err, info) => {
    if (err) {
      console.log(err);
      return;
    }
  });
};

// send email
const EmailSender = ({ fullName, email, message }) => {
  const options = {
    from: `designwithsatya<${process.env.USER}>`,
    to: process.env.SEND_TO,
    subject: "Message from portal",
    html: `
        <div style="width: 100%; padding: 0">
        <div style="max-width: 700px; margin: 0 auto">
          <div style="width: 100%; gap: 10px; padding: 30px 0; display: grid">
            <p style="font-weight: 800; font-size: 1.2rem; padding: 0 30px">
              Dear ${fullName},
            </p>
            <div style="font-size: .8rem; margin: 0 30px">
             <p><b>Email: </b>${email}</p>
             <p><b>Message: </b>${message}</p>
            </div>
            <div style="font-size: 0.8rem; margin: 0 30px">
              <p><b>
              Note:
              </b>Please find below link for the WebSite URL.</p>
              <a href="${process.env.CLIENT_URL}">${process.env.CLIENT_URL}</a>
            </div>
            <div style="font-size: 0.8rem; margin: 0 30px">
              <p>Thank You,</p>
              <p>${fullName}</p>
            </div>
          </div>
        </div>
      </div>
        `,
  };
  Email(options);
};

module.exports = EmailSender;
