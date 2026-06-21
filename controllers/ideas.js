const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDb().db().collection('ideas').find();
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSingle = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('ideas').find({ _id: userId });
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists[0]);
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createIdea = async (req, res) => {
  try {
    const idea = {
      userId: req.body.userId,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      tags: req.body.tags,
      status: req.body.status,
      rating: req.body.rating,
      createdAt: new Date()
    };
    const response = await mongodb.getDb().db().collection('ideas').insertOne(idea);
    if (response.acknowledged) {
      res.status(201).json({ message: 'Idea created successfully', id: response.insertedId });
    } else {
      res.status(500).json(response.error || 'Some error occurred while creating the idea.');
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateIdea = async (req, res) => {
  try {
    const ideaId = new ObjectId(req.params.id);
    const idea = {
      userId: req.body.userId,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      tags: req.body.tags,
      status: req.body.status,
      rating: req.body.rating
    };
    const response = await mongodb.getDb().db().collection('ideas').replaceOne({ _id: ideaId }, idea);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || 'Some error occurred while updating the idea.');
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteIdea = async (req, res) => {
  try {
    const ideaId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().db().collection('ideas').deleteOne({ _id: ideaId }, true);
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || 'Some error occurred while deleting the idea.');
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createIdea,
  updateIdea,
  deleteIdea
};