// ========================================================
// Supabase Client Oficial - Chapa ARC 07
// ========================================================

// 1. Importação do cliente via CDN ESM oficial
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// 2. Configurações do Supabase (Preencha com as credenciais do seu projeto)
export const SUPABASE_URL = 'https://mwjrivlmeixfysfycedj.supabase.co'

export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13anJpdmxtZWl4ZnlzZnljZWRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxMjI0MTcsImV4cCI6MjEwODY5ODQxN30._zir0suagC0tNpW9QHSo2NYWpSiMR8fP5UUGv0fh1SE';

// Verifica se as chaves foram preenchidas pelo usuário
export const isConfigured = 
  SUPABASE_URL.startsWith('http') && 
  !SUPABASE_URL.includes('SUA_URL_AQUI') && 
  SUPABASE_ANON_KEY.length > 20 &&
  !SUPABASE_ANON_KEY.includes('SUA_CHAVE_ANON_AQUI');

// Instanciação segura do cliente
export const supabase = isConfigured 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

if (!isConfigured) {
  console.info(
    '%c[Supabase ARC 07]%c Credenciais pendentes em js/supabaseClient.js. As ações funcionarão com persistência local até a configuração das chaves.',
    'color: #FF007F; font-weight: bold;',
    'color: #FACC15;'
  );
}

// ========================================================
// Helper de Toast Visual (Sucesso / Erro)
// ========================================================
export function exibirToast(mensagem, isError = false) {
  const toast = document.getElementById('toastNotification');
  const text = document.getElementById('toastMessage');
  
  if (!toast || !text) {
    if (isError) alert(`Erro: ${mensagem}`);
    else alert(mensagem);
    return;
  }

  text.textContent = mensagem;
  const iconContainer = toast.querySelector('div:first-child');
  const icon = toast.querySelector('i');

  if (isError) {
    toast.classList.remove('border-arc-yellow/60');
    toast.classList.add('border-arc-pink', 'bg-zinc-950/95');
    if (iconContainer) iconContainer.className = 'w-9 h-9 rounded-xl bg-arc-pink text-white flex items-center justify-center text-lg font-bold shrink-0';
    if (icon) icon.className = 'bi bi-exclamation-triangle-fill';
  } else {
    toast.classList.remove('border-arc-pink');
    toast.classList.add('border-arc-yellow/60');
    if (iconContainer) iconContainer.className = 'w-9 h-9 rounded-xl bg-arc-yellow text-black flex items-center justify-center text-lg font-bold shrink-0';
    if (icon) icon.className = 'bi bi-check2-circle';
  }

  toast.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
  setTimeout(() => {
    toast.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
  }, 4000);
}

// ========================================================
// 3. Funções Utilitárias Exportadas
// ========================================================

/**
 * Envia uma mensagem/sugestão para a tabela 'feedbacks'
 */
export async function enviarFeedback(tipo, turma, mensagem) {
  try {
    if (!supabase) {
      return { 
        success: false, 
        offline: true, 
        error: new Error('Configure o SUPABASE_URL e SUPABASE_ANON_KEY no arquivo js/supabaseClient.js') 
      };
    }

    const { data, error } = await supabase
      .from('feedbacks')
      .insert([{
        tipo: tipo || 'Geral',
        turma: turma || 'Não informada',
        mensagem: mensagem,
        status: 'pendente'
      }])
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Erro em enviarFeedback:', err);
    return { success: false, error: err };
  }
}

/**
 * Registra um alerta de infraestrutura (ex: falta de papel higiênico)
 */
export async function registrarAlertaInfra(tipo = 'papel_higienico', localizacao) {
  try {
    if (!supabase) {
      return { 
        success: false, 
        offline: true, 
        error: new Error('Configure o SUPABASE_URL e SUPABASE_ANON_KEY no arquivo js/supabaseClient.js') 
      };
    }

    const { data, error } = await supabase
      .from('alertas_infra')
      .insert([{
        tipo: tipo,
        localizacao: localizacao || 'Banheiro geral da escola',
        status: 'aberto'
      }])
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Erro em registrarAlertaInfra:', err);
    return { success: false, error: err };
  }
}

