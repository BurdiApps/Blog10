const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDb().db('Blog10').collection('ideas').find();
    const ideas = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(ideas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSingle = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid id format' });
    }
    const ideaId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db('Blog10').collection('ideas').findOne({ _id: ideaId });
    if (!result) return res.status(404).json({ message: 'Idea not found' });
    res.status(200).json(result);
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
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const response = await mongodb.getDb().db('Blog10').collection('ideas').insertOne(idea);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json({ message: 'Error creating idea' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateIdea = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid id format' });
    }
    const ideaId = new ObjectId(req.params.id);
    const idea = {
      userId: req.body.userId,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      tags: req.body.tags,
      status: req.body.status,
      rating: req.body.rating,
      updatedAt: new Date()
    };
    const response = await mongodb.getDb().db('Blog10').collection('ideas').replaceOne({ _id: ideaId }, idea);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Idea not found or no changes made' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteIdea = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid id format' });
    }
    const ideaId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().db('Blog10').collection('ideas').deleteOne({ _id: ideaId });
    if (response.deletedCount > 0) {
      res.status(200).send();
    } else {
      res.status(404).json({ message: 'Idea not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAll, getSingle, createIdea, updateIdea, deleteIdea };