import { featuredWorkers, workers } from '../../shared/workerCatalog.js';
import supriyaImage from '../assets/Clients/Supriya.png';
import nikeshImage from '../assets/Clients/nikesh.png';
import rajKedarImage from '../assets/Clients/Raj kedar.png';
import parthDeoreImage from '../assets/Clients/Parth Deore.jpeg';

export const fallbackServices = [
  { id: 'carpentry', name: 'Carpentry', description: 'Expert carpenters for furniture and fitting needs.', icon: 'tools' },
  { id: 'electrician', name: 'Electrician', description: 'Certified electricians for safe and quick solutions.', icon: 'bolt' },
  { id: 'plumbing', name: 'Plumbing', description: 'Experienced plumbers for repairs and installations.', icon: 'water' },
  { id: 'painting', name: 'Painting', description: 'Professional painters to beautify your spaces.', icon: 'paint' },
  { id: 'cleaning', name: 'Cleaning', description: 'Thorough home and office cleaning by skilled workers.', icon: 'broom' },
  { id: 'ac-repair', name: 'AC Repair', description: 'Fast air conditioning repair and maintenance.', icon: 'snowflake' },
  { id: 'masonry', name: 'Masonry', description: 'Skilled masons for construction and tiling work.', icon: 'hammer' },
  { id: 'gardening', name: 'Gardening', description: 'Garden maintenance and landscaping at your doorstep.', icon: 'leaf' },
];

export const fallbackWorkers = featuredWorkers;
export const fallbackCatalogWorkers = workers;

export const reviewImagesByLegacyPath = {
  '/src/assets/Clients/Supriya.png': supriyaImage,
  '/src/assets/Clients/nikesh.png': nikeshImage,
  '/src/assets/Clients/Raj kedar.png': rajKedarImage,
  '/src/assets/Clients/Parth Deore.jpeg': parthDeoreImage,
};

export const fallbackReviews = [
  { id: 'review-1', name: 'Supriya', imageUrl: supriyaImage, rating: 4.5, text: 'The carpenter I found via SkillConnect was incredibly skilled, affordable, reliable, and professional.' },
  { id: 'review-2', name: 'Nikesh Patil', imageUrl: nikeshImage, rating: 4.5, text: 'Within 20 minutes, I was connected to a verified electrician who arrived on time and fixed everything smoothly.' },
  { id: 'review-3', name: 'Raj Kedar', imageUrl: rajKedarImage, rating: 4.5, text: 'Booked a plumber through SkillConnect and had a smooth experience. He was polite, punctual, and precise.' },
  { id: 'review-4', name: 'Parth Deore', imageUrl: parthDeoreImage, rating: 4.5, text: 'The workers are verified, rates are fair, and service is top-tier. No endless waiting or shady freelancers.' },
];
