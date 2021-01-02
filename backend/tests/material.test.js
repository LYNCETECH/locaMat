var express = require('express');
var router = express.Router();
const request = require('supertest');
const app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const MaterialModel = require('../models/material');

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

const materialData = {
      "nom": "Iphone 12",
      "ref": "Iphone 12 001",
      "imageUrl":"image.com",
      "dateDepart":"19/04/2020",
      "dateRetour":""
  }

const materialData1 = {
      "nom": "Iphone 12",
      "ref": "Iphone 12 001",
      "version": "IOS 14",
      "imageUrl":"image.com",
      "dateDepart":"19/04/2020",
      "dateRetour":""
  }

const materialData2 = {
      "nom": "Iphone 12",
      "ref": "Iphone 12 001",
      "imageUrl":"image.com",
      "dateDepart":"19/04/2020",
      "dateRetour":""
  }


const materialData3 = {
      "nom": "Iphone 12",
      "ref": "Iphone 12 001",
      "imageUrl":"image.com",
      "dateDepart":"19/04/2020",
      "dateRetour":""
  }

const materialData4 = {
      "nom": "Iphone 12",
      "ref": "Iphone 12 001",
      "imageUrl":"image.com",
      "dateDepart":"19/04/2020",
      "dateRetour":""
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

describe('Material Model Test', () => {
    it('create & save material successfully', async () => {
        const validMaterial = new MaterialModel(materialData);
        const savedMaterial = await validMaterial.save();
        // Object Id should be defined when successfully saved to MongoDB.
        expect(savedMaterial._id).toBeDefined();
        expect(savedMaterial.nom).toBe(materialData.nom);
        expect(savedMaterial.ref).toBe(materialData.ref);
        expect(savedMaterial.imageUrl).toBe(materialData.imageUrl);
        expect(savedMaterial.dateDepart).toBe(materialData.dateDepart);
        expect(savedMaterial.dateRetour).toBe(materialData.dateRetour);

    });

    // Test Schema is working!!!
    // You shouldn't be able to add in any field that isn't defined in the schema
    it('Should insert user, but the field does not defined in schema should be undefined', async () => {
        const materialWithInvalidField = new MaterialModel(materialData1);
        const savedMaterialWithInvalidField = await materialWithInvalidField.save();
        expect(savedMaterialWithInvalidField._id).toBeDefined();
        expect(savedMaterialWithInvalidField.version).toBeUndefined();
    });

    // Test Validation is working!!!
    // It should us told us the errors in on role field.
    it('Should NOT create user without required field', async () => {
        const materialWithoutRequiredField = new MaterialModel(materialData2);
        let err;
        try {
            const savedMaterialWithoutRequiredField = await materialWithoutRequiredField.save();
            error = savedMaterialWithoutRequiredField;
        } catch (error) {
            err = error
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
        expect(err.errors.role).toBeDefined();
    });
    
})

/*
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

    
})*/

 




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

