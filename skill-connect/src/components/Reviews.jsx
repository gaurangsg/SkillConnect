import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

import { Pagination, Autoplay } from "swiper/modules";
import { FaStar, FaStarHalfAlt, FaQuoteRight } from "react-icons/fa";


const reviews = [

  {

    name: "Supriya",

    image: "/src/assets/Clients/Supriya.png", // ✅ Use public folder

    rating: 4.5,

    text: "I’ve never felt this confident hiring a technician before! 🛠️ The carpenter I found via SkillConnect was incredibly skilled and finished the wardrobe work ahead of time. Affordable, reliable, and professional. I’m never calling random service numbers again! 📱✅",

  },

  {

    name: "Nikesh Patil",

    image: "/src/assets/Clients/nikesh.png",

    rating: 4.5,

    text: "SkillConnect truly saved my day!💡 I had a sudden electrical issue, and within 20 minutes, I was connected to a verified electrician who arrived on time and fixed everything smoothly. The professionalism and speed blew me away. Highly recommend! 🔧⚡",

  },

  {

    name: "Raj Kedar",

    image: "/src/assets/Clients/Raj kedar.png",

    rating: 4.5,

    text: "Booked a plumber through SkillConnect and wow... what a smooth experience!🚿 He was polite, punctual, and fixed my bathroom leakage perfectly. Loved how simple the whole process was — just a few clicks and help was on the way. 🙌💧",

  },

  {

    name: "Parth Deore",

    image: "/src/assets/Clients/Parth Deore.jpeg",

    rating: 4.5,

    text: "From wiring issues to water leaks, SkillConnect is now my go-to!😍 The workers are verified, rates are fair, and service is top-tier. The best part? No endless waiting or shady freelancers. It’s all professional and punctual.🏠",

  },

  {

    name: "Nidhi Gupta",

    image: "https://plus.unsplash.com/premium_photo-1682089810582-f7b200217b67?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW5kaWFuJTIwZ2lybHxlbnwwfHwwfHx8MA%3D%3D",

    rating: 4.5,

    text: "Needed a house deep clean and booked through SkillConnect. 🧼 The cleaning team was well-equipped, courteous, and super thorough. My house is literally sparkling now ✨! Can’t believe I didn’t try this earlier. Total lifesaver! 🙏",



  },

  {

    name: "Ashwini Chauturvedi",

    image: "https://thumbs.dreamstime.com/b/simple-indian-girl-sweet-smile-happy-face-44021920.jpg",

    rating: 4.5,

    text: " Woke up to a busted water pipe 😩… Within 30 minutes of booking on SkillConnect, a certified plumber was at my doorstep. Polite, professional, and super fast! Can’t thank you enough! 👏🚰",



  },

  {

    name: "Kriti Rajput",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3tZKQnFkGEnjLtPOkg2J2eFCDge5V8fRubQ&s",
    rating: 4.5,
    text: "Was facing constant power cuts in one room… Booked an electrician via SkillConnect and BAM⚡— problem solved in no time. He even gave tips to avoid the issue in future. Super impressed! 🧠💡",

  },

  {

    name: "Neha Sharma",
    image: "https://media.istockphoto.com/id/1213705773/photo/beautiful-happy-indian-girl-enjoying-fresh-air-and-thinking.jpg?s=612x612&w=0&k=20&c=wgGfLvtfDH6oe9Pb4N50RnSxoxE8bP6vBNWj6LO4rbA=",
    rating: 4.5,
    text: "I was nervous hiring someone online, but SkillConnect changed the game for me. The technician fixed my geyser flawlessly! 🌡️🔥 The booking process was simple and transparent too. Loved it!",

  },

  {

    name: "Nitika Roy",
    image: "https://www.shutterstock.com/shutterstock/photos/2320794427/display_1500/stock-photo-a-beautiful-indian-girl-smiles-while-looking-girl-with-simple-make-up-2320794427.jpg",
    rating: 4.5,
    text: "Renovating my home was easier than ever thanks to SkillConnect! Got an interior painter, carpenter, and electrician — all from one place and fully reliable. This platform is a total blessing. 🙏",

  },

  {

    name: "Shweta Singh",
    image: "/Clients/Parth Deore.jpeg",
    rating: 4.5,
    text: "Usually calling a plumber used to be a headache 😩… SkillConnect made it painless and professional. The guy even cleaned up after finishing. That’s premium service right there! 🌟",

  },

  {

    name: "Sakshii Shukla",
    image: "/Clients/Parth Deore.jpeg",
    rating: 4.5,
    text: "SkillConnect brought me peace of mind 🧘! Every worker we booked — from AC servicing to wiring repair — was verified and trained. Zero fear of fraud or poor service. Just perfection! ✅🔌",

  },

  {

    name: "Puja singh",
    image: "/Clients/Parth Deore.jpeg",
    rating: 4.5,
    text: "Called a fridge mechanic through SkillConnect… and within the hour it was running like new! 🧊 The guy was so knowledgeable and had all tools with him. Best ₹ ever spent! 😎🛠️",

  },

  {

    name: "Smriti Singh",
    image: "/Clients/Parth Deore.jpeg",
    rating: 4.5,
    text: "SkillConnect is like Zomato for services 😂! Needed someone for kitchen sink repair — booked in 3 taps, guy came in 45 mins and solved it. Loved the hassle-free experience. ✨🍽️",

  },
];
const getStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  return (
    <div className="flex text-yellow-400 mt-1">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={i} />
      ))}
      {halfStar && <FaStarHalfAlt />}
    </div>
  );
};

const Reviews = () => {
  return (
    <section id="info" className="py-16 bg-gray-50">
      <div className="text-center mb-10">
        <h3 className="text-green-600 text-xl font-semibold">Customer's Review</h3>
        <h1 className="text-4xl font-bold text-gray-800 uppercase mt-2">What They Say</h1>
      </div>

      {/* ✅ Adjusted for near full-width with ~1cm margin */}
      <div className="max-w-[98%] mx-auto px-2 sm:px-4">
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          loop={true}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          modules={[Pagination, Autoplay]}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 h-full relative">
                <FaQuoteRight className="text-4xl text-gray-200 absolute top-4 right-4" />
                <div className="flex items-center gap-4">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">{review.name}</h3>
                    {getStars(review.rating)}
                  </div>
                </div>
                <p className="text-gray-700 mt-4 text-sm leading-relaxed">{review.text}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Reviews;