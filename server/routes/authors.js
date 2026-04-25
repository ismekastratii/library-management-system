const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Book = require('../models/book');

// Get all authors
router.get('/', async (req, res) => {
  try {
    const authors = await Author.find().sort({ name: 1 });
    res.json(authors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create author
router.post('/', async (req, res) => {
  const author = new Author({
    name: req.body.name,
    email: req.body.email
  });

  try {
    const newAuthor = await author.save();
    res.status(201).json(newAuthor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update author
router.put('/:id', getAuthor, async (req, res) => {
  if (req.body.name != null) {
    res.author.name = req.body.name;
  }
  if (req.body.email != null) {
    res.author.email = req.body.email;
  }

  try {
    const updatedAuthor = await res.author.save();
    res.json(updatedAuthor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete author
router.delete('/:id', getAuthor, async (req, res) => {
  try {
    const books = await Book.find({ author: req.params.id });
    if (books.length > 0) {
      return res.status(400).json({ message: 'Cannot delete author with books' });
    }
    await res.author.remove();
    res.json({ message: 'Author deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get author by ID
async function getAuthor(req, res, next) {
  try {
    const author = await Author.findById(req.params.id);
    if (author == null) {
      return res.status(404).json({ message: 'Author not found' });
    }
    res.author = author;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = router;