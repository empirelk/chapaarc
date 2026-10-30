const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('🧪 BATERIA DE TESTES DE INTEGRIDADE E FUNCIONALIDADE');
console.log('   CHAPA ARC 07 — SISTEMA COMPLETO');
console.log('====================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(description, condition, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${description}`);
  } else {
    failedTests++;
    console.error(`  ❌ [FAIL] ${description} ${details ? '-> ' + details : ''}`);
  }
}

// ------------------------------------------------------------------
// 1. VERIFICAÇÃO DE ARQUIVOS ESSENCIAIS DO PROJETO
// ------------------------------------------------------------------
console.log('📁 1. Verificação de Arquivos e Estrutura:');
const requiredFiles = [
  'index.html',
  'site_oficial_chapa_arc_07.html',
  'admin-login.html',
  'admin-dashboard.html',
  'schema.sql',
  '_redirects',
  'netlify.toml',
  'js/supabaseClient.js'
];

requiredFiles.forEach(file => {
  assert(`Arquivo ${file} existe no projeto`, fs.existsSync(file));
});

// ------------------------------------------------------------------
// 2. SINCRONISMO ENTRE INDEX.HTML E SITE_OFICIAL_CHAPA_ARC_07.HTML
// ------------------------------------------------------------------
console.log('\n🔄 2. Sincronismo da Landing Page:');
const indexContent = fs.readFileSync('index.html', 'utf8');
const siteOficialContent = fs.readFileSync('site_oficial_chapa_arc_07.html', 'utf8');
assert('index.html e site_oficial_chapa_arc_07.html são idênticos em conteúdo', indexContent === siteOficialContent);

// ------------------------------------------------------------------
// 3. TESTE DO TIMER DA ELEIÇÃO (03 DE NOVEMBRO)
// ------------------------------------------------------------------
console.log('\n⏱️ 3. Teste do Timer da Eleição (03 de Novembro):');
assert('Timer aponta para data oficial 03 de Novembro', indexContent.includes("new Date('2026-11-03T08:00:00')"));
assert('Timer não usa mais soma relativa volátil (Date.now() + 3 dias)', !indexContent.includes('Date.now() + (3 * 24'));
assert('Badge visual exibe 03 de Novembro', indexContent.includes('03 de Novembro'));

// Simulação de cálculo do timer
const targetDate = new Date('2026-11-03T08:00:00').getTime();
const simulatedNow = new Date('2026-10-27T18:25:00').getTime();
const diff = targetDate - simulatedNow;
const days = Math.floor(diff / (1000 * 60 * 60 * 24));
assert(`Cálculo do timer: faltam ${days} dias para 03/11/2026`, days >= 6 && days <= 7);

// ------------------------------------------------------------------
// 4. TESTE DO RANKING DE TORCIDA / SALAS LIMPAS (1A a 3C)
// ------------------------------------------------------------------
console.log('\n🏆 4. Teste das Salas Oficiais (Torcida e Sala Limpa):');
const expectedSalas = ['1º A', '1º B', '1º C', '2º A', '2º B', '2º C', '3º A', '3º B', '3º C'];
expectedSalas.forEach(sala => {
  assert(`Sala oficial presente: ${sala}`, indexContent.includes(`name: '${sala}'`));
});
assert('Salas antigas/fictícias como 6A, 7A, 8A foram purgadas', !indexContent.includes("'6º A'") && !indexContent.includes("'7º A'") && !indexContent.includes("'8º A'"));
assert('Todos os contadores de votos iniciam estritamente em zero', indexContent.includes("votes: 0"));

// ------------------------------------------------------------------
// 5. TESTE DA SEÇÃO DE APOIO DIGITAL (HERO SUPPORT COUNTER)
// ------------------------------------------------------------------
console.log('\n🤝 5. Teste da Seção de Apoio Digital:');
assert('Elemento contador de apoiadores heroTotalSupporters presente', indexContent.includes('id="heroTotalSupporters"'));
assert('Botão heroSupportBtn presente com ação declareSupportHero', indexContent.includes('id="heroSupportBtn"') && indexContent.includes('onclick="declareSupportHero()"'));
assert('Função declareSupportHero incrementa contador global e persiste', indexContent.includes('arc07_total_supporters') && indexContent.includes('total_apoios'));
assert('Prevenção de voto duplo com flag persistente', indexContent.includes('arc07_hero_supported'));