/**
 * Registra o voto de prioridade na tabela 'votos_comercio'
 */
export async function registrarVotoComercio(itemId, turma = 'Geral') {
  try {
    if (!supabase) {
      return { 
        success: false, 
        offline: true, 
        error: new Error('Configure o SUPABASE_URL e SUPABASE_ANON_KEY no arquivo js/supabaseClient.js') 
      };
    }

    const { data, error } = await supabase
      .from('votos_comercio')
      .insert([{
        item_id: itemId,
        turma: turma
      }])
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Erro em registrarVotoComercio:', err);
    return { success: false, error: err };
  }
}

/**
 * Registra qualquer voto geral no banco de dados (propostas, comércio, eventos, torcida de salas, apoio)
 */
export async function registrarVotoGeral(categoria, itemId, turma = 'Geral') {
  try {
    if (!supabase) return { success: false, offline: true };

    const { data, error } = await supabase
      .from('votos_comercio')
      .insert([{
        item_id: itemId,
        turma: `${categoria}:${turma}`
      }])
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Erro em registrarVotoGeral:', err);
    return { success: false, error: err };
  }
}

/**
 * Obtém os feedbacks públicos para exibição no mural em tempo real
 */
export async function obterFeedbacksPublicos(limite = 40) {
  try {
    if (!supabase) return { data: [], offline: true };

    const { data, error } = await supabase
      .from('feedbacks')
      .select('id, tipo, turma, mensagem, created_at')
      .order('created_at', { ascending: false })
      .limit(limite);

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (err) {
    console.error('Erro em obterFeedbacksPublicos:', err);
    return { data: [], error: err };
  }
}

/**
 * Obtém a contagem de votos e total por item do comércio
 */
export async function obterMetricasVotos() {
  try {
    if (!supabase) {
      return { total: 0, contagem: {}, offline: true };
    }

    const { data, error } = await supabase
      .from('votos_comercio')
      .select('item_id');

    if (error) throw error;

    const contagem = {};
    (data || []).forEach(voto => {
      contagem[voto.item_id] = (contagem[voto.item_id] || 0) + 1;
    });

    return { 
      total: data.length, 
      contagem, 
      error: null 
    };
  } catch (err) {
    console.error('Erro em obterMetricasVotos:', err);
    return { total: 0, contagem: {}, error: err };
  }
}

/**
 * Autentica o administrador/membro da chapa no Supabase Auth
 */
export async function autenticarAdmin(email, senha) {
  try {
    if (!supabase) throw new Error('Supabase não configurado');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha
    });
    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Erro em autenticarAdmin:', err);
    return { success: false, error: err };
  }
}

/**
 * Desloga o usuário autenticado
 */
export async function deslogarAdmin() {
  try {
    if (!supabase) throw new Error('Supabase não configurado');
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Erro em deslogarAdmin:', err);
    return { success: false, error: err };
  }
}

/**
 * Obtém a sessão atual do usuário autenticado
 */
export async function obterSessao() {
  try {
    if (!supabase) return { session: null, error: new Error('Supabase não configurado') };
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { session: data?.session, error: null };
  } catch (err) {
    console.error('Erro em obterSessao:', err);
    return { session: null, error: err };
  }
}

/**
 * Obtém os feedbacks registrados no banco
 */
export async function obterFeedbacks(filtroStatus = null) {
  try {
    if (!supabase) return { data: [], offline: true };
    let query = supabase.from('feedbacks').select('*').order('created_at', { ascending: false });
    if (filtroStatus && filtroStatus !== 'todos') {
      query = query.eq('status', filtroStatus);
    }
    const { data, error } = await query;
    if (error) throw error;
    return { data: data || [], success: true };
  } catch (err) {
    console.error('Erro em obterFeedbacks:', err);
    return { data: [], error: err, success: false };
  }
}

/**
 * Atualiza o status de um feedback ('pendente', 'em_analise', 'atendido')
 */
