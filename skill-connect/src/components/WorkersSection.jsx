// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const workers = [
  {
    name: "Christine williams",
    skill: "Plumber",
    image: "https://randomuser.me/api/portraits/women/68.jpg"
    
  },
  {

    name: "Sofia york",
    skill: "Site Observer",
    image: "https://media.istockphoto.com/id/1346124943/photo/architect-working-on-digital-tablet-at-construction-site.jpg?s=612x612&w=0&k=20&c=5QcuHtYjE7A8ldDe-JJ7uyElhHCzhtZD-2P850mHhok="

  },
  {
    name: "John Doe",
    skill: "Electrician",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Priya Sharma",
    skill: "Painter",
    image:"https://st2.depositphotos.com/5653638/11527/i/950/depositphotos_115271504-stock-photo-indian-young-girl-with-paint.jpg",
  },
  {
    name: "David Brown",
    skill: "Mason",
    image: "https://www.shutterstock.com/shutterstock/photos/2060102003/display_1500/stock-photo-indian-construction-site-manager-standing-with-folded-arms-wearing-safety-vest-and-helmet-thinking-2060102003.jpg"
  },
  {
    name: "Emily Davis",
    skill: "Welder",
    image: "https://www.cwbweldingfoundation.org/wp-content/uploads/2022/08/wiw.png"
  },
  {
    name: "Mike Smith",
    skill: "Carpenter",
    image: "https://media.istockphoto.com/id/163204230/photo/young-construction-worker-carrying-wood-boards.jpg?s=612x612&w=0&k=20&c=fImTSVkOFQqwiyc2keRYbQQCOFfwSMMkrCCKN7d6ujY=",
  },
  {
    name: "Aisha Ali",
    skill: "Gardener",
    image: "https://c8.alamy.com/comp/MTY3N5/young-female-gardener-holding-pot-with-flowers-in-glasshouse-MTY3N5.jpg"
  },
  {
    name: "Liam Wilson",
    skill: "Chef",
    image: "https://www.shutterstock.com/image-photo/young-male-chef-isolated-on-600nw-710598367.jpg"
  },
  {
    name: "Olivia Johnson",
    skill: "Housekeeper",
    image: "https://media.istockphoto.com/id/530815822/photo/hispanic-woman-housekeeping.jpg?s=612x612&w=0&k=20&c=QDbfmECjDjtZvPIJ7n37oEq6MrRzgMbJ1tBBf6Q7u0c="

  },
  {
    name: "Ethan Martinez",
    skill: "Mechanic",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlEFS4iCGvUFmcvmKKwsm277_cirTM2lWdfQ&s"
  },
  {
    name: "Ava Garcia",
    skill: "Electrician",
    image: "https://www.shutterstock.com/image-photo/beautiful-female-construction-worker-on-260nw-268825181.jpg"
  },
];

const WorkersSection = () => {
  return (
    <section id="hire" className="min-h-screen bg-gray-100 py-20 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-12">Our Top Skilled Workers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {workers.map((worker, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-md p-6"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={worker.image}
                alt={worker.name}
                className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">{worker.name}</h3>
              <p className="text-gray-600">{worker.skill}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkersSection;