import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Paper, Box, Button, 
  TextField, CircularProgress, Alert, Grid
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const BookDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reservationDate, setReservationDate] = useState('');
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [reservationError, setReservationError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/books/${id}`);
        setBook(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch book details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleReserve = async () => {
    try {
      setReservationError(null);
      await api.post('/reservations', {
        book_id: id,
        pickup_date: reservationDate
      });
      setReservationSuccess(true);
      // Refresh book data to update availability
      const response = await api.get(`/books/${id}`);
      setBook(response.data);
    } catch (err) {
      setReservationError(err.response?.data?.message || 'Reservation failed');
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!book) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography>Book not found</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box
              component="img"
              src={book.cover_image || 'https://via.placeholder.com/300x450'}
              alt={book.title}
              sx={{ width: '100%', borderRadius: 1 }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h3" gutterBottom>
              {book.title}
            </Typography>
            <Typography variant="h5" gutterBottom>
              by {book.author}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Genre: {book.genre} | Published: {book.published_year}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Available Copies: {book.available_copies} / {book.total_copies}
            </Typography>
            <Typography variant="body1" paragraph sx={{ mt: 2 }}>
              {book.description || 'No description available.'}
            </Typography>

            {user && book.available_copies > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Reserve this book
                </Typography>
                <TextField
                  label="Pickup Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  value={reservationDate}
                  onChange={(e) => setReservationDate(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleReserve}
                  disabled={!reservationDate}
                >
                  Reserve Now
                </Button>
                {reservationSuccess && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    Book reserved successfully!
                  </Alert>
                )}
                {reservationError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {reservationError}
                  </Alert>
                )}
              </Box>
            )}

            {!user && (
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => navigate('/login')}
              >
                Login to Reserve
              </Button>
            )}

            {book.available_copies <= 0 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                This book is currently not available for reservation.
              </Alert>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default BookDetailsPage;