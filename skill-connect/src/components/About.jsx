// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const About = () => {
  return (
    <motion.section
      id="about"
      className="min-h-screen flex items-center justify-center bg-black text-white px-6"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="max-w-3xl text-center">
        <h2 className="text-4xl font-bold mb-6">About SkillConnect</h2>
        <p className="text-lg leading-relaxed">
          SkillConnect connects you with the best skilled workers — electricians, plumbers,
          carpenters, and many more — at just a click. Trusted by thousands of happy customers,
          we make hiring effortless, quick, and reliable.
        </p>
      </div>
    </motion.section>
  );
};

export default About;
