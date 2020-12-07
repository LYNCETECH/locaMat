
const express = require('express');
const router = express.Router();

const stuffCtrl = require('../controllers/material.js');

router.get('/', stuffCtrl.getAllStuff);
router.post('/', stuffCtrl.createMaterial);
router.get('/:id', stuffCtrl.getOneMaterial);
router.put('/:id', stuffCtrl.modifyMaterial);
router.delete('/:id', stuffCtrl.deleteMaterial);

module.exports = router; 