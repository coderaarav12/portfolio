import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import TextCursor from './TextCursor';
import './style.css';

const Navigation = createContext(() => {});
const ambience = { context: null, nodes: [], timers: [], noiseBuffer: null };
function stopSoundscape() {
  ambience.timers.forEach(window.clearInterval);
  ambience.timers = [];
  ambience.nodes.forEach(node => { try { node.stop?.(); } catch {} try { node.disconnect(); } catch {} });
  ambience.nodes = [];
  if (ambience.context) ambience.context.suspend().catch(() => {});
}
function startSoundscape(kind) {
  stopSoundscape();
  if (kind === 'off') return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  const context = ambience.context || (ambience.context = new AudioContextClass());
  context.resume().catch(() => {});
  const master = context.createGain();
  master.gain.setValueAtTime(0, context.currentTime);
  master.gain.linearRampToValueAtTime(.14, context.currentTime + .8);
  master.connect(context.destination);
  ambience.nodes.push(master);
  const keep = node => { ambience.nodes.push(node); return node; };
  const noise = (low, high, amount) => {
    if (!ambience.noiseBuffer) {
      ambience.noiseBuffer = context.createBuffer(1, context.sampleRate * 3, context.sampleRate);
      const data = ambience.noiseBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }
    const source = keep(context.createBufferSource()); source.buffer = ambience.noiseBuffer; source.loop = true;
    const highPass = keep(context.createBiquadFilter()); highPass.type = 'highpass'; highPass.frequency.value = low;
    const lowPass = keep(context.createBiquadFilter()); lowPass.type = 'lowpass'; lowPass.frequency.value = high;
    const gain = keep(context.createGain()); gain.gain.value = amount;
    source.connect(highPass).connect(lowPass).connect(gain).connect(master); source.start();
  };
  const tone = (frequency, duration = 1.5, wave = 'sine', volume = .14, cutoff = 1500) => {
    const oscillator = context.createOscillator(); oscillator.type = wave; oscillator.frequency.value = frequency;
    const filter = context.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = cutoff;
    const gain = context.createGain(); const now = context.currentTime;
    gain.gain.setValueAtTime(.0001, now); gain.gain.exponentialRampToValueAtTime(volume, now + .045); gain.gain.exponentialRampToValueAtTime(.0001, now + duration);
    oscillator.connect(filter).connect(gain).connect(master); oscillator.start(now); oscillator.stop(now + duration + .05);
    oscillator.onended = () => { oscillator.disconnect(); filter.disconnect(); gain.disconnect(); };
  };
  if (kind === 'rain') noise(520, 7200, .17);
  if (kind === 'forest') {
    noise(120, 950, .12);
    const chirp = () => { const start = 1900 + Math.random() * 1800; tone(start, .18 + Math.random() * .22, 'sine', .055, 5000); tone(start * (1.16 + Math.random() * .18), .2, 'sine', .035, 5000); };
    ambience.timers.push(window.setInterval(chirp, 2500 + Math.random() * 2200));
  }
  if (kind === 'waterfall') noise(75, 1650, .22);
  if (kind === 'lofi') {
    noise(1000, 4200, .018);
    const chords = [[146.83, 174.61, 220], [110, 138.59, 164.81], [130.81, 164.81, 196], [98, 123.47, 146.83]];
    let step = 0; const play = () => { chords[step++ % chords.length].forEach((note, i) => tone(note, 2.1, 'triangle', i === 0 ? .16 : .085, 950)); tone(55, .18, 'sine', .08, 180); };
    play(); ambience.timers.push(window.setInterval(play, 2400));
  }
  if (kind === 'rock') {
    const chords = [[82.41, 123.47, 164.81], [73.42, 110, 146.83], [65.41, 98, 130.81], [73.42, 110, 146.83]];
    let step = 0; const play = () => { chords[step++ % chords.length].forEach((note, i) => tone(note, .78, 'sawtooth', i === 0 ? .17 : .09, 680)); tone(55, .12, 'triangle', .14, 180); };
    play(); ambience.timers.push(window.setInterval(play, 900));
  }
}
const profile = {
  name: 'Aarav Goel',
  email: 'goelaarav290@gmail.com',
  phone: '+919500554947',
  alternatePhone: '+919873004947',
  github: 'https://github.com/coderaarav12',
  linkedin: 'https://www.linkedin.com/in/aaravgoel12/',
  resume: '/Aarav-Goel-Resume.pdf',
  photo: '/aarav-portrait.png',
};

const projects = [
  {
    id: '01', slug: 'greatmedia', name: 'GreatMedia', eyebrow: 'MediaHub · Movies / TV / Anime', type: 'Full-stack media browser', date: '2026',
    image: '/greatmedia-home.png', live: 'https://greatmedia-hub.pages.dev',
    repos: [
      { label: 'Frontend', url: 'https://github.com/coderaarav12/media-hub-frontend' },
      { label: 'Backend / API', url: 'https://github.com/coderaarav12/media-hub-api' },
    ],
    lead: 'Movies, television, and anime in one place.',
    body: 'Search, trending picks, show details, episodes, and playback sources in one dark media browser.',
    problem: 'Movies, series, and anime are scattered across catalogs. GreatMedia brings discovery together.',
    contribution: 'A fast single-page browser backed by a serverless API for TMDB and AniList metadata.',
    facts: ['HTML / CSS / JavaScript', 'Node.js / Express serverless API', 'TMDB / AniList · Cloudflare Pages / Vercel'],
    status: 'Live product', mark: 'G', tint: 'blue',
  },
  {
    id: '02', slug: 'edutechsrm', name: 'EdutechSRM', eyebrow: 'SRMIST · Student platform', type: 'Full-stack academic dashboard', date: 'Mar 2026 — now',
    image: '/edutechsrm-home.png', live: 'https://www.edutechsrm.in',
    repos: [{ label: 'Full-stack repository', url: 'https://github.com/coderaarav12/edutechsrm-frontend-in' }],
    lead: 'A student dashboard for the everyday mechanics of university life.',
    body: 'Attendance, marks, CGPA, timetables, and campus tools brought into one responsive dashboard.',
    problem: 'University information is scattered. EdutechSRM brings a student daily essentials together.',
    contribution: 'A Next.js PWA with Cloudflare Worker APIs, Zoho SSO, and a Playwright fallback. It does not store student passwords.',
    facts: ['Next.js 16 / TypeScript / Tailwind', 'Cloudflare Workers / OpenNext', 'Zoho SSO / PWA / Playwright fallback'],
    status: 'Live · 250+ active users', mark: 'E', tint: 'coral', heroTint: 'sage',
  },
];

const hackathons = [
  { date: 'MANIPAL / SEP 2026', name: 'Ripple', focus: 'Regional medicine shortage detection and redistribution.', constraint: 'A low stock level alone is noise. Coordinated shortages need to be seen across geography and time.', build: 'Consumption velocity, confidence-bounded stock runways, and geospatial clustering in a decision-facing map.', stack: 'FastAPI · Pandas · NumPy · SciPy · scikit-learn · Leaflet', source: 'https://github.com/4rch1t/ripple' },
  { date: 'SIH / SEP 2026', name: 'SyncMasters', focus: 'CPSE material intelligence and procurement data standardization.', constraint: 'Fragmented raw-material names make aggregation and shared procurement difficult across organizations.', build: 'An ingestion and extraction pipeline using OCR and local vision models to normalize records into a unified material database.', stack: 'React · Cloudflare Workers / D1 · FastAPI · Ollama · Llama 3.2 Vision', source: 'https://github.com/coderaarav12/SIH2026' },
  { date: 'AUG 2026', name: 'TrustOS', focus: 'Evidence-led integrity for remote assessments.', constraint: 'A detection score is hard to trust without the signals that support it.', build: 'A prototype joining browser signals, face and hand behavior, and multi-agent analysis into an explainable score.', stack: 'Chrome extension · FastAPI · multi-agent analysis', source: 'https://github.com/coderaarav12/Hackathon-TrustOS' },
];

