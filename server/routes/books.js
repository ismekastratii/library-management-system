const express = require('express');
const router = express.Router();
const multer = require('multer');
const Book = require('../models/book');

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'));
    }
  },
});

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find()
      .populate('author')
      .sort({ createdAt: 'desc' });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create book
router.post('/', upload.single('cover'), async (req, res) => {
  const book = new Book({
    title: req.body.title,
    description: req.body.description,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    author: req.body.author,
  });

  if (req.file) {
    book.coverImage = req.file.buffer;
    book.coverImageType = req.file.mimetype;
  }

  try {
    const newBook = await book.save();
    const populatedBook = await Book.findById(newBook._id).populate('author');
    res.status(201).json(populatedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update book
router.put('/:id', upload.single('cover'), getBook, async (req, res) => {
  if (req.body.title != null) {
    res.book.title = req.body.title;
  }
  if (req.body.description != null) {
    res.book.description = req.body.description;
  }
  if (req.body.publishDate != null) {
    res.book.publishDate = new Date(req.body.publishDate);
  }
  if (req.body.pageCount != null) {
    res.book.pageCount = req.body.pageCount;
  }
  if (req.body.author != null) {
    res.book.author = req.body.author;
  }
  if (req.file) {
    res.book.coverImage = req.file.buffer;
    res.book.coverImageType = req.file.mimetype;
  }

  try {
    const updatedBook = await res.book.save();
    const populatedBook = await Book.findById(updatedBook._id).populate('author');
    res.json(populatedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete book
router.delete('/:id', getBook, async (req, res) => {
  try {
    await res.book.remove();
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get book by ID
async function getBook(req, res, next) {
  try {
    const book = await Book.findById(req.params.id);
    if (book == null) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.book = book;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = router; 