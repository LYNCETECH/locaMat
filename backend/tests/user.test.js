var express = require('express');
var router = express.Router();
const request = require('supertest');
const app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const UserModel = require('../models/users');

var users = require('../routes/users');
var auth = require('../routes/auth');
var materials = require('../routes/materials');
var booking = require('../routes/booking');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/materials', materials);
app.use('/api/v1/booking', materials);

/*********************GLOBAL VARIABLES **********************************/

const userData = {
      "nom": "Test0",
      "prenom":"prenom",
      "email":"mail@gmail.com",
      "role":"ROLE_USER",
      "password":"polytech"
  }

const userData1 = {
      "nom": "Test0",
      "age": "10",
      "prenom":"prenom",
      "email":"maila@gmail.com",
      "role":"ROLE_USER",
      "password":"polytech"
  }

const userData2 = {
      "nom": "Test1",
      "prenom":"prenom",
      "email":"mail8@gmail.com",
      "password":"polytech"
  }


const userData3 = {
      "nom": "Test3",
      "prenom":"prenom",
      "email":"mailgmail.com",
      "role":"ROLE_USER",
      "password":"polytech"
  }

const userData4 = {
      "nom": "Test4",
      "prenom":"prenom",
      "email":"mail4@gmail.com",
      "role":"ROLE_ADMIN",
      "password":"polytech"
  }


mongoose.set('useCreateIndex', true)
mongoose.promise = global.Promise

/*****************************functions to clear database after all tests*******************************************/
async function removeAllCollections () {
  const collections = Object.keys(mongoose.connection.collections)
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName]
    await collection.deleteMany()
  }
}

async function dropAllCollections () {
  const collections = Object.keys(mongoose.connection.collections)
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName]
    try {
      await collection.drop()
    } catch (error) {
      // Sometimes this error happens, but you can safely ignore it
      if (error.message === 'ns not found') return
      // This error occurs when you use it.todo. You can
      // safely ignore this error too
      if (error.message.includes('a background operation is currently running')) return
      console.log(error.message)
    }
  }
}

    // It's just so easy to connect to the MongoDB Memory Server 
    // By using mongoose.connect
    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
        });
    });

      /*afterEach(async () => {
      await removeAllCollections();
    })*/

    // Disconnect Mongoose
    afterAll(async () => {
      await dropAllCollections();
      await mongoose.connection.close();
    })

describe('User Model Test', () => {
    it('create & save user successfully', async () => {
        const validUser = new UserModel(userData);
        const savedUser = await validUser.save();
        // Object Id should be defined when successfully saved to MongoDB.
        expect(savedUser._id).toBeDefined();
        expect(savedUser.nom).toBe(userData.nom);
        expect(savedUser.prenom).toBe(userData.prenom);
        expect(savedUser.email).toBe(userData.email);
        expect(savedUser.role).toBe(userData.role);
    });

    // Test Schema is working!!!
    // You shouldn't be able to add in any field that isn't defined in the schema
    it('Should insert user, but the field does not defined in schema should be undefined', async () => {
        const userWithInvalidField = new UserModel(userData1);
        const savedUserWithInvalidField = await userWithInvalidField.save();
        expect(savedUserWithInvalidField._id).toBeDefined();
        expect(savedUserWithInvalidField.age).toBeUndefined();
    });

    // Test Validation is working!!!
    // It should us told us the errors in on role field.
    it('Should NOT create user without required field', async () => {
        const userWithoutRequiredField = new UserModel(userData2);
        let err;
        try {
            const savedUserWithoutRequiredField = await userWithoutRequiredField.save();
            error = savedUserWithoutRequiredField;
        } catch (error) {
            err = error
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
        expect(err.errors.role).toBeDefined();
    });
    
})


describe('User requests Test', () => {

    it('Should signup with no existing user', async () => {
        const res=await request(app)
          .post('/api/v1/auth/signup')
          .send(userData4);
        expect(res.statusCode).toEqual(201);
    });

    it('Should NOT signup with existing user', async () => {
        const res=await request(app)
          .post('/api/v1/auth/signup')
          .send(userData);
        expect(res.statusCode).toEqual(401);
        expect(res.body.error.errors.email.kind).toContain("unique");
    });

    // It should us told us the errors in on role field.
    it('Should NOT signup without required field', async () => {
        const res=await request(app)
          .post('/api/v1/auth/signup')
          .send(userData2)
          expect(res.statusCode).toEqual(401);
          expect(res.body.error.errors.role.kind).toContain("required");
    });

    // It should us told us the errors in on email field.
    it('Should NOT signup with invalid email', async () => {
        const res=await request(app)
          .post('/api/v1/auth/signup')
          .send(userData3);

          expect(res.statusCode).toEqual(401);
          expect(res.body.error.errors.email.message).toContain("Invalid email");
          
    });

    
})

 




/*
test('Should signup with no existing user', async () => {
  await request(app)
        .put('/api/v1/auth/signup')
        .send(userData)
        .expect(201);
});
test('Should NOT signup with existing user', async () => {
  await request(app)
        .put('/api/v1/auth/signup')
        .send(userData2)
        .expect(401);
});


test('Should NOT signup with Invalid email', async () => {
  await request(app)
        .put('/api/v1/auth/signup')
        .send(userData3)
        .expect(401);
});

test('Should NOT signup with missing required parameters =>nom,prenom,email,role,password', async () => {
  await request(app)
        .put('/api/v1/auth/signup')
        .send(userData4)
        .expect(401);
});*/

