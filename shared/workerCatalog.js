const featuredWorkers = [
  {
    id: 'worker-1',
    name: 'Christine Williams',
    skill: 'Plumber',
    serviceId: 'plumbing',
    imageUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
    rating: 4.8,
    verified: true,
    featured: true,
    isDemo: true,
    experienceYears: 8,
    bio: 'A practical plumbing professional focused on repairs, fixture installations, and clear communication from the first visit.',
    specialties: ['Leak repairs', 'Fixture installation', 'Bathroom plumbing'],
    serviceAreas: ['Local service area'],
    languages: ['English'],
    responseTime: 'Usually replies within an hour',
  },
  {
    id: 'worker-2',
    name: 'Sofia York',
    skill: 'Site Observer',
    serviceId: 'masonry',
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500',
    rating: 4.7,
    verified: true,
    featured: true,
    isDemo: true,
    experienceYears: 6,
    bio: 'A detail-oriented site professional who helps coordinate masonry work and keep projects organized.',
    specialties: ['Site coordination', 'Work inspections', 'Project updates'],
    serviceAreas: ['Local service area'],
    languages: ['English'],
    responseTime: 'Usually replies within a few hours',
  },
  {
    id: 'worker-3',
    name: 'John Doe',
    skill: 'Electrician',
    serviceId: 'electrician',
    imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 4.9,
    verified: true,
    featured: true,
    isDemo: true,
    experienceYears: 10,
    bio: 'An electrician focused on household troubleshooting, safe installations, and straightforward service updates.',
    specialties: ['Electrical repairs', 'Lighting', 'Safety checks'],
    serviceAreas: ['Local service area'],
    languages: ['English'],
    responseTime: 'Usually replies within an hour',
  },
  {
    id: 'worker-4',
    name: 'Priya Sharma',
    skill: 'Painter',
    serviceId: 'painting',
    imageUrl: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=500',
    rating: 4.6,
    verified: true,
    featured: true,
    isDemo: true,
    experienceYears: 7,
    bio: 'A residential painter who helps customers plan clean finishes, careful preparation, and tidy project handovers.',
    specialties: ['Interior painting', 'Wall preparation', 'Color refreshes'],
    serviceAreas: ['Local service area'],
    languages: ['English', 'Hindi'],
    responseTime: 'Usually replies within a few hours',
  },
  {
    id: 'worker-5',
    name: 'David Brown',
    skill: 'Mason',
    serviceId: 'masonry',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500',
    rating: 4.8,
    verified: true,
    featured: true,
    isDemo: true,
    experienceYears: 12,
    bio: 'A masonry professional experienced in repair work, tile installation, and small construction projects.',
    specialties: ['Masonry repairs', 'Tile installation', 'Surface finishing'],
    serviceAreas: ['Local service area'],
    languages: ['English'],
    responseTime: 'Usually replies within an hour',
  },
  {
    id: 'worker-6',
    name: 'Emily Davis',
    skill: 'Welder',
    serviceId: 'masonry',
    imageUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=500',
    rating: 4.7,
    verified: true,
    featured: true,
    isDemo: true,
    experienceYears: 9,
    bio: 'A welding professional who handles metal repairs and custom fabrication with an emphasis on careful measurements.',
    specialties: ['Metal repairs', 'Gate fabrication', 'Welding'],
    serviceAreas: ['Local service area'],
    languages: ['English'],
    responseTime: 'Usually replies within a few hours',
  },
  {
    id: 'worker-7',
    name: 'Mike Smith',
    skill: 'Carpenter',
    serviceId: 'carpentry',
    imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500',
    rating: 4.8,
    verified: true,
    featured: true,
    isDemo: true,
    experienceYears: 11,
    bio: 'A carpenter specializing in practical home repairs, custom fittings, and furniture assembly.',
    specialties: ['Furniture assembly', 'Cabinet fitting', 'Door repairs'],
    serviceAreas: ['Local service area'],
    languages: ['English'],
    responseTime: 'Usually replies within an hour',
  },
  {
    id: 'worker-8',
    name: 'Aisha Ali',
    skill: 'Gardener',
    serviceId: 'gardening',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
    rating: 4.9,
    verified: true,
    featured: true,
    isDemo: true,
    experienceYears: 6,
    bio: 'A gardening professional who helps with routine maintenance, planting plans, and seasonal cleanups.',
    specialties: ['Garden maintenance', 'Planting', 'Seasonal cleanup'],
    serviceAreas: ['Local service area'],
    languages: ['English', 'Hindi'],
    responseTime: 'Usually replies within a few hours',
  },
];

