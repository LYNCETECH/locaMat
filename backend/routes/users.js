var express = require('express');
var router = express.Router();

const auth = require('../middleware/auth');
const userCtrl = require('../controllers/user');

router.get('/',auth,userCtrl.getAllUser);
router.get('/:id', auth,userCtrl.getOneUser);
router.put('/:id', auth,userCtrl.modifyUser);
router.delete('/:id', auth,userCtrl.deleteUser);

module.exports = router;

