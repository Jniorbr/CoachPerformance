# AGENTS.md — Coach Performance

## 1. Identidade do projeto

O Coach Performance é um projeto acadêmico desenvolvido no SENAC, com visão de evolução para um produto real.

Objetivo: desenvolver uma aplicação web para centralizar informações relacionadas a treino, alimentação, sono, hidratação, hábitos e evolução física.

Repositório:
https://github.com/Jniorbr/CoachPerformance

## 2. Objetivos de desenvolvimento

Construir uma aplicação funcional, organizada, segura, escalável e sustentável.

Prioridades:
- Atender aos requisitos acadêmicos.
- Preservar funcionalidades existentes.
- Preparar a aplicação para usuários reais.
- Manter boa experiência de uso.
- Evitar complexidade arquitetural desnecessária.

## 3. Regras obrigatórias

- Antes de implementar, inspecione o código existente.
- Não presuma que funcionalidades estão implementadas sem verificar.
- Não reescreva arquivos ou módulos sem justificativa.
- Não faça grandes alterações em múltiplas áreas simultaneamente.
- Não introduza dependências sem necessidade justificada.
- Não altere banco de dados, autenticação ou políticas RLS sem autorização explícita.
- Nunca exponha credenciais, tokens ou chaves privadas.
- Não remova funcionalidades temporárias sem entender sua finalidade.
- Não substitua o trabalho de aprendizagem do aluno por implementações sem explicação.

## 4. Metodologia obrigatória

Para cada demanda:

1. Entender o requisito.
2. Relacionar o requisito ao domínio Coach Performance.
3. Auditar o código envolvido.
4. Identificar o que já existe.
5. Identificar lacunas e riscos.
6. Apresentar dúvidas e decisões necessárias.
7. Propor um plano de implementação.
8. Aguardar aprovação quando houver decisões arquiteturais ou alterações sensíveis.
9. Implementar somente quando autorizado.
10. Revisar alterações e orientar testes.
11. Atualizar a documentação quando necessário.

## 5. Arquitetura e tecnologias

A arquitetura atual deve ser descoberta por auditoria, não presumida.

React 19 e Tailwind CSS 4 são tecnologias opcionais, não exigências absolutas.

Não introduzir backend próprio ou API independente sem necessidade concreta. Avaliar primeiro as capacidades existentes do Supabase.

Priorizar:
- Responsabilidade única.
- Baixo acoplamento.
- Alta coesão.
- Separação de responsabilidades.
- Reutilização justificada.
- Tipagem e validações consistentes.
- Segurança no acesso aos dados.

## 6. Banco de dados e Supabase

O projeto utiliza Supabase, PostgreSQL, Supabase Auth e RLS.

Contexto anteriormente consolidado, sujeito à conferência na auditoria:
- Tabelas principais: treinos_series e refeicoes.
- RLS baseada em auth.uid().
- Quatro policies por tabela.
- GRANT restrito a authenticated.
- Atualização e exclusão de séries por ID.
- Upsert de refeições por (user_id, data, refeicao).
- Datas enviadas pelo frontend em horário local.
- Histórico consulta os últimos 30 dias.
- Sono, hidratação, cardio e conclusão do treino utilizam localStorage.

Não assumir que esse estado permanece inalterado. Conferir o banco e o código antes de qualquer decisão.

## 7. Segurança

- Não inserir segredos no código ou na documentação.
- Não versionar arquivos .env com credenciais.
- Não enfraquecer políticas RLS.
- Não expor dados de usuários.
- Não executar migrações sem autorização.

## 8. Trabalho com Git e GitHub

Antes de alterações relevantes:
- Verificar branch e estado do repositório.
- Identificar alterações não commitadas.
- Não sobrescrever trabalho existente.
- Não realizar commits ou push sem solicitação/autorização.
- Descrever arquivos modificados e motivos.

## 9. Comunicação

- Responder em português do Brasil.
- Ser objetivo e organizado.
- Explicar decisões técnicas e seus motivos.
- Separar fatos confirmados, hipóteses e recomendações.
- Não inventar estruturas, funcionalidades ou resultados de testes.
- Ensinar o aluno durante o desenvolvimento.

## 10. Regra fundamental

O objetivo não é apenas fazer o sistema funcionar.

É construir um produto sustentável e garantir que o aluno compreenda a arquitetura, as decisões e o código que está desenvolvendo.

## 11. LGPD, privacidade e proteção de dados

O Coach Performance poderá armazenar dados pessoais e dados pessoais sensíveis, especialmente informações relacionadas à saúde e hábitos dos usuários.

O desenvolvimento deverá considerar a Lei Geral de Proteção de Dados (LGPD).

O agente deverá:
- Identificar os dados pessoais coletados e armazenados.
- Classificar os dados conforme sua natureza.
- Avaliar finalidade, necessidade e proporcionalidade da coleta.
- Identificar bases legais aplicáveis, especialmente para dados sensíveis.
- Avaliar mecanismos de transparência e exercício dos direitos dos titulares.
- Avaliar política de privacidade, retenção e exclusão de dados.
- Revisar autenticação, autorização, RLS e isolamento entre usuários.
- Identificar riscos de exposição e armazenamento inadequado.

Não afirmar conformidade com a LGPD sem avaliação suficiente. Questões jurídicas devem ser sinalizadas para validação especializada.

## 12. Publicação e testes com usuários reais

O projeto será publicado para utilização e avaliação por pessoas reais, além de sua finalidade acadêmica.

A arquitetura e a infraestrutura deverão considerar esse cenário.

Antes da publicação, avaliar:
- Separação entre desenvolvimento e produção.
- Configuração segura de variáveis de ambiente.
- Autenticação e isolamento entre usuários.
- Revisão das políticas RLS.
- Responsividade e compatibilidade entre dispositivos.
- Tratamento de erros e estados de carregamento.
- Backup e recuperação.
- Monitoramento e diagnóstico de falhas.
- Processo de coleta de feedback.
- Proteção dos dados dos participantes dos testes.

Não publicar funcionalidades com riscos conhecidos de exposição de dados.

## 13. Auditoria de persistência e localStorage

O agente deverá auditar todas as informações armazenadas em localStorage, sessionStorage ou outros mecanismos locais.

Para cada informação, avaliar:
- Natureza e finalidade do dado.
- Necessidade de persistência.
- Necessidade de histórico.
- Necessidade de sincronização entre dispositivos.
- Associação com o usuário autenticado.
- Requisitos de privacidade e segurança.
- Impactos na experiência do usuário.

Classificar cada item como:
1. Manter armazenamento local.
2. Migrar para persistência no Supabase.
3. Adotar estratégia híbrida.
4. Remover somente se houver autorização e justificativa.

Apresentar uma matriz de recomendações antes de implementar migrações.

Toda migração deverá preservar os dados existentes quando aplicável, considerar compatibilidade e ser aprovada previamente pelo usuário.

Não modificar schema, tabelas, políticas RLS ou autenticação sem autorização explícita.