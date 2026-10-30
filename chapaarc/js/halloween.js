/**
 * ========================================================
 * 🎃 HALLOWEEN ENGINE - CHAPA ARC 07 (EDIÇÃO ESPECIAL)
 * Sincronização em Nuvem em Tempo Real + Partículas a 60 FPS
 * ========================================================
 */

(function () {
  const SUPABASE_REST_URL = 'https://mwjrivlmeixfysfycedj.supabase.co/rest/v1/configuracoes_site?chave=eq.tema_ativo&select=valor';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13anJpdmxtZWl4ZnlzZnljZWRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxMjI0MTcsImV4cCI6MjEwODY5ODQxN30._zir0suagC0tNpW9QHSo2NYWpSiMR8fP5UUGv0fh1SE';

  let canvas = null;
  let ctx = null;
  let animId = null;
  let width = 0;
  let height = 0;
  let isRunning = false;
  let isMobile = false;

  let ghosts = [];
  let bats = [];
  let embers = [];

  const GHOST_SYMBOLS = ['👻', '🎃', '✨'];

  function checkDevice() {
    isMobile = window.innerWidth < 768;
  }

  class Ghost {
    constructor(initRandomY = false) {
      this.reset(initRandomY);
    }

    reset(initRandomY = false) {
      this.x = Math.random() * width;
      this.y = initRandomY ? Math.random() * height : height + 40;
      this.speedY = 0.4 + Math.random() * 0.7;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.wavePhase = Math.random() * Math.PI * 2;
      this.waveSpeed = 0.02 + Math.random() * 0.02;
      this.size = isMobile ? (18 + Math.random() * 10) : (24 + Math.random() * 16);
      this.alpha = 0.18 + Math.random() * 0.45;
      this.symbol = GHOST_SYMBOLS[Math.floor(Math.random() * GHOST_SYMBOLS.length)];
    }

    update() {
      this.y -= this.speedY;
      this.wavePhase += this.waveSpeed;
      this.x += Math.sin(this.wavePhase) * 0.6 + this.speedX;

      if (this.y < -50 || this.x < -60 || this.x > width + 60) {
        this.reset(false);
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.font = `${this.size}px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.symbol, this.x, this.y);
      ctx.restore();
    }
  }

  class Bat {
    constructor() {
      this.reset(true);
    }

    reset(initRandom = false) {
      this.direction = Math.random() > 0.5 ? 1 : -1;
      this.x = initRandom 
        ? Math.random() * width 
        : (this.direction === 1 ? -40 : width + 40);
      this.y = Math.random() * (height * 0.65);
      this.speedX = (1.2 + Math.random() * 1.5) * this.direction;
      this.speedY = (Math.random() - 0.5) * 0.8;
      this.flapPhase = Math.random() * Math.PI * 2;
      this.size = isMobile ? (16 + Math.random() * 8) : (22 + Math.random() * 12);
      this.alpha = 0.35 + Math.random() * 0.4;
    }

    update() {
      this.x += this.speedX;
      this.flapPhase += 0.15;
      this.y += Math.sin(this.flapPhase) * 1.2 + this.speedY;

      if (this.direction === 1 && this.x > width + 50) {
        this.reset(false);
      } else if (this.direction === -1 && this.x < -50) {
        this.reset(false);
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.translate(this.x, this.y);
      if (this.direction === -1) {
        ctx.scale(-1, 1);
      }
      ctx.font = `${this.size}px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🦇', 0, 0);
      ctx.restore();
    }
  }

  class Ember {
    constructor() {
      this.reset(true);
    }

    reset(initRandom = false) {
      this.x = Math.random() * width;
      this.y = initRandom ? Math.random() * height : height + 10;
      this.size = 1.2 + Math.random() * 2.5;
      this.speedY = 0.3 + Math.random() * 0.8;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.alpha = 0.2 + Math.random() * 0.6;
      this.color = Math.random() > 0.4 ? '#FF6600' : (Math.random() > 0.5 ? '#9D4EDD' : '#00FF88');
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.alpha -= 0.0015;

      if (this.y < -10 || this.alpha <= 0) {
        this.reset(false);
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function resizeCanvas() {
    if (!canvas) return;
    checkDevice();
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  function initParticles() {
    ghosts = [];
    bats = [];
    embers = [];

    const numGhosts = isMobile ? 4 : 7;
    const numBats = isMobile ? 3 : 5;
    const numEmbers = isMobile ? 12 : 25;

    for (let i = 0; i < numGhosts; i++) ghosts.push(new Ghost(true));
    for (let i = 0; i < numBats; i++) bats.push(new Bat());
    for (let i = 0; i < numEmbers; i++) embers.push(new Ember());
  }

  function renderLoop() {
    if (!isRunning || !ctx) return;

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < embers.length; i++) {
      embers[i].update();
      embers[i].draw(ctx);
    }

    for (let i = 0; i < ghosts.length; i++) {
      ghosts[i].update();
      ghosts[i].draw(ctx);
    }

    for (let i = 0; i < bats.length; i++) {
      bats[i].update();
      bats[i].draw(ctx);
    }

    animId = requestAnimationFrame(renderLoop);
  }

  function handlePointer(e) {
    if (!isRunning || embers.length > 50) return;
    const x = e.clientX || (e.touches && e.touches[0]?.clientX);
    const y = e.clientY || (e.touches && e.touches[0]?.clientY);
    if (!x || !y) return;

    for (let i = 0; i < 2; i++) {
      const p = new Ember();
      p.x = x + (Math.random() - 0.5) * 20;
      p.y = y + (Math.random() - 0.5) * 20;
      p.speedY = 0.8 + Math.random() * 1.2;
      p.alpha = 0.8;
      p.color = '#FF7700';
      embers.push(p);
    }
  }

  window.iniciarHalloween = function () {
    if (isRunning) return;

    if (!canvas) {
      canvas = document.getElementById('halloweenCanvas');
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'halloweenCanvas';
        document.body.appendChild(canvas);
      }
      ctx = canvas.getContext('2d');
      window.addEventListener('resize', resizeCanvas);
      window.addEventListener('pointermove', handlePointer, { passive: true });
    }

    resizeCanvas();
    initParticles();
    isRunning = true;
    canvas.style.display = 'block';
    renderLoop();
  };

  window.pararHalloween = function () {
    isRunning = false;
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
    if (canvas) {
      canvas.style.display = 'none';
      if (ctx) ctx.clearRect(0, 0, width, height);
    }
  };

  window.alternarHalloween = function (forcarEstado) {
    const isCurrentlyActive = document.body 
      ? document.body.classList.contains('theme-halloween')
      : (document.documentElement && document.documentElement.classList.contains('theme-halloween'));

    const ativar = typeof forcarEstado === 'boolean' 
      ? forcarEstado 
      : !isCurrentlyActive;

    if (ativar) {
      if (document.documentElement) document.documentElement.classList.add('theme-halloween');
      if (document.body) document.body.classList.add('theme-halloween');
      localStorage.setItem('chapa_arc_tema', 'halloween');
      if (document.body) window.iniciarHalloween();
    } else {
      if (document.documentElement) document.documentElement.classList.remove('theme-halloween');
      if (document.body) document.body.classList.remove('theme-halloween');
      localStorage.setItem('chapa_arc_tema', 'padrao');
      window.pararHalloween();
    }

    return ativar;
  };

  // Sincronização Direta com a Nuvem Supabase (PARA TODOS OS ALUNOS - SEM CACHE)
  async function sincronizarTemaNuvem() {
    try {
      const urlSemCache = `${SUPABASE_REST_URL}&_t=${Date.now()}`;
      const resp = await fetch(urlSemCache, {
        cache: 'no-store',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': 'Bearer ' + SUPABASE_ANON_KEY
        }
      });
      if (resp.ok) {
        const rows = await resp.json();
        if (Array.isArray(rows) && rows.length > 0) {
          const valor = rows[0].valor;
          const isHalloween = (valor === 'halloween');
          window.alternarHalloween(isHalloween);
          return;
        }
      }
    } catch (e) {
      // Se offline, usa o estado persistido local
    }

    const temaLocal = localStorage.getItem('chapa_arc_tema');
    if (temaLocal === 'halloween') {
      window.alternarHalloween(true);
    }
  }

  // Economia de Bateria (Pausa partículas quando a aba está em segundo plano)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    } else {
      if (isRunning && !animId) {
        animId = requestAnimationFrame(renderLoop);
      }
      sincronizarTemaNuvem();
    }
  });

  // Disparo Imediato e Contínuo
  sincronizarTemaNuvem();
  document.addEventListener('DOMContentLoaded', sincronizarTemaNuvem);
  // Checagem em segundo plano a cada 10 segundos para sincronismo ao vivo
  setInterval(sincronizarTemaNuvem, 10000);
})();
