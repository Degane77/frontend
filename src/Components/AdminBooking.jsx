import { useEffect, useState } from 'react';
import { getAllBookings, getDoctorBookings, deleteBooking } from '../services/bookingService';

const AdminBooking = () => {
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [doctorId, setDoctorId] = useState('');
	const [deleting, setDeleting] = useState(null);
	const [error, setError] = useState('');

	const fetchBookings = async () => {
		setLoading(true);
		setError('');
		try {
			let res;
			if (doctorId) {
				res = await getDoctorBookings(doctorId);
			} else {
				res = await getAllBookings();
			}
			setBookings(res.data);
		} catch (err) {
			setError('Failed to fetch bookings');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchBookings();
		// eslint-disable-next-line
	}, [doctorId]);

	const handleDelete = async (id) => {
		if (!window.confirm('Are you sure you want to delete this booking?')) return;
		setDeleting(id);
		try {
			await deleteBooking(id);
			setBookings(bookings.filter(b => b._id !== id));
		} catch (err) {
			alert('Failed to delete booking');
		} finally {
			setDeleting(null);
		}
	};

	return (
		<div className="p-6">
			<h2 className="text-2xl font-bold mb-4">Admin Booking Management</h2>
			<div className="mb-4 flex gap-2 items-center">
				<input
					type="text"
					placeholder="Filter by Doctor ID (optional)"
					value={doctorId}
					onChange={e => setDoctorId(e.target.value)}
					className="border px-2 py-1 rounded"
				/>
				<button onClick={fetchBookings} className="bg-blue-500 text-white px-3 py-1 rounded">Refresh</button>
			</div>
			{loading ? (
				<div>Loading bookings...</div>
			) : error ? (
				<div className="text-red-500">{error}</div>
			) : (
				<div className="overflow-x-auto">
					<table className="min-w-full bg-white border rounded">
						<thead>
							<tr>
								<th className="px-2 py-1 border">Patient</th>
								<th className="px-2 py-1 border">Doctor</th>
								<th className="px-2 py-1 border">Date</th>
								<th className="px-2 py-1 border">Time</th>
								<th className="px-2 py-1 border">Status</th>
								<th className="px-2 py-1 border">Actions</th>
							</tr>
						</thead>
						<tbody>
							{bookings.map(booking => (
								<tr key={booking._id}>
									<td className="px-2 py-1 border">{booking.patient?.fullName || booking.patient}</td>
									<td className="px-2 py-1 border">{booking.doctor?.fullName || booking.doctor}</td>
									<td className="px-2 py-1 border">{new Date(booking.appointmentDate).toLocaleDateString()}</td>
									<td className="px-2 py-1 border">{booking.appointmentTime}</td>
									<td className="px-2 py-1 border">{booking.status}</td>
									<td className="px-2 py-1 border">
										<button
											className="bg-red-500 text-white px-2 py-1 rounded"
											onClick={() => handleDelete(booking._id)}
											disabled={deleting === booking._id}
										>
											{deleting === booking._id ? 'Deleting...' : 'Delete'}
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default AdminBooking;
