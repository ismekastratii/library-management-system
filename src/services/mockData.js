// Mock data for authors
export const mockAuthors = [
  { _id: '1', name: 'John Doe', email: 'john@example.com' },
  { _id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  { _id: '3', name: 'Robert Johnson', email: 'robert@example.com' },
];

// Mock data for books
export const mockBooks = [
  {
    _id: '1',
    title: 'The Great Adventure',
    description: 'An epic journey through unknown lands.',
    publishDate: new Date('2023-01-15'),
    pageCount: 342,
    author: mockAuthors[0],
    coverImagePath: 'https://source.unsplash.com/random/400x600?book,adventure'
  },
  {
    _id: '2',
    title: 'Mystery of the Lost City',
    description: 'A thrilling mystery set in an ancient civilization.',
    publishDate: new Date('2023-06-22'),
    pageCount: 288,
    author: mockAuthors[1],
    coverImagePath: 'https://source.unsplash.com/random/400x600?book,mystery'
  },
  {
    _id: '3',
    title: 'Modern Programming',
    description: 'A comprehensive guide to modern programming practices.',
    publishDate: new Date('2023-11-30'),
    pageCount: 520,
    author: mockAuthors[2],
    coverImagePath: 'https://source.unsplash.com/random/400x600?book,programming'
  },
]; 