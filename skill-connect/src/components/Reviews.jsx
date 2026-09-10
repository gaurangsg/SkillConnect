import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { Autoplay, Pagination } from 'swiper/modules';
import { FaQuoteRight, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { getReviews } from '../api/client';

const getStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  return (
    <div className="flex text-yellow-400 mt-1">
      {[...Array(fullStars)].map((_, index) => <FaStar key={index} />)}
      {halfStar && <FaStarHalfAlt />}
    </div>
  );
};

const Reviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getReviews().then(setReviews);
  }, []);

  return (
    <section id="info" className="py-16 bg-gray-50">
      <div className="text-center mb-10">
        <h3 className="text-green-600 text-xl font-semibold">Customer&apos;s Review</h3>
        <h1 className="text-4xl font-bold text-gray-800 uppercase mt-2">What They Say</h1>
      </div>
      <div className="max-w-[98%] mx-auto px-2 sm:px-4">
        <Swiper slidesPerView={1} spaceBetween={20} loop pagination={{ clickable: true }} autoplay={{ delay: 3000, disableOnInteraction: false }} modules={[Pagination, Autoplay]} breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 }, 1280: { slidesPerView: 4 } }}>
          {reviews.map((review) => (
            <SwiperSlide key={review.id}>
              <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 h-full relative">
                <FaQuoteRight className="text-4xl text-gray-200 absolute top-4 right-4" />
                <div className="flex items-center gap-4">
                  <img src={review.imageUrl} alt={review.name} className="w-14 h-14 rounded-full object-cover" />
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
