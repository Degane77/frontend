import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaUserMd,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaBuilding,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
} from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_BASE_URL || ""; // e.g. http://localhost:5000

const SkeletonCard = () => (
  <div className="rounded-2xl border border-emerald-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 p-4 animate-pulse">
    <div className="h-40 rounded-xl bg-slate-200 dark:bg-slate-800" />
    <div className="mt-4 h-5 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
    <div className="mt-2 h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
    <div className="mt-4 space-y-2">
      <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800" />
      <div className="h-4 w-11/12 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="h-4 w-10/12 rounded bg-slate-200 dark:bg-slate-800" />
    </div>
    <div className="mt-4 grid grid-cols-2 gap-3">
      <div className="h-10 rounded-lg bg-slate-200 dark:bg-slate-800" />
      <div className="h-10 rounded-lg bg-slate-200 dark:bg-slate-800" />
    </div>
  </div>
);

const DoctorCard = ({ doctor }) => {
  const imgSrc = doctor?.doctorImage?.filename
    ? `${API_BASE || "http://localhost:5000"}/uploads/doctors/${doctor.doctorImage.filename}`
    : null;

  return (
    <div className="group bg-white/80 dark:bg-slate-900/70 rounded-2xl border border-emerald-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all overflow-hidden">
      {/* Media */}
      <div className="relative h-56 bg-gradient-to-br from-emerald-100 to-sky-100 dark:from-slate-800 dark:to-slate-900">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={doctor.fullName}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : null}
        {!imgSrc && (
          <div className="absolute inset-0 flex items-center justify-center">
            <FaUserMd className="text-5xl text-emerald-600/80 dark:text-emerald-400/70" />
          </div>
        )}

        {/* Badge */}
        <div className="absolute top-4 right-4">
          {doctor.isVerified ? (
            <span className="inline-flex items-center gap-1 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
              <FaCheckCircle /> Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
              <FaTimesCircle /> Pending
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight">{doctor.fullName}</h2>
        <p className="text-emerald-700 dark:text-emerald-300 font-medium mb-3">{doctor.specialty || '—'}</p>

        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          {doctor.educationLevel && (
            <div className="flex items-center gap-2">
              <FaGraduationCap className="text-emerald-500" />
              <span>{doctor.educationLevel}</span>
            </div>
          )}
          {doctor.workplace && (
            <div className="flex items-center gap-2">
              <FaBuilding className="text-emerald-500" />
              <span>{doctor.workplace}</span>
            </div>
          )}
          {doctor.phone && (
            <a href={`tel:${doctor.phone}`} className="flex items-center gap-2 hover:text-emerald-600">
              <FaPhone className="text-emerald-500" />
              <span>{doctor.phone}</span>
            </a>
          )}
          {doctor.email && (
            <a href={`mailto:${doctor.email}`} className="flex items-center gap-2 hover:text-emerald-600 truncate">
              <FaEnvelope className="text-emerald-500" />
              <span className="truncate">{doctor.email}</span>
            </a>
          )}
          {doctor.address && (
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-emerald-500" />
              <span className="truncate">{doctor.address}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          <a
            href={doctor.phone ? `tel:${doctor.phone}` : '#'}
            className={`inline-flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold transition ${
              doctor.phone
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            Contact
          </a>
          <Link
            to={`/doctor/${doctor._id}/book`}
            className="inline-flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold bg-sky-600 text-white hover:bg-sky-700 shadow"
          >
            <FaCalendarAlt /> Book
          </Link>
        </div>
      </div>
    </div>
  );
};

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [q, setQ] = useState("");
  const [specialty, setSpecialty] = useState("all");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/doctors` || '/api/doctors');
        if (!res.ok) throw new Error('Failed to fetch doctors');
        const data = await res.json();
        setDoctors(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError(err.message);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const specialties = useMemo(() => {
    const set = new Set();
    doctors.forEach(d => d?.specialty && set.add(d.specialty));
    return ['all', ...Array.from(set).sort()];
  }, [doctors]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return doctors.filter(d => {
      const matchesText = !term || [d.fullName, d.specialty, d.workplace, d.address]
        .filter(Boolean)
        .some(v => String(v).toLowerCase().includes(term));
      const matchesSpec = specialty === 'all' || d.specialty === specialty;
      return matchesText && matchesSpec;
    });
  }, [doctors, q, specialty]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-sky-50 dark:from-slate-950 dark:to-slate-900 p-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <p className="text-emerald-700 dark:text-emerald-300 font-semibold">Loading doctors…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 dark:bg-red-950">
        <div className="bg-red-100 dark:bg-red-900/40 px-6 py-4 rounded-lg text-red-800 dark:text-red-200 font-medium border border-red-200 dark:border-red-900">
          ❌ Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50 dark:from-slate-950 dark:to-slate-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-emerald-700 dark:text-emerald-300">
            Meet Our Doctors
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Expert Somali medical professionals dedicated to your health and wellness.
          </p>
        </div>

        {/* Controls */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, specialty, workplace…"
            className="w-full px-4 py-3 rounded-xl border border-emerald-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-emerald-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/80 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {specialties.map((s) => (
              <option key={s} value={s}>{s === 'all' ? 'All specialties' : s}</option>
            ))}
          </select>
          <div className="flex items-center justify-between p-3 rounded-xl border border-emerald-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300">
            <span className="text-sm">Results</span>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{filtered.length}</span>
          </div>
        </div>

        {/* Cards grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-emerald-200 dark:border-slate-800 rounded-2xl bg-white/60 dark:bg-slate-900/60">
            <FaUserMd className="text-6xl text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-100 mb-2">No Doctors Found</h3>
            <p className="text-slate-500 dark:text-slate-400">Try a different search or filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((doc) => (
              <DoctorCard key={doc._id} doctor={doc} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-emerald-600 to-sky-600 rounded-2xl p-10 text-white shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Need Help?</h2>
            <p className="text-base sm:text-lg mb-6 opacity-90">
              Our team is available to support your mental and physical health.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white text-emerald-700 hover:bg-slate-100 px-6 py-2 rounded-lg font-bold shadow-md"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorList;
