import { useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { createBooking, getWorkers } from '../api/client';

const serviceIds = { plumber: 'plumbing', electrician: 'electrician', painter: 'painting', mason: 'masonry', carpenter: 'carpentry', gardener: 'gardening' };

const WorkersSection = ({ token }) => {
  const [workers, setWorkers] = useState([]);
  const [search, setSearch] = useState('');
  const [bookingWorker, setBookingWorker] = useState(null);
  const [booking, setBooking] = useState({ scheduledFor: '', address: '', description: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    getWorkers(search).then(setWorkers);
  }, [search]);

  const submitBooking = async (event) => {
    event.preventDefault();
    setMessage('');
    try {
      const workerId = bookingWorker.id || bookingWorker._id;
      await createBooking(token, {
        workerId: String(workerId),
        serviceId: serviceIds[bookingWorker.skill.toLowerCase()] || 'electrician',
        scheduledFor: booking.scheduledFor,
        address: booking.address.trim(),
        description: booking.description.trim(),
      });
      setMessage('Booking request sent.');
      setBooking({ scheduledFor: '', address: '', description: '' });
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <section id="hire" className="min-h-screen bg-gray-100 py-20 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6">Our Top Skilled Workers</h2>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Filter by name or skill"
          className="mb-12 px-5 py-3 rounded-full border border-gray-300 w-full max-w-md"
          aria-label="Filter workers"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {workers.map((worker, index) => (
            <motion.div
              key={worker.id}
              className="bg-white rounded-lg shadow-md p-6"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ scale: 1.05 }}
            >
              <img src={worker.imageUrl} alt={worker.name} className="w-32 h-32 object-cover rounded-full mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{worker.name}</h3>
              <p className="text-gray-600">{worker.skill}</p>
              <button
                type="button"
                onClick={() => {
                  if (!token) {
                    setMessage('Sign in above to book a worker.');
                    return;
                  }
                  setMessage('');
                  setBookingWorker(worker);
                }}
                className="mt-4 bg-yellow-400 px-4 py-2 rounded font-semibold hover:bg-yellow-300"
              >
                Book worker
              </button>
            </motion.div>
          ))}
        </div>
        {!workers.length && <p className="mt-8 text-gray-600">No workers found.</p>}
        {message && <p className="mt-6 text-green-700">{message}</p>}
        {bookingWorker && (
          <form onSubmit={submitBooking} className="mt-10 max-w-xl mx-auto bg-white p-6 rounded-lg shadow text-left">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Book {bookingWorker.name}</h3>
              <button type="button" onClick={() => setBookingWorker(null)} aria-label="Close booking form" className="text-xl">&times;</button>
            </div>
            <input required type="datetime-local" value={booking.scheduledFor} onChange={(event) => setBooking({ ...booking, scheduledFor: event.target.value })} className="w-full border p-3 rounded mb-3" />
            <input required placeholder="Service address" value={booking.address} onChange={(event) => setBooking({ ...booking, address: event.target.value })} className="w-full border p-3 rounded mb-3" />
            <textarea required placeholder="Describe the work" value={booking.description} onChange={(event) => setBooking({ ...booking, description: event.target.value })} className="w-full border p-3 rounded mb-3" rows="3" />
            <button type="submit" className="bg-yellow-400 px-5 py-3 rounded font-semibold hover:bg-yellow-300">Send booking request</button>
          </form>
        )}
      </div>
    </section>
  );
};

export default WorkersSection;
