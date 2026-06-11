-- ============================================
-- Migração: Colunas extras + GRANTs + Seed
-- ============================================

-- 1. Colunas que faltavam no blog_posts
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT FALSE;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS cover_image_url TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS categories TEXT[] DEFAULT '{}';

-- 2. Permissão para o público ler posts publicados
GRANT SELECT ON blog_posts TO anon;

-- ============================================
-- SEED: 3 Artigos de Blog
-- ============================================

-- Remove duplicatas caso já existam (rerun-safe)
DELETE FROM blog_posts WHERE slug IN ('como-aprender-ingles-sozinho', 'frases-em-ingles-mais-usadas', 'ingles-para-viagem');

-- ARTIGO 1: Como Aprender Inglês Sozinho
INSERT INTO blog_posts (author_id, title, slug, content, excerpt, cover_image_url, status, published, published_at, meta_title, meta_description, focus_keyword, seo_score, categories, tags)
SELECT
  id, 'Como Aprender Inglês Sozinho: Guia Completo para Iniciantes',
  'como-aprender-ingles-sozinho',
  '<h1>Como Aprender Inglês Sozinho: Guia Completo para Iniciantes</h1>
<p>Aprender inglês sozinho é totalmente possível com as estratégias certas. Neste guia completo, você vai descobrir <strong>como aprender inglês sozinho</strong> de forma eficiente, mesmo começando do zero.</p>

<h2>Por que aprender inglês sozinho?</h2>
<p>Milhões de pessoas ao redor do mundo já provaram que é possível dominar o idioma sem frequentar escolas tradicionais. Com a internet, você tem acesso a recursos que antes eram exclusivos de cursos presenciais.</p>

<h2>Defina seu objetivo</h2>
<p>Antes de começar, pergunte-se: por que quero <strong>aprender inglês sozinho</strong>? Viajar? Trabalhar? Fazer um intercâmbio? Ter um objetivo claro mantém você motivado.</p>

<h2>Imersão diária é a chave</h2>
<p>Reserve pelo menos 30 minutos por dia para o inglês. A consistência é mais importante que a intensidade. Veja séries, ouça podcasts, leia notícias e tente pensar em inglês.</p>

<h2>As 4 habilidades essenciais</h2>
<h3>1. Listening (Compreensão auditiva)</h3>
<p>Ouça podcasts como BBC Learning English, assista a filmes com legendas em inglês e use o YouTube para encontrar conteúdo do seu interesse.</p>

<h3>2. Speaking (Fala)</h3>
<p>Pratique em voz alta sozinho, grave áudios no celular e use apps como HelloTalk para conversar com nativos.</p>

<h3>3. Reading (Leitura)</h3>
<p>Comece com notícias simples (News in Levels) e evolua para livros e artigos acadêmicos.</p>

<h3>4. Writing (Escrita)</h3>
<p>Mantenha um diário em inglês, participe de fóruns e escreva resumos do que aprendeu.</p>

<h2>Melhores recursos gratuitos</h2>
<ul>
<li><strong>Duolingo</strong> — Vocabulário básico e gramática</li>
<li><strong>Anki</strong> — Flashcards para memorização</li>
<li><strong>BBC Learning English</strong> — Conteúdo gratuito de qualidade</li>
<li><strong>YouTube</strong> — Canais como English in Use, BBC English</li>
<li><strong>Spotify</strong> — Podcasts para todos os níveis</li>
</ul>

<h2>Crie um cronograma de estudos</h2>
<p>Distribua as 4 habilidades ao longo da semana. Exemplo: segunda é dia de listening, terça de leitura, quarta de speaking, quinta de writing e sexta de revisão.</p>

<h2>Erros comuns ao aprender inglês sozinho</h2>
<ul>
<li>Focar só em gramática e esquecer a conversação</li>
<li>Não praticar listening diariamente</li>
<li>Ter medo de errar ao falar</li>
<li>Não ter um método estruturado</li>
</ul>

<h2>FAQ — Perguntas Frequentes</h2>
<h3>É possível aprender inglês sozinho do zero?</h3>
<p>Sim! Com disciplina, bons recursos e prática diária, milhares de pessoas já aprenderam <strong>inglês sozinho</strong> do absoluto zero.</p>

<h3>Quanto tempo leva para aprender inglês sozinho?</h3>
<p>Com dedicação de 30 a 60 minutos por dia, é possível atingir o nível intermediário (B1) em 6 a 12 meses.</p>

<h3>Preciso de um curso ou consigo aprender de graça?</h3>
<p>Existem ótimos recursos gratuitos, mas um curso estruturado acelera seu aprendizado e evita erros comuns.</p>

<p>Quer acelerar seu aprendizado? Conheça os cursos da <strong>LearningEnglishBR</strong> e tenha um método comprovado com suporte de professores qualificados.</p>',
  'Guia completo com estratégias comprovadas sobre como aprender inglês sozinho. Descubra métodos, recursos gratuitos e um plano de estudos para dominar o idioma.',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
  'PUBLISHED', TRUE, NOW(),
  'Como Aprender Inglês Sozinho | Guia Completo 2026',
  'Aprenda inglês sozinho com este guia completo. Estratégias, recursos gratuitos e plano de estudos para você dominar o idioma sem sair de casa.',
  'como aprender inglês sozinho',
  92,
  ARRAY['Dicas de Estudo', 'Iniciantes'],
  ARRAY['aprender inglês', 'estudo autodidata', 'inglês para iniciantes', 'dicas de estudo', 'inglês online']
FROM profiles LIMIT 1;

-- ARTIGO 2: 50 Frases em Inglês Mais Usadas
INSERT INTO blog_posts (author_id, title, slug, content, excerpt, cover_image_url, status, published, published_at, meta_title, meta_description, focus_keyword, seo_score, categories, tags)
SELECT
  id, 'As 50 Frases em Inglês Mais Usadas no Dia a Dia',
  'frases-em-ingles-mais-usadas',
  '<h1>As 50 Frases em Inglês Mais Usadas no Dia a Dia</h1>
<p>Conhecer as <strong>frases em inglês mais usadas</strong> no cotidiano é o primeiro passo para ganhar confiança na comunicação. Neste guia, você vai aprender as expressões essenciais para sobreviver e brilhar em qualquer conversa.</p>

<h2>Saudações e Cortesia</h2>
<ul>
<li><strong>Good morning!</strong> — Bom dia!</li>
<li><strong>How are you?</strong> — Como você está?</li>
<li><strong>Nice to meet you!</strong> — Prazer em conhecê-lo!</li>
<li><strong>Thank you so much!</strong> — Muito obrigado!</li>
<li><strong>You''re welcome!</strong> — De nada!</li>
<li><strong>Excuse me!</strong> — Com licença!</li>
<li><strong>I''m sorry!</strong> — Me desculpe!</li>
</ul>

<h2>Apresentações Pessoais</h2>
<ul>
<li><strong>My name is...</strong> — Meu nome é...</li>
<li><strong>I''m from Brazil.</strong> — Eu sou do Brasil.</li>
<li><strong>I work as a...</strong> — Eu trabalho como...</li>
<li><strong>I''m a student.</strong> — Eu sou estudante.</li>
<li><strong>I live in...</strong> — Eu moro em...</li>
</ul>

<h2>No Restaurante</h2>
<ul>
<li><strong>I''d like to order...</strong> — Eu gostaria de pedir...</li>
<li><strong>Can I have the menu, please?</strong> — Posso ver o cardápio?</li>
<li><strong>The bill, please!</strong> — A conta, por favor!</li>
<li><strong>Is service included?</strong> — O serviço está incluído?</li>
<li><strong>Delicious!</strong> — Delicioso!</li>
</ul>

