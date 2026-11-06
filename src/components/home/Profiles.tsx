import { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { Product } from '../../types/product';
import { ProfileCrossSectionSVG } from '../products/ProfileCrossSectionSVG';

// A size-ordered tour of the neon range, all drawn at the same scale.
const PICK = [
  'neon-flex-0306-sv-ty-ns0306v24p6',
  'neon-flex-0606-tv-ty-nt0606v24px',
  'neon-flex-0612-sv-ty-ns0612v24px',
  'neon-flex-3d-1010-ty-n3d1010v24p',
  'neon-flex-360-r13-ty-nr13v24px-c',
  'neon-flex-1220-sv-ty-ns1220v24px',
  'neon-flex-1615-tv-ty-nt1615v24px',
  'neon-flex-d16-tv-ty-ntd16v24px',
  'neon-flex-1617-tv-anti-glare-ugr-19-anti-glare-ty',
  'neon-flex-t1615-ty-nt1615ev24p',
  'neon-flex-1225-sv-ty-ns1225v24px',
  'neon-flex-2020-tv-ty-nt2020v24px',
  'neon-flex-360-r25-ty-nr25v24px-c',
  'neon-flex-3032-sv-ty-ns3032v24px',
  'neon-flex-360-r40-ty-nr40v24px-c',
  'neon-flex-5025-tv-ty-nt5025v24px',
];

const SCALE = 3.4;

function ArcCard({ p, i, pos, cardW }: { p: Product; i: number; pos: MotionValue<number>; cardW: number }) {
  const R = cardW * 4.2;
  const transform = useTransform(pos, (v) => {
    const dv = i - v;
    const a = dv * 0.3;
    const x = Math.sin(a) * R;
    const z = (Math.cos(a) - 1) * R;
    const y = (1 - Math.cos(a)) * -R * 0.4;
    const lift = Math.max(0, 1 - Math.abs(dv));
    return `translate3d(${x}px, ${y - lift * 20}px, ${z}px) rotateY(${a}rad) scale(${1 + lift * 0.12})`;
  });
  const opacity = useTransform(pos, (v) => Math.max(0, 1 - Math.max(0, Math.abs(i - v) - 2.6) * 1.2));
  const zIndex = useTransform(pos, (v) => 100 - Math.round(Math.abs(i - v) * 10));

  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{
        width: cardW,
        height: cardW * 1.3,
        marginLeft: -cardW / 2,
        marginTop: -cardW * 0.65,
        transform,
        opacity,
        zIndex,
        backfaceVisibility: 'hidden',
      }}
    >
      <Link
        to={`/product/${p.id}`}
        className="group flex h-full w-full flex-col overflow-hidden rounded-[26px] bg-ink text-canvas"
      >
        <div className="flex flex-1 items-center justify-center text-canvas">
          <ProfileCrossSectionSVG w={p.size.w} h={p.size.h} view={p.view} scale={SCALE} showDimensions={false} />
        </div>
        <div className="flex items-end justify-between px-5 pb-5">
          <div>
            <div className="font-display text-[18px] tracking-[-0.03em]">{p.model}</div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-canvas/50">
              {p.view === '360' ? `Ø ${p.size.w}` : `${p.size.w} × ${p.size.h}`} mm · {p.ip}
            </div>
          </div>
          <span className="grid h-8 w-8 place-items-center rounded-full bg-canvas/10 transition-all duration-500 ease-silk group-hover:bg-canvas group-hover:text-ink">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 9L9 3M9 3H4M9 3v5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export function Profiles({ products }: { products: Product[] }) {
  const ref = useRef<HTMLElement>(null);
  const items = useMemo(
    () => PICK.map((id) => products.find((p) => p.id === id)).filter((p): p is Product => Boolean(p)),
    [products],
  );
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const raw = useTransform(scrollYProgress, [0.05, 0.95], [0, items.length - 1]);
  const pos = useSpring(raw, { stiffness: 120, damping: 26, mass: 0.6 });
  const counter = useTransform(pos, (v) => String(Math.min(items.length, Math.round(v) + 1)).padStart(2, '0'));
  const bar = useTransform(scrollYProgress, [0.05, 0.95], ['0%', '100%']);
  const cardW = typeof window !== 'undefined' ? Math.round(Math.min(240, Math.max(170, window.innerWidth * 0.16))) : 220;

  return (
    <section ref={ref} id="profiles" className="relative" style={{ height: `${items.length * 38 + 60}vh` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        <div className="mx-auto flex w-full max-w-[1600px] items-end justify-between px-5 pt-28 sm:px-10">
          <div>
            <div className="micro mb-5">02 — Profiles</div>
            <h2 className="max-w-[14ch] font-display text-[clamp(36px,4.6vw,76px)] font-normal leading-[1] tracking-[-0.045em] text-ink">
              Every profile, drawn to scale.
            </h2>
          </div>
          <div className="hidden text-right sm:block">
            <div className="font-display text-[44px] font-light tabular-nums tracking-[-0.05em] text-ink">
              <motion.span>{counter}</motion.span>
              <span className="text-mute"> / {String(items.length).padStart(2, '0')}</span>
            </div>
            <div className="micro mt-1">3 mm to 50 mm · same scale</div>
          </div>
        </div>
        <div className="relative flex-1" style={{ perspective: 1800 }}>
          <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
            {items.map((p, i) => (
              <ArcCard key={p.id} p={p} i={i} pos={pos} cardW={cardW} />
            ))}
          </div>
        </div>
        <div className="mx-auto mb-10 flex w-full max-w-[1600px] items-center gap-6 px-5 sm:px-10">
          <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-ink/10">
            <motion.div style={{ width: bar }} className="h-full rounded-full bg-ink" />
          </div>
          <Link to="/products/neon-flex" className="pill-soft">
            All neon profiles
          </Link>
        </div>
      </div>
    </section>
  );
}