const certificates = [
  { title: 'AI Fundamentals', issuer: 'Google · Coursera', date: 'May 2026', id: '8YPOZH4YAEMI', image: '/certificates/images/8YPOZH4YAEMI.jpg', pdf: '/certificates/ai-fundamentals-google.pdf', verify: 'https://coursera.org/account/accomplishments/records/8YPOZH4YAEMI' },
  { title: 'Object Oriented Programming with C++', issuer: 'Microsoft · Coursera', date: 'May 2026', id: 'DIAVK96YVZDV', image: '/certificates/images/DIAVK96YVZDV.jpg', pdf: '/certificates/object-oriented-programming-cpp-microsoft.pdf', verify: 'https://coursera.org/account/accomplishments/records/DIAVK96YVZDV' },
  { title: 'Python for Data Science, AI & Development', issuer: 'IBM · Coursera', date: 'Dec 2025', id: 'WGD2ICSMNBZS', image: '/certificates/images/WGD2ICSMNBZS.jpg', verify: 'https://coursera.org/account/accomplishments/records/WGD2ICSMNBZS' },
  { title: 'ENDURO — Software Training & Inner Personality Development workshop', issuer: 'ENDURO · IIT Hyderabad', date: 'Aug–Sep 2025', id: 'EN251633', image: '/certificates/images/enduro-certificate.jpg', verify: 'https://www.linkedin.com/in/aaravgoel12/details/certifications/' },
  { title: 'Programming with C++', issuer: 'Simplilearn · Coursera', date: 'Jul 2025', id: 'TQSK59BDIBQ4', image: '/certificates/images/TQSK59BDIBQ4.jpg', verify: 'https://coursera.org/account/accomplishments/verify/TQSK59BDIBQ4' },
  { title: 'The Fundamentals of RDMA Programming', issuer: 'NVIDIA · Coursera', date: 'Jul 2025', id: 'KN4PJG9RWP0H', image: '/certificates/images/KN4PJG9RWP0H.jpg', verify: 'https://coursera.org/account/accomplishments/records/KN4PJG9RWP0H' },
];

const education = [
  { date: '2017 — 2025', title: 'Vedritam Group · DAV schools', detail: 'Schooling in Physics, Chemistry, Mathematics, and Engineering Graphics.', logo: '/logos/dav-group.png', logoAlt: 'DAV Group Chennai emblem' },
  { date: '2025 — 2029', title: 'SRMIST KTR', detail: 'Bachelor of Technology in Computer Science, specializing in AI/ML. Currently in semester three.', current: true, logo: '/logos/srmist.webp', logoAlt: 'SRM Institute of Science and Technology emblem' },
];

const campusRoles = [
  { date: 'OCT 2025 — MAY 2026', title: 'Design Intern · Cherry+ Network', detail: 'Created promotional creatives, event content, and digital media while working with the team to maintain the organization’s visual identity.', logo: '/logos/cherry-plus.jpg', logoAlt: 'Cherry+ Network logo' },
  { date: 'MAY 2026 — NOW', title: 'Design Manager · Cherry+ Network', detail: 'Leads design strategy and visual identity for a campus community platform. Coordinates design workflows, cross-functional teams, and brand consistency; also mentors junior designers. Received special recognition and a double elevation.', current: true, logo: '/logos/cherry-plus.jpg', logoAlt: 'Cherry+ Network logo' },
  { date: 'SEP 2026 — NOW', title: 'PR Team Member · Directorate of Alumni Affairs, SRM', detail: 'Supports alumni event communications, promotion, outreach, and digital content.', current: true, logo: '/logos/srm-alumni.jpg', logoAlt: 'SRMIST Alumni Association logo' },
];

const aboutPhoto = { src: '/gallery/04-formal.jpeg', alt: 'Aarav in a suit' };

function useNavigation() { return useContext(Navigation); }
function InternalLink({ href, children, className = '', onClick, ...props }) {
  const navigate = useNavigation();
  return <a href={href} className={className} onClick={event => { onClick?.(event); if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; event.preventDefault(); navigate(href); }} {...props}>{children}</a>;
}
function ExternalLink({ href, children, className = '', ...props }) { return <a className={`arrow-link ${className}`} href={href} target="_blank" rel="noreferrer" {...props}>{children}<span aria-hidden="true">↗</span></a>; }
function ParticleText({ text, particleSize = 2.2, density = 4, color = '#152421', highlightColor = '#e06a4b', scatter = 190, gatherDuration = 1600, stagger = 420, pointerRepel = 42, repelRadius = 120, idleDrift = .8, onClickBurst = true }) {
  const canvasRef = React.useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const styles = getComputedStyle(canvas);
    const resolvedColor = styles.color || color;
    const resolvedHighlight = getComputedStyle(document.documentElement).getPropertyValue('--coral').trim() || highlightColor;
    const buffer = document.createElement('canvas');
    const bufferContext = buffer.getContext('2d', { willReadFrequently: true });
    let particles = [];
    let width = 0;
    let height = 0;
    let ratio = 1;
    let frame = 0;
    let pointer = { x: -1000, y: -1000, speed: 0, previousX: -1000, previousY: -1000 };
    let burst = null;
    let startedAt = performance.now();
    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      width = bounds.width;
      height = bounds.height;
      ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      buffer.width = Math.round(width * ratio);
      buffer.height = Math.round(height * ratio);
      const source = bufferContext;
      source.setTransform(ratio, 0, 0, ratio, 0, 0);
      source.clearRect(0, 0, width, height);
      let size = Math.min(124, width * .085, height * .48);
      source.textAlign = 'left';
      source.textBaseline = 'middle';
      source.font = `800 ${size}px 'DM Sans', sans-serif`;
      const gap = size * -.055;
      const splitAt = text.lastIndexOf(' ');
      const lead = text.slice(0, splitAt + 1);
      const tail = text.slice(splitAt + 1);
      const leadWidth = source.measureText(lead).width;
      const tailWidth = source.measureText(tail).width;
      const total = leadWidth + tailWidth + gap;
      if (total > width * .96) {
        size *= (width * .96) / total;
        source.font = `800 ${size}px 'DM Sans', sans-serif`;
      }
      const scaledLead = source.measureText(lead).width;
      const scaledTail = source.measureText(tail).width;
      const scaledGap = size * -.055;
      const startX = Math.max(0, (width - scaledLead - scaledTail - scaledGap) / 2);
      source.fillStyle = resolvedColor;
      source.fillText(lead, startX, height / 2);
      source.fillStyle = resolvedHighlight;
      source.fillText(tail, startX + scaledLead + scaledGap, height / 2);
      const pixels = source.getImageData(0, 0, buffer.width, buffer.height).data;
      const step = Math.max(2.8, density * .8);
      particles = [];
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const px = Math.floor(x * ratio);
          const py = Math.floor(y * ratio);
          const offset = (py * buffer.width + px) * 4;
          if (pixels[offset + 3] > 100 && Math.random() > .14) {
            particles.push({ x: x + (Math.random() - .5) * step, y: y + (Math.random() - .5) * step, ox: (Math.random() - .5) * scatter, oy: (Math.random() - .5) * scatter, delay: Math.random() * stagger, coral: pixels[offset] > pixels[offset + 2] * 1.18 });
          }
        }
      }
      startedAt = performance.now();
    };
    const draw = now => {
      ctx.clearRect(0, 0, width, height);
      const elapsed = now - startedAt;
      const burstAge = burst ? now - burst.time : Infinity;
      particles.forEach((point, index) => {
        const progress = reducedMotion ? 1 : Math.max(0, Math.min(1, (elapsed - point.delay) / gatherDuration));
        const eased = progress * progress * (3 - 2 * progress);
        let x = point.x + point.ox * (1 - eased);
        let y = point.y + point.oy * (1 - eased);
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (!reducedMotion && distance < repelRadius && distance > 0) {
          const push = (1 - distance / repelRadius) * pointerRepel;
          x += dx / distance * push;
          y += dy / distance * push;
        }
        if (!reducedMotion && idleDrift) {
          x += Math.sin(now * .001 + index * .17) * idleDrift;
          y += Math.cos(now * .0012 + index * .11) * idleDrift;
        }
        if (!reducedMotion && burstAge < 650 && burst) {
          const bx = x - burst.x;
          const by = y - burst.y;
          const bd = Math.max(1, Math.hypot(bx, by));
          if (bd < 220) {
            const force = (1 - burstAge / 650) * (1 - bd / 220) * 46;
            x += bx / bd * force;
            y += by / bd * force;
          }
        }
        const movingHighlight = !reducedMotion && pointer.speed > .7 && distance < repelRadius;
        ctx.fillStyle = movingHighlight ? resolvedHighlight : point.coral ? resolvedHighlight : resolvedColor;
        ctx.beginPath();
        ctx.arc(x, y, particleSize * .78, 0, Math.PI * 2);
        ctx.fill();
      });
      pointer.speed *= .84;
      frame = window.requestAnimationFrame(draw);
    };
    const onPointerMove = event => {
      const bounds = canvas.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      pointer.speed = Math.hypot(x - pointer.previousX, y - pointer.previousY);
      pointer.previousX = x;
      pointer.previousY = y;
      pointer.x = x;
      pointer.y = y;
    };
    const onPointerLeave = () => { pointer.x = -1000; pointer.y = -1000; pointer.speed = 0; };
    const onPointerDown = event => {
      if (!onClickBurst || reducedMotion) return;
      const bounds = canvas.getBoundingClientRect();
      burst = { x: event.clientX - bounds.left, y: event.clientY - bounds.top, time: performance.now() };
    };
    resize();
    frame = window.requestAnimationFrame(draw);
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerleave', onPointerLeave);
    canvas.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('pointerdown', onPointerDown);
    };
  }, [text, particleSize, density, color, highlightColor, scatter, gatherDuration, stagger, pointerRepel, repelRadius, idleDrift, onClickBurst]);
  return <canvas ref={canvasRef} className="welcome-particle-canvas" aria-hidden="true"/>;
}
function Header({ route, soundscape, onSoundscapeChange }) {
  const [menu, setMenu] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [soundOpen, setSoundOpen] = useState(false);
  const contactRef = React.useRef(null);
  const soundRef = React.useRef(null);
  useEffect(() => {
    const closeOutside = event => { if (!contactRef.current?.contains(event.target)) setContactOpen(false); if (!soundRef.current?.contains(event.target)) setSoundOpen(false); };
    const closeEscape = event => { if (event.key === 'Escape') { setContactOpen(false); setSoundOpen(false); } };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeEscape);
    return () => { document.removeEventListener('pointerdown', closeOutside); document.removeEventListener('keydown', closeEscape); };
  }, []);
  const nav = [
    { label: 'Projects', href: '/projects', active: route.startsWith('/projects') || route.startsWith('/project/') || route.startsWith('/archive') },
    { label: 'About', href: '/about', active: route === '/about' },
    { label: 'Certificates', href: '/certificates', active: route === '/certificates' },
  ];
  const sounds = [['off','Sound off'],['rain','Rain'],['forest','Forest'],['waterfall','Waterfall'],['lofi','Lo-fi'],['rock','Rock']];
  const selectedSound = sounds.find(([value]) => value === soundscape)?.[1] || 'Sound off';
  return <><header className="site-header"><InternalLink className="monogram" href="/" aria-label="Aarav Goel home">AG<span>°</span></InternalLink><nav aria-label="Main navigation">{nav.map(item => <InternalLink className={item.active ? 'nav-active' : ''} key={item.label} href={item.href}>{item.label}</InternalLink>)}</nav><div className="header-right-controls"><div className="header-sound" ref={soundRef}><button className="availability header-sound-trigger" type="button" aria-expanded={soundOpen} aria-haspopup="menu" aria-controls="header-sound-menu" onClick={() => setSoundOpen(value => !value)}><span aria-hidden="true">♫</span>{soundscape === 'off' ? 'SOUND' : selectedSound.toUpperCase()}</button><div className={`header-sound-menu${soundOpen ? ' is-open' : ''}`} id="header-sound-menu" role="menu" aria-hidden={!soundOpen}>{sounds.map(([value,label])=><button key={value} type="button" role="menuitemradio" aria-checked={soundscape===value} className={soundscape===value?'is-selected':''} onClick={()=>{onSoundscapeChange(value);setSoundOpen(false)}}><span>{label}</span><i>{soundscape===value?'✓':''}</i></button>)}</div></div><div className="header-contact" ref={contactRef}><button className="availability" type="button" aria-expanded={contactOpen} aria-controls="header-contact-menu" onClick={() => setContactOpen(value => !value)}>Let’s connect</button><div className={`header-contact-menu${contactOpen ? ' is-open' : ''}`} id="header-contact-menu" aria-hidden={!contactOpen}><p>CONTACT LINKS</p><a href={`mailto:${profile.email}`}><span>EMAIL</span><strong>{profile.email}</strong><b>↗</b></a><a href={profile.github} target="_blank" rel="noreferrer"><span>GITHUB</span><strong>coderaarav12</strong><b>↗</b></a><a href={profile.linkedin} target="_blank" rel="noreferrer"><span>LINKEDIN</span><strong>aaravgoel12</strong><b>↗</b></a></div></div></div><button className="menu" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-label="Toggle navigation">{menu ? 'Close' : 'Menu'}</button></header>{menu && <div className="mobile-nav">{nav.map(item => <InternalLink key={item.label} href={item.href} onClick={() => setMenu(false)}>{item.label}</InternalLink>)}<a href={`mailto:${profile.email}`}>Get in touch ↗</a></div>}</>;
}
function Portrait({ className = '' }) {
  const alphaSampler = React.useRef(null);
  const handlePointerMove = event => {
    const image = event.currentTarget.querySelector('img');
    if (!image?.complete || !image.naturalWidth) return;
    if (!alphaSampler.current) {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      context.drawImage(image, 0, 0);
      alphaSampler.current = { canvas, context };
    }
    const bounds = image.getBoundingClientRect();
    const x = Math.floor((event.clientX - bounds.left) * image.naturalWidth / bounds.width);
    const y = Math.floor((event.clientY - bounds.top) * image.naturalHeight / bounds.height);
    const inside = x >= 0 && y >= 0 && x < image.naturalWidth && y < image.naturalHeight;
    const opaque = inside && alphaSampler.current.context.getImageData(x, y, 1, 1).data[3] > 24;
    event.currentTarget.classList.toggle('is-photo-hovered', opaque);
  };
  const clearPointer = event => event.currentTarget.classList.remove('is-photo-hovered');
  return <figure className={`portrait-frame ${className}`} tabIndex="0" onPointerMove={handlePointerMove} onPointerLeave={clearPointer}><div className="portrait-image-wrap"><img src={profile.photo} alt="Aarav Goel" /></div><figcaption><span>CHENNAI, INDIA</span><span>AARAV GOEL</span></figcaption></figure>;
}
function SiteVideoBackground() {
  return <div className="site-video-background" aria-hidden="true"><video autoPlay muted loop playsInline preload="metadata"><source src="/portfolio-background.mp4" type="video/mp4"/></video></div>;
}
function SiteFooter() { return <footer className="site-footer"><div className="footer-main"><TextCursor text="Aarav Goel" mode="stamp" fontSize={28} spacing={88} maxPoints={7} shrink={0.5} fade={0.6} smoothing={0.3} exitDuration={0.5} removalInterval={30} followMouseDirection keepUpright randomFloat popIn hideCursor={false}/><p className="section-number">LET’S BUILD SOMETHING USEFUL</p><h2>Have a real<br/><em>problem?</em></h2><a className="mail" href={`mailto:${profile.email}`}>{profile.email} <span>↗</span></a><div className="footer-socials"><ExternalLink href={profile.github}>GitHub</ExternalLink><ExternalLink href={profile.linkedin}>LinkedIn</ExternalLink><InternalLink className="arrow-link" href="/about">About & contact <span>↗</span></InternalLink></div></div><div className="footer-end"><span>© 2026 AARAV GOEL</span><InternalLink href="/">BACK TO HOME PAGE ↑</InternalLink></div></footer>; }
function PageFrame({ children, route }) { const fallback = !document.startViewTransition; return <div className={`page-transition${fallback ? ' page-transition-fallback' : ''}`} key={route}>{children}</div>; }
function Reveal({ children, className = '', delay = 0 }) {
  const ref = React.useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) { node.classList.add('is-visible'); return undefined; }
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { node.classList.add('is-visible'); observer.disconnect(); } }, { threshold: .12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} style={{ '--reveal-delay': `${delay}s` }} className={`reveal ${className}`}>{children}</div>;
}
function ProjectVisual({ project }) { return <div className={`project-visual has-screenshot ${project.tint}`}><img src={project.image} alt={`${project.name} interface screenshot`} loading="lazy" decoding="async"/><div className="project-visual-caption"><span>{project.eyebrow}</span><span>FRONTEND + BACKEND ↗</span></div></div>; }

function HomePage() {
  return <><main id="top"><section className="hero home-hero"><p className="eyebrow hero-reveal">PORTFOLIO / 2026—27 &nbsp; · &nbsp; CHENNAI, INDIA</p><Portrait className="hero-portrait hero-reveal delay-2"/><div className="hero-layout"><h1 className="hero-reveal delay-1">I build the <em>useful</em><br/><span className="hero-tail">part.</span></h1><div className="hero-note hero-reveal delay-2"><p>Aspiring Software Engineer and AI/ML student building digital products that turn messy, real-world systems into something people can use.</p><div><InternalLink href="/projects/live">See my two builds <b>↓</b></InternalLink><ExternalLink href={profile.github}>Check my GitHub</ExternalLink></div></div></div><div className="hero-bottom hero-reveal delay-3"><span>ASPIRING SOFTWARE ENGINEER</span><span>AI / ML EXPERIMENTS</span><span>HACKATHON BUILDER</span></div></section>
    <section className="home-route-list" aria-label="Explore the portfolio">
      <InternalLink className="home-destination-card home-project-destination" href="/projects" aria-label="Explore projects">
        <div className="home-destination-art home-project-art" aria-hidden="true"><img src={projects[0].image} alt="" loading="lazy"/><img src={projects[1].image} alt="" loading="lazy"/></div>
        <div className="home-destination-copy"><h2><span>Projects</span><em>&amp; Products.</em></h2><b aria-hidden="true">↗</b></div>
      </InternalLink>
      <InternalLink className="home-destination-card home-about-destination" href="/about" aria-label="About Aarav Goel">
        <div className="home-destination-art home-about-art" aria-hidden="true"><img src={aboutPhoto.src} alt="" loading="lazy"/></div>
        <div className="home-destination-copy"><h2><span>About</span><em>Aarav Goel.</em></h2><b aria-hidden="true">↗</b></div>
      </InternalLink>
    </section>
    <section className="home-hackathon-preview"><div className="home-hackathon-heading"><h2>Built under<br/><em>a deadline.</em></h2><p>Hackathons are their own kind of work: fast teams, real constraints, and prototypes made to test an idea.</p><InternalLink className="arrow-link" href="/projects/hackathons">Explore the hackathon archive <span>↗</span></InternalLink></div><div className="home-hackathon-cards">{hackathons.slice(0,2).map((item,index)=><InternalLink className="home-hackathon-card" href="/projects/hackathons" key={item.name}><span>0{index+1} / {item.date}</span><strong>{item.name}</strong><p>{item.focus}</p><b>OPEN ARCHIVE ↗</b></InternalLink>)}</div></section>
    <section className="home-certificates-cta" aria-label="Certificates and credentials"><InternalLink href="/certificates" aria-label="Explore certificates and credentials"><span className="home-certificates-copy"><small>COURSES · CREDENTIALS · PROOF OF LEARNING</small><strong>Certificates<br/><em>&amp; credentials.</em></strong></span><b aria-hidden="true">↗</b></InternalLink></section>
    <SkillsTextPath/>
    <GithubContributionCalendar/>
  </main><SiteFooter/></>;
}

function SkillsTextPath() {
  const skills = 'Python ✦ C++ ✦ JavaScript ✦ TypeScript ✦ React ✦ Next.js ✦ Node.js ✦ Tailwind CSS ✦ Cloudflare Workers ✦ GitHub ✦ AI / ML ✦ Data Science ✦ FastAPI ✦ Product Engineering ✦';
  return <section className="skills-path-section" aria-label="Languages, frameworks, and AI / ML">
    <div className="skills-path-viewport" aria-label={skills.replaceAll(' ✦ ', ', ')}>
      <svg className="skills-path-svg" viewBox="0 0 1440 240" role="img" aria-hidden="true" preserveAspectRatio="none">
        <defs><path id="skills-flow-path" d="M-40 154 C 190 52, 360 52, 570 142 S 955 232, 1160 124 S 1375 45, 1500 118"/></defs>
        <text><textPath href="#skills-flow-path" startOffset="0%">{skills}{skills}<animate attributeName="startOffset" from="0%" to="-50%" dur="34s" repeatCount="indefinite"/></textPath></text>
      </svg>
    </div>
  </section>;
}

function ProjectRow({ project: p, index = 0 }) {
  return <Reveal className={`project project-${p.id}`} delay={index * .04}><div className="project-index">{p.id}<span>{p.type}</span></div><InternalLink className="project-image-link" href={`/project/${p.slug}`} aria-label={`Read ${p.name} case study`}><ProjectVisual project={p}/></InternalLink><div className="project-copy"><p className="project-status">{p.status}</p><p className="project-eyebrow">{p.eyebrow}</p><h3><InternalLink href={`/project/${p.slug}`}>{p.name}</InternalLink></h3><h4>{p.lead}</h4><p className="body-copy">{p.body}</p><ul>{p.facts.map(x => <li key={x}>{x}</li>)}</ul><div className="project-links"><InternalLink className="arrow-link" href={`/project/${p.slug}`}>From problem to build <span>→</span></InternalLink>{p.live && <ExternalLink href={p.live}>Live product</ExternalLink>}{p.repos.map(repo => <ExternalLink href={repo.url} key={repo.label}>{repo.label}</ExternalLink>)}</div></div></Reveal>;
}
function ProjectsPage() {
  return <><main className="projects-page"><section className="route-hero projects-route-hero"><p className="section-number">01 / LIVE PROJECTS · 2026</p><h1>Two builds.<br/><em>Front to back.</em></h1><p>One media browser and one student platform. Built across the interface, the APIs, and the systems behind them.</p><span className="route-index">PRODUCT FILES ↓</span></section><section className="projects route-projects" aria-label="Full-stack projects">{projects.map((p, index) => <ProjectRow project={p} key={p.id} index={index}/>)}</section><section className="github-invite"><p className="section-number">THE REST OF THE REPOSITORY</p><h2>More experiments<br/><em>live on GitHub.</em></h2><ExternalLink href={profile.github}>Browse GitHub</ExternalLink></section></main><SiteFooter/></>;
}

