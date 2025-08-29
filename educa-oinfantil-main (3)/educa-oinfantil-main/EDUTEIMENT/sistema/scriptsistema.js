// =====================
// Utilidades
// =====================
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => [...ctx.querySelectorAll(sel)];

const CHARACTERS = [
  { id: 'princesa', label: '👸 Princesa' },
  { id: 'heroi', label: '🦸 Herói' },
  { id: 'dinossauro', label: '🦖 Dinossauro' },
  { id: 'unicornio', label: '🦄 Unicórnio' },
  { id: 'pirata', label: '🏴‍☠️ Pirata' },
  { id: 'astronauta', label: '👩‍🚀 Astronauta' },
  { id: 'robô', label: '🤖 Robô' },
  { id: 'sereia', label: '🧜‍♀️ Sereia' },
];

// Render tags acessíveis
const tagsWrap = $('#characters');
if (tagsWrap) {
  CHARACTERS.forEach(ch => {
    const label = document.createElement('label');
    label.className = 'tag';
    label.setAttribute('tabindex', '0');
    label.innerHTML = `<input type="checkbox" value="${ch.id}" aria-label="${ch.label}"> ${ch.label}`;
    label.addEventListener('click', (e) => {
      if(e.target.tagName.toLowerCase() === 'input') return;
      const cb = label.querySelector('input');
      cb.checked = !cb.checked;
      label.classList.toggle('active', cb.checked);
      limitTags();
      savePrefs();
    });
    label.addEventListener('keydown', (e) => {
      if(e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        label.click();
      }
    });
    tagsWrap.appendChild(label);
  });
}

function limitTags() {
  const selected = $$('#characters input:checked');
  const labels = $$('#characters .tag');
  if (selected.length > 3) {
    selected[0].checked = false;
    labels.find(l => l.querySelector('input') === selected[0]).classList.remove('active');
  }
  const formError = $('#formError');
  if (formError) {
    formError.style.display = selected.length === 0 ? 'block' : 'none';
  }
}

// Inicializa tema ao carregar
(function initTheme() {
  const saved = localStorage.getItem('mm_theme');
  if (saved === 'dark') {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
})();

// Espera o DOM carregar antes de acessar elementos
document.addEventListener('DOMContentLoaded', function () {
  const themeBtn = document.querySelector('#themeBtn');
  if (!themeBtn) return;

  const isDark = document.body.classList.contains('dark');
  themeBtn.setAttribute('aria-pressed', isDark);

  themeBtn.addEventListener('click', function () {
    const currentlyDark = document.body.classList.toggle('dark');
    themeBtn.setAttribute('aria-pressed', currentlyDark);
    localStorage.setItem('mm_theme', currentlyDark ? 'dark' : 'light');
  });
});

// Botão do header para scroll suave
const scrollBtn = document.querySelector('.btn.primary');
const configSection = $('#config');
if (scrollBtn && configSection) {
  scrollBtn.addEventListener('click', function(e) {
    e.preventDefault();
    configSection.scrollIntoView({ behavior: 'smooth' });
  });
}

// Drawer
const drawer = $('#drawer');
const menuBtn = $('#menuBtn');
const closeDrawerBtn = $('#closeDrawer');

if (drawer && menuBtn && closeDrawerBtn) {
  menuBtn.addEventListener('click', () => {
    drawer.hidden = false;
    requestAnimationFrame(() => drawer.classList.add('open'));
    menuBtn.setAttribute('aria-expanded', 'true');
  });

  closeDrawerBtn.addEventListener('click', closeDrawer);
  $$('#drawer a').forEach(a => a.addEventListener('click', closeDrawer));

  function closeDrawer() {
    drawer.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    setTimeout(() => drawer.hidden = true, 300);
  }
}

// Formulário
const form = $('#storyForm');
const cover = $('#cover');
const story = $('#story');

if (form && cover && story) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const age = $('#age').value;
    const theme = $('#theme').value;
    const chars = $$('#characters input:checked').map(i => i.value);
    if (chars.length === 0 || chars.length > 3) {
      const formError = $('#formError');
      if (formError) formError.style.display = 'block';
      return;
    }
    const formError = $('#formError');
    if (formError) formError.style.display = 'none';

    const { title, text } = buildStory(age, theme, chars);
    cover.textContent = title;
    story.innerHTML = text;
    savePrefs();
  });
}

const resetBtn = $('#resetBtn');
if (resetBtn && form && cover && story) {
  resetBtn.addEventListener('click', () => {
    form.reset();
    $$('#characters .tag').forEach(t => t.classList.remove('active'));
    story.innerHTML = '<p>Preencha o formulário para ver a prévia da história aqui. Ela será adaptada para a idade escolhida, com frases e palavras apropriadas.</p>';
    cover.textContent = '📘 Sua capa mágica';
    localStorage.removeItem('mm_prefs');
    const formError = $('#formError');
    if (formError) formError.style.display = 'none';
  });
}

function buildStory(age, theme, chars) {
  const title = `📘 ${capitalize(theme)} de ${chars.map(pretty).slice(0, 3).join(', ')}`;

  const vocab = {
    '3-4': {
      open: 'Era uma vez, num lugar cheio de cores,',
      verbs: ['brincar', 'sorrir', 'pular'],
      close: 'E todos foram dormir com o coração feliz.'
    },
    '5-6': {
      open: 'Em um bosque brilhante e curioso,',
      verbs: ['explorar', 'ajudar', 'imaginar'],
      close: 'No fim, aprenderam que a amizade ilumina qualquer caminho.'
    },
    '7-8': {
      open: 'Numa tarde de vento leve,',
      verbs: ['investigar', 'descobrir', 'cooperar'],
      close: 'A aventura mostrou que coragem e gentileza caminham juntas.'
    },
    '9+': {
      open: 'Nos confins de um mundo fantástico,',
      verbs: ['desvendar', 'compreender', 'transformar'],
      close: 'Perceberam que escolhas sábias constroem grandes jornadas.'
    },
  }[age || '5-6'];

  const motif = {
    amizade: 'aprendendo a compartilhar e ouvir o outro',
    coragem: 'perdendo o medo do escuro e dos desafios',
    aventura: 'seguindo pistas e mapas misteriosos',
    natureza: 'cuidando das árvores, rios e bichinhos',
    galaxia: 'visitando planetas cheios de brilhos e estrelas',
  }[theme] || 'descobrindo novos caminhos';

  const action = `${vocab.verbs[0]}, ${vocab.verbs[1]} e ${vocab.verbs[2]}`;

  const text = `
    <p><strong>${vocab.open}</strong> ${chars.map(pretty).slice(0, 3).join(', ')} decidiu(aram) viver uma grande história sobre <em>${motif}</em>.</p>
    <p>No caminho, precisaram ${action}. A cada passo, a imaginação pintava o céu com novas cores.</p>
    <p>Quando a jornada terminou, compreenderam algo especial: ${vocab.close}</p>
  `;
  return { title, text };
}

function pretty(id) {
  const map = {
    princesa: 'a Princesa',
    heroi: 'o Herói',
    dinossauro: 'o Dinossauro',
    unicornio: 'o Unicórnio',
    pirata: 'o Pirata',
    astronauta: 'a Astronauta',
    'robô': 'o Robô',
    sereia: 'a Sereia'
  };
  return map[id] || id;
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Persistência local
function savePrefs() {
  const ageEl = $('#age');
  const themeEl = $('#theme');
  if (!ageEl || !themeEl) return;

  const data = {
    age: ageEl.value,
    theme: themeEl.value,
    chars: $$('#characters input:checked').map(i => i.value)
  };
  localStorage.setItem('mm_prefs', JSON.stringify(data));
}

(function restore() {
  const raw = localStorage.getItem('mm_prefs');
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    const ageEl = $('#age');
    const themeEl = $('#theme');
    if (ageEl && data.age) ageEl.value = data.age;
    if (themeEl && data.theme) themeEl.value = data.theme;
    if (Array.isArray(data.chars)) {
      data.chars.forEach(v => {
        const label = $$('#characters .tag').find(l => l.querySelector('input').value === v);
        if (label) {
          label.querySelector('input').checked = true;
          label.classList.add('active');
        }
      });
    }
  } catch (err) { /* ignore */ }
})();
