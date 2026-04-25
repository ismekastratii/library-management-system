import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getBooks, createBook, updateBook, deleteBook, getAuthors } from '../services/api';

function Books() {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentBook, setCurrentBook] = useState({
    title: '',
    description: '',
    publishDate: null,
    pageCount: '',
    author: '',
    coverImage: null,
  });
  const [previewUrl, setPreviewUrl] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchBooks();
    fetchAuthors();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const data = await getBooks();
      setBooks(data);
    } catch (error) {
      showSnackbar('Error fetching books', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthors = async () => {
    try {
      const data = await getAuthors();
      setAuthors(data);
    } catch (error) {
      showSnackbar('Error fetching authors', 'error');
    }
  };

  const handleOpen = (book = null) => {
    if (book) {
      setCurrentBook(book);
      setPreviewUrl(book.coverImagePath);
      setEditMode(true);
    } else {
      setCurrentBook({
        title: '',
        description: '',
        publishDate: null,
        pageCount: '',
        author: '',
        coverImage: null,
      });
      setPreviewUrl('');
      setEditMode(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentBook({
      title: '',
      description: '',
      publishDate: null,
      pageCount: '',
      author: '',
      coverImage: null,
    });
    setPreviewUrl('');
    setEditMode(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentBook({ ...currentBook, coverImage: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData();
    Object.keys(currentBook).forEach(key => {
      if (key === 'coverImage' && currentBook[key] instanceof File) {
        formData.append('cover', currentBook[key]);
      } else if (key === 'publishDate' && currentBook[key]) {
        formData.append(key, currentBook[key].toISOString());
      } else if (currentBook[key] !== null) {
        formData.append(key, currentBook[key]);
      }
    });

    try {
      if (editMode) {
        await updateBook(currentBook._id, currentBook);
        showSnackbar('Book updated successfully');
      } else {
        await createBook(currentBook);
        showSnackbar('Book created successfully');
      }
      handleClose();
      fetchBooks();
    } catch (error) {
      showSnackbar(error.message || 'Error saving book', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(id);
        showSnackbar('Book deleted successfully');
        fetchBooks();
      } catch (error) {
        showSnackbar(error.message || 'Error deleting book', 'error');
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5">Books</Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpen()}
            >
              Add Book
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          {loading ? (
            <Paper sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {books.map((book) => (
                <Grid item xs={12} sm={6} md={4} key={book._id}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="200"
                      image={book.coverImagePath}
                      alt={book.title}
                      sx={{ objectFit: 'contain' }}
                    />
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {book.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {book.description}
                      </Typography>
                      <Typography variant="body2">
                        Author: {book.author.name}
                      </Typography>
                      <Typography variant="body2">
                        Pages: {book.pageCount}
                      </Typography>
                      <Typography variant="body2">
                        Published: {new Date(book.publishDate).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <IconButton onClick={() => handleOpen(book)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(book._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit Book' : 'Add Book'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              type="text"
              fullWidth
              value={currentBook.title}
              onChange={(e) => setCurrentBook({ ...currentBook, title: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              label="Description"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={currentBook.description}
              onChange={(e) => setCurrentBook({ ...currentBook, description: e.target.value })}
              required
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Author</InputLabel>
              <Select
                value={currentBook.author}
                onChange={(e) => setCurrentBook({ ...currentBook, author: e.target.value })}
                required
              >
                {authors.map((author) => (
                  <MenuItem key={author._id} value={author._id}>
                    {author.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Page Count"
              type="number"
              fullWidth
              value={currentBook.pageCount}
              onChange={(e) => setCurrentBook({ ...currentBook, pageCount: e.target.value })}
              required
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Publish Date"
                value={currentBook.publishDate}
                onChange={(date) => setCurrentBook({ ...currentBook, publishDate: date })}
                slotProps={{ textField: { fullWidth: true, margin: 'dense', required: true } }}
              />
            </LocalizationProvider>
            <input
              accept="image/*"
              type="file"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              id="cover-image-input"
            />
            <label htmlFor="cover-image-input">
              <Button
                variant="outlined"
                component="span"
                fullWidth
                sx={{ mt: 2 }}
              >
                Upload Cover Image
              </Button>
            </label>
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Cover preview"
                style={{
                  width: '100%',
                  maxHeight: '200px',
                  objectFit: 'contain',
                  marginTop: '16px',
                }}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={submitting}>Cancel</Button>
            <Button 
              type="submit" 
              color="primary"
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={20} /> : null}
            >
              {editMode ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Books; 