function ProjectsHub() {
  return <><main className="archive-hub"><section className="archive-hub-intro"><p className="section-number">01 / PROJECTS</p><h1>Choose a<br/><em>trail to follow.</em></h1><p>Explore the live products I built, or follow the hackathon archive for experiments made under pressure.</p></section><div className="archive-hub-grid"><InternalLink href="/projects/live" className="archive-hub-card archive-hub-projects"><span>01 / LIVE PROJECTS</span><div><p>Full-stack products</p><h2>Made to<br/><em>be useful.</em></h2></div><b>EXPLORE LIVE PROJECTS ↗</b></InternalLink><InternalLink href="/projects/hackathons" className="archive-hub-card archive-hub-hackathons"><span>02 / HACKATHON ARCHIVE</span><div><p>Rapid builds · team challenges</p><h2>Made under<br/><em>pressure.</em></h2></div><b>OPEN HACKATHON ARCHIVE ↗</b></InternalLink></div></main><SiteFooter/></>;
}

function ArchivePage() {
  return <HackathonArchivePage/>;
}

function HackathonArchivePage() {
  return <><main className="archive-page"><section className="route-hero archive-route-hero"><p className="section-number">02 / PROJECTS · HACKATHON ARCHIVE</p><h1>Hackathons are<br/><em>their own story.</em></h1><p>Compressed timelines, team decisions, rough edges, and ideas worth carrying forward.</p><span className="route-index">ARCHIVE ENTRIES ↓</span></section><section className="archive archive-route-content"><div className="archive-heading"><p className="section-number">THE RECORD</p><h2>Work under<br/>constraints<span>.</span></h2><p>Prototypes made with a team, a clock, and a specific problem to make smaller.</p></div><div className="entries">{hackathons.map((entry, index) => <Reveal className="archive-entry" key={entry.name} delay={index * .035}><span>{entry.date}</span><h3>{entry.name}</h3><p className="archive-focus">{entry.focus}</p><p><b>Constraint:</b> {entry.constraint}</p><p><b>Build:</b> {entry.build}</p><p className="archive-stack">{entry.stack}</p><ExternalLink href={entry.source}>Source repository</ExternalLink></Reveal>)}</div></section></main><SiteFooter/></>;
}

function PdfPreview({src,label,className='',children}) {
  const [open,setOpen]=useState(false);
  useEffect(()=>{
    if(!open)return undefined;
    const close=e=>{if(e.key==='Escape')setOpen(false)};
    document.addEventListener('keydown',close);
    document.body.style.overflow='hidden';
    return()=>{document.removeEventListener('keydown',close);document.body.style.overflow=''};
  },[open]);
  const preview=open&&createPortal(
    <div className="pdf-modal-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setOpen(false)}}>
      <section className="pdf-modal" role="dialog" aria-modal="true" aria-label={label + ' PDF preview'}>
        <header className="pdf-modal-header">
          <div><p className="section-number">DOCUMENT PREVIEW</p><h2>{label}</h2></div>
          <div><a href={src} target="_blank" rel="noreferrer">Open in new tab ↗</a><a href={src} download>Download ↓</a><button type="button" aria-label="Close PDF preview" onClick={()=>setOpen(false)}>×</button></div>
        </header>
        <iframe title={label + ' PDF'} src={src + '#view=FitH'} />
      </section>
    </div>,
    document.body
  );
  return <><button className={'pdf-preview-trigger ' + className} type="button" onClick={()=>setOpen(true)}>{children || label}</button>{preview}</>;
}
function CertificateImagePreview({src,label,verify,className='',children}) {
  const [open,setOpen]=useState(false);
  useEffect(()=>{
    if(!open)return undefined;
    const close=e=>{if(e.key==='Escape')setOpen(false)};
    document.addEventListener('keydown',close);
    document.body.style.overflow='hidden';
    return()=>{document.removeEventListener('keydown',close);document.body.style.overflow=''};
  },[open]);
  const preview=open&&createPortal(
    <div className="pdf-modal-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setOpen(false)}}>
      <section className="pdf-modal certificate-image-modal" role="dialog" aria-modal="true" aria-label={label + ' preview'}>
        <header className="pdf-modal-header">
          <div><p className="section-number">CERTIFICATE PREVIEW</p><h2>{label}</h2></div>
          <div><a href={src} download>Download image ↓</a>{verify&&<a href={verify} target="_blank" rel="noreferrer">Verify ↗</a>}<button type="button" aria-label="Close certificate preview" onClick={()=>setOpen(false)}>×</button></div>
        </header>
        <div className="certificate-image-preview-stage"><img src={src} alt={label}/></div>
      </section>
    </div>,
    document.body
  );
  return <><button className={'pdf-preview-trigger ' + className} type="button" onClick={()=>setOpen(true)}>{children||label}</button>{preview}</>;
}
function Timeline({ entries }) { return <div className="journey-list">{entries.map((item, index) => <Reveal className="journey-item" key={item.title} delay={index * .035}><div className="journey-date">{item.date}</div><div className="journey-logo">{item.logo ? <img src={item.logo} alt={item.logoAlt} loading="lazy"/> : <span>{item.title.slice(0, 2)}</span>}</div><div className="journey-detail"><h3>{item.title}{item.current && <span> CURRENT</span>}</h3><p>{item.detail}</p></div></Reveal>)}</div>; }
function AboutGallery() { return <figure className="about-gallery"><img src={aboutPhoto.src} alt={aboutPhoto.alt}/><figcaption><span>CHENNAI / INDIA</span><span>AARAV GOEL</span></figcaption></figure>; }
function AboutPage() {
  return <><main className="about-page"><section className="about-cover"><div className="about-cover-copy"><p className="section-number">03 / ABOUT AARAV</p><h1>Still learning.<br/><em>Already building.</em></h1><p>I’m Aarav, a CSE AI/ML undergrad at SRMIST. I build software, shape its visual design, and contribute to campus communities.</p><div className="about-links"><ExternalLink href={profile.github}>GitHub</ExternalLink><ExternalLink href={profile.linkedin}>LinkedIn</ExternalLink></div></div><AboutGallery/><span className="about-cover-index">CHENNAI / INDIA</span></section>
    <section className="journey-section education-section" id="education"><div className="journey-heading"><p className="section-number">EDUCATION</p><h2>Learning the<br/><em>foundations.</em></h2><p>School first. Then computer science, with an AI/ML specialization.</p></div><Timeline entries={education}/></section>
    <section className="roles-section" id="roles"><div className="journey-heading"><p className="section-number">CAMPUS ROLES</p><h2>Learning by<br/><em>contributing.</em></h2><p>Creative, community, and communications work alongside college.</p></div><Timeline entries={campusRoles}/></section>
    <section className="about-contact" id="contact"><div className="contact-intro"><p className="section-number">04 / FIND ME</p><span>OPEN TO INTERNSHIPS · COLLABORATIONS · GOOD PROBLEMS</span></div><div className="about-contact-grid"><div className="contact-cta"><h2>Have something<br/><em>worth building?</em></h2><p>I’m always up for a thoughtful conversation about software engineering, AI/ML, design, or building with a team.</p><a className="contact-primary" href={`mailto:${profile.email}`}>Start a conversation <b>↗</b></a></div><div className="contact-list"><a href={`mailto:${profile.email}`}><span>EMAIL</span><strong>{profile.email}</strong><b>↗</b></a><a href={`tel:${profile.phone}`}><span>PHONE</span><strong>+91 95005 54947</strong><b>↗</b></a><a href={`tel:${profile.alternatePhone}`}><span>ALTERNATE</span><strong>+91 98730 04947</strong><b>↗</b></a><a href={profile.github} target="_blank" rel="noreferrer"><span>GITHUB</span><strong>coderaarav12</strong><b>↗</b></a><a href={profile.linkedin} target="_blank" rel="noreferrer"><span>LINKEDIN</span><strong>aaravgoel12</strong><b>↗</b></a><PdfPreview src={profile.resume} label="Resume preview" className="contact-resume"><span>RESUME</span><strong>A concise overview of my experience.</strong><b>PREVIEW RESUME ↗</b></PdfPreview></div></div></section>
  </main><SiteFooter/></>;
}