export async function atualizarStatusFeedback(id, novoStatus) {
  try {
    if (!supabase) return { success: false, offline: true };
    const { data, error } = await supabase
      .from('feedbacks')
      .update({ status: novoStatus })
      .eq('id', id)
      .select();
    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Erro em atualizarStatusFeedback:', err);
    return { success: false, error: err };
  }
}

/**
 * Obtém todos os alertas de infraestrutura
 */
export async function obterAlertasInfra(filtroStatus = null) {
  try {
    if (!supabase) return { data: [], offline: true };
    let query = supabase.from('alertas_infra').select('*').order('created_at', { ascending: false });
    if (filtroStatus && filtroStatus !== 'todos') {
      query = query.eq('status', filtroStatus);
    }
    const { data, error } = await query;
    if (error) throw error;
    return { data: data || [], success: true };
  } catch (err) {
    console.error('Erro em obterAlertasInfra:', err);
    return { data: [], error: err, success: false };
  }
}

/**
 * Marca um alerta de infraestrutura como 'resolvido'
 */
export async function resolverAlertaInfra(id) {
  try {
    if (!supabase) return { success: false, offline: true };
    const { data, error } = await supabase
      .from('alertas_infra')
      .update({ status: 'resolvido' })
      .eq('id', id)
      .select();
    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Erro em resolverAlertaInfra:', err);
    return { success: false, error: err };
  }
}

function persistirEquipeTodosCaches(lista) {
  const json = JSON.stringify(lista);
  localStorage.setItem('arc07_team_members', json);
  localStorage.setItem('arc07_team', json);
  localStorage.setItem('arc07_equipe', json);
}

function obterEquipeCachesLocais() {
  const keys = ['arc07_team_members', 'arc07_team', 'arc07_equipe'];
  for (const k of keys) {
    const val = localStorage.getItem(k);
    if (val) {
      try {
        const arr = JSON.parse(val);
        if (Array.isArray(arr) && arr.length > 0) return arr;
      } catch (e) {}
    }
  }
  return null;
}

/**
 * Obtém a lista dos 13 integrantes da equipe (do Supabase ou localStorage)
 */
export async function obterEquipeMembros() {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('equipe_membros')
        .select('*')
        .order('id', { ascending: true });
      if (!error && data && data.length > 0) {
        persistirEquipeTodosCaches(data);
        return { data, success: true };
      }
    }
  } catch (err) {
    console.warn('Erro ao buscar equipe_membros do Supabase:', err);
  }

  // Fallback para cache local
  const cached = obterEquipeCachesLocais();
  if (cached) {
    return { data: cached, success: true, local: true };
  }
  return { data: null, success: false };
}

/**
 * Salva ou atualiza os dados e foto de um integrante específico
 */
export async function salvarMembroEquipe(membro) {
  try {
    const cached = obterEquipeCachesLocais() || [];
    const idx = cached.findIndex(m => m.id === membro.id);
    if (idx >= 0) cached[idx] = { ...cached[idx], ...membro };
    else cached.push(membro);
    persistirEquipeTodosCaches(cached);

    if (!supabase) return { success: true, local: true };

    const { data, error } = await supabase
      .from('equipe_membros')
      .upsert([{
        id: membro.id,
        name: membro.name,
        role: membro.role,
        turma: membro.turma,
        quote: membro.quote,
        photo: membro.photo || '',
        updated_at: new Date().toISOString()
      }])
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Erro ao salvarMembroEquipe:', err);
    return { success: false, error: err };
  }
}

/**
 * Salva a lista completa dos 13 membros (ex: bulk upload)
 */
export async function salvarEquipeCompleta(membros) {
  try {
    persistirEquipeTodosCaches(membros);
    if (!supabase) return { success: true, local: true };

    const payload = membros.map(m => ({
      id: m.id,
      name: m.name,
      role: m.role,
      turma: m.turma,
      quote: m.quote,
      photo: m.photo || '',
      updated_at: new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from('equipe_membros')
      .upsert(payload);

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Erro ao salvarEquipeCompleta:', err);
    return { success: false, error: err };
  }
}

/**
 * Salva ou recupera configurações globais do site (ex: cartaz oficial)
 */
export async function salvarConfiguracao(chave, valor) {
  try {
    localStorage.setItem(`arc07_${chave}`, valor);
    if (!supabase) return { success: true, local: true };

    const { data, error } = await supabase
      .from('configuracoes_site')
      .upsert([{ chave, valor, updated_at: new Date().toISOString() }]);

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Erro ao salvarConfiguracao:', err);
    return { success: false, error: err };
  }
}

export async function obterConfiguracao(chave) {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('configuracoes_site')
        .select('valor')
        .eq('chave', chave)
        .maybeSingle();
      if (!error && data?.valor) {
        localStorage.setItem(`arc07_${chave}`, data.valor);
        return { valor: data.valor, success: true };
      }
    }
  } catch (err) {
    console.warn('Erro ao obterConfiguracao:', err);
  }

  const localVal = localStorage.getItem(`arc07_${chave}`);
  return { valor: localVal, success: !!localVal, local: true };
}

/**
 * Obtém todos os comunicados / posts publicados pela presidência
 * (Prioridade: Tabela 'comunicados' no Supabase -> REST -> Cache Local)
 */
export async function obterComunicados() {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('comunicados')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && Array.isArray(data)) {
        localStorage.setItem('arc07_comunicados', JSON.stringify(data));
        return data;
      }
    }
    const resp = await fetch(`${SUPABASE_URL}/rest/v1/comunicados?select=*&order=created_at.desc`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY
      }
    });
    if (resp.ok) {
      const data = await resp.json();
      if (Array.isArray(data)) {
        localStorage.setItem('arc07_comunicados', JSON.stringify(data));
        return data;
      }
    }
  } catch (e) {
    console.warn('Erro ao obter comunicados da tabela:', e);
  }

  // Fallback configuracoes_site e local
  try {
    const res = await obterConfiguracao('comunicados_posts');
    if (res?.valor) {
      const posts = JSON.parse(res.valor);
      if (Array.isArray(posts) && posts.length > 0) return posts;
    }
  } catch (e) {}

  try {
    const local = localStorage.getItem('arc07_comunicados');
    if (local) return JSON.parse(local);
  } catch(e) {}
  return [];
}

/**
 * Salva a lista completa de comunicados no Supabase
 */
export async function salvarComunicados(posts) {
  try {
    localStorage.setItem('arc07_comunicados', JSON.stringify(posts));
    await salvarConfiguracao('comunicados_posts', JSON.stringify(posts));
    return { success: true };
  } catch (e) {
    console.error('Erro ao salvar comunicados:', e);
    return { success: false, error: e };
  }
}

/**
 * Publica um novo comunicado da presidência
 */
export async function publicarComunicado(novoPost) {
  try {
    if (supabase) {
      await supabase.from('comunicados').insert([novoPost]);
    }
    await fetch(`${SUPABASE_URL}/rest/v1/comunicados`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY
      },
      body: JSON.stringify(novoPost)
    });
  } catch (e) {}

  const posts = await obterComunicados();
  posts.unshift(novoPost);
  return await salvarComunicados(posts);
}

/**
 * Exclui um comunicado pelo ID
 */
export async function excluirComunicado(id) {
  try {
    if (supabase) {
      await supabase.from('comunicados').delete().eq('id', id);
    }
    await fetch(`${SUPABASE_URL}/rest/v1/comunicados?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY
      }
    });
  } catch (e) {}

  const posts = await obterComunicados();
  const filtrados = posts.filter(p => p.id !== id);
  return await salvarComunicados(filtrados);
}

/**
 * Zera todos os votos de teste no Supabase (apenas para Admin autenticado)
 */
export async function zerarVotosBanco() {
  try {
    localStorage.removeItem('arc07_proposals');
    localStorage.removeItem('arc07_store');
    localStorage.removeItem('arc07_classrooms');
    localStorage.removeItem('arc07_eventpoll');
    localStorage.removeItem('arc07_hero_supported');

    if (!supabase) return { success: true, local: true };

    const { error } = await supabase
      .from('votos_comercio')
      .delete()
      .neq('item_id', '___safe_placeholder___');

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Erro em zerarVotosBanco:', err);
    return { success: false, error: err };
  }
}

// ========================================================
// 4. Integração dos Event Listeners com a UI
// ========================================================

document.addEventListener('DOMContentLoaded', () => {
  initOuvidoriaForm();
  initAlertaBanheiro();
  initVotacaoComercio();
  sincronizarTudoSupabase();
});

// A. Formulário de Ouvidoria / Caixinha de Sugestões
function initOuvidoriaForm() {
  const form = document.getElementById('suggestionForm');
  if (!form) return;

  // Intercepta o envio do formulário
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const nameInput = document.getElementById('sugName');
    const turmaInput = document.getElementById('sugTurma');
    const categorySelect = document.getElementById('sugCategory');
    const messageInput = document.getElementById('sugMessage');

    const nome = nameInput?.value.trim() || 'Anônimo';
    const turma = turmaInput?.value.trim();
    const categoria = categorySelect?.value || 'Geral';
    const mensagem = messageInput?.value.trim();

    if (!turma || !mensagem) {
      exibirToast('Preencha sua turma e mensagem!', true);
      return;
    }

    const mensagemCompleta = nome !== 'Anônimo' 
      ? `[${nome}]: ${mensagem}` 
      : mensagem;

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="bi bi-hourglass-split animate-spin text-arc-yellow"></i> Enviando...`;
    }

    try {
      // 1. Envia para a tabela feedbacks
      const resultadoFeedback = await enviarFeedback(categoria, turma, mensagemCompleta);

      // 2. Se a categoria for de banheiro/papel higiênico, registra também em alertas_infra
      if (categoria.includes('Banheiro') || categoria.includes('Papel') || mensagem.toLowerCase().includes('papel')) {
        await registrarAlertaInfra('papel_higienico', `Turma ${turma}: ${mensagem}`);
      }

      // 3. Atualiza o mural na tela instantaneamente
      if (typeof window.suggestions !== 'undefined' && Array.isArray(window.suggestions)) {
        window.suggestions.unshift({
          name: nome,
          turma: turma,
          category: categoria,
          message: mensagem,
          time: 'Agora mesmo'
        });
        if (typeof window.renderSuggestionsWall === 'function') {
          window.renderSuggestionsWall();
        }
      }

      // Limpa os campos
      if (messageInput) messageInput.value = '';

      if (resultadoFeedback.success) {
        exibirToast('Ideia enviada ao Supabase com sucesso! A Chapa ARC 07 agradece! 🦜');
      } else if (resultadoFeedback.offline) {
        exibirToast('Ideia registrada no mural local! (Configure as chaves do Supabase para salvar no banco)');
      } else {
        exibirToast('Erro ao gravar no Supabase, mas seu feedback foi salvo localmente.', true);
      }
    } catch (err) {
      console.error(err);
      exibirToast('Falha na comunicação com o servidor.', true);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }
  }, true);
}

// B. Botão de Alerta Rápido de Papel Higiênico
function initAlertaBanheiro() {
  // Procura pelo botão existente ou cria o listener para o alerta rápido
  const btnAlerta = document.getElementById('btnAlertaBanheiro');
  
  if (btnAlerta) {
    btnAlerta.addEventListener('click', async (e) => {
      e.preventDefault();
      await dispararAlertaPapelHigienico();
    });
  }
}

export async function dispararAlertaPapelHigienico(localizacaoFornecida) {
  let localizacao = localizacaoFornecida;

  if (!localizacao) {
    localizacao = prompt(
      '🚨 ALERTA RÁPIDO CHAPA ARC 07:\nEm qual banheiro está faltando papel higiênico ou sabonete?',
      'Banheiro Feminino - 1º Andar'
    );
  }

  if (!localizacao || !localizacao.trim()) {
    return;
  }

  exibirToast('Registrando alerta de reposição...');

  const resultado = await registrarAlertaInfra('papel_higienico', localizacao.trim());

  if (resultado.success) {
    exibirToast(`🚨 Alerta registrado no Supabase! A equipe ARC 07 foi comunicada para repor o ${localizacao}! 🧻`);
  } else if (resultado.offline) {
    exibirToast(`🚨 Alerta registrado localmente: ${localizacao}! (Configure as credenciais do Supabase)`);
  } else {
    exibirToast('Não foi possível enviar o alerta ao Supabase. Tente novamente!', true);
  }
}

