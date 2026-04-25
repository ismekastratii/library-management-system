import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
} from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

function Navbar() {
  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <LibraryBooksIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ISME Library
          </Typography>
          <Button color="inherit" component={RouterLink} to="/">
            Home
          </Button>
          <Button color="inherit" component={RouterLink} to="/authors">
            Authors
          </Button>
          <Button color="inherit" component={RouterLink} to="/books">
            Books
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;