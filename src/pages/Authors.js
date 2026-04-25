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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAuthors, createAuthor, updateAuthor, deleteAuthor } from '../services/api';

function Authors() {
  const [authors, setAuthors] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentAuthor, setCurrentAuthor] = useState({ name: '', email: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    setLoading(true);
    try {
      const data = await getAuthors();
      setAuthors(data);
    } catch (error) {
      showSnackbar('Error fetching authors', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (author = null) => {
    if (author) {
      setCurrentAuthor(author);
      setEditMode(true);
    } else {
      setCurrentAuthor({ name: '', email: '' });
      setEditMode(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentAuthor({ name: '', email: '' });
    setEditMode(false);
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
    try {
      if (editMode) {
        await updateAuthor(currentAuthor._id, currentAuthor);
        showSnackbar('Author updated successfully');
      } else {
        await createAuthor(currentAuthor);
        showSnackbar('Author created successfully');
      }
      handleClose();
      fetchAuthors();
    } catch (error) {
      showSnackbar(error.message || 'Error saving author', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this author?')) {
      try {
        await deleteAuthor(id);
        showSnackbar('Author deleted successfully');
        fetchAuthors();
      } catch (error) {
        showSnackbar(error.message || 'Error deleting author', 'error');
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5">Authors</Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpen()}
            >
              Add Author
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          {loading ? (
            <Paper sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Paper>
          ) : (
            <Paper>
              <List>
                {authors.map((author) => (
                  <ListItem key={author._id}>
                    <ListItemText
                      primary={author.name}
                      secondary={author.email}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => handleOpen(author)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" onClick={() => handleDelete(author._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? 'Edit Author' : 'Add Author'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              type="text"
              fullWidth
              value={currentAuthor.name}
              onChange={(e) => setCurrentAuthor({ ...currentAuthor, name: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              value={currentAuthor.email}
              onChange={(e) => setCurrentAuthor({ ...currentAuthor, email: e.target.value })}
              required
            />
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

export default Authors;