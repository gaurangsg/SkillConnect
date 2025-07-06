import React from "react";
import Navbar from './components/Navbar';
import About from './components/About';
import Services from './components/ServicesSection';
import Workers from './components/WorkersSection';
import Hero from './components/Hero';
import Reviews from './components/Reviews';
import Footer from './components/Footer';


function App() {

  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Workers />
      {/* <Testimonials /> */}
      <Reviews />
      <Footer />
    </>

  );
}

export default App
