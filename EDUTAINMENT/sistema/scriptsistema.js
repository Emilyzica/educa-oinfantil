// =====================
// Utilidades
// =====================
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

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
      if (e.target.tagName.toLowerCase() === 'input') return;
      const cb = label.querySelector('input');
      cb.checked = !cb.checked;
      label.classList.toggle('active', cb.checked);
      limitTags();
      savePrefs();
    });
    label.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
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
  scrollBtn.addEventListener('click', function (e) {
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

// =====================
// Responsável
// =====================
const perfilDiv = document.getElementById("perfil");
const historicoDiv = document.getElementById("historico");
const listaHistorico = document.getElementById("listaHistorico");
const modal = document.getElementById("modal");
const filhoForm = document.getElementById("filhoForm");

let filhos = JSON.parse(localStorage.getItem("filhos")) || [];
let historico = JSON.parse(localStorage.getItem("historico")) || [];

// Renderizar perfis
function renderizarPerfis() {
  perfilDiv.innerHTML = "";
  filhos.forEach((filho, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${filho.foto || 'https://via.placeholder.com/120'}" alt="Foto do filho" class="avatar">
      <h3>${filho.nome} (${filho.idade} anos)</h3>
      <p>Preferências: ${filho.preferencias || "Não informadas"}</p>
      <div class="card-actions">
        <button class="btn small" onclick="editarFilho(${index})"><i class="fa-solid fa-pen"></i> Editar</button>
        <button class="btn small danger" onclick="excluirFilho(${index})"><i class="fa-solid fa-trash"></i> Excluir</button>
      </div>
      <button class="btn" onclick="registrarLeitura('${filho.nome}')"><i class="fa-solid fa-book-open"></i> Registrar História</button>
    `;
    perfilDiv.appendChild(card);
  });
}

// Renderizar histórico
function renderizarHistorico() {
  listaHistorico.innerHTML = "";
  historico.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `<i class="fa-solid fa-book-open"></i> ${item.filho}: ${item.historia} <br><small>${item.data}</small>`;
    listaHistorico.appendChild(li);
  });
}

// Adicionar leitura (corrigido com scroll + alerta)
function registrarLeitura(nomeFilho) {
  const historia = prompt("Digite o nome da história lida:");
  if (historia) {
    historico.unshift({
      filho: nomeFilho,
      historia: historia,
      data: new Date().toLocaleString("pt-BR")
    });
    localStorage.setItem("historico", JSON.stringify(historico));
    renderizarHistorico();
    historicoDiv.classList.remove("hidden");

    // Rolagem suave
    historicoDiv.scrollIntoView({ behavior: "smooth" });

    // Mensagem de sucesso
    const msg = document.createElement("div");
    msg.className = "alerta-registrado";
    msg.innerHTML = `<i class="fa-solid fa-check-circle"></i> História registrada com sucesso!`;

    document.body.appendChild(msg);

    setTimeout(() => {
      msg.classList.add("fade-out");
      setTimeout(() => msg.remove(), 500);
    }, 2500);
  }
}

// Modal
document.getElementById("addFilhoBtn").onclick = () => abrirModal();
function abrirModal(index = null) {
  modal.classList.remove("hidden");
  if (index !== null) {
    document.getElementById("modalTitle").textContent = "Editar Filho";
    document.getElementById("editIndex").value = index;
    document.getElementById("nome").value = filhos[index].nome;
    document.getElementById("idade").value = filhos[index].idade;
    document.getElementById("preferencias").value = filhos[index].preferencias;
  } else {
    document.getElementById("modalTitle").textContent = "Adicionar Filho";
    filhoForm.reset();
    document.getElementById("editIndex").value = "";
  }
}
function fecharModal() { modal.classList.add("hidden"); }

// Salvar filho
filhoForm.onsubmit = (e) => {
  e.preventDefault();
  const nome = document.getElementById("nome").value;
  const idade = document.getElementById("idade").value;
  const preferencias = document.getElementById("preferencias").value;
  const fotoInput = document.getElementById("foto");
  const editIndex = document.getElementById("editIndex").value;

  if (fotoInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      salvarFilho(nome, idade, preferencias, e.target.result, editIndex);
    };
    reader.readAsDataURL(fotoInput.files[0]);
  } else {
    const fotoExistente = editIndex !== "" ? filhos[editIndex].foto : null;
    salvarFilho(nome, idade, preferencias, fotoExistente, editIndex);
  }
};

function salvarFilho(nome, idade, preferencias, foto, editIndex) {
  if (editIndex !== "") {
    filhos[editIndex] = { nome, idade, preferencias, foto };
  } else {
    filhos.push({ nome, idade, preferencias, foto });
  }
  localStorage.setItem("filhos", JSON.stringify(filhos));
  renderizarPerfis();
  fecharModal();
}

// Editar / Excluir
function editarFilho(index) { abrirModal(index); }
function excluirFilho(index) {
  if (confirm("Tem certeza que deseja excluir este filho?")) {
    filhos.splice(index, 1);
    localStorage.setItem("filhos", JSON.stringify(filhos));
    renderizarPerfis();
  }
}

// Inicializar
renderizarPerfis();
renderizarHistorico();

// Alternar histórico pelo menu lateral
document.querySelector('a[href="#historico"]').addEventListener('click', (e) => {
  e.preventDefault();
  historicoDiv.classList.toggle("hidden");
});

// ---- LOGIN ----
function abrirLogin() {
  document.getElementById("loginModal").style.display = "flex";
}

function fecharLogin() {
  document.getElementById("loginModal").style.display = "none";
}

// ---- REGISTRO ----
function abrirRegistro() {
  document.getElementById("registerModal").style.display = "flex";
}

function fecharRegistro() {
  document.getElementById("registerModal").style.display = "none";
}

// Fechar clicando fora
window.onclick = function (event) {
  let login = document.getElementById("loginModal");
  let register = document.getElementById("registerModal");

  if (event.target === login) login.style.display = "none";
  if (event.target === register) register.style.display = "none";
}

// Expor funções globais
window.fecharModal = fecharModal;
window.editarFilho = editarFilho;
window.excluirFilho = excluirFilho;
window.registrarLeitura = registrarLeitura;
window.abrirLogin = abrirLogin;
window.fecharLogin = fecharLogin;
window.abrirRegistro = abrirRegistro;
window.fecharRegistro = fecharRegistro;


