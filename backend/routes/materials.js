
const express = require('express');
const router = express.Router();

const stuffCtrl = require('../controllers/material.js');
const auth = require('../middleware/auth');

router.get('/', auth,stuffCtrl.getAllStuff);
router.post('/', auth,stuffCtrl.createMaterial);
router.get('/:id',auth, stuffCtrl.getOneMaterial);
router.put('/:id',auth, stuffCtrl.modifyMaterial);
router.delete('/:id', auth,stuffCtrl.deleteMaterial);

module.exports = router; 