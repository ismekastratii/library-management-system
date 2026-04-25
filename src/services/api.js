import { mockAuthors, mockBooks } from './mockData';

// Author API functions
export const getAuthors = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockAuthors;
};

export const createAuthor = async (author) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newAuthor = {
    _id: Date.now().toString(),
    ...author
  };
  mockAuthors.push(newAuthor);
  return newAuthor;
};

export const updateAuthor = async (id, author) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockAuthors.findIndex(a => a._id === id);
  if (index === -1) throw new Error('Author not found');
  mockAuthors[index] = { ...mockAuthors[index], ...author };
  return mockAuthors[index];
};

export const deleteAuthor = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockAuthors.findIndex(a => a._id === id);
  if (index === -1) throw new Error('Author not found');
  mockAuthors.splice(index, 1);
};

// Book API functions
export const getBooks = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockBooks;
};

export const createBook = async (book) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newBook = {
    _id: Date.now().toString(),
    ...book,
    coverImagePath: `https://source.unsplash.com/random/400x600?book,${encodeURIComponent(book.title)}`
  };
  mockBooks.push(newBook);
  return newBook;
};

export const updateBook = async (id, book) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockBooks.findIndex(b => b._id === id);
  if (index === -1) throw new Error('Book not found');
  mockBooks[index] = { ...mockBooks[index], ...book };
  return mockBooks[index];
};

export const deleteBook = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockBooks.findIndex(b => b._id === id);
  if (index === -1) throw new Error('Book not found');
  mockBooks.splice(index, 1);
}; 