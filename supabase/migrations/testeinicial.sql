-- ==========================================
-- ENGLISH PROFICIENCY ASSESSMENT (TESTE DE NÍVEL)
-- ==========================================

-- Drop existing
DROP TABLE IF EXISTS english_test_answers CASCADE;
DROP TABLE IF EXISTS english_test_attempts CASCADE;
DROP TABLE IF EXISTS english_test_options CASCADE;
DROP TABLE IF EXISTS english_test_questions CASCADE;
DROP TABLE IF EXISTS english_test_results CASCADE;
DROP TABLE IF EXISTS english_tests CASCADE;
DROP TYPE IF EXISTS english_question_category CASCADE;
DROP TYPE IF EXISTS english_cefr_level CASCADE;

-- ==========================================
-- ENUMS
-- ==========================================
CREATE TYPE english_cefr_level AS ENUM ('A1', 'A2', 'B1', 'B2', 'C1', 'C2');
CREATE TYPE english_question_category AS ENUM ('GRAMMAR', 'VOCABULARY', 'READING', 'LISTENING', 'WRITING');

-- ==========================================
-- TABLES
-- ==========================================

-- 1. Tests (definição do teste)
CREATE TABLE english_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL DEFAULT 'Teste de Nível de Inglês',
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    passing_score INTEGER DEFAULT 0,
    question_count INTEGER DEFAULT 40,
    time_estimate_minutes INTEGER DEFAULT 20,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Questions (banco de questões)
CREATE TABLE english_test_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID REFERENCES english_tests(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    explanation TEXT,
    cefr_level english_cefr_level NOT NULL,
    category english_question_category NOT NULL,
    difficulty INTEGER DEFAULT 1 CHECK (difficulty >= 1 AND difficulty <= 5),
    position INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Options (alternativas de cada questão)
CREATE TABLE english_test_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID REFERENCES english_test_questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Results (definição de faixa de resultado por nível)
CREATE TABLE english_test_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID REFERENCES english_tests(id) ON DELETE CASCADE,
    cefr_level english_cefr_level NOT NULL,
    min_score INTEGER NOT NULL,
    max_score INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    recommendation TEXT,
    recommended_course_id UUID,
    badge_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(test_id, cefr_level)
);

-- 5. Attempts (tentativas dos usuários)
CREATE TABLE english_test_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID REFERENCES english_tests(id) ON DELETE CASCADE,
    -- Lead info
    lead_name TEXT NOT NULL,
    lead_email TEXT NOT NULL,
    lead_phone TEXT,
    -- Resultado
    total_questions INTEGER NOT NULL DEFAULT 0,
    correct_answers INTEGER NOT NULL DEFAULT 0,
    score_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
    cefr_level english_cefr_level,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    is_completed BOOLEAN DEFAULT FALSE,
    -- Metadados
    time_spent_seconds INTEGER DEFAULT 0,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Answers (respostas individuais)
CREATE TABLE english_test_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID REFERENCES english_test_attempts(id) ON DELETE CASCADE,
    question_id UUID REFERENCES english_test_questions(id) ON DELETE CASCADE,
    selected_option_id UUID REFERENCES english_test_options(id) ON DELETE SET NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    time_spent_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(attempt_id, question_id)
);

-- ==========================================
-- RLS
-- ==========================================
ALTER TABLE english_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE english_test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE english_test_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE english_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE english_test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE english_test_answers ENABLE ROW LEVEL SECURITY;

-- Public read for active tests and questions
CREATE POLICY "Anyone can read active tests" ON english_tests FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Anyone can read questions" ON english_test_questions FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Anyone can read options" ON english_test_options FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can read results" ON english_test_results FOR SELECT USING (TRUE);

-- Anyone can insert attempts and answers (lead capture)
CREATE POLICY "Anyone can insert attempts" ON english_test_attempts FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Anyone can read own attempt" ON english_test_attempts FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can update own attempt" ON english_test_attempts FOR UPDATE USING (TRUE);
CREATE POLICY "Anyone can insert answers" ON english_test_answers FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Anyone can read own answers" ON english_test_answers FOR SELECT USING (TRUE);

-- Admin full access (authenticated with admin role)
CREATE POLICY "Admin all tests" ON english_tests FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all questions" ON english_test_questions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all options" ON english_test_options FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all results" ON english_test_results FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all attempts" ON english_test_attempts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all answers" ON english_test_answers FOR ALL USING (auth.role() = 'authenticated');

-- ==========================================
-- GRANTS (required for RLS to work with anon key)
-- ==========================================
GRANT ALL ON english_tests TO anon, authenticated, service_role;
GRANT ALL ON english_test_questions TO anon, authenticated, service_role;
GRANT ALL ON english_test_options TO anon, authenticated, service_role;
GRANT ALL ON english_test_results TO anon, authenticated, service_role;
GRANT ALL ON english_test_attempts TO anon, authenticated, service_role;
GRANT ALL ON english_test_answers TO anon, authenticated, service_role;

