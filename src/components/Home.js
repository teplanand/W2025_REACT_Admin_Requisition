import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-100 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#00A3E0] to-[#007BFF] shadow-lg">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="https://storage.googleapis.com/a1aa/image/e745ff3c-7903-4672-6271-17773d43e058.jpg"
              alt="Tech Elecon Logo"
              className="w-12 h-12 rounded-full border-2 border-white"
            />
            <h1 className="text-3xl font-bold tracking-tight text-white">Tech Elecon</h1>
          </div>
          <Link to="/login">
            <button className="bg-white text-[#007BFF] hover:bg-gray-100 px-6 py-2 rounded-2xl font-semibold shadow-md transition-all duration-300">
              Login
            </button>
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <section className="flex flex-col-reverse md:flex-row items-center gap-12 max-w-7xl mx-auto">
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-5xl font-extrabold mb-6 leading-tight text-[#004d40] animate-fade-in">
              Empower Your Business with Tech Elecon
            </h2>
            <p className="text-gray-700 text-lg mb-6">
              Discover cutting-edge technology solutions crafted to elevate your business operations and accelerate growth.
            </p>
            <Link to="/login">
              <button className="bg-[#00A3E0] hover:bg-[#007BFF] text-white px-6 py-3 rounded-2xl font-semibold shadow-lg transition-transform transform hover:scale-105 duration-300">
                Get Started
              </button>
            </Link>
          </div>
          <div className="md:w-1/2">
            <img
              src="https://storage.googleapis.com/a1aa/image/f3083e0f-70f7-4dbd-0dc0-d3716459ba34.jpg"
              alt="Tech Solutions"
              className="w-full rounded-3xl shadow-2xl"
            />
          </div>
        </section>

        {/* Services */}
        <section className="mt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {[
            {
              title: "High-Speed DSL Broadband",
              desc: "Enjoy fast and reliable internet connectivity to support your business needs.",
              img: "https://storage.googleapis.com/a1aa/image/2c61ffa8-5d09-4dfa-7402-ed4f59278008.jpg"
            },
            {
              title: "CCTV Camera",
              desc: "Enhance security with advanced CCTV solutions for your premises.",
              img: "https://storage.googleapis.com/a1aa/image/cc2f8bb8-07df-4f7c-0758-7eb77de97e64.jpg"
            },
            {
              title: "Cloud Services",
              desc: "Access scalable and secure cloud infrastructure for your data needs.",
              img: "https://storage.googleapis.com/a1aa/image/674129f2-f769-426b-d69b-695a2d419629.jpg"
            }
          ].map((service, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition duration-300"
            >
              <img src={service.img} alt={service.title} className="w-24 h-24 mb-6" />
              <h3 className="text-2xl font-bold text-[#007BFF] mb-3">{service.title}</h3>
              <p className="text-gray-600">{service.desc}</p>
            </div>
          ))}
        </section>

        {/* Why Choose Us */}
        <section className="mt-24 text-center max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-10 text-[#004d40]">Why Choose Tech Elecon?</h2>
          <ul className="space-y-6 text-lg text-gray-700">
            {[
              "Expert team with years of industry experience",
              "Customized solutions tailored to your business",
              "Reliable customer support and maintenance",
              "Competitive pricing with transparent quotes"
            ].map((item, index) => (
              <li key={index} className="flex items-center justify-center gap-3">
                <i className="fas fa-check-circle text-[#00A3E0] text-2xl"></i>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-teal-50 to-blue-50 border-t border-gray-300 mt-24 py-8">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between text-sm text-gray-700">
          <p>© {new Date().getFullYear()} Tech Elecon. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            {["facebook-f", "twitter", "linkedin-in", "instagram"].map((icon, index) => (
              <a key={index} href="#" className="hover:text-[#007BFF] transition">
                <i className={`fab fa-${icon} fa-lg`}></i>
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
