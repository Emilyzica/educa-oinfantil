// ===== JSON-LD (SEO) =====
const script = document.createElement('script');
script.type = 'application/ld+json';
script.text = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Alfa Play",
  "url": "https://exemplo.com/",
  "description": "Histórias, atividades e painel para responsáveis.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://exemplo.com/busca?q={query}",
    "query-input": "required name=query"
  }
});
document.head.appendChild(script);

// ===== Mobile Drawer =====
const menuBtn = document.getElementById('menuBtn');
const drawer = document.getElementById('drawer');
let drawerOpen = false;
function toggleDrawer(force){
  drawerOpen = force ?? !drawerOpen;
  drawer.hidden = !drawerOpen;
  menuBtn.setAttribute('aria-expanded', drawerOpen);
  document.body.style.overflow = drawerOpen ? 'hidden' : '';
}
menuBtn?.addEventListener('click', () => toggleDrawer());
drawer?.addEventListener('click', (e)=>{ if(e.target.tagName === 'A') toggleDrawer(false); });
window.addEventListener('keydown', (e)=>{ if(e.key==='Escape' && drawerOpen) toggleDrawer(false); });

// ===== Back to top =====
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  const show = window.scrollY > 400;
  toTop.style.opacity = show ? 1 : 0;
  toTop.style.transform = show ? 'translateY(0)' : 'translateY(8px)';
});
toTop.addEventListener('click', ()=> window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== Animate in view =====
const io = new IntersectionObserver((entries)=>{
  entries.forEach(el=>{
    if(el.isIntersecting){
      el.target.animate([
        { opacity: 0, transform: 'translateY(16px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 500, easing: 'ease-out', fill: 'forwards' });
      io.unobserve(el.target);
    }
  });
}, { threshold: .18 });
document.querySelectorAll('[data-anim]').forEach(el=> io.observe(el));

// ===== Bars animation =====
const barWrap = document.querySelector('#responsavel .bars');
const bars = document.querySelectorAll('.bar');
const animateBars = () => {
  bars.forEach((b,i)=>{
    const target = parseInt(b.style.height);
    b.style.height = '0%';
    b.animate([{height:'0%'},{height: target+'%'}], {duration: 900 + i*200, easing:'cubic-bezier(.16,1,.3,1)', fill:'forwards'});
  });
};
const ioBars = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ animateBars(); ioBars.disconnect(); } });
}, { threshold: .3 });
ioBars.observe(barWrap);

// ===== Microinteractions: buttons =====
document.querySelectorAll('.pill, .btn, .btn-mini, .cta-small').forEach(btn=>{
  btn.addEventListener('pointerdown', ()=> btn.animate([{ transform:'scale(1)'},{ transform:'scale(.97)'}], {duration:150, fill:'forwards'}));
  btn.addEventListener('pointerup', ()=> btn.animate([{ transform:'scale(.97)'},{ transform:'scale(1)'}], {duration:120, fill:'forwards'}));
});

// ===== Placeholder actions =====
document.querySelectorAll('[data-read]').forEach(b=> b.addEventListener('click', ()=> alert('Abrir leitor de histórias (em desenvolvimento).')));
document.querySelectorAll('[data-listen]').forEach(b=> b.addEventListener('click', ()=> alert('Reprodução em áudio (em desenvolvimento).')));


//dark//
const darkToggle = document.getElementById("darkModeToggle");
const body = document.body;

if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark");
  darkToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

darkToggle.addEventListener("click", () => {
  body.classList.toggle("dark");
  if (body.classList.contains("dark")) {
    darkToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    localStorage.setItem("theme", "dark");
  } else {
    darkToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    localStorage.setItem("theme", "light");
  }
});