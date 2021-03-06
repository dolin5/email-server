const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors')
let auth;

if (process.env.NODE_ENV === 'production') {
  auth = process.env;
}
else {
  auth = require('./config.json');
}

const transporter = nodemailer.createTransport({
  service: 'Sendgrid',
  auth: {
    user: auth.SENDGRID_USERNAME, pass: auth.SENDGRID_PASSWORD
  }
});
const app = express();
app.use(cors());
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

const PORT = process.env.PORT || 3000;

app.use(express.static('./public'));

app.post('/sendEmail', (req, res, next) => {
  let email = req.body.email;
  let message = req.body.message;
  let name = req.body.name;
  let gif = req.body.gif;
  if (['http://localhost:8080', 'https://ng911datasync.com'].indexOf(req.headers.origin) >= 0) {
    transporter.sendMail({
      from: email,
      to: 'dylan@olingeographics.com',
      subject: `NG911 Data Sync Message`,
      html: `<span>${message}</span><br><span>${name}</span>`
    }, (err, info) => {
      if (err) {
        res.send(err);
      }
      else {
        console.log('after info');
        res.status(200).json({
          success: true,
          message: 'Email Sent'
        });
      }
    });
  } else {
    next(new Error('wrong domain'));
  }
});

app.listen(PORT, () => {
  console.log('Listening on port: ' + PORT);
});

