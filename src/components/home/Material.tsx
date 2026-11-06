import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';

const TEXT =
  'Co-extruded in Dow SILASTIC™ ET-7021 optical silicone. One seamless line of light — no dots, no shadows, IP67 to IP68, built to bend where architecture does.';

function Word({ word, i, total, progress }: { word: string; i: number; total: number; progress: MotionValue<number> }) {
  const start = i / total;
  const opacity = useTransform(progress, [start * 0.85, start * 0.85 + 0.12], [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block pr-[0.24em]">
      {word}
    </motion.span>
  );
}

export function Material() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.55'] });
  const words = TEXT.split(' ');

  return (
    <section ref={ref} className="mx-auto max-w-[1600px] px-5 py-[22vh] sm:px-10">
      <div className="micro mb-10">01 — Material</div>
      <p className="max-w-[22ch] font-display text-[clamp(36px,5.4vw,92px)] font-normal leading-[1.02] tracking-[-0.045em] text-ink">
        {words.map((w, i) => (
          <Word key={i} word={w} i={i} total={words.length} progress={scrollYProgress} />
        ))}
      </p>
      <div className="mt-20 grid grid-cols-2 gap-y-12 sm:grid-cols-4">
        {[
          ['2012', 'Founded in Shenzhen'],
          ['11,000 m²', 'Two factories'],
          ['260', 'People on the line'],
          ['50+', 'Export countries'],
        ].map(([n, l]) => (
          <div key={l}>
            <div className="font-display text-[clamp(36px,4vw,64px)] font-light tracking-[-0.05em] text-ink">{n}</div>
            <div className="micro mt-2">{l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
