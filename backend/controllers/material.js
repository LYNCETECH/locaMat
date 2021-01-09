const Material = require('../models/material');

exports.createMaterial = (req, res, next) => {
  const material = new Material({
    nom: req.body.nom,
    version: req.body.version,
    ref: req.body.ref,
    imageUrl: req.body.imageUrl,
    dateDepart: req.body.dateDepart,
    dateRetour: req.body.dateRetour,
    emprunteur: req.body.emprunteur
  });
  material.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
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

exports.getOneMaterial = (req, res, next) => {
  Material.findOne({
    _id: req.params.id
  }).then(
    (material) => {
      res.status(200).json(material);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifyMaterial = (req, res, next) => {
  const material = new Material({
    _id: req.params.id,
    nom: req.body.nom,
    version: req.body.version,
    ref: req.body.ref,
    imageUrl: req.body.imageUrl,
    dateDepart: req.body.dateDepart,
    dateRetour: req.body.dateRetour,
    emprunteur: req.body.emprunteur
  });
  Material.updateOne({_id: req.params.id}, material).then(
    () => {
      res.status(201).json({
        message: 'Material updated successfully!'
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

exports.deleteMaterial = (req, res, next) => {
  Material.deleteOne({_id: req.params.id}).then(
  (toto) => {
    console.log(toto);
    res.status(200).json({
      message: 'Deleted!'
    });
  }
  ).catch(
    (error) => {

      //console.log(JSON.stringify(error));
      res.status(400).json({
        error: error,
        message: error
      });
    }
  );
};

exports.getAllStuff = (req, res, next) => {
  Material.find().then(
    (materials) => {
      
      res.status(200).json(materials);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};