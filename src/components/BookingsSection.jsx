import { useEffect, useState } from 'react';
import { getBookings, updateBookingStatus } from '../api/client';

const formatDate = (value) => new Date(value).toLocaleString([], {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const BookingsSection = ({ token, role }) => {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) return;
    getBookings(token).then(setBookings).catch((error) => setMessage(error.message));
  }, [token]);

  if (!token) return null;

  const changeStatus = async (bookingId, status) => {
    try {
      await updateBookingStatus(token, bookingId, status);
      setBookings((current) => current.map((booking) => (
        booking._id === bookingId ? { ...booking, status } : booking
      )));
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <section id="bookings" className="bg-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-green-600 font-semibold">Your account</p>
            <h2 className="text-4xl font-bold">{role === 'worker' ? 'Assigned jobs' : 'My bookings'}</h2>
          </div>
          <span className="text-gray-500">{bookings.length} request{bookings.length === 1 ? '' : 's'}</span>
        </div>
        {message && <p className="text-red-600 mb-4">{message}</p>}
        {!bookings.length && !message && <p className="text-gray-600">{role === 'worker' ? 'Assigned jobs will appear here.' : 'Your booking requests will appear here.'}</p>}
        <div className="grid gap-4 md:grid-cols-2">
          {bookings.map((booking) => (
            <article key={booking._id} className="border border-gray-200 rounded-lg p-5 shadow-sm">
              <div className="flex justify-between gap-4">
                <div>
                  <p className="font-semibold">{booking.serviceId}</p>
                  <p className="text-sm text-gray-600">Worker: {booking.workerId}</p>
                </div>
                <span className="capitalize text-sm font-semibold text-green-700">{booking.status}</span>
              </div>
              <p className="mt-4 text-gray-700">{formatDate(booking.scheduledFor)}</p>
              <p className="text-gray-600">{booking.address}</p>
              <p className="mt-2 text-sm text-gray-600">{booking.description}</p>
              {role === 'worker' && booking.status === 'pending' && (
                <button type="button" onClick={() => changeStatus(booking._id, 'confirmed')} className="mt-4 mr-4 text-sm text-green-700 underline">
                  Confirm job
                </button>
              )}
              {role === 'worker' && booking.status === 'confirmed' && (
                <button type="button" onClick={() => changeStatus(booking._id, 'completed')} className="mt-4 mr-4 text-sm text-green-700 underline">
                  Mark completed
                </button>
              )}
              {role !== 'worker' && ['pending', 'confirmed'].includes(booking.status) && (
                <button type="button" onClick={() => changeStatus(booking._id, 'cancelled')} className="mt-4 text-sm text-red-600 underline">
                  Cancel booking
                </button>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookingsSection;