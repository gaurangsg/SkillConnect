import { useEffect, useState } from 'react';
import { Avatar, Paper, Rating, Skeleton, Typography } from '@mui/material';
import { FaQuoteLeft } from 'react-icons/fa';
import { getReviews } from '../api/client';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { let active = true; getReviews().then((data) => { if (active) setReviews(data); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, []);

  return (
    <section id="reviews" className="section-pad reviews-section">
      <div className="section-wrap">
        <div className="eyebrow">Good work deserves a good word</div>
        <div className="section-heading-row" style={{ marginBottom: 10 }}>
          <div><h2 className="section-title">A little trust goes a long way.</h2><p className="section-copy">Hear from people who found the right help for their home.</p></div>
          <Rating value={4.5} precision={0.5} readOnly size="large" />
        </div>
        <div className="review-grid">
          {loading ? Array.from({ length: 3 }, (_, index) => <Paper key={index} className="review-card" elevation={0}><Skeleton width="32%" /><Skeleton height={80} /><Skeleton width="50%" /></Paper>) : reviews.slice(0, 6).map((review) => (
            <Paper key={review.id || review._id} className="review-card" elevation={0}>
              <FaQuoteLeft className="review-quote" />
              <Typography className="review-copy">“{review.text}”</Typography>
              <div className="review-person">
                {review.imageUrl ? <img src={review.imageUrl} alt="" loading="lazy" /> : <Avatar>{review.name?.[0] || 'S'}</Avatar>}
                <div><div className="review-name">{review.name}</div><Rating className="review-stars" value={Number(review.rating) || 0} precision={0.5} readOnly size="small" /></div>
              </div>
            </Paper>
          ))}
        </div>
      </div>
    </section>
  );
}
