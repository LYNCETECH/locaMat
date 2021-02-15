const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }).then(
    (user) => {
      if (!user) {
        return res.status(401).json({type:new Error('User not found!'),message:"Utilisateur inconnu, vérifiez votre adresse mail et réessayer"}
        );
      }
      
      bcrypt.compare(req.body.password, user.password).then(
        (valid) => {
         
          if (!valid) {
            return res.status(401).json({type:new Error('Incorrect password!'),message:"Mot de passe incorrect, vérifiez votre mot de passe et réessayer"
            });
          }

          const token = jwt.sign(
            { userId: user._id },
            'RANDOM_TOKEN_SECRET',{ expiresIn: '24h' });
           
          res.status(200).json({
            userId: user._id,
            token: token
          });
        }
      ).catch(
        (error) => {
          res.status(500).json({
            error: error
          });
        }
      );
    }
  ).catch(
    (error) => {
      res.status(500).json({
        error: error
      });
    }
  );
}

exports.getOneUser = (req, res, next) => {
  User.findOne({
    _id: req.params.id
  }).then(
    (user) => {
      
      res.status(200).json(user);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifyUser = (req, res, next) => {
  let hashpass;
  User.findOne({
    _id: req.params.id
  }).then(
    (user) => {
       
      if(user.password!==req.body.password)
      {
        
          bcrypt.hash(req.body.password, 10)
          .then(hash => {
            
              hashpass=hash;
          })
          .catch(error => res.status(500).json({ error }));
      }else{
        
        hashpass=req.body.password;
      }
      
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );

  const user = new User({
        _id: req.params.id,
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        role: req.body.role,
        password: hashpass
      });
      User.updateOne({_id: req.params.id}, user).then(
        () => {
          res.status(201).json({
            message: 'User updated successfully!'
          });
        }
      ).catch(
        (error) => {
          res.status(400).json({
            error: error
          });
        }
      );
  
};

exports.deleteUser = (req, res, next) => {
  User.deleteOne({_id: req.params.id}).then(
    () => {
      res.status(200).json({
        message: 'User deleted!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getAllUser = (req, res, next) => {
  User.find().then(
    (users) => {
      res.status(200).json(users);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};


exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        role: req.body.role,
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: 'User created successfully' }))
        .catch(
          (error) => {
            
            if(error.errors.kind=='unique')
            {
              error.message="Un utilisateur avec cet email existe déjà";
            }


            res.status(401).json({error});
            
            
        });
    })
    .catch(error => res.status(500).json({ error }));
};