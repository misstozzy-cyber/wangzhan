import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { SEOHead } from '../components/common/SEOHead';

const SILK = [0.22, 1, 0.36, 1] as const;
const fac = (n: string) => `/assets/factory/lab_facility_${n}.webp`;

const CHAPTERS = [
  { n: '2012', l: 'Founded in Shenzhen', t: 'Started as a silicone neon specialist in Bao’an, Shenzhen.', img: fac('01') },
  { n: '11,000 m²', l: 'Two factories', t: 'Headquarters in Shajing, a second plant in Shiyan.', img: fac('13') },
  { n: '260', l: 'People', t: 'From LED packaging to the final reel, one team under one roof.', img: fac('07') },
  { n: '15', l: 'R&D engineers', t: 'Optical, structural and electronic design in-house.', img: fac('06') },
  { n: '50+', l: 'Export countries', t: 'Shipping to lighting designers and contractors worldwide.', img: fac('02') },
];

const PROCESS = [
  { t: 'LED packaging', d: 'Chips are packaged and binned in-house, so colour stays consistent from reel to reel.', img: fac('08') },
  { t: 'SMT assembly', d: 'Automated placement onto flexible circuit boards.', img: fac('16') },
  { t: 'Silicone co-extrusion', d: 'Dow SILASTIC™ ET-7021 optical silicone is extruded around the light engine in one seamless body.', img: fac('15') },
  { t: 'Ageing & waterproof testing', d: 'Reels are aged, then checked for IP67 / IP68 performance before packing.', img: fac('25') },
  { t: 'Photometry', d: 'Integrating sphere and goniophotometer measurements behind every datasheet and IES file.', img: fac('11') },
];

const LAB = [
  ['11', 'Integrating sphere'],
  ['20', 'Goniophotometer'],
  ['19', 'Temperature & humidity chamber'],
  ['23', 'UV weathering chamber'],
  ['24', 'Waterproof test chamber'],
  ['25', 'Immersion pressure tank'],
  ['26', 'Salt spray chamber'],
  ['27', 'Tensile tester'],
  ['21', 'Optical measuring system'],
  ['22', 'Drop tester'],
];

const CERTS = [
  'ISO 9001', 'ISO 14001', 'ISO 45001', 'ETL', 'TÜV CE', 'UKCA', 'RCM', 'RoHS', 'LM-80',
];