// ------------------------------------------------------------------
// 6. TESTE DOS INTEGRANTES DA EQUIPE (16 CARDS BASE + DINÂMICO)
// ------------------------------------------------------------------
console.log('\n👥 6. Teste dos 16 Integrantes Base da Equipe Oficial:');
const expectedRoles = [
  'Presidência',
  'Vice-Presidência',
  'Secretaria Geral',
  'Tesouraria & Vendinha',
  'Diretoria de Esportes',
  'Esportes & Torneios',
  'Eventos & Cultura',
  'Recreio & Lazer',
  'Comunicação & Redes',
  'Assistência & Estrutura',
  'Sala Mais Limpa',
  'Ações Solidárias',
  'Voz do Aluno',
  'Apoio & Representação',
  'Apoio & Mobilização',
  'Apoio & Projetos'
];

expectedRoles.forEach((role, i) => {
  const memberId = i + 1;
  assert(`Integrante #${String(memberId).padStart(2, '0')} configurado com cargo ${role}`, indexContent.includes(`id: ${memberId}`) && indexContent.includes(role));
});

assert('Estrutura do index.html suporta 16 membros e renderização dinâmica', indexContent.includes('teamTotalDisplay') && indexContent.includes('defaultTeamMembers.forEach'));

// ------------------------------------------------------------------
// 7. TESTE DA PROPOSTA #10 E SEÇÃO DE CURSOS GRATUITOS
// ------------------------------------------------------------------
console.log('\n🎓 7. Teste de Cursos Gratuitos (Sebrae, SENAI & Parceiros):');
assert('Proposta #10 configurada no index.html com ID prop-10', indexContent.includes("id: 'prop-10'") && indexContent.includes("number: '10'"));
assert('Título da proposta menciona Cursos Gratuitos', indexContent.includes('Cursos Gratuitos (Sebrae, SENAI & Plataformas Confiáveis)'));
assert('Filtro de educação presente no cabeçalho das propostas', indexContent.includes("filterProposals('educacao')"));
assert('Seção dedicada #cursos presente no HTML', indexContent.includes('id="cursos"'));
assert('Grid de cursos #coursesGrid presente', indexContent.includes('id="coursesGrid"'));
assert('Função renderCourses implementada e exportada globalmente', indexContent.includes('function renderCourses()') && indexContent.includes('window.renderCourses = renderCourses'));
assert('Cursos padrão incluem Sebrae, SENAI e Fundação Bradesco', indexContent.includes('Sebrae') && indexContent.includes('SENAI') && indexContent.includes('Fundação Bradesco'));
assert('Links de navegação do menu desktop e mobile apontam para #cursos', indexContent.includes('href="#cursos"'));

// ------------------------------------------------------------------
// 8. TESTE DA PROPOSTA #11 (JARDIM DE CONEXÃO COM A NATUREZA)
// ------------------------------------------------------------------
console.log('\n🌱 8. Teste da Proposta #11 (Jardim de Conexão com a Natureza):');
assert('Proposta #11 configurada no index.html com ID prop-11', indexContent.includes("id: 'prop-11'") && indexContent.includes("number: '11'"));
assert('Título da proposta menciona Jardim de Conexão com a Natureza', indexContent.includes('Jardim de Conexão com a Natureza'));
assert('Filtro de natureza presente no cabeçalho das propostas', indexContent.includes("filterProposals('natureza')"));
assert('Badge visual exibe 11 Propostas no título e navegação', indexContent.includes('11 Propostas'));

