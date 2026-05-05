import './Projects.css'
import { motion } from 'framer-motion'
import { ArrowRight, Monitor, Smartphone, Layers } from 'lucide-react'

const projects = [
  {
    id: 1,
    title: 'Classic Elegance',
    category: 'חתונה',
    img: '/images/project-1.png',
    icon: <Layers size={18} />
  },
  {
    id: 2,
    title: 'Modern Industrial',
    category: 'עסקי',
    img: '/images/project-2.png',
    icon: <Monitor size={18} />
  },
  {
    id: 3,
    title: 'Luxury Gold',
    category: 'יוקרה',
    img: '/images/project-3.png',
    icon: <Smartphone size={18} />
  },
  {
    id: 4,
    title: 'Minimal Tech',
    category: 'הייטק',
    img: '/images/project-4.png',
    icon: <Layers size={18} />
  },
]

export default function Projects() {
  return (
    <section id="projects" className="projects-v2 section">
      <div className="container">
        <div className="projects-v2__header">
          <div className="projects-v2__header-left">
            <span className="eyebrow">העיצובים שלנו</span>
            <h2 className="section-title">בחרו את המראה המושלם לאתר שלכם</h2>
          </div>
          <p className="projects-v2__header-desc">
            מגוון תבניות פרימיום שניתן להתאים אישית לכל סוג אירוע. כל עיצוב מותאם מלא למובייל ולחוויית משתמש מקסימלית.
          </p>
        </div>
      </div>

      <div className="projects-v2__slider">
        <motion.div 
          className="projects-v2__track"
          animate={{ x: [0, -1400] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {[...projects, ...projects, ...projects].map((p, i) => (
            <div key={i} className="design-card">
              <div className="design-card__img-wrap">
                <img src={p.img} alt={p.title} />
                <div className="design-card__overlay">
                  <div className="design-card__badge">
                    {p.icon}
                    <span>{p.category}</span>
                  </div>
                  <h3 className="design-card__title">{p.title}</h3>
                  <a href="/onboarding" className="design-card__btn">
                    נסו עכשיו <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
