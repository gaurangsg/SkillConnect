
import { motion as Motion } from 'framer-motion';

const steps = [
  { number: '01', title: 'Tell us what you need', copy: 'Choose a service and share a few details about the job.' },
  { number: '02', title: 'Find the right person', copy: 'Explore profiles and choose a skilled professional for your project.' },
  { number: '03', title: 'Book and keep track', copy: 'Pick a time, send your request, and follow the updates in your account.' },
];

export default function HowItWorks() {
  return <section id="how-it-works" className="section-pad steps-section"><div className="section-wrap"><div className="eyebrow" style={{ color: '#b0ed7b' }}>Less back and forth. More done.</div><h2 className="section-title">The next step is always clear.</h2><p className="section-copy">From the first search to the booking update, SkillConnect keeps the process straightforward.</p><div className="steps-grid">{steps.map((step, index) => <Motion.article key={step.number} className="step-card" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .45, delay: index * .08 }}><div className="step-number">{step.number}</div><div className="step-title">{step.title}</div><div className="step-copy">{step.copy}</div></Motion.article>)}</div></div></section>;
}
