import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Box,
} from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PeopleIcon from '@mui/icons-material/People';

function Home() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to ISME Library
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          Manage your books and authors with ease
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <LibraryBooksIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Browse Books
            </Typography>
            <Typography color="textSecondary" paragraph>
              Explore our collection of books, add new ones, or manage existing entries.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              to="/books"
              size="large"
            >
              View Books
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <PeopleIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Manage Authors
            </Typography>
            <Typography color="textSecondary" paragraph>
              View all authors, add new authors, or update existing author information.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              to="/authors"
              size="large"
            >
              View Authors
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;