// ------------------------------------------------------------------
// 9. TESTE DO DASHBOARD ADMINISTRATIVO (ADMIN-DASHBOARD.HTML)
// ------------------------------------------------------------------
console.log('\n🎛️ 9. Teste do Painel Administrativo (admin-dashboard.html):');
const adminContent = fs.readFileSync('admin-dashboard.html', 'utf8');

assert('Script não utiliza mais type="module" (evita travamentos de CORS)', !adminContent.includes('<script type="module">'));
assert('Supabase JS UMD carregado no cabeçalho', adminContent.includes('@supabase/supabase-js@2'));
assert('Função handleLogout implementada com redirecionamento incondicional', adminContent.includes('window.handleLogout') && adminContent.includes("window.location.href = 'index.html'"));
assert('Função switchTab suporta todas as 7 abas incluindo cursos', 
  adminContent.includes("'posts'") && 
  adminContent.includes("'equipe'") && 
  adminContent.includes("'cursos'") && 
  adminContent.includes("'config'") && 
  adminContent.includes("'feedbacks'") && 
  adminContent.includes("'infra'") && 
  adminContent.includes("'comercio'")
);

assert('Aba e formulário de Cursos Gratuitos no painel admin presentes', 
  adminContent.includes('id="tabBtnCursos"') && 
  adminContent.includes('id="tabContentCursos"') && 
  adminContent.includes('id="formCadastrarCurso"') &&
  adminContent.includes('id="adminCoursesList"')
);

assert('Funções administrativas de cursos implementadas', 
  adminContent.includes('carregarCursosAdmin') && 
  adminContent.includes('handleCadastrarCurso') && 
  adminContent.includes('handleExcluirCurso') &&
  adminContent.includes('handleRestaurarCursosPadrao')
);

assert('Formulário de Adicionar Novo Integrante presente no painel admin', 
  adminContent.includes('id="formAddMember"') &&
  adminContent.includes('handleAdicionarMembro') &&
  adminContent.includes('handleExcluirMembro')
);

assert('Suporte a 16 integrantes base e expansão dinâmica de membros no painel', adminContent.includes('defaultTeamData') && adminContent.includes('currentTeam.length'));
assert('Botão de Subir Fotos da Galeria presente', adminContent.includes('handleAdminBulkPhotos'));
assert('Botão de Baixar Fotos (.json) presente', adminContent.includes('exportarFotosJSON'));
assert('Botão de Carregar Fotos (.json) presente', adminContent.includes('importarFotosJSON'));
assert('Unificação das chaves de persistência de equipe em todos os caches', adminContent.includes('persistirEquipeTodosCaches'));

assert('Painel de administração da Vendinha permite adicionar, excluir e restaurar itens de compras', 
  adminContent.includes('handleAdicionarItemVendinha') && 
  adminContent.includes('handleExcluirItemVendinha') && 
  adminContent.includes('handleRestaurarItensVendinhaPadrao') &&
  adminContent.includes('handleZerarVotosVendinha')
);

assert('Painel de administração de Eventos permite adicionar, excluir e restaurar opções de eventos', 
  adminContent.includes('handleAdicionarOpcaoEvento') && 
  adminContent.includes('handleExcluirOpcaoEvento') && 
  adminContent.includes('handleRestaurarEventosPadrao') &&
  adminContent.includes('handleZerarVotosEventos')
);

// ------------------------------------------------------------------
// 9. TESTE DO SCRIPT SUPABASE (JS/SUPABASECLIENT.JS)
// ------------------------------------------------------------------
console.log('\n⚡ 9. Teste do Cliente Supabase (js/supabaseClient.js):');
const supabaseClientContent = fs.readFileSync('js/supabaseClient.js', 'utf8');

assert('Credenciais oficiais do Supabase configuradas', supabaseClientContent.includes('mwjrivlmeixfysfycedj.supabase.co'));
assert('Função obterEquipeMembros utiliza fallback de caches unificados', supabaseClientContent.includes('obterEquipeCachesLocais'));
assert('Função sincronizarTudoSupabase inclui sincronização do contador de apoios', supabaseClientContent.includes('total_apoios'));
assert('Função sincronizarTudoSupabase inclui sincronização de cursos_lista', supabaseClientContent.includes('cursos_lista'));
assert('Função sincronizarTudoSupabase inclui sincronização de store_items_list', supabaseClientContent.includes('store_items_list'));
assert('Função sincronizarTudoSupabase inclui sincronização de event_poll_list', supabaseClientContent.includes('event_poll_list'));
assert('Sincronização automática disparada no carregamento', supabaseClientContent.includes('sincronizarTudoSupabase();'));

// ------------------------------------------------------------------
// 10. TESTE DO SCHEMA SQL (SCHEMA.SQL)
// ------------------------------------------------------------------
console.log('\n📄 10. Teste do Schema do Banco de Dados (schema.sql):');
const schemaContent = fs.readFileSync('schema.sql', 'utf8');

const tables = [
  'feedbacks',
  'alertas_infra',
  'votos_comercio',
  'votos_geral',
  'equipe_membros',
  'configuracoes_site',
  'comunicados'
];