-- ==========================================
-- INDEXES
-- ==========================================
CREATE INDEX idx_questions_test_id ON english_test_questions(test_id);
CREATE INDEX idx_questions_cefr ON english_test_questions(cefr_level);
CREATE INDEX idx_questions_category ON english_test_questions(category);
CREATE INDEX idx_options_question_id ON english_test_options(question_id);
CREATE INDEX idx_attempts_email ON english_test_attempts(lead_email);
CREATE INDEX idx_attempts_completed ON english_test_attempts(is_completed);
CREATE INDEX idx_attempts_cefr ON english_test_attempts(cefr_level);
CREATE INDEX idx_answers_attempt_id ON english_test_answers(attempt_id);
CREATE INDEX idx_results_test_id ON english_test_results(test_id);

-- ==========================================
-- TRIGGERS
-- ==========================================
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON english_tests FOR EACH ROW EXECUTE PROCEDURE moddatetime(updated_at);
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON english_test_questions FOR EACH ROW EXECUTE PROCEDURE moddatetime(updated_at);

-- ==========================================
-- SEED DATA - Questões do Teste de Nível
-- ==========================================

-- Insert the test
INSERT INTO english_tests (id, title, description, is_active, question_count, time_estimate_minutes)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Teste de Nível de Inglês',
    'Avaliação completa de proficiência em inglês seguindo o padrão CEFR. Inclui questões de gramática, vocabulário, leitura e compreensão.',
    TRUE, 40, 25
);

-- Insert result ranges
INSERT INTO english_test_results (test_id, cefr_level, min_score, max_score, title, description, recommendation, badge_text) VALUES
('00000000-0000-0000-0000-000000000001', 'A1', 0, 20, 'Beginner', 'Você está começando sua jornada no inglês. Conhece palavras e frases básicas.', 'Recomendamos nosso Curso Iniciante para construir uma base sólida.', 'Iniciante'),
('00000000-0000-0000-0000-000000000001', 'A2', 21, 40, 'Elementary', 'Você já consegue se comunicar em situações simples e cotidianas.', 'Nosso Curso Básico vai te ajudar a ganhar mais confiança.', 'Básico'),
('00000000-0000-0000-0000-000000000001', 'B1', 41, 60, 'Intermediate', 'Você consegue lidar com a maioria das situações de viagem e conversar sobre temas familiares.', 'O Curso Intermediário é ideal para você.', 'Intermediário'),
('00000000-0000-0000-0000-000000000001', 'B2', 61, 75, 'Upper Intermediate', 'Você se comunica com fluência natural e consegue discutir temas complexos.', 'Avançe ainda mais com nosso Curso Intermediário Avançado.', 'Intermediário Avançado'),
('00000000-0000-0000-0000-000000000001', 'C1', 76, 90, 'Advanced', 'Você domina o inglês com excelência. Consegue se expressar de forma fluente e espontânea.', 'Nosso Curso Avançado vai polir ainda mais seu inglês.', 'Avançado'),
('00000000-0000-0000-0000-000000000001', 'C2', 91, 100, 'Proficient', 'Você tem domínio completo do inglês. Sua comunicação é precisa e sofisticada.', 'O Programa de Fluência vai te desafiar ainda mais.', 'Fluência');

-- ==========================================
-- SEED QUESTIONS (40 questions covering A1-C2)
-- ==========================================

-- ========================
-- A1 QUESTIONS (6)
-- ========================

