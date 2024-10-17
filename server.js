const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
require('dotenv').config();
const { User, Wedding, Attendee } = require('./models/schemas');

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
mongoose.connect(process.env.MONGODB_URI);

// REGISTER
app.post('/register', (req, res) => {
  if (User.findOne({ username: req.body.adminUserName }).length > 0) {
    res.status(401).send({ state: 'error', message: 'El nombre de usuario aministrador ya existe' });
  } else if (User.findOne({ username: req.body.guestsUserName }).length > 0) {
    res.status(401).send({ state: 'error', message: 'El nombre de usuario para invitados ya existe' });
  } else {
    bcrypt.hash(req.body.adminPassword, 10, (error, hashedAdminPassword) => {
      if (error) {
        res.status(500).send({ state: 'error', message: 'Error interno del servidor' });
      }
      bcrypt.hash(req.body.guestsPassword, 10, (error, hashedGuestsPassword) => {
        if (error) {
          res.status(500).send({ state: 'error', message: 'Error interno del servidor' });
        }
        // Save new users
        const adminUser = new User({
          username: req.body.adminUserName,
          password: hashedAdminPassword,
          weddingId: req.body.adminUserName,
          role: 'admin'
        });
        adminUser.save().catch(err => {
          res.status(500).send({ state: 'error', message: 'Error interno del servidor' });
        });
        const guestsUser = new User({
          username: req.body.guestsUserName,
          password: hashedGuestsPassword,
          weddingId: req.body.adminUserName,
          role: 'guests'
        });
        guestsUser.save().catch(err => {
          res.status(500).send({ state: 'error', message: 'Error interno del servidor' });
        });

        // Save new wedding
        const wedding = new Wedding({
          weddingId: req.body.adminUserName,
          coupleName: '',
          description: '',
          image: '',
          date: ''
        });
        wedding.save()
          .then(result => {
            res.send({ state: 'success', user: result });
          })
          .catch(err => {
            res.status(500).send({ state: 'error', message: 'Error interno del servidor' });
          });
      });
    });
  }
});

// LOGIN
app.post('/login', (req, res) => {
  // Retrieve username and password from request body
  const username = req.body.name;
  const password = req.body.password;

  User.findOne({ username: username }).then(user => {
    if (user) {
      // Compare password with hashed password stored in the database
      bcrypt.compare(password, user.password, (error, result) => {
        if (result) {
          res.send({ user });
        } else {
          res.status(401).send({ message: 'Credenciales incorrectas' });
        }
      });
    } else {
      res.status(401).send({ message: 'Credenciales incorrectas' });
    }
  }).catch(err => {
    res.status(500).send({ message: 'Error interno del servidor' });
  });
});

// GET ALL ATTENDEES
app.get('/attendees/:weddingId', (req, res) => {
  Attendee.find({ weddingId: req.params.weddingId }).then(result => {
    res.send(result);
  }).catch(err => {
    res.status(500).send({ message: 'Error interno del servidor' });
  });
});

// ADD ATTENDEE
app.post('/attendees/:weddingId', (req, res) => {
  Attendee.findOne({ email: req.body.email }).then(attendee => {
    if (attendee) {
      res.status(401).send({ message: 'El email ya está registrado' });
    } else {
      const attendee = new Attendee({
        weddingId: req.params.weddingId,
        name: req.body.name,
        email: req.body.email,
        mealPreference: req.body.mealPreference,
        busPreference: req.body.busPreference,
        comments: req.body.comments
      });
      attendee.save().then(result => {
        res.send(result);
      }).catch(err => {
        res.status(500).send({ message: 'Error interno del servidor' });
      });
    }
  });
});

// DELETE ATTENDEE
app.delete('/attendees/:email', (req, res) => {
  Attendee.findOneAndDelete({ email: req.params.email }).then(result => {
    res.send(result);
  }).catch(() => {
    res.status(500).send({ message: 'Error interno del servidor' });
  });
});

// UPLOAD IMAGES
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.use('/images', express.static(path.join(__dirname, 'images')));

app.post('/upload', upload.single('file'), (req, res) => {
  const imagePath = 'images/' + req.file.filename;
  res.send({ imagePath: imagePath });
});

// UPDATE WEDDING
app.put('/wedding/:id', (req, res) => {
  Wedding.findOneAndUpdate(
    { weddingId: req.params.id },
    req.body,
    { new: true }
  )
    .then(updatedWedding => {
      if (!updatedWedding) {
        return res.status(404).send('Boda no encontrada');
      }
      res.send(updatedWedding);
    })
    .catch(err => {
      res.status(500).send('Error interno del servidor');
    });
});

// GET WEDDING
app.get('/wedding/:id', (req, res) => {
  Wedding.findOne({ weddingId: req.params.id })
    .then(wedding => {
      if (!wedding) {
        return res.status(404).send('Boda no encontrada');
      }
      res.send(wedding);
    })
    .catch(err => {
      res.status(500).send('Error interno del servidor');
    });
});

// RUN SERVER
app.listen(process.env.PORT, () => {
  console.log('Server is running...');
});