// C. Votação de Materiais do Comércio Escolar (Vendinha)
function initVotacaoComercio() {
  const container = document.getElementById('storePriorityList');
  if (!container) return;

  // Intercepta cliques de votação no container
  container.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-store-id]') || e.target.closest('button');
    if (!btn) return;

    // Obtém o ID do item
    const matchId = btn.getAttribute('data-store-id') || 
                    btn.getAttribute('onclick')?.match(/voteStoreItem\(['"]([^'"]+)['"]\)/)?.[1];

    if (!matchId) return;

    // Impede o onclick original do HTML para centralizar aqui
    e.preventDefault();
    e.stopPropagation();

    await executarVotoComercio(matchId);
  }, true);

  // Também expõe a função global para caso o inline onclick seja disparado
  window.voteStoreItem = async function(id) {
    await executarVotoComercio(id);
  };
}

async function executarVotoComercio(itemId) {
  // Busca a turma do usuário ou usa padrão
  const turmaSalva = localStorage.getItem('arc07_user_turma') || 
                     document.getElementById('sugTurma')?.value.trim() || 
                     'Geral';

  // Atualiza localmente o array para resposta visual instantânea
  if (typeof window.storeItems !== 'undefined' && Array.isArray(window.storeItems)) {
    const item = window.storeItems.find(i => i.id === itemId);
    if (item) {
      item.votes = (item.votes || 0) + 1;
      localStorage.setItem('arc07_store', JSON.stringify(window.storeItems));
      if (typeof window.renderStorePoll === 'function') {
        window.renderStorePoll();
      }
    }
  }

  // Envia o voto para o Supabase
  const resultado = await registrarVotoComercio(itemId, turmaSalva);

  if (resultado.success) {
    exibirToast(`Voto registrado com sucesso no Supabase! 🏓`);
  } else if (resultado.offline) {
    exibirToast(`Voto registrado localmente! (Configure o Supabase em js/supabaseClient.js)`);
  } else {
    exibirToast('Erro ao salvar voto no Supabase.', true);
  }
}

/**
 * Sincroniza todos os dados reais do Supabase na inicialização:
 * Votos de comércio, propostas, eventos, torcida de salas, apoio geral, mural e equipe
 */