-- Q1: Grammar A1
INSERT INTO english_test_questions (id, test_id, question, explanation, cefr_level, category, difficulty, position) VALUES
('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'Choose the correct option: "She ___ a student."', 'O verbo "to be" no presente para he/she/it é "is".', 'A1', 'GRAMMAR', 1, 1);
INSERT INTO english_test_options (question_id, option_text, is_correct, position) VALUES
('00000000-0000-0000-0000-000000000101', 'is', TRUE, 1),
('00000000-0000-0000-0000-000000000101', 'are', FALSE, 2),
('00000000-0000-0000-0000-000000000101', 'am', FALSE, 3),
('00000000-0000-0000-0000-000000000101', 'be', FALSE, 4);

-- Q2: Vocabulary A1
INSERT INTO english_test_questions (id, test_id, question, explanation, cefr_level, category, difficulty, position) VALUES
('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000001', 'What is the correct word? "I ___ coffee every morning."', '"Drink" é o verbo correto para consumir líquidos.', 'A1', 'VOCABULARY', 1, 2);
INSERT INTO english_test_options (question_id, option_text, is_correct, position) VALUES
('00000000-0000-0000-0000-000000000102', 'drink', TRUE, 1),
('00000000-0000-0000-0000-000000000102', 'eat', FALSE, 2),
('00000000-0000-0000-0000-000000000102', 'cook', FALSE, 3),
('00000000-0000-0000-0000-000000000102', 'make', FALSE, 4);

-- Q3: Grammar A1
INSERT INTO english_test_questions (id, test_id, question, explanation, cefr_level, category, difficulty, position) VALUES
('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000001', 'Complete: "They ___ to the park yesterday."', 'Passado simples do verbo "to go" é "went".', 'A1', 'GRAMMAR', 1, 3);
INSERT INTO english_test_options (question_id, option_text, is_correct, position) VALUES
('00000000-0000-0000-0000-000000000103', 'went', TRUE, 1),
('00000000-0000-0000-0000-000000000103', 'go', FALSE, 2),
('00000000-0000-0000-0000-000000000103', 'goes', FALSE, 3),
('00000000-0000-0000-0000-000000000103', 'going', FALSE, 4);

-- Q4: Reading A1
INSERT INTO english_test_questions (id, test_id, question, explanation, cefr_level, category, difficulty, position) VALUES
('00000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000001', 'Read: "John is 25 years old. He lives in London." How old is John?', 'O texto diz claramente que John tem 25 anos.', 'A1', 'READING', 1, 4);
INSERT INTO english_test_options (question_id, option_text, is_correct, position) VALUES
('00000000-0000-0000-0000-000000000104', '25', TRUE, 1),
('00000000-0000-0000-0000-000000000104', '20', FALSE, 2),
('00000000-0000-0000-0000-000000000104', '30', FALSE, 3),
('00000000-0000-0000-0000-000000000104', '15', FALSE, 4);

-- Q5: Vocabulary A1
INSERT INTO english_test_questions (id, test_id, question, explanation, cefr_level, category, difficulty, position) VALUES
('00000000-0000-0000-0000-000000000105', '00000000-0000-0000-0000-000000000001', 'What is the opposite of "hot"?', 'O oposto de "hot" (quente) é "cold" (frio).', 'A1', 'VOCABULARY', 1, 5);
INSERT INTO english_test_options (question_id, option_text, is_correct, position) VALUES
('00000000-0000-0000-0000-000000000105', 'cold', TRUE, 1),
('00000000-0000-0000-0000-000000000105', 'warm', FALSE, 2),
('00000000-0000-0000-0000-000000000105', 'cool', FALSE, 3),
('00000000-0000-0000-0000-000000000105', 'wet', FALSE, 4);

-- Q6: Grammar A1
INSERT INTO english_test_questions (id, test_id, question, explanation, cefr_level, category, difficulty, position) VALUES
('00000000-0000-0000-0000-000000000106', '00000000-0000-0000-0000-000000000001', 'Choose: "There ___ a book on the table."', '"There is" é usado para singular.', 'A1', 'GRAMMAR', 1, 6);
INSERT INTO english_test_options (question_id, option_text, is_correct, position) VALUES
('00000000-0000-0000-0000-000000000106', 'is', TRUE, 1),
('00000000-0000-0000-0000-000000000106', 'are', FALSE, 2),
('00000000-0000-0000-0000-000000000106', 'am', FALSE, 3),
('00000000-0000-0000-0000-000000000106', 'have', FALSE, 4);

-- ========================
-- A2 QUESTIONS (7)
-- ========================

-- Q7: Grammar A2
INSERT INTO english_test_questions (id, test_id, question, explanation, cefr_level, category, difficulty, position) VALUES
('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000001', 'Complete: "She ___ to music right now."', 'Present continuous (now) = is + verb-ing.', 'A2', 'GRAMMAR', 2, 7);
INSERT INTO english_test_options (question_id, option_text, is_correct, position) VALUES
('00000000-0000-0000-0000-000000000201', 'is listening', TRUE, 1),
('00000000-0000-0000-0000-000000000201', 'listens', FALSE, 2),
('00000000-0000-0000-0000-000000000201', 'listened', FALSE, 3),
('00000000-0000-0000-0000-000000000201', 'will listen', FALSE, 4);

-- Q8: Vocabulary A2
INSERT INTO english_test_questions (id, test_id, question, explanation, cefr_level, category, difficulty, position) VALUES
('00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000001', 'Choose the correct word: "I need to ___ my homework before Friday."', '"Finish" significa terminar/completar.', 'A2', 'VOCABULARY', 2, 8);
INSERT INTO english_test_options (question_id, option_text, is_correct, position) VALUES
('00000000-0000-0000-0000-000000000202', 'finish', TRUE, 1),
('00000000-0000-0000-0000-000000000202', 'start', FALSE, 2),
('00000000-0000-0000-0000-000000000202', 'open', FALSE, 3),
('00000000-0000-0000-0000-000000000202', 'lose', FALSE, 4);

-- Q9: Grammar A2
INSERT INTO english_test_questions (id, test_id, question, explanation, cefr_level, category, difficulty, position) VALUES
('00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000001', 'Choose: "I have ___ been to France."', '"Never" expressa que nunca fez algo.', 'A2', 'GRAMMAR', 2, 9);
INSERT INTO english_test_options (question_id, option_text, is_correct, position) VALUES
('00000000-0000-0000-0000-000000000203', 'never', TRUE, 1),
('00000000-0000-0000-0000-000000000203', 'ever', FALSE, 2),
('00000000-0000-0000-0000-000000000203', 'always', FALSE, 3),
('00000000-0000-0000-0000-000000000203', 'yet', FALSE, 4);

-- Q10: Reading A2
INSERT INTO english_test_questions (id, test_id, question, explanation, cefr_level, category, difficulty, position) VALUES
('00000000-0000-0000-0000-000000000204', '00000000-0000-0000-0000-000000000001', 'Read: "Sarah usually wakes up at 7 AM. She takes a shower and then has breakfast. She leaves home at 8 AM." What does Sarah do first?', 'O texto diz que ela acorda, depois toma banho e então café da manhã.', 'A2', 'READING', 2, 10);
INSERT INTO english_test_options (question_id, option_text, is_correct, position) VALUES
('00000000-0000-0000-0000-000000000204', 'She wakes up', TRUE, 1),
('00000000-0000-0000-0000-000000000204', 'She takes a shower', FALSE, 2),
('00000000-0000-0000-0000-000000000204', 'She has breakfast', FALSE, 3),
('00000000-0000-0000-0000-000000000204', 'She leaves home', FALSE, 4);

-- Q11: Vocabulary A2
INSERT INTO english_test_questions (id, test_id, question, explanation, cefr_level, category, difficulty, position) VALUES
('00000000-0000-0000-0000-000000000205', '00000000-0000-0000-0000-000000000001', 'What does "expensive" mean?', '"Expensive" significa caro.', 'A2', 'VOCABULARY', 2, 11);
INSERT INTO english_test_options (question_id, option_text, is_correct, position) VALUES
('00000000-0000-0000-0000-000000000205', 'costing a lot of money', TRUE, 1),
('00000000-0000-0000-0000-000000000205', 'very cheap', FALSE, 2),
('00000000-0000-0000-0000-000000000205', 'very fast', FALSE, 3),
('00000000-0000-0000-0000-000000000205', 'very small', FALSE, 4);

-- Q12: Grammar A2
INSERT INTO english_test_questions (id, test_id, question, explanation, cefr_level, category, difficulty, position) VALUES
('00000000-0000-0000-0000-000000000206', '00000000-0000-0000-0000-000000000001', 'Complete: "I ___ like pizza when I was a child."', '"Used to" expressa hábitos passados.', 'A2', 'GRAMMAR', 2, 12);
INSERT INTO english_test_options (question_id, option_text, is_correct, position) VALUES
('00000000-0000-0000-0000-000000000206', 'used to', TRUE, 1),
('00000000-0000-0000-0000-000000000206', 'use to', FALSE, 2),
('00000000-0000-0000-0000-000000000206', 'was used', FALSE, 3),
('00000000-0000-0000-0000-000000000206', 'did used', FALSE, 4);

-- Q13: Reading A2
INSERT INTO english_test_questions (id, test_id, question, explanation, cefr_level, category, difficulty, position) VALUES
('00000000-0000-0000-0000-000000000207', '00000000-0000-0000-0000-000000000001', 'Read: "The restaurant opens at 6 PM and closes at 11 PM. It is closed on Mondays." When is the restaurant closed?', 'O texto diz explicitamente que fecha às segundas.', 'A2', 'READING', 2, 13);
INSERT INTO english_test_options (question_id, option_text, is_correct, position) VALUES
('00000000-0000-0000-0000-000000000207', 'On Mondays', TRUE, 1),
('00000000-0000-0000-0000-000000000207', 'At 6 PM', FALSE, 2),
('00000000-0000-0000-0000-000000000207', 'At 11 PM', FALSE, 3),
('00000000-0000-0000-0000-000000000207', 'On Sundays', FALSE, 4);

-- ========================
-- B1 QUESTIONS (7)
-- ========================

-- Q14: Grammar B1
INSERT INTO english_test_questions (id, test_id, question, explanation, cefr_level, category, difficulty, position) VALUES
('00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000001', 'Complete: "If it rains, I ___ stay home."', 'First conditional: if + present, will + infinitive.', 'B1', 'GRAMMAR', 3, 14);
INSERT INTO english_test_options (question_id, option_text, is_correct, position) VALUES
('00000000-0000-0000-0000-000000000301', 'will', TRUE, 1),
('00000000-0000-0000-0000-000000000301', 'would', FALSE, 2),
('00000000-0000-0000-0000-000000000301', 'am', FALSE, 3),
('00000000-0000-0000-0000-000000000301', 'do', FALSE, 4);

-- Q15: Vocabulary B1
INSERT INTO english_test_questions (id, test_id, question, explanation, cefr_level, category, difficulty, position) VALUES
('00000000-0000-0000-0000-000000000302', '00000000-0000-0000-0000-000000000001', 'Choose the best word: "She ___ to her boss about the project."', '"Explain" é o verbo correto para quando se explica algo.', 'B1', 'VOCABULARY', 3, 15);
INSERT INTO english_test_options (question_id, option_text, is_correct, position) VALUES
('00000000-0000-0000-0000-000000000302', 'explained', TRUE, 1),
('00000000-0000-0000-0000-000000000302', 'told', FALSE, 2),
('00000000-0000-0000-0000-000000000302', 'said', FALSE, 3),
('00000000-0000-0000-0000-000000000302', 'spoke', FALSE, 4);

-- Q16: Grammar B1
INSERT INTO english_test_questions (id, test_id, question, explanation, cefr_level, category, difficulty, position) VALUES
('00000000-0000-0000-0000-000000000303', '00000000-0000-0000-0000-000000000001', 'Choose: "The book ___ by Mark Twain."', 'Voz passiva no passado: was/were + past participle.', 'B1', 'GRAMMAR', 3, 16);
INSERT INTO english_test_options (question_id, option_text, is_correct, position) VALUES
('00000000-0000-0000-0000-000000000303', 'was written', TRUE, 1),
('00000000-0000-0000-0000-000000000303', 'wrote', FALSE, 2),
('00000000-0000-0000-0000-000000000303', 'is written', FALSE, 3),
('00000000-0000-0000-0000-000000000303', 'has written', FALSE, 4);

-- Q17: Reading B1
INSERT INTO english_test_questions (id, test_id, question, explanation, cefr_level, category, difficulty, position) VALUES
('00000000-0000-0000-0000-000000000304', '00000000-0000-0000-0000-000000000001', 'Read: "Despite the heavy rain, the event was a success. More than 500 people attended, and the organizers raised over $10,000 for charity." What does "despite" mean?', '"Despite" significa "apesar de".', 'B1', 'READING', 3, 17);
INSERT INTO english_test_options (question_id, option_text, is_correct, position) VALUES
('00000000-0000-0000-0000-000000000304', 'in spite of', TRUE, 1),
('00000000-0000-0000-0000-000000000304', 'because of', FALSE, 2),
('00000000-0000-0000-0000-000000000304', 'due to', FALSE, 3),
('00000000-0000-0000-0000-000000000304', 'thanks to', FALSE, 4);

-- Q18: Vocabulary B1
INSERT INTO english_test_questions (id, test_id, question, explanation, cefr_level, category, difficulty, position) VALUES
('00000000-0000-0000-0000-000000000305', '00000000-0000-0000-0000-000000000001', 'What is a synonym for "difficult"?', '"Hard" é sinônimo de "difficult" (difícil).', 'B1', 'VOCABULARY', 3, 18);
INSERT INTO english_test_options (question_id, option_text, is_correct, position) VALUES
('00000000-0000-0000-0000-000000000305', 'hard', TRUE, 1),
('00000000-0000-0000-0000-000000000305', 'easy', FALSE, 2),
('00000000-0000-0000-0000-000000000305', 'soft', FALSE, 3),
('00000000-0000-0000-0000-000000000305', 'simple', FALSE, 4);

-- Q19: Grammar B1
INSERT INTO english_test_questions (id, test_id, question, explanation, cefr_level, category, difficulty, position) VALUES
('00000000-0000-0000-0000-000000000306', '00000000-0000-0000-0000-000000000001', 'Complete: "She has been working here ___ 2018."', 'Present perfect continuous com "since" para ponto no tempo.', 'B1', 'GRAMMAR', 3, 19);
INSERT INTO english_test_options (question_id, option_text, is_correct, position) VALUES
('00000000-0000-0000-0000-000000000306', 'since', TRUE, 1),
('00000000-0000-0000-0000-000000000306', 'for', FALSE, 2),
('00000000-0000-0000-0000-000000000306', 'from', FALSE, 3),
('00000000-0000-0000-0000-000000000306', 'in', FALSE, 4);

-- Q20: Reading B1
INSERT INTO english_test_questions (id, test_id, question, explanation, cefr_level, category, difficulty, position) VALUES
('00000000-0000-0000-0000-000000000307', '00000000-0000-0000-0000-000000000001', 'Read: "The company announced that they are expanding their operations to three new countries. This will create approximately 200 new jobs." How many jobs will be created?', 'O texto diz aproximadamente 200 novos empregos.', 'B1', 'READING', 3, 20);
INSERT INTO english_test_options (question_id, option_text, is_correct, position) VALUES
('00000000-0000-0000-0000-000000000307', 'Approximately 200', TRUE, 1),
('00000000-0000-0000-0000-000000000307', 'Exactly 200', FALSE, 2),
('00000000-0000-0000-0000-000000000307', 'More than 500', FALSE, 3),
('00000000-0000-0000-0000-000000000307', '100', FALSE, 4);

-- ========================
-- B2 QUESTIONS (7)
-- ========================

-- Q21: Grammar B2
INSERT INTO english_test_questions (id, test_id, question, explanation, cefr_level, category, difficulty, position) VALUES
('00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000001', 'Complete: "I wish I ___ more time to study."', 'Wish + past perfect para expressar arrependimento sobre o passado.', 'B2', 'GRAMMAR', 4, 21);
INSERT INTO english_test_options (question_id, option_text, is_correct, position) VALUES
('00000000-0000-0000-0000-000000000401', 'had', TRUE, 1),
('00000000-0000-0000-0000-000000000401', 'have', FALSE, 2),
('00000000-0000-0000-0000-000000000401', 'would have', FALSE, 3),
('00000000-0000-0000-0000-000000000401', 'will have', FALSE, 4);

-- Q22: Vocabulary B2
INSERT INTO english_test_questions (id, test_id, question, explanation, cefr_level, category, difficulty, position) VALUES
('00000000-0000-0000-0000-000000000402', '00000000-0000-0000-0000-000000000001', 'Choose the correct word: "The findings of the research were ___ by the scientific community."', '"Acknowledged" significa reconhecido.', 'B2', 'VOCABULARY', 4, 22);
INSERT INTO english_test_options (question_id, option_text, is_correct, position) VALUES
('00000000-0000-0000-0000-000000000402', 'acknowledged', TRUE, 1),
('00000000-0000-0000-0000-000000000402', 'denied', FALSE, 2),
('00000000-0000-0000-0000-000000000402', 'ignored', FALSE, 3),
('00000000-0000-0000-0000-000000000402', 'forgotten', FALSE, 4);

-- Q23: Grammar B2
INSERT INTO english_test_questions (id, test_id, question, explanation, cefr_level, category, difficulty, position) VALUES
('00000000-0000-0000-0000-000000000403', '00000000-0000-0000-0000-000000000001', 'Choose: "Had I known, I ___ come earlier."', 'Third conditional invertido: Had + subject + past participle, would have + past participle.', 'B2', 'GRAMMAR', 4, 23);
INSERT INTO english_test_options (question_id, option_text, is_correct, position) VALUES
('00000000-0000-0000-0000-000000000403', 'would have', TRUE, 1),
('00000000-0000-0000-0000-000000000403', 'will', FALSE, 2),
('00000000-0000-0000-0000-000000000403', 'would', FALSE, 3),
('00000000-0000-0000-0000-000000000403', 'have', FALSE, 4);

-- Q24: Reading B2
INSERT INTO english_test_questions (id, test_id, question, explanation, cefr_level, category, difficulty, position) VALUES
('00000000-0000-0000-0000-000000000404', '00000000-0000-0000-0000-000000000001', 'Read: "The novel, which was published in 1925, is widely regarded as a masterpiece of American literature. Its themes of wealth, love, and the American Dream continue to resonate with readers today." What is the novel about?', 'O texto menciona temas de riqueza, amor e o Sonho Americano.', 'B2', 'READING', 4, 24);
INSERT INTO english_test_options (question_id, option_text, is_correct, position) VALUES
('00000000-0000-0000-0000-000000000404', 'Themes of wealth, love, and the American Dream', TRUE, 1),
('00000000-0000-0000-0000-000000000404', 'A scientific discovery', FALSE, 2),
('00000000-0000-0000-0000-000000000404', 'A war story', FALSE, 3),
('00000000-0000-0000-0000-000000000404', 'A biography', FALSE, 4);

-- Q25: Vocabulary B2
INSERT INTO english_test_questions (id, test_id, question, explanation, cefr_level, category, difficulty, position) VALUES
('00000000-0000-0000-0000-000000000405', '00000000-0000-0000-0000-000000000001', 'What does "nevertheless" mean?', '"Nevertheless" significa "no entanto" ou "apesar disso".', 'B2', 'VOCABULARY', 4, 25);
INSERT INTO english_test_options (question_id, option_text, is_correct, position) VALUES
('00000000-0000-0000-0000-000000000405', 'however', TRUE, 1),
('00000000-0000-0000-0000-000000000405', 'therefore', FALSE, 2),
('00000000-0000-0000-0000-000000000405', 'furthermore', FALSE, 3),
('00000000-0000-0000-0000-000000000405', 'meanwhile', FALSE, 4);

-- Q26: Grammar B2
INSERT INTO english_test_questions (id, test_id, question, explanation, cefr_level, category, difficulty, position) VALUES
('00000000-0000-0000-0000-000000000406', '00000000-0000-0000-0000-000000000001', 'Complete: "It is essential that every student ___ the rules."', 'Subjuntivo: after "essential that" use o base form do verbo.', 'B2', 'GRAMMAR', 4, 26);
INSERT INTO english_test_options (question_id, option_text, is_correct, position) VALUES
('00000000-0000-0000-0000-000000000406', 'follow', TRUE, 1),
('00000000-0000-0000-0000-000000000406', 'follows', FALSE, 2),
('00000000-0000-0000-0000-000000000406', 'followed', FALSE, 3),
('00000000-0000-0000-0000-000000000406', 'will follow', FALSE, 4);

-- Q27: Reading B2
INSERT INTO english_test_questions (id, test_id, question, explanation, cefr_level, category, difficulty, position) VALUES
('00000000-0000-0000-0000-000000000407', '00000000-0000-0000-0000-000000000001', 'Read: "The government implemented new policies aimed at reducing carbon emissions by 50% by 2030. Critics argue, however, that the measures are insufficient and that more aggressive action is needed." What do critics say?', 'Os críticos argumentam que as medidas são insuficientes.', 'B2', 'READING', 4, 27);
INSERT INTO english_test_options (question_id, option_text, is_correct, position) VALUES
('00000000-0000-0000-0000-000000000407', 'The measures are insufficient', TRUE, 1),
('00000000-0000-0000-0000-000000000407', 'The policies are excellent', FALSE, 2),
('00000000-0000-0000-0000-000000000407', 'The target is too high', FALSE, 3),
('00000000-0000-0000-0000-000000000407', 'The government should wait', FALSE, 4);

-- ========================
-- C1 QUESTIONS (7)
-- ========================

-- Q28: Grammar C1
INSERT INTO english_test_questions (id, test_id, question, explanation, cefr_level, category, difficulty, position) VALUES
('00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000001', 'Complete: "Not until the following morning ___ the extent of the damage."', 'Inversão após "Not until": Not until + clause + aux + subject + verb.', 'C1', 'GRAMMAR', 5, 28);
INSERT INTO english_test_options (question_id, option_text, is_correct, position) VALUES
('00000000-0000-0000-0000-000000000501', 'did they realize', TRUE, 1),
('00000000-0000-0000-0000-000000000501', 'they realized', FALSE, 2),
('00000000-0000-0000-0000-000000000501', 'they did realize', FALSE, 3),
('00000000-0000-0000-0000-000000000501', 'realized they', FALSE, 4);

-- Q29: Vocabulary C1
INSERT INTO english_test_questions (id, test_id, question, explanation, cefr_level, category, difficulty, position) VALUES
('00000000-0000-0000-0000-000000000502', '00000000-0000-0000-0000-000000000001', 'Choose the best word: "The professor ___ the student for his outstanding research."', '"Commended" significa elogiou formalmente.', 'C1', 'VOCABULARY', 5, 29);
INSERT INTO english_test_options (question_id, option_text, is_correct, position) VALUES
('00000000-0000-0000-0000-000000000502', 'commended', TRUE, 1),
('00000000-0000-0000-0000-000000000502', 'blamed', FALSE, 2),
('00000000-0000-0000-0000-000000000502', 'ignored', FALSE, 3),
('00000000-0000-0000-0000-000000000502', 'dismissed', FALSE, 4);

-- Q30: Grammar C1
INSERT INTO english_test_questions (id, test_id, question, explanation, cefr_level, category, difficulty, position) VALUES
('00000000-0000-0000-0000-000000000503', '00000000-0000-0000-0000-000000000001', 'Complete: "Were it not for your help, I ___ the project."', 'Third conditional invertido sem "if".', 'C1', 'GRAMMAR', 5, 30);
INSERT INTO english_test_options (question_id, option_text, is_correct, position) VALUES
('00000000-0000-0000-0000-000000000503', 'would not have finished', TRUE, 1),
('00000000-0000-0000-0000-000000000503', 'will not finish', FALSE, 2),
('00000000-0000-0000-0000-000000000503', 'did not finish', FALSE, 3),
('00000000-0000-0000-0000-000000000503', 'had not finished', FALSE, 4);

-- Q31: Reading C1
INSERT INTO english_test_questions (id, test_id, question, explanation, cefr_level, category, difficulty, position) VALUES
('00000000-0000-0000-0000-000000000504', '00000000-0000-0000-0000-000000000001', 'Read: "The implications of quantum computing for cryptography are profound. Current encryption methods, which rely on the difficulty of factoring large numbers, could be rendered obsolete by sufficiently powerful quantum computers." What does this imply about current encryption?', 'O texto sugere que a criptografia atual pode se tornar obsoleta.', 'C1', 'READING', 5, 31);
INSERT INTO english_test_options (question_id, option_text, is_correct, position) VALUES
('00000000-0000-0000-0000-000000000504', 'It could become obsolete', TRUE, 1),
('00000000-0000-0000-0000-000000000504', 'It will become stronger', FALSE, 2),
('00000000-0000-0000-0000-000000000504', 'It is already obsolete', FALSE, 3),
('00000000-0000-0000-0000-000000000504', 'It is unaffected', FALSE, 4);

-- Q32: Vocabulary C1
INSERT INTO english_test_questions (id, test_id, question, explanation, cefr_level, category, difficulty, position) VALUES
('00000000-0000-0000-0000-000000000505', '00000000-0000-0000-0000-000000000001', 'What does "ubiquitous" mean?', '"Ubiquitous" significa onipresente, encontrado em toda parte.', 'C1', 'VOCABULARY', 5, 32);
INSERT INTO english_test_options (question_id, option_text, is_correct, position) VALUES
('00000000-0000-0000-0000-000000000505', 'present everywhere', TRUE, 1),
('00000000-0000-0000-0000-000000000505', 'extremely rare', FALSE, 2),
('00000000-0000-0000-0000-000000000505', 'very dangerous', FALSE, 3),
('00000000-0000-0000-0000-000000000505', 'completely invisible', FALSE, 4);

-- Q33: Grammar C1
INSERT INTO english_test_questions (id, test_id, question, explanation, cefr_level, category, difficulty, position) VALUES
('00000000-0000-0000-0000-000000000506', '00000000-0000-0000-0000-000000000001', 'Choose: "The CEO, along with the board members, ___ in favor of the merger."', 'Sujeito singular (CEO) + "along with" = verbo no singular.', 'C1', 'GRAMMAR', 5, 33);
INSERT INTO english_test_options (question_id, option_text, is_correct, position) VALUES
('00000000-0000-0000-0000-000000000506', 'was', TRUE, 1),
('00000000-0000-0000-0000-000000000506', 'were', FALSE, 2),
('00000000-0000-0000-0000-000000000506', 'have been', FALSE, 3),
('00000000-0000-0000-0000-000000000506', 'are', FALSE, 4);

-- Q34: Reading C1
INSERT INTO english_test_questions (id, test_id, question, explanation, cefr_level, category, difficulty, position) VALUES
('00000000-0000-0000-0000-000000000507', '00000000-0000-0000-0000-000000000001', 'Read: "The author''s critique of neoliberalism is nuanced, acknowledging its role in global economic growth while simultaneously condemning its exacerbation of inequality. This dialectical approach sets her work apart from more polemical treatments of the subject." How does the author''s approach differ?', 'A abordagem dialética reconhece tanto aspectos positivos quanto negativos.', 'C1', 'READING', 5, 34);
INSERT INTO english_test_options (question_id, option_text, is_correct, position) VALUES
('00000000-0000-0000-0000-000000000507', 'It is dialectical, acknowledging both sides', TRUE, 1),
('00000000-0000-0000-0000-000000000507', 'It is purely critical', FALSE, 2),
('00000000-0000-0000-0000-000000000507', 'It is entirely supportive', FALSE, 3),
('00000000-0000-0000-0000-000000000507', 'It is indifferent', FALSE, 4);

-- ========================
-- C2 QUESTIONS (6)
-- ========================

-- Q35: Grammar C2
INSERT INTO english_test_questions (id, test_id, question, explanation, cefr_level, category, difficulty, position) VALUES
('00000000-0000-0000-0000-000000000601', '00000000-0000-0000-0000-000000000001', 'Complete: "Should you require further assistance, ___ hesitate to contact us."', 'Inversão em condicionais formais: Should + subject + verb.', 'C2', 'GRAMMAR', 5, 35);
INSERT INTO english_test_options (question_id, option_text, is_correct, position) VALUES
('00000000-0000-0000-0000-000000000601', 'do not', TRUE, 1),
('00000000-0000-0000-0000-000000000601', 'you do not', FALSE, 2),
('00000000-0000-0000-0000-000000000601', 'you will not', FALSE, 3),
('00000000-0000-0000-0000-000000000601', 'not', FALSE, 4);

-- Q36: Vocabulary C2
INSERT INTO english_test_questions (id, test_id, question, explanation, cefr_level, category, difficulty, position) VALUES
('00000000-0000-0000-0000-000000000602', '00000000-0000-0000-0000-000000000001', 'Choose the best word: "Her ___ remarks during the debate showed her profound understanding of the subject."', '"Lucid" significa claro, lúcido.', 'C2', 'VOCABULARY', 5, 36);
INSERT INTO english_test_options (question_id, option_text, is_correct, position) VALUES
('00000000-0000-0000-0000-000000000602', 'lucid', TRUE, 1),
('00000000-0000-0000-0000-000000000602', 'vague', FALSE, 2),
('00000000-0000-0000-0000-000000000602', 'ambiguous', FALSE, 3),
('00000000-0000-0000-0000-000000000602', 'obscure', FALSE, 4);

-- Q37: Grammar C2
INSERT INTO english_test_questions (id, test_id, question, explanation, cefr_level, category, difficulty, position) VALUES
('00000000-0000-0000-0000-000000000603', '00000000-0000-0000-0000-000000000001', 'Complete: "It is imperative that the data ___ verified before publication."', 'Subjuntivo formal: "imperative that" + base form.', 'C2', 'GRAMMAR', 5, 37);
INSERT INTO english_test_options (question_id, option_text, is_correct, position) VALUES
('00000000-0000-0000-0000-000000000603', 'be', TRUE, 1),
('00000000-0000-0000-0000-000000000603', 'is', FALSE, 2),
('00000000-0000-0000-0000-000000000603', 'being', FALSE, 3),
('00000000-0000-0000-0000-000000000603', 'been', FALSE, 4);

-- Q38: Reading C2
INSERT INTO english_test_questions (id, test_id, question, explanation, cefr_level, category, difficulty, position) VALUES
('00000000-0000-0000-0000-000000000604', '00000000-0000-0000-0000-000000000001', 'Read: "The epistemological foundations of positivism have been subjected to sustained critique by post-structuralist thinkers, who contend that the purported objectivity of scientific inquiry is itself a discursive construct imbued with power relations." What do post-structuralists argue?', 'Os pós-estruturalistas argumentam que a objetividade científica é uma construção discursiva.', 'C2', 'READING', 5, 38);
INSERT INTO english_test_options (question_id, option_text, is_correct, position) VALUES
('00000000-0000-0000-0000-000000000604', 'Scientific objectivity is a discursive construct', TRUE, 1),
('00000000-0000-0000-0000-000000000604', 'Positivism is completely correct', FALSE, 2),
('00000000-0000-0000-0000-000000000604', 'Science has no value', FALSE, 3),
('00000000-0000-0000-0000-000000000604', 'Power relations are irrelevant', FALSE, 4);

-- Q39: Vocabulary C2
INSERT INTO english_test_questions (id, test_id, question, explanation, cefr_level, category, difficulty, position) VALUES
('00000000-0000-0000-0000-000000000605', '00000000-0000-0000-0000-000000000001', 'What does "mellifluous" mean?', '"Mellifluous" significa suave, doce, agradável ao ouvir (som).', 'C2', 'VOCABULARY', 5, 39);
INSERT INTO english_test_options (question_id, option_text, is_correct, position) VALUES
('00000000-0000-0000-0000-000000000605', 'sweet and smooth sounding', TRUE, 1),
('00000000-0000-0000-0000-000000000605', 'harsh and loud', FALSE, 2),
('00000000-0000-0000-0000-000000000605', 'fast and energetic', FALSE, 3),
('00000000-0000-0000-0000-000000000605', 'sad and melancholic', FALSE, 4);

-- Q40: Grammar C2
INSERT INTO english_test_questions (id, test_id, question, explanation, cefr_level, category, difficulty, position) VALUES
('00000000-0000-0000-0000-000000000606', '00000000-0000-0000-0000-000000000001', 'Choose: "Never before ___ such a compelling argument presented so eloquently."', 'Inversão com "Never before" no início da frase.', 'C2', 'GRAMMAR', 5, 40);
INSERT INTO english_test_options (question_id, option_text, is_correct, position) VALUES
('00000000-0000-0000-0000-000000000606', 'have I heard', TRUE, 1),
('00000000-0000-0000-0000-000000000606', 'I have heard', FALSE, 2),
('00000000-0000-0000-0000-000000000606', 'I heard', FALSE, 3),
('00000000-0000-0000-0000-000000000606', 'did I heard', FALSE, 4);