function CertificatesPage() {
  return <><main className="certificates-page"><section className="route-hero certificate-hero"><p className="section-number">04 / LEARNING RECORD · 2025—26</p><h1>Learn it.<br/><em>Put it to work.</em></h1></section><section className="certificate-gallery" aria-label="Certificates">{certificates.map((cert, i) => <Reveal className="certificate-card" key={cert.id} delay={i * .025}><div className="certificate-art">{cert.image ? (cert.pdf ? <PdfPreview src={cert.pdf} label={`${cert.title} certificate`} className="certificate-image-trigger"><img src={cert.image} alt={`${cert.title} certificate`} loading="lazy"/><span>Preview certificate ↗</span></PdfPreview> : <CertificateImagePreview src={cert.image} verify={cert.verify} label={`${cert.title} certificate`} className="certificate-image-trigger"><img src={cert.image} alt={`${cert.title} certificate`} loading="lazy"/><span>Preview certificate ↗</span></CertificateImagePreview>) : <a href={cert.verify} target="_blank" rel="noreferrer" aria-label={`Open ${cert.title} credential`}><div className="enduro-credential"><small>WORKSHOP / 2025</small><strong>ENDURO</strong><span>SOFTWARE TRAINING<br/>+ PERSONAL DEVELOPMENT</span><i>{cert.id}</i></div><span>View credential ↗</span></a>}</div><div className="certificate-card-copy"><span className="certificate-number">0{i + 1} <i>/ {cert.date}</i></span><h2>{cert.title}</h2><p>{cert.issuer}</p><div><span>ID / {cert.id}</span>{cert.pdf && <PdfPreview src={cert.pdf} label={`${cert.title} certificate`}>Preview PDF ↗</PdfPreview>}{!cert.pdf && cert.image && <CertificateImagePreview src={cert.image} verify={cert.verify} label={`${cert.title} certificate`}>Preview certificate ↗</CertificateImagePreview>}{!cert.pdf && !cert.image && <a href={cert.verify} target="_blank" rel="noreferrer">View credential ↗</a>}</div></div></Reveal>)}</section></main><SiteFooter/></>;
}

