import { useState, useEffect } from 'react';
import { 
  Container, Typography, Table, TableBody, 
  TableCell, TableContainer, TableHead, 
  TableRow, Paper, Chip, CircularProgress, Alert 
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const statusColors = {
  pending: 'default',
  approved: 'primary',
  rejected: 'error',
  completed: 'success',
};

const MyReservationsPage = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const response = await api.get('/reservations/my');
        setReservations(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch reservations. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchReservations();
    }
  }, [user]);

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

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Reservations
      </Typography>
      {reservations.length === 0 ? (
        <Typography>You have no reservations yet.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Book Title</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Reservation Date</TableCell>
                <TableCell>Pickup Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>{reservation.title}</TableCell>
                  <TableCell>{reservation.author}</TableCell>
                  <TableCell>
                    {new Date(reservation.reservation_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {reservation.pickup_date ? new Date(reservation.pickup_date).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={reservation.status} 
                      color={statusColors[reservation.status] || 'default'} 
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default MyReservationsPage;