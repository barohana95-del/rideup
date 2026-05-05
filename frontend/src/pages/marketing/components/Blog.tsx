import { motion, Variants } from 'framer-motion'

const ArrowSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 18 14" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M16.8065 5.82872C14.3962 5.82872 12.1995 3.54151 12.1995 1.02981V0L10.2223 0V1.02981C10.2223 2.85669 10.9914 4.57028 12.1985 5.82872L0 5.82872L0 7.88833L12.1985 7.88833C10.9914 9.14676 10.2223 10.8604 10.2223 12.6872V13.717H12.1995V12.6872C12.1995 10.1755 14.3962 7.88833 16.8065 7.88833H17.7951V5.82872H16.8065Z"/>
  </svg>
)

const posts = [
  {
    id: 1,
    cat: 'טיפים',
    date: '5 במאי, 2026',
    title: 'איך לחסוך עד 30% בעלויות ההסעה לאירוע שלך',
    img: '/images/blog-1.png',
    href: '/onboarding'
  },
  {
    id: 2,
    cat: 'מדריכים',
    date: '2 במאי, 2026',
    title: 'למה אתר RSVP הוא הכרחי לכל חתונה ב-2026',
    img: '/images/blog-2.png',
    href: '/onboarding'
  },
  {
    id: 3,
    cat: 'תכנון',
    date: '28 באפריל, 2026',
    title: 'הסעות לאירועים: הטעויות שכולם עושים ואיך להימנע מהן',
    img: '/images/blog-3.png',
    href: '/onboarding'
  }
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}


export default function Blog() {
  return (
    <section id="blog" className="blog section" style={{ background: 'var(--color-pale)' }}>
      <div className="container">
        <motion.div 
          className="blog__header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <span className="eyebrow">מהבלוג שלנו</span>
            <h2 className="section-title">
              חדשות וטיפים לניהול אירועים חכם ומדויק
            </h2>
          </div>
          <a href="/onboarding" className="btn btn-outline">
            כל הכתבות <ArrowSvg />
          </a>
        </motion.div>

        <motion.div 
          className="blog__grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {posts.map(p => (
            <motion.a variants={cardVariants} key={p.id} href={p.href} className="blog-card">
              <div className="blog-card__img-wrap">
                <img src={p.img} alt={p.title} />
                <span className="blog-card__cat">{p.cat}</span>
              </div>
              <div className="blog-card__body">
                <span className="blog-card__date">{p.date}</span>
                <h3 className="blog-card__title">{p.title}</h3>
                <span className="blog-card__read">
                  קראו עוד <ArrowSvg />
                </span>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