<h2>Fazendo Compras</h2>
<ul>
<li><strong>How much is this?</strong> — Quanto custa isso?</li>
<li><strong>I''m just looking, thanks.</strong> — Só estou olhando.</li>
<li><strong>Do you have this in a smaller size?</strong> — Tem este num tamanho menor?</li>
<li><strong>Can I pay by card?</strong> — Posso pagar com cartão?</li>
<li><strong>I''ll take it!</strong> — Vou levar!</li>
</ul>

<h2>Emergências</h2>
<ul>
<li><strong>I need help!</strong> — Preciso de ajuda!</li>
<li><strong>Call the police!</strong> — Chame a polícia!</li>
<li><strong>I don''t feel well.</strong> — Não estou me sentindo bem.</li>
<li><strong>Where is the hospital?</strong> — Onde fica o hospital?</li>
<li><strong>Help me, please!</strong> — Me ajude, por favor!</li>
</ul>

<h2>Dicas para memorizar</h2>
<p>Para realmente absorver estas <strong>frases em inglês mais usadas</strong>, pratique com flashcards (Anki), repita em voz alta e tente usá-las em conversas reais ou simuladas.</p>

<h2>FAQ</h2>
<h3>Quantas frases preciso saber para me comunicar?</h3>
<p>Com cerca de 200-300 frases essenciais, você já consegue se virar na maioria das situações cotidianas.</p>

<h3>Como praticar essas frases?</h3>
<p>Use o método de repetição espaçada, grave áudios de si mesmo falando e pratique com parceiros de conversação.</p>

<p>Quer dominar o inglês de verdade? Conheça os cursos da <strong>LearningEnglishBR</strong> e aprenda com método comprovado!</p>',
  'Aprenda as 50 frases em inglês mais usadas no dia a dia. De saudações a emergências, domine as expressões essenciais para se comunicar com confiança.',
  'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800',
  'PUBLISHED', TRUE, NOW(),
  '50 Frases em Inglês Mais Usadas | Vocabulário Essencial',
  'Conheça as 50 frases em inglês mais usadas no dia a dia. Guia completo com saudações, compras, restaurante e emergências para você se comunicar.',
  'frases em inglês mais usadas',
  95,
  ARRAY['Vocabulário', 'Conversação'],
  ARRAY['frases em inglês', 'vocabulário inglês', 'inglês para iniciantes', 'conversação em inglês', 'expressões inglesas']
FROM profiles LIMIT 1;

-- ARTIGO 3: Inglês para Viagem
INSERT INTO blog_posts (author_id, title, slug, content, excerpt, cover_image_url, status, published, published_at, meta_title, meta_description, focus_keyword, seo_score, categories, tags)
SELECT
  id, 'Inglês para Viagem: 50 Palavras e Expressões Essenciais',
  'ingles-para-viagem',
  '<h1>Inglês para Viagem: 50 Palavras e Expressões Essenciais</h1>
<p>Viajar para o exterior sem saber inglês pode ser desafiador. Por isso, preparamos este guia completo de <strong>inglês para viagem</strong> com as palavras e expressões que você realmente vai usar.</p>

<h2>No Aeroporto</h2>
<ul>
<li><strong>Where is the check-in counter?</strong> — Onde fica o balcão de check-in?</li>
<li><strong>Can I see your passport, please?</strong> — Posso ver seu passaporte?</li>
<li><strong>What is the gate number?</strong> — Qual é o número do portão?</li>
<li><strong>Is my flight on time?</strong> — Meu voo está no horário?</li>
<li><strong>I have a connecting flight.</strong> — Tenho um voo de conexão.</li>
<li><strong>Where do I collect my luggage?</strong> — Onde pego minha bagagem?</li>
</ul>

<h2>No Hotel</h2>
<ul>
<li><strong>I have a reservation.</strong> — Tenho uma reserva.</li>
<li><strong>What time is check-in/check-out?</strong> — Qual é o horário do check-in/check-out?</li>
<li><strong>Is breakfast included?</strong> — O café da manhã está incluído?</li>
<li><strong>Can I have extra towels?</strong> — Posso ter toalhas extras?</li>
<li><strong>Is there Wi-Fi?</strong> — Tem Wi-Fi?</li>
<li><strong>I''d like to extend my stay.</strong> — Gostaria de estender minha estadia.</li>
</ul>

<h2>Pedindo Informações</h2>
<ul>
<li><strong>Excuse me, can you help me?</strong> — Com licença, pode me ajudar?</li>
<li><strong>Where is the nearest subway station?</strong> — Onde fica a estação de metrô mais próxima?</li>
<li><strong>How do I get to...</strong> — Como chego a...</li>
<li><strong>Is it far from here?</strong> — É longe daqui?</li>
<li><strong>Can you show me on the map?</strong> — Pode me mostrar no mapa?</li>
<li><strong>How long does it take?</strong> — Quanto tempo leva?</li>
</ul>

<h2>No Restaurante</h2>
<ul>
<li><strong>A table for two, please.</strong> — Uma mesa para dois, por favor.</li>
<li><strong>Can I see the wine list?</strong> — Posso ver a carta de vinhos?</li>
<li><strong>I''m allergic to...</strong> — Tenho alergia a...</li>
<li><strong>Is this dish spicy?</strong> — Este prato é apimentado?</li>
<li><strong>I''d like the check, please.</strong> — A conta, por favor.</li>
<li><strong>Can I take this to go?</strong> — Posso levar para viagem?</li>
</ul>

<h2>Emergências</h2>
<ul>
<li><strong>I need a doctor.</strong> — Preciso de um médico.</li>
<li><strong>Call an ambulance!</strong> — Chame uma ambulância!</li>
<li><strong>I lost my passport.</strong> — Perdi meu passaporte.</li>
<li><strong>Where is the embassy?</strong> — Onde fica a embaixada?</li>
<li><strong>I''ve been robbed!</strong> — Fui roubado!</li>
<li><strong>I need to call my insurance.</strong> — Preciso ligar para meu seguro.</li>
</ul>

<h2>Dicas de pronúncia</h2>
<p>Pratique as <strong>expressões de inglês para viagem</strong> em voz alta antes de viajar. Use apps como Google Translate para verificar a pronúncia correta e grave sua própria voz para comparar.</p>

<h2>Aplicativos úteis para viagem</h2>
<ul>
<li><strong>Google Translate</strong> — Tradução instantânea com câmera</li>
<li><strong>Maps.me</strong> — Mapas offline</li>
<li><strong>Uber</strong> — Transporte sem precisar falar</li>
<li><strong>Duolingo</strong> — Revisão rápida antes da viagem</li>
<li><strong>XE Currency</strong> — Conversão de moedas</li>
</ul>

<h2>FAQ</h2>
<h3>Preciso ser fluente para viajar?</h3>
<p>Não! Com um vocabulário básico de <strong>inglês para viagem</strong> e um aplicativo de tradução, você consegue se virar em qualquer situação.</p>

<h3>Qual o nível mínimo de inglês para viajar?</h3>
<p>O nível A2 (básico) já é suficiente para fazer check-in, pedir comida e pedir informações básicas.</p>

<p>Quer viajar com mais confiança? Conheça o curso <strong>Inglês para Viagem</strong> da LearningEnglishBR e prepare-se para sua próxima aventura!</p>',
  'Domine o inglês para viagem com 50 palavras e expressões essenciais. Do aeroporto ao restaurante, prepare-se para sua próxima viagem internacional.',
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800',
  'PUBLISHED', TRUE, NOW(),
  'Inglês para Viagem | 50 Expressões Essenciais',
  'Aprenda inglês para viagem com 50 palavras e expressões essenciais. Guia completo para aeroporto, hotel, restaurante e emergências no exterior.',
  'inglês para viagem',
  94,
  ARRAY['Viagem', 'Vocabulário'],
  ARRAY['inglês para viagem', 'vocabulário de viagem', 'inglês para turismo', 'expressões de viagem', 'inglês básico']
FROM profiles LIMIT 1;