function GithubContributionCalendar() {
  const [calendar, setCalendar] = useState(null);
  const [failed, setFailed] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [pushes, setPushes] = useState([]);
  const [pushesLoading, setPushesLoading] = useState(true);
  const [pushesUnavailable, setPushesUnavailable] = useState(false);
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await fetch('https://github-contributions-api.jogruber.de/v4/coderaarav12?y=last', { cache: 'no-store' });
        if (!response.ok) throw new Error('Contribution feed unavailable');
        const result = await response.json();
        if (!Array.isArray(result.contributions)) throw new Error('Contribution data is incomplete');
        if (active) { setCalendar(result); setFailed(false); }
      } catch {
        try {
          const fallback = await fetch('/github-contributions-fallback.json', { cache: 'no-store' });
          const snapshot = await fallback.json();
          if (!fallback.ok || !Array.isArray(snapshot.contributions)) throw new Error('Saved contribution data unavailable');
          if (active) { setCalendar(snapshot); setFailed(true); }
        } catch {
          if (active) setFailed(true);
        }
        if (active && !calendar) setFailed(true);
      }
    };
    load();
    const interval = window.setInterval(load, 30 * 60 * 1000);
    return () => { active = false; window.clearInterval(interval); };
  }, []);
  useEffect(() => {
    let active = true;
    const loadPushes = async () => {
      try {
        let events = [];
        try {
          const response = await fetch('https://api.github.com/users/coderaarav12/events/public?per_page=100', { headers: { Accept: 'application/vnd.github+json' }, cache: 'no-store' });
          if (response.ok) events = await response.json();
        } catch { /* The public repository fallback below may still work. */ }
        const pushEvents = events.filter(event => event.type === 'PushEvent').slice(0, 5);
        let recent = await Promise.all(pushEvents.map(async event => {
          let commit = event.payload?.commits?.[0];
          if (!commit?.message && event.payload?.head && event.repo?.name) {
            try {
              const detailResponse = await fetch(`https://api.github.com/repos/${event.repo.name}/commits/${event.payload.head}`, { headers: { Accept: 'application/vnd.github+json' }, cache: 'no-store' });
              if (detailResponse.ok) { const detail = await detailResponse.json(); commit = { message: detail.commit?.message }; }
            } catch { /* Keep the push record even if its commit detail cannot be loaded. */ }
          }
          const branch = (event.payload?.ref || '').replace('refs/heads/', '');
          return { id: event.id, repo: event.repo?.name || 'GitHub project', message: commit?.message?.split('\n')[0] || 'Pushed updates', count: event.payload?.size || event.payload?.commits?.length || 1, branch, date: event.created_at, url: event.payload?.head && event.repo?.name ? `https://github.com/${event.repo.name}/commit/${event.payload.head}` : `https://github.com/${event.repo?.name || 'coderaarav12'}` };
        }));
        // Public event feeds can have no push entries even when public repos have recent commits.
        if (!recent.length) {
          const reposResponse = await fetch('https://api.github.com/users/coderaarav12/repos?sort=pushed&per_page=4', { headers: { Accept: 'application/vnd.github+json' }, cache: 'no-store' });
          if (!reposResponse.ok) throw new Error('Public repository feed unavailable');
          const repos = await reposResponse.json();
          recent = (await Promise.all(repos.slice(0, 4).map(async repo => {
            try {
              const commitResponse = await fetch(`https://api.github.com/repos/${repo.full_name}/commits?per_page=1`, { headers: { Accept: 'application/vnd.github+json' }, cache: 'no-store' });
              if (!commitResponse.ok) return null;
              const [commit] = await commitResponse.json();
              if (!commit) return null;
              return { id: `${repo.full_name}-${commit.sha}`, repo: repo.full_name, message: commit.commit?.message?.split('\n')[0] || 'Pushed updates', count: 1, branch: repo.default_branch || '', date: commit.commit?.author?.date || repo.pushed_at, url: commit.html_url };
            } catch { return null; }
          }))).filter(Boolean).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);
        }
        if (active) { setPushes(recent); setPushesUnavailable(false); }
      } catch { if (active) setPushesUnavailable(true); }
      finally { if (active) setPushesLoading(false); }
    };
    loadPushes();
    const interval = window.setInterval(loadPushes, 10 * 60 * 1000);
    return () => { active = false; window.clearInterval(interval); };
  }, []);
  const days = calendar?.contributions || [];
  const weeks = Array.from({ length: Math.ceil(days.length / 7) }, (_, week) => days.slice(week * 7, week * 7 + 7));
  const months = days.reduce((labels, day, index) => {
    const date = new Date(`${day.date}T12:00:00`);
    if (date.getDate() === 1 || index === 0) labels.push({ label: date.toLocaleDateString('en', { month: 'short' }), column: Math.floor(index / 7) + 1 });
    return labels;
  }, []);
  const total = calendar?.total?.lastYear;
  useEffect(() => {
    if (calendar && !selectedDay && days.length) setSelectedDay([...days].reverse().find(day => day.count > 0) || days.at(-1));
  }, [calendar]);
  const selected = hoveredDay || selectedDay;
  const selectedDate = selected?.date ? new Date(`${selected.date}T12:00:00`).toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : 'Hover or select a square to inspect activity';
  const selectedIndex = selected ? days.findIndex(day => day.date === selected.date) : -1;
  const selectedWeek = selectedIndex < 0 ? [] : days.slice(Math.floor(selectedIndex / 7) * 7, Math.floor(selectedIndex / 7) * 7 + 7);
  const weekTotal = selectedWeek.reduce((sum, day) => sum + day.count, 0);
  const activeWeekDays = selectedWeek.filter(day => day.count > 0).length;
  return <section className="github-calendar-section"><div className="github-calendar-heading"><p className="section-number">THE YEAR IN CODE</p><a href={profile.github} target="_blank" rel="noreferrer">GITHUB / CODERAARAV12 ↗</a></div><div className="github-calendar-panel"><div className="github-calendar-title"><h2>{total == null ? (failed ? 'GitHub activity' : 'Loading contributions…') : `${total.toLocaleString()} contributions in the last year`}</h2><span>{failed ? 'LATEST SAVED SNAPSHOT' : 'LIVE FROM GITHUB'}</span></div><div className="github-calendar-interactive"><div className="github-calendar-scroll"><div className="github-months" aria-hidden="true">{months.map((month, index) => <span key={`${month.label}-${index}`} style={{ gridColumn: month.column }}>{month.label}</span>)}</div><div className="github-calendar-body"><div className="github-weekdays" aria-hidden="true"><span>Mon</span><span>Wed</span><span>Fri</span></div><div className="github-grid" aria-label="GitHub contributions over the last year">{weeks.map((week, weekIndex) => <div className="github-week" key={weekIndex}>{Array.from({ length: 7 }, (_, dayIndex) => { const day = week[dayIndex]; return day ? <button type="button" key={day.date} className={`github-cell level-${day.level ?? 0}${selected?.date === day.date ? ' is-selected' : ''}`} title={`${day.count} contributions on ${day.date} · select for details`} aria-label={`${day.count} contributions on ${day.date}; select for details`} aria-pressed={selectedDay?.date === day.date} onClick={() => setSelectedDay(day)} onMouseEnter={() => setHoveredDay(day)} onMouseLeave={() => setHoveredDay(null)} onFocus={() => setHoveredDay(day)} onBlur={() => setHoveredDay(null)} /> : <span key={`empty-${weekIndex}-${dayIndex}`} className="github-cell level-0 is-empty" aria-hidden="true" />; })}</div>)}</div></div></div><aside className="github-day-detail" aria-live="polite"><span>{hoveredDay ? 'PREVIEWING DAY' : 'DAY IN FOCUS'}</span><strong>{selected?.count ?? '—'} <small>contributions</small></strong><p>{selectedDate}</p><div className="github-day-stats"><span><i>THIS WEEK</i><b>{selected ? weekTotal : '—'}</b></span><span><i>ACTIVE DAYS</i><b>{selected ? `${activeWeekDays}/7` : '—'}</b></span></div><i>GitHub’s daily total can include commits, pull requests, issues, and reviews.</i>{selectedDay && <button type="button" onClick={() => setSelectedDay(null)}>Clear selection</button>}</aside></div><div className="github-calendar-foot"><a href={profile.github} target="_blank" rel="noreferrer">View GitHub profile ↗</a><span className="github-legend"><i>Less</i>{[0,1,2,3,4].map(level=><b className={`github-cell level-${level}`} key={level}/>)}<i>More</i></span></div><div className="github-pushes"><div className="github-pushes-heading"><span>RECENT PUBLIC PUSHES</span><small>REFRESHES EVERY 10 MIN</small></div>{pushesLoading ? <p className="github-push-empty">Loading recent public activity…</p> : pushes.length ? <div className="github-push-list">{pushes.map(push => <a className="github-push" href={push.url} key={push.id} target="_blank" rel="noreferrer"><span className="github-push-repo">{push.repo}<small>{push.branch || 'default branch'}</small></span><strong>{push.message}<small>{push.count} commit{push.count === 1 ? '' : 's'} · {new Date(push.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</small></strong><b>↗</b></a>)}</div> : <p className="github-push-empty">{pushesUnavailable ? 'GitHub is temporarily rate-limiting public activity. Try again in a while.' : 'No recent public pushes are available right now.'} <a href={profile.github} target="_blank" rel="noreferrer">Open GitHub activity ↗</a></p>}</div></div></section>;
}

function CaseStudy({ project }) {
  return <><main className="case-page"><section className={`case-hero case-hero-shot ${project.heroTint || project.tint}`}><div className="case-meta"><span>{project.eyebrow}</span><span>{project.date}</span></div><div className="case-hero-layout"><div className="case-hero-copy"><p className="case-kicker">{project.type}</p><h1>{project.name}</h1><p>{project.lead}</p><div className="case-hero-links">{project.live && <ExternalLink href={project.live}>Open live product</ExternalLink>}{project.repos.map(repo => <ExternalLink href={repo.url} key={repo.label}>{repo.label}</ExternalLink>)}</div></div><img className="case-preview" src={project.image} alt={`${project.name} product interface`} /></div><span className="case-scroll">Scroll for the build ↓</span></section><section className="case-record"><div><p className="section-number">THE PROBLEM</p><h2>{project.problem}</h2></div><div><p className="section-number">THE BUILD</p><p className="case-body">{project.body}</p><p className="case-body">{project.contribution}</p><ul>{project.facts.map(item => <li key={item}>{item}</li>)}</ul></div></section><section className="case-end"><p>{project.status}</p><h2>Built from<br/><em>front to back.</em></h2><div>{project.live && <ExternalLink href={project.live}>Visit product</ExternalLink>}{project.repos.map(repo => <ExternalLink href={repo.url} key={repo.label}>{repo.label}</ExternalLink>)}<InternalLink className="arrow-link" href="/projects">Both projects <span>↗</span></InternalLink></div></section></main><SiteFooter/></>;
}

function NotFoundPage() {
  return <><main className="not-found-page"><section className="not-found-panel" aria-labelledby="not-found-title"><div className="not-found-code" aria-hidden="true">404</div><div className="not-found-copy"><p className="section-number">ERROR 404 · ROUTE NOT FOUND</p><h1 id="not-found-title">This page went<br/><em>off on a side quest.</em></h1><p>We checked the project tree. This address isn’t part of the build.</p><div className="not-found-actions"><InternalLink href="/" className="not-found-home">Back to home <span>↗</span></InternalLink><InternalLink href="/projects" className="arrow-link">Browse projects <span>↗</span></InternalLink></div></div><span className="not-found-aside">NO SUCH FILE / NO SUCH PLACE</span></section></main><SiteFooter/></>;
}

function IntroLoader({onFinish, soundscape, onSoundscapeChange}) {
  const [leaving,setLeaving]=useState(false);
  const finishRef=React.useRef(onFinish);
  const enterRef=React.useRef(null);
  useEffect(()=>{
    const previousOverflow=document.body.style.overflow;
    document.body.style.overflow='hidden';
    return()=>{document.body.style.overflow=previousOverflow};
  },[]);
  const enter=()=>{
    if(leaving)return;
    setLeaving(true);
    window.setTimeout(()=>finishRef.current(),620);
  };
  enterRef.current=enter;
  useEffect(()=>{
    const onKeyDown=e=>{if(e.key==='Enter'){e.preventDefault();enterRef.current?.()}};
    window.addEventListener('keydown',onKeyDown);
    return()=>window.removeEventListener('keydown',onKeyDown);
  },[]);
  return <div className={`intro-loader${leaving?' is-leaving':''}`} aria-label="Aarav Goel portfolio introduction">
    <section className="intro-welcome is-visible" aria-hidden="false">
      <div className="welcome-top"><span>AG<span className="welcome-mark-dot">.</span></span><span>PORTFOLIO · 2026</span></div>
      <div className="welcome-center"><p>THE WORK OF AARAV GOEL</p><div className="welcome-particle-wrap"><ParticleText text="Welcome to my Portfolio." particleSize={2.2} density={4} color="var(--ink)" highlightColor="var(--coral)" scatter={190} gatherDuration={1600} stagger={420} pointerRepel={42} repelRadius={120} idleDrift={0.8}/><h1 className="visually-hidden">Welcome to my Portfolio.</h1></div></div>
      <div className="welcome-bottom"><span>ASPIRING SOFTWARE ENGINEER · AI / ML</span><button type="button" onClick={enter}>ENTER <b>↗</b></button><span>CHENNAI, INDIA</span><div className="welcome-sound-picker"><span>SOUND</span><div>{[['off','OFF'],['rain','RAIN'],['forest','FOREST'],['waterfall','WATER'],['lofi','LO-FI'],['rock','ROCK']].map(([value,label])=><button key={value} type="button" className={soundscape===value?'is-active':''} aria-pressed={soundscape===value} onClick={()=>onSoundscapeChange(value)}>{label}</button>)}</div></div></div>
    </section>
  </div>;
}
function App() {
  const [showIntro,setShowIntro]=useState(() => window.location.pathname === "/");
  const [soundscape,setSoundscape]=useState('off');
  const [footerVisible, setFooterVisible] = useState(false);
  const [route, setRoute] = useState(() => `${window.location.pathname}${window.location.hash}`);
  const routePath = route.split('#')[0] || '/';
  const changeSoundscape = value => { setSoundscape(value); startSoundscape(value); };
  useEffect(() => {
    const footer = document.querySelector('.site-footer');
    if (!footer) { setFooterVisible(false); return; }
    let frame = 0;
    const syncFooterVisibility = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const footerTop = document.documentElement.scrollHeight - footer.offsetHeight;
        const viewportBottom = window.scrollY + window.innerHeight;
        setFooterVisible(viewportBottom >= footerTop + 8 && window.scrollY < footerTop + footer.offsetHeight);
      });
    };
    syncFooterVisibility();
    window.addEventListener('scroll', syncFooterVisibility, { passive: true });
    window.addEventListener('resize', syncFooterVisibility);
    const resizeObserver = new ResizeObserver(syncFooterVisibility);
    resizeObserver.observe(document.querySelector('.page-transition') || footer);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', syncFooterVisibility);
      window.removeEventListener('resize', syncFooterVisibility);
      resizeObserver.disconnect();
    };
  }, [routePath]);
  const navigate = href => {
    const next = new URL(href, window.location.href);
    const nextRoute = `${next.pathname}${next.hash}`;
    if (next.pathname === window.location.pathname && next.hash) {
      history.pushState({}, '', nextRoute);
      setRoute(nextRoute);
      requestAnimationFrame(() => document.querySelector(next.hash)?.scrollIntoView({ behavior: 'smooth' }));
      return;
    }
    const update = () => { history.pushState({}, '', nextRoute); setRoute(nextRoute); window.scrollTo({ top: 0, behavior: 'instant' }); };
    if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) document.startViewTransition(() => flushSync(update));
    else flushSync(update);
  };
  useEffect(() => {
    const handlePop = () => {
      const update = () => { setRoute(`${window.location.pathname}${window.location.hash}`); window.scrollTo(0, 0); };
      if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) document.startViewTransition(() => flushSync(update));
      else flushSync(update);
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);
  useEffect(() => { const hash = route.split('#')[1]; if (hash) requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })); }, [route]);
  const project = useMemo(() => projects.find(item => routePath === `/project/${item.slug}`), [routePath]);
  const isLiveProjects = routePath === '/projects/live' || routePath === '/projects' && window.location.hash === '#live';
  const isHackathonArchive = routePath === '/projects/hackathons' || routePath === '/archive/hackathons';
  const isProjectsHub = routePath === '/projects' || routePath === '/archive';
  const isKnownRoute = Boolean(project) || ['/', '/about', '/certificates', '/projects/live', '/projects', '/archive', '/projects/hackathons', '/archive/hackathons'].includes(routePath);
  const content = project ? <CaseStudy project={project}/> : routePath === '/about' ? <AboutPage/> : routePath === '/certificates' ? <CertificatesPage/> : isLiveProjects ? <ProjectsPage/> : isProjectsHub ? <ProjectsHub/> : isHackathonArchive ? <ArchivePage/> : isKnownRoute ? <HomePage/> : <NotFoundPage/>;
  useEffect(() => {
    const titles = { '/': 'Aarav Goel — Aspiring Software Engineer', '/projects': 'Projects — Aarav Goel', '/projects/live': 'Live Projects — Aarav Goel', '/projects/hackathons': 'Hackathon Archive — Aarav Goel', '/archive': 'Projects — Aarav Goel', '/archive/hackathons': 'Hackathon Archive — Aarav Goel', '/about': 'About Aarav Goel', '/certificates': 'Certificates — Aarav Goel' };
    document.title = isKnownRoute ? (titles[routePath] || `${project?.name || 'Portfolio'} — Aarav Goel`) : '404 — Route not found | Aarav Goel';
  }, [routePath, isKnownRoute, project]);
  return <Navigation.Provider value={navigate}><div className="mobile-site-blocker" role="dialog" aria-modal="true" aria-labelledby="mobile-blocker-title"><span className="mobile-blocker-mark">AG<span>°</span></span><p className="section-number">AARAV GOEL · PORTFOLIO</p><h1 id="mobile-blocker-title">Made for a<br/><em>larger screen.</em></h1><p className="mobile-blocker-note">This portfolio is currently available on desktop. Open it on a laptop or desktop to explore the projects, journey, and work in full.</p></div><SiteVideoBackground/>{routePath === "/" && showIntro && <IntroLoader soundscape={soundscape} onSoundscapeChange={changeSoundscape} onFinish={()=>setShowIntro(false)}/>}<Header route={routePath} soundscape={soundscape} onSoundscapeChange={changeSoundscape}/><PageFrame route={routePath} key={routePath}>{content}</PageFrame>{routePath !== '/' && !footerVisible && <InternalLink className="archive-home-float" href="/">Back to Home</InternalLink>}</Navigation.Provider>;
}

createRoot(document.getElementById('root')).render(<App/>);
