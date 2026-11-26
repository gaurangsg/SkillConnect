import { useEffect, useState } from 'react';
import { Avatar, IconButton, Paper, Rating, Skeleton, Typography } from '@mui/material';
import { FaChevronLeft, FaChevronRight, FaQuoteLeft } from 'react-icons/fa';
import { A11y, Autoplay, Keyboard, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { getReviews } from '../api/client';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [swiper, setSwiper] = useState(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => { let active = true; getReviews().then((data) => { if (active) setReviews(data); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, []);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener?.('change', updatePreference);
    return () => preference.removeEventListener?.('change', updatePreference);
  }, []);

  const visibleReviews = reviews.slice(0, 6);

  return (
    <section id="reviews" className="section-pad reviews-section">
      <div className="section-wrap">
        <div className="eyebrow">Good work deserves a good word</div>
        <div className="section-heading-row" style={{ marginBottom: 10 }}>
          <div><h2 className="section-title">A little trust goes a long way.</h2><p className="section-copy">Hear from people who found the right help for their home.</p></div>
          <Rating value={4.5} precision={0.5} readOnly size="large" />
        </div>
        {loading ? (
          <div className="review-grid">
            {Array.from({ length: 3 }, (_, index) => <Paper key={index} className="review-card" elevation={0}><Skeleton width="32%" /><Skeleton height={80} /><Skeleton width="50%" /></Paper>)}
          </div>
        ) : visibleReviews.length > 0 && (
          <div className="review-carousel">
            <Swiper
              className="review-swiper"
              modules={[A11y, Autoplay, Keyboard, Pagination]}
              slidesPerView={1}
              spaceBetween={18}
              speed={reducedMotion ? 0 : 850}
              loop={visibleReviews.length > 3}
              autoplay={reducedMotion || visibleReviews.length < 2 ? false : {
                delay: 4200,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              keyboard={{ enabled: true, onlyInViewport: true }}
              pagination={{ clickable: true, dynamicBullets: true }}
              grabCursor
              breakpoints={{
                700: { slidesPerView: 2 },
                1080: { slidesPerView: 3 },
              }}
              onSwiper={setSwiper}
            >
              {visibleReviews.map((review) => (
                <SwiperSlide key={review.id || review._id} className="review-slide">
                  <Paper className="review-card" elevation={0}>
                    <FaQuoteLeft className="review-quote" />
                    <Typography className="review-copy">“{review.text}”</Typography>
                    <div className="review-person">
                      {review.imageUrl ? <img src={review.imageUrl} alt="" loading="lazy" /> : <Avatar>{review.name?.[0] || 'S'}</Avatar>}
                      <div><div className="review-name">{review.name}</div><Rating className="review-stars" value={Number(review.rating) || 0} precision={0.5} readOnly size="small" /></div>
                    </div>
                  </Paper>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="review-carousel-controls">
              <Typography variant="caption">Swipe, drag, or use the arrows to explore</Typography>
              <div className="review-carousel-arrows">
                <IconButton aria-label="Previous customer review" onClick={() => swiper?.slidePrev()} disabled={!swiper}>
                  <FaChevronLeft />
                </IconButton>
                <IconButton aria-label="Next customer review" onClick={() => swiper?.slideNext()} disabled={!swiper}>
                  <FaChevronRight />
                </IconButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