export async function sincronizarTudoSupabase() {
  if (!supabase) return;

  try {
    // 0. Sincroniza Tema Ativo Instantaneamente (Halloween / Padrão PARA TODOS)
    try {
      const resTema = await obterConfiguracao('tema_ativo');
      if (resTema?.valor) {
        const isHalloween = resTema.valor === 'halloween';
        if (typeof window.alternarHalloween === 'function') {
          window.alternarHalloween(isHalloween);
        } else {
          if (isHalloween) {
            document.body.classList.add('theme-halloween');
            localStorage.setItem('chapa_arc_tema', 'halloween');
          } else {
            document.body.classList.remove('theme-halloween');
            localStorage.setItem('chapa_arc_tema', 'padrao');
          }
        }
      }
    } catch (e) {}

    // 1. Sincroniza Votos de todas as categorias
    const metricas = await obterMetricasVotos();
    const contagem = metricas.contagem || {};

    // Sincroniza lista dinâmica da Vendinha (se o Grêmio alterou no painel)
    const resStoreList = await obterConfiguracao('store_items_list');
    if (resStoreList?.valor) {
      try {
        const parsed = JSON.parse(resStoreList.valor);
        if (Array.isArray(parsed)) {
          window.storeItems = parsed.map(item => ({
            ...item,
            votes: (contagem[item.id] !== undefined) ? Number(contagem[item.id]) : (Number(item.votes) || 0)
          }));
          localStorage.setItem('arc07_store', JSON.stringify(window.storeItems));
        }
      } catch(e) {}
    }

    // Sincroniza lista dinâmica de Eventos (se o Grêmio alterou no painel)
    const resEventList = await obterConfiguracao('event_poll_list');
    if (resEventList?.valor) {
      try {
        const parsed = JSON.parse(resEventList.valor);
        if (Array.isArray(parsed)) {
          window.eventPoll = parsed.map(item => ({
            ...item,
            votes: (contagem[item.id] !== undefined) ? Number(contagem[item.id]) : (Number(item.votes) || 0)
          }));
          localStorage.setItem('arc07_eventpoll', JSON.stringify(window.eventPoll));
        }
      } catch(e) {}
    }

    // Vendinha (Comércio Escolar)
    if (typeof window.storeItems !== 'undefined' && Array.isArray(window.storeItems)) {
      window.storeItems.forEach(item => {
        item.votes = (contagem[item.id] !== undefined) ? Number(contagem[item.id]) : (Number(item.votes) || 0);
      });
      localStorage.setItem('arc07_store', JSON.stringify(window.storeItems));
      if (typeof window.renderStorePoll === 'function') window.renderStorePoll();
    }

    // Propostas
    if (typeof window.proposals !== 'undefined' && Array.isArray(window.proposals)) {
      window.proposals.forEach(p => {
        p.votes = (contagem[p.id] !== undefined) ? Number(contagem[p.id]) : (Number(p.votes) || 0);
      });
      if (typeof window.renderProposals === 'function') window.renderProposals();
      if (typeof window.updateTotalSupportersCount === 'function') window.updateTotalSupportersCount();
    }

    // Eventos
    if (typeof window.eventPoll !== 'undefined' && Array.isArray(window.eventPoll)) {
      window.eventPoll.forEach(e => {
        e.votes = (contagem[e.id] !== undefined) ? Number(contagem[e.id]) : (Number(e.votes) || 0);
      });
      localStorage.setItem('arc07_eventpoll', JSON.stringify(window.eventPoll));
      if (typeof window.renderEventPoll === 'function') window.renderEventPoll();
    }

    // Salas (Torcida)
    if (typeof window.classrooms !== 'undefined' && Array.isArray(window.classrooms)) {
      window.classrooms.forEach(c => {
        c.votes = (contagem[c.id] !== undefined) ? Number(contagem[c.id]) : (Number(c.votes) || 0);
      });
      if (typeof window.renderClassrooms === 'function') window.renderClassrooms();
    }

    // Apoio dos Alunos (Hero) - Mantém a integridade do contador oficial
    if (typeof window.updateTotalSupportersCount === 'function') {
      window.updateTotalSupportersCount();
    }

    // 2. Sincroniza Mural de Feedbacks / Sugestões reais
    const resFeedbacks = await obterFeedbacksPublicos(30);
    if (resFeedbacks?.data && typeof window.suggestions !== 'undefined') {
      window.suggestions = resFeedbacks.data.map(f => {
        let autor = 'Estudante Anônimo';
        let msg = f.mensagem || '';
        if (msg.startsWith('[') && msg.includes(']: ')) {
          const fecho = msg.indexOf(']: ');
          autor = msg.slice(1, fecho);
          msg = msg.slice(fecho + 3);
        }
        return {
          name: autor,
          turma: f.turma || 'Geral',
          category: f.tipo || 'Geral',
          message: msg,
          time: new Date(f.created_at).toLocaleDateString('pt-BR')
        };
      });
      if (typeof window.renderSuggestionsWall === 'function') {
        window.renderSuggestionsWall();
      }
    }

    // 3. Sincroniza Integrantes da Equipe (Dinâmico para qualquer quantidade de membros)
    const resEquipe = await obterEquipeMembros();
    if (resEquipe?.data && resEquipe.data.length > 0 && Array.isArray(window.teamMembers)) {
      const map = {};
      window.teamMembers.forEach(m => { if (m && m.id) map[m.id] = { ...m }; });
      resEquipe.data.forEach(m => {
        if (m && m.id) map[m.id] = { ...(map[m.id] || {}), ...m };
      });
      window.teamMembers = Object.values(map).sort((a, b) => a.id - b.id);
      if (typeof window.renderTeam === 'function') {
        window.renderTeam();
      }
    }

    // 4. Sincroniza Cartaz Oficial
    const resPoster = await obterConfiguracao('poster');
    if (resPoster?.valor && typeof window.applyPosterImage === 'function') {
      window.applyPosterImage(resPoster.valor);
    }

    // 5. Sincroniza Comunicados / Posts da Presidência
    const posts = await obterComunicados();
    if (typeof window.renderComunicadosPublicos === 'function') {
      window.renderComunicadosPublicos(posts);
    }

    // 6. Sincroniza Textos Personalizados do Site (Instagram, Slogan, etc.)
    const resInstagram = await obterConfiguracao('site_instagram');
    if (resInstagram?.valor) {
      document.querySelectorAll('.site-instagram-text').forEach(el => el.textContent = resInstagram.valor);
      document.querySelectorAll('.site-instagram-link').forEach(el => el.href = `https://instagram.com/${resInstagram.valor.replace('@', '')}`);
    }

    const resSlogan = await obterConfiguracao('site_slogan');
    if (resSlogan?.valor) {
      document.querySelectorAll('.site-slogan-text').forEach(el => el.textContent = resSlogan.valor);
    }

    // 7. Sincroniza Contador Global de Apoios
    const resApoio = await obterConfiguracao('total_apoios');
    if (resApoio?.valor && typeof window.updateTotalSupportersCount === 'function') {
      window.updateTotalSupportersCount(parseInt(resApoio.valor, 10));
    }

    // 8. Sincroniza Lista de Cursos Gratuitos (Sebrae, SENAI & Parceiros)
    const resCursos = await obterConfiguracao('cursos_lista');
    if (resCursos?.valor) {
      try {
        const cursosParsed = JSON.parse(resCursos.valor);
        if (Array.isArray(cursosParsed)) {
          window.courses = cursosParsed;
          localStorage.setItem('arc07_cursos', JSON.stringify(cursosParsed));
          if (typeof window.renderCourses === 'function') {
            window.renderCourses();
          }
        }
      } catch (e) {
        console.warn('Erro ao processar cursos_lista do Supabase:', e);
      }
    }

    // 9. Sincroniza Tema Ativo (Padrão ou Especial de Halloween)
    const resTema = await obterConfiguracao('tema_ativo');
    if (resTema?.valor) {
      const isHalloween = resTema.valor === 'halloween';
      if (typeof window.alternarHalloween === 'function') {
        window.alternarHalloween(isHalloween);
      } else {
        if (isHalloween) {
          document.body.classList.add('theme-halloween');
          localStorage.setItem('chapa_arc_tema', 'halloween');
        } else {
          document.body.classList.remove('theme-halloween');
          localStorage.setItem('chapa_arc_tema', 'padrao');
        }
      }
    }
  } catch (err) {
    console.warn('Sincronização com Supabase (offline/tabelas pendentes):', err);
  }
}

// ========================================================
// Exposição Global para compatibilidade total com o HTML
// ========================================================
window.supabaseARC07 = {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  isConfigured,
  supabase,
  enviarFeedback,
  registrarAlertaInfra,
  registrarVotoComercio,
  registrarVotoGeral,
  obterMetricasVotos,
  obterFeedbacksPublicos,
  sincronizarTudoSupabase,
  autenticarAdmin,
  deslogarAdmin,
  obterSessao,
  obterEquipeMembros,
  salvarMembroEquipe,
  salvarEquipeCompleta,
  salvarConfiguracao,
  obterConfiguracao,
  obterComunicados,
  salvarComunicados,
  publicarComunicado,
  excluirComunicado,
  zerarVotosBanco,
  dispararAlertaPapelHigienico,
  exibirToast
};

if (typeof window !== 'undefined') {
  setTimeout(() => {
    sincronizarTudoSupabase();
  }, 150);
}