const categories = [
  {
    id: 'carpentry',
    skill: 'Carpenter',
    specialties: ['Furniture assembly', 'Cabinet fitting', 'Door and hinge repair'],
    bio: 'Carpentry support for home repairs, installations, and made-to-measure projects.',
  },
  {
    id: 'electrician',
    skill: 'Electrician',
    specialties: ['Lighting installation', 'Wiring repairs', 'Electrical safety checks'],
    bio: 'Electrical help for household repairs, lighting upgrades, and safe installations.',
  },
  {
    id: 'plumbing',
    skill: 'Plumber',
    specialties: ['Leak repairs', 'Fixture installation', 'Drain troubleshooting'],
    bio: 'Plumbing support for leaks, fixtures, and everyday water-system repairs.',
  },
  {
    id: 'painting',
    skill: 'Painter',
    specialties: ['Interior painting', 'Surface preparation', 'Trim and touch-ups'],
    bio: 'Painting support for room refreshes, careful preparation, and clean finishes.',
  },
  {
    id: 'cleaning',
    skill: 'Cleaner',
    specialties: ['Deep cleaning', 'Move-in cleaning', 'Kitchen and bathroom care'],
    bio: 'Home cleaning support for regular upkeep and one-time deep cleans.',
  },
  {
    id: 'ac-repair',
    skill: 'AC Technician',
    specialties: ['AC diagnostics', 'Routine servicing', 'Cooling system repairs'],
    bio: 'Air-conditioning support for maintenance, troubleshooting, and installation.',
  },
  {
    id: 'masonry',
    skill: 'Mason',
    specialties: ['Tile installation', 'Wall repairs', 'Surface finishing'],
    bio: 'Masonry support for repairs, tiling, and small construction projects.',
  },
  {
    id: 'gardening',
    skill: 'Gardener',
    specialties: ['Garden maintenance', 'Planting', 'Seasonal cleanup'],
    bio: 'Gardening support for planting, maintenance, and outdoor-space refreshes.',
  },
];

const firstNames = [
  ['Aarav', 'men'], ['Ananya', 'women'], ['Rohan', 'men'], ['Isha', 'women'], ['Kabir', 'men'],
  ['Meera', 'women'], ['Arjun', 'men'], ['Diya', 'women'], ['Vihaan', 'men'], ['Kavya', 'women'],
  ['Aditya', 'men'], ['Nisha', 'women'], ['Reyansh', 'men'], ['Aditi', 'women'], ['Kunal', 'men'],
  ['Pooja', 'women'], ['Siddharth', 'men'], ['Tara', 'women'], ['Dev', 'men'], ['Sana', 'women'],
  ['Rahul', 'men'], ['Neha', 'women'], ['Ishaan', 'men'], ['Riya', 'women'], ['Manav', 'men'],
  ['Anika', 'women'], ['Varun', 'men'], ['Simran', 'women'], ['Yash', 'men'], ['Mira', 'women'],
];

const lastNames = [
  'Mehta', 'Desai', 'Kulkarni', 'Nair', 'Shah', 'Joshi', 'Patil', 'Rao', 'Kapoor', 'Iyer',
  'Malhotra', 'Das', 'Menon', 'Choudhary', 'Bansal', 'Khanna', 'Sethi', 'Naidu', 'Fernandes', 'Pillai',
  'Verma', 'Ghosh', 'Bhatia', 'Reddy', 'Sinha', 'Sen', 'Arora', 'Mishra', 'Jadhav', 'Dutta',
];

const featuredCounts = featuredWorkers.reduce((counts, worker) => {
  counts[worker.serviceId] = (counts[worker.serviceId] || 0) + 1;
  return counts;
}, {});

const demoWorkers = categories.flatMap((category, categoryIndex) => {
  const missingCount = Math.max(0, 30 - (featuredCounts[category.id] || 0));
  return Array.from({ length: missingCount }, (_value, index) => {
    const firstNameIndex = (index + categoryIndex * 3) % firstNames.length;
    const lastNameIndex = (index + categoryIndex * 7) % lastNames.length;
    const [firstName, gender] = firstNames[firstNameIndex];
    const experienceYears = 2 + ((index + categoryIndex * 3) % 16);
    const reviewCount = 8 + ((index * 17 + categoryIndex * 11) % 93);
    const rating = Number((4.3 + ((index * 13 + categoryIndex * 5) % 8) / 10).toFixed(1));
    const portrait = ((index * 7 + categoryIndex * 13) % 99) + 1;

    return {
      id: `demo-${category.id}-${String(index + 1).padStart(2, '0')}`,
      name: `${firstName} ${lastNames[lastNameIndex]}`,
      skill: category.skill,
      serviceId: category.id,
      imageUrl: `https://randomuser.me/api/portraits/${gender}/${portrait}.jpg`,
      rating,
      reviewCount,
      experienceYears,
      completedJobs: reviewCount * 2 + experienceYears * 4,
      responseTime: ['Usually replies within an hour', 'Usually replies within a few hours', 'Usually replies the same day'][(index + categoryIndex) % 3],
      bio: category.bio,
      specialties: category.specialties,
      serviceAreas: ['Local service area'],
      languages: ['English', 'Hindi'],
      verified: false,
      featured: false,
      isDemo: true,
    };
  });
});

export { featuredWorkers, demoWorkers };
export const workerCategoryIds = categories.map(({ id }) => id);
export const workers = [...featuredWorkers, ...demoWorkers];