/** Vertical scroll drives a horizontal track of chapters. */
function Chapters() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], ['0%', `-${((CHAPTERS.length - 1) / CHAPTERS.length) * 100}%`]);
  return (
    <section ref={ref} className="relative" style={{ height: `${CHAPTERS.length * 80}vh` }}>
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <motion.div style={{ x, width: `${CHAPTERS.length * 100}vw` }} className="flex">
          {CHAPTERS.map((c, i) => (
            <div key={c.l} className="flex w-screen shrink-0 items-center px-5 sm:px-10">
              <div className="mx-auto grid w-full max-w-[1600px] items-center gap-8 lg:grid-cols-12">
                <div className="lg:col-span-6">
                  <div className="micro mb-4">{String(i + 1).padStart(2, '0')} / {String(CHAPTERS.length).padStart(2, '0')}</div>
                  <div className="whitespace-nowrap font-display text-[clamp(64px,10.5vw,200px)] font-light leading-[0.85] tracking-[-0.07em] text-ink">{c.n}</div>
                  <div className="mt-6 font-display text-[clamp(22px,2vw,32px)] tracking-[-0.03em] text-ink">{c.l}</div>
                  <p className="mt-2 max-w-[40ch] text-[15px] leading-relaxed text-graphite">{c.t}</p>
                </div>
                <div className="lg:col-span-6">
                  <div className="aspect-[4/3] overflow-hidden rounded-[40px] bg-stone">
                    <img src={c.img} alt={c.l} loading="lazy" className="h-full w-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/** Hover or tap a step; the image beside it changes like a slide projector. */
function Process() {
  const [active, setActive] = useState(0);
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-[16vh] sm:px-10">
      <div className="micro mb-5">How it is made</div>
      <h2 className="max-w-[16ch] font-display text-[clamp(36px,4.6vw,76px)] font-normal leading-[1] tracking-[-0.045em] text-ink">
        From chip to reel, under one roof.
      </h2>
      <div className="mt-14 grid gap-10 lg:grid-cols-12">
        <ol className="lg:col-span-6">
          {PROCESS.map((s, i) => (
            <li key={s.t}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className="group flex w-full items-baseline gap-6 rounded-[24px] px-4 py-5 text-left transition-colors duration-500 hover:bg-stone/40"
              >
                <span className={`font-mono text-[12px] transition-colors ${active === i ? 'text-ink' : 'text-mute'}`}>{String(i + 1).padStart(2, '0')}</span>
                <span className="flex-1">
                  <span className={`block font-display text-[clamp(24px,2.6vw,40px)] tracking-[-0.04em] transition-colors duration-500 ${active === i ? 'text-ink' : 'text-ink/30'}`}>
                    {s.t}
                  </span>
                  <AnimatePresence initial={false}>
                    {active === i && (
                      <motion.span
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: SILK }}
                        className="block overflow-hidden"
                      >
                        <span className="block max-w-[46ch] pt-2 text-[15px] leading-relaxed text-graphite">{s.d}</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </button>
            </li>
          ))}
        </ol>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[40px] bg-stone lg:sticky lg:top-28 lg:col-span-6 lg:self-start">
          <AnimatePresence initial={false}>
            <motion.img
              key={active}
              src={PROCESS[active].img}
              alt={PROCESS[active].t}
              initial={{ clipPath: 'inset(0 0 100% 0 round 40px)', scale: 1.1 }}
              animate={{ clipPath: 'inset(0 0 0% 0 round 40px)', scale: 1 }}
              exit={{ opacity: 0.6 }}
              transition={{ duration: 0.9, ease: SILK }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/** Certificates arrive as a fanned hand of cards and spread on hover. */
function Certificates() {
  const [spread, setSpread] = useState(false);
  const n = 9;
  return (
    <section className="overflow-hidden py-[14vh]">
      <div className="mx-auto max-w-[1600px] px-5 text-center sm:px-10">
        <div className="micro mb-5">Certified</div>
        <h2 className="mx-auto max-w-[18ch] font-display text-[clamp(36px,4.6vw,76px)] font-normal leading-[1] tracking-[-0.045em] text-ink">
          Tested to the standards your project asks for.
        </h2>
      </div>
      <div
        className="relative mx-auto mt-16 h-[clamp(260px,34vw,460px)] max-w-[1200px]"
        onMouseEnter={() => setSpread(true)}
        onMouseLeave={() => setSpread(false)}
        onClick={() => setSpread((s) => !s)}
      >
        {Array.from({ length: n }).map((_, i) => {
          const c = i - (n - 1) / 2;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 80, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              animate={{
                rotate: spread ? c * 3 : c * 7,
                x: `${c * (spread ? 105 : 22)}%`,
                y: spread ? Math.abs(c) * 6 : Math.abs(c) * 14,
              }}
              transition={{ type: 'spring', stiffness: 120, damping: 18, delay: spread ? 0 : 0.02 * i }}
              className="absolute left-1/2 top-0 aspect-[7/10] h-full -translate-x-1/2 origin-bottom"
              style={{ zIndex: 10 - Math.abs(Math.round(c)) }}
            >
              <img
                src={`/assets/certs/cert_0${i + 1}.webp`}
                alt={CERTS[i]}
                loading="lazy"
                className="h-full w-full rounded-[18px] bg-white object-cover shadow-[0_30px_60px_-30px_rgba(17,17,17,0.5)]"
              />
            </motion.div>
          );
        })}
      </div>
      <div className="mx-auto mt-14 flex max-w-[900px] flex-wrap justify-center gap-2 px-5">
        {CERTS.map((c) => (
          <span key={c} className="rounded-full bg-stone/60 px-4 py-2 text-[13px] text-graphite">{c}</span>
        ))}
      </div>
    </section>
  );
}

export const AboutPage: React.FC = () => {
  const words = ['Linear', 'light,', 'made', 'in', 'Shenzhen', 'since', '2012.'];
  return (
    <div className="pt-32">
      <SEOHead
        title="About · Factory, Lab & Certifications"
        description="Tyria Lighting has made silicone LED neon flex, LED strip and wall grazers in Shenzhen since 2012: 11,000 m² across two factories, 260 people, in-house lab and ISO-certified quality management."
        canonicalPath="/about"
      />

      {/* Opening line, word by word from behind a mask */}
      <section className="mx-auto max-w-[1600px] px-5 sm:px-10">
        <div className="micro mb-6">About Tyria</div>
        <h1 className="max-w-[14ch] font-display text-[clamp(52px,9vw,160px)] font-light leading-[0.9] tracking-[-0.065em] text-ink">
          {words.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1.1, ease: SILK, delay: 0.15 + i * 0.07 }}
                className="inline-block pr-[0.22em]"
              >
                {w}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: SILK, delay: 0.8 }}
          className="mt-10 max-w-[52ch] text-[17px] leading-relaxed text-graphite"
        >
          Shenzhen Tyria Lighting Technology Co., Ltd. designs and manufactures silicone LED neon flex, LED strip, wall
          grazers and backlit LED sheets for architectural and commercial lighting.
        </motion.p>
      </section>

      <Chapters />
      <Process />

      {/* Lab: staggered gallery */}
      <section className="mx-auto max-w-[1600px] px-5 py-[10vh] sm:px-10">
        <div className="micro mb-5">The lab</div>
        <h2 className="max-w-[16ch] font-display text-[clamp(36px,4.6vw,76px)] font-normal leading-[1] tracking-[-0.045em] text-ink">
          Every claim on a datasheet is measured here.
        </h2>
        <div className="mt-14 columns-2 gap-4 md:columns-3 lg:columns-5">
          {LAB.map(([n, t], i) => (
            <motion.figure
              key={n}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5% 0px' }}
              transition={{ duration: 0.9, ease: SILK, delay: (i % 5) * 0.06 }}
              className="mb-4 break-inside-avoid"
            >
              <div className="overflow-hidden rounded-[24px] bg-stone">
                <img src={fac(n)} alt={t} loading="lazy" className="w-full transition-transform duration-[1200ms] ease-silk hover:scale-[1.05]" />
              </div>
              <figcaption className="micro mt-2 px-1">{t}</figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      <Certificates />

      {/* Factories */}
      <section className="mx-auto max-w-[1600px] px-5 pb-[12vh] sm:px-10">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ['Factory 01 · Headquarters', 'Antonio Technology Park, Shajing, Bao’an, Shenzhen, China'],
            ['Factory 02', 'Shancheng Industrial Zone, Shiyan, Bao’an, Shenzhen, China'],
          ].map(([t, a]) => (
            <div key={t} className="rounded-card bg-paper p-8 sm:p-10">
              <div className="micro">{t}</div>
              <p className="mt-4 max-w-[30ch] font-display text-[clamp(22px,2vw,30px)] leading-snug tracking-[-0.03em] text-ink">{a}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-2">
          <Link to="/contact" className="pill-ink h-12 px-7">Visit or request a sample</Link>
          <Link to="/downloads" className="pill-soft h-12 px-6">Company catalogue</Link>
        </div>
      </section>
    </div>
  );
};
