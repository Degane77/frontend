// components/HomeHero.jsx
import hospital from '../assets/hospital.jpg';

const HomeHero = () => {
  return (
    <div
      className="w-full h-[85vh] bg-cover bg-center flex items-center text-white px-6"
      style={{ backgroundImage: `linear-gradient(to right, rgba(0, 102, 255, 0.8), rgba(0, 102, 255, 0.2)), url(${hospital})` }}
    >
      <div className="max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">\          Your Path to Wellness<br />
          with Innovative Healthcare
        </h1>
        <p className="text-md md:text-lg mb-6">
          Welcome to our healthcare sanctuary, where your well-being takes center stage. Our dedicated
          team of medical experts is committed to providing exceptional care tailored to your needs.
          From preventive medicine to specialized treatments, we prioritize your health journey.
        </p>
        <div className="flex gap-4">
          <button className="bg-white text-blue-600 font-semibold px-6 py-2 rounded shadow hover:bg-blue-100 transition duration-200">
            Read More
          </button>
          <button className="flex items-center gap-2 border border-white px-6 py-2 rounded hover:bg-white hover:text-blue-600 transition duration-200">
            <span className="text-xl">▶</span> Watch Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeHero;
