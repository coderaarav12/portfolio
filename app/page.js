const stats = [
  { label: "VISUAL INTENSITY", value: "MAX" },
  { label: "PORTFOLIO STATUS", value: "SOON" },
  { label: "DEPLOY TARGET", value: "CLOUDFLARE" },
];

export default function Home() {
  return (
    <main className="scene">
      <div className="bg-grid" />
      <div className="orb orb-one" />
      <div className="orb orb-two" />
      <div className="orb orb-three" />
      <section className="panel">
        <p className="eyebrow">AARAV GOEL</p>
        <h1>
          <span>Portfolio</span>
          <span>to be public soon</span>
        </h1>
        <p className="lede">
          An electric, high-energy teaser page built to feel loud, modern, and
          ready for Cloudflare.
        </p>
        <div className="stats">
          {stats.map((item) => (
            <article key={item.label} className="stat-card">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </article>
          ))}
        </div>
      </section>

      <div className="rings" aria-hidden="true">
        <div className="ring ring-a" />
        <div className="ring ring-b" />
        <div className="ring ring-c" />
      </div>

      <div className="ticker" aria-hidden="true">
        <span>AARAV GOEL PORTFOLIO TO BE PUBLIC SOON</span>
        <span>AARAV GOEL PORTFOLIO TO BE PUBLIC SOON</span>
        <span>AARAV GOEL PORTFOLIO TO BE PUBLIC SOON</span>
      </div>
    </main>
  );
}