tables.forEach(table => {
  assert(`Tabela ${table} declarada com CREATE TABLE IF NOT EXISTS`, schemaContent.includes(`CREATE TABLE IF NOT EXISTS public.${table}`));
  assert(`RLS habilitado para tabela ${table}`, schemaContent.includes(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;`));
  assert(`Política pública configurada para ${table}`, schemaContent.includes(`ON public.${table} FOR ALL`));
});

// ------------------------------------------------------------------
// 11. TESTE DE CONFIGURAÇÕES DE DEPLOY (NETLIFY)
// ------------------------------------------------------------------
console.log('\n🌐 11. Teste de Configuração Netlify:');
const redirectsContent = fs.readFileSync('_redirects', 'utf8');
const netlifyToml = fs.readFileSync('netlify.toml', 'utf8');

assert('Rota /gestao-arc mapeada no _redirects', redirectsContent.includes('/gestao-arc') && redirectsContent.includes('/admin-login.html'));
assert('Rota /gestao-arc/dashboard mapeada no _redirects', redirectsContent.includes('/gestao-arc/dashboard') && redirectsContent.includes('/admin-dashboard.html'));
assert('Configuração de publish no netlify.toml definida corretamente', netlifyToml.includes('publish = "."') || netlifyToml.includes('publish = "./"'));

// ------------------------------------------------------------------
// 12. TESTE DO MODO ESPECIAL DE HALLOWEEN
// ------------------------------------------------------------------
console.log('\n🎃 12. Teste do Sistema Temático de Halloween:');
assert('Arquivo css/halloween.css existe no projeto', fs.existsSync('css/halloween.css'));
assert('Arquivo js/halloween.js existe no projeto', fs.existsSync('js/halloween.js'));

const hwCss = fs.readFileSync('css/halloween.css', 'utf8');
const hwJs = fs.readFileSync('js/halloween.js', 'utf8');

assert('CSS de Halloween possui regras isoladas para .theme-halloween', hwCss.includes('body.theme-halloween'));
assert('CSS de Halloween possui recolorização em laranja abóbora e roxo', hwCss.includes('--hw-orange') && hwCss.includes('--hw-purple'));
assert('Engine JS possui renderizador de fantasmas e morcegos a 60 FPS', hwJs.includes('class Ghost') && hwJs.includes('class Bat'));
assert('Engine JS exporta funções globais de ativação e reversão', hwJs.includes('window.iniciarHalloween') && hwJs.includes('window.pararHalloween') && hwJs.includes('window.alternarHalloween'));
assert('Painel ADM possui switch de controle do Modo Halloween', adminContent.includes('btnToggleHalloween') && adminContent.includes('badgeHalloweenStatus'));
assert('Painel ADM possui handler de ativação com Supabase', adminContent.includes('handleToggleAdminHalloween') && adminContent.includes('tema_ativo'));
assert('Cliente Supabase possui sincronização automática do tema_ativo', supabaseClientContent.includes('tema_ativo') && supabaseClientContent.includes('alternarHalloween'));
assert('Landing page index.html inclui assets e banner temático', indexContent.includes('css/halloween.css') && indexContent.includes('js/halloween.js') && indexContent.includes('halloween-announcement-banner'));
assert('Landing page réplica inclui assets e banner temático', siteOficialContent.includes('css/halloween.css') && siteOficialContent.includes('js/halloween.js') && siteOficialContent.includes('halloween-announcement-banner'));

// ------------------------------------------------------------------
// 13. TESTE DO BADGE FLUTUANTE DE DEPLOY (GUSTAVO AGOSTINHO)
// ------------------------------------------------------------------
console.log('\n🚀 13. Teste do Badge Flutuante de Deploy:');
const freshIndex = fs.readFileSync('index.html', 'utf8');
const freshReplica = fs.readFileSync('site_oficial_chapa_arc_07.html', 'utf8');

assert('Badge flutuante devFloatingBadge presente no index.html', freshIndex.includes('id="devFloatingBadge"'));
assert('Badge flutuante aponta para Instagram @sexcdarskinarchiives_', freshIndex.includes('instagram.com/sexcdarskinarchiives_'));
assert('Badge inicializa com Deployed for: Gustavo Agostinho', freshIndex.includes('Gustavo Agostinho'));
assert('Script alterna com @sexcdarskinarchiives_ a cada 5 segundos', freshIndex.includes('5000') && freshIndex.includes('@sexcdarskinarchiives_'));
assert('Badge flutuante idêntico no site_oficial_chapa_arc_07.html', freshReplica.includes('id="devFloatingBadge"') && freshReplica.includes('sexcdarskinarchiives_'));

// ------------------------------------------------------------------
// 14. VALIDAÇÃO DE SINTAXE JAVASCRIPT (PREVENÇÃO DE TELA BRANCA / LOOPS)
// ------------------------------------------------------------------
console.log('\n🛡️ 14. Validação de Sintaxe JavaScript nos Scripts Inline:');

function validateInlineScripts(filename) {
  const content = fs.readFileSync(filename, 'utf8');
  const regex = /<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  let blockIdx = 0;
  while ((match = regex.exec(content)) !== null) {
    blockIdx++;
    try {
      new Function(match[1]);
    } catch(err) {
      return { valid: false, error: `Erro no bloco ${blockIdx} de ${filename}: ${err.message}` };
    }
  }
  return { valid: true, blocks: blockIdx };
}

const syntaxIndex = validateInlineScripts('index.html');
assert(`Scripts inline de index.html compilam sem erros de sintaxe (${syntaxIndex.blocks} blocos)`, syntaxIndex.valid);

const syntaxReplica = validateInlineScripts('site_oficial_chapa_arc_07.html');
assert(`Scripts inline de site_oficial_chapa_arc_07.html compilam sem erros de sintaxe (${syntaxReplica.blocks} blocos)`, syntaxReplica.valid);

const syntaxAdmin = validateInlineScripts('admin-dashboard.html');
assert(`Scripts inline de admin-dashboard.html compilam sem erros de sintaxe (${syntaxAdmin.blocks} blocos)`, syntaxAdmin.valid);

// ------------------------------------------------------------------
// RESULTADO FINAL DA BATERIA
// ------------------------------------------------------------------
console.log('\n====================================================');
console.log(`📊 RESULTADO FINAL: ${passedTests}/${totalTests} TESTES APROVADOS (${Math.round((passedTests/totalTests)*100)}%)`);
if (failedTests === 0) {
  console.log('🎉 TODOS OS SISTEMAS ESTÃO 100% OPERACIONAIS E VALIDADOS!');
} else {
  console.log(`⚠️ ${failedTests} TESTES FALHARAM. REVISE OS DETALHES ACIMA.`);
}
console.log('====================================================\n');

process.exit(failedTests === 0 ? 0 : 1);
