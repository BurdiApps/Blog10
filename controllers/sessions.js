const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDb().db('Blog10').collection('sessions').find();
    const sessions = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSingle = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid id format' });
    }
    const sessionId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db('Blog10').collection('sessions').findOne({ _id: sessionId });
    if (!result) return res.status(404).json({ message: 'Session not found' });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createSession = async (req, res) => {
  try {
    const session = {
      userId: req.body.userId,
      sessionName: req.body.sessionName,
      prompt: req.body.prompt,
      ideas: req.body.ideas,
      notes: req.body.notes,
      createdAt: new Date()
    };
    const response = await mongodb.getDb().db('Blog10').collection('sessions').insertOne(session);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json({ message: 'Error creating session' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateSession = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid id format' });
    }
    const sessionId = new ObjectId(req.params.id);
    const session = {
      userId: req.body.userId,
      sessionName: req.body.sessionName,
      prompt: req.body.prompt,
      ideas: req.body.ideas,
      notes: req.body.notes
    };
    const response = await mongodb.getDb().db('Blog10').collection('sessions').replaceOne({ _id: sessionId }, session);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Session not found or no changes made' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteSession = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid id format' });
    }
    const sessionId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().db('Blog10').collection('sessions').deleteOne({ _id: sessionId });
    if (response.deletedCount > 0) {
      res.status(200).send();
    } else {
      res.status(404).json({ message: 'Session not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAll, getSingle, createSession, updateSession, deleteSession };