var express = require('express');
var router = express.Router();

//const auth = require('../middleware/auth');
const userCtrl = require('../controllers/user');

router.get('/', userCtrl.getAllUser);
router.post('/', userCtrl.signup);
router.get('/:id', userCtrl.getOneUser);
router.put('/:id', userCtrl.modifyUser);
router.delete('/:id', userCtrl.deleteUser);

module.exports = router;

