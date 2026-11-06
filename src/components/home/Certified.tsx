const CERTS = ['ISO 9001', 'ISO 14001', 'ISO 45001', 'UL', 'ETL', 'TÜV CE', 'UKCA', 'RoHS'];

export function Certified() {
  const row = [...CERTS, ...CERTS];
  return (
    <section className="py-[12vh]">
      <div className="mx-auto mb-10 max-w-[1600px] px-5 sm:px-10">
        <div className="micro">06 — Certified</div>
      </div>
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="flex w-max animate-[marquee_38s_linear_infinite] gap-4">
          {row.map((c, i) => (
            <span
              key={i}
              className="whitespace-nowrap rounded-full bg-paper px-8 py-5 font-display text-[clamp(28px,3.4vw,56px)] font-light tracking-[-0.04em] text-ink shadow-[0_20px_40px_-30px_rgba(17,17,17,0.35)]"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-[1600px] px-5 text-[14px] text-graphite sm:px-10">
        Quality, environmental and safety management certified. Product listings for North America, Europe and the UK.
      </p>
    </section>
  );
}
