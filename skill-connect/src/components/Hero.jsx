import React from 'react';
const Hero = () => {
  return (
    <section id="home" className="relative w-full h-screen overflow-hidden">
      <video
  autoPlay
  muted
  loop
  playsInline
  className="absolute top-0 left-0 w-full h-full object-cover"
  src="/Background_Video.mp4"
/>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl text-white font-bold mb-6">
          Find Skilled Workers Instantly
        </h1>
        <input
          type="text"
          placeholder="Search for electricians, plumbers..."
          className="px-6 py-3 w-2/3 max-w-lg rounded-full text-white"
        />
      </div>


    </section>
  );
};

export default Hero;
