# Guia Completo de Hospedagem e Configuração
## Sistema de Agendamentos Transformar

**Autor:** Manus AI  
**Data:** Janeiro 2025  
**Versão:** 1.0

---

## Índice

1. [Introdução](#introdução)
2. [Opções de Hospedagem Gratuita](#opções-de-hospedagem-gratuita)
3. [Configuração do Google Calendar API](#configuração-do-google-calendar-api)
4. [Deploy no Vercel (Recomendado)](#deploy-no-vercel-recomendado)
5. [Deploy no Netlify](#deploy-no-netlify)
6. [Deploy no Firebase Hosting](#deploy-no-firebase-hosting)
7. [Configuração de Domínio Personalizado](#configuração-de-domínio-personalizado)
8. [Manutenção e Monitoramento](#manutenção-e-monitoramento)
9. [Solução de Problemas](#solução-de-problemas)
10. [Referências](#referências)

---

## Introdução

Este guia fornece instruções detalhadas para hospedar o sistema de agendamentos do consultório Transformar de forma gratuita na internet. O sistema foi desenvolvido como uma Progressive Web App (PWA) com integração ao Google Calendar, permitindo que pacientes agendem consultas online e que os agendamentos sejam automaticamente sincronizados com a agenda do fisioterapeuta.

O sistema é composto por:
- **Frontend**: Interface responsiva desenvolvida em HTML, CSS e JavaScript
- **Backend**: API REST desenvolvida em Python Flask
- **Banco de Dados**: SQLite para armazenamento local dos agendamentos
- **Integração**: Google Calendar API para sincronização de eventos
- **PWA**: Funcionalidades de aplicativo móvel com cache offline

### Requisitos Técnicos

Antes de iniciar o processo de hospedagem, certifique-se de ter:
- Conta no Google Cloud Console (gratuita)
- Conta em uma das plataformas de hospedagem (Vercel, Netlify ou Firebase)
- Conhecimentos básicos de linha de comando
- Editor de texto ou IDE
- Navegador web moderno

---


## Opções de Hospedagem Gratuita

Para hospedar o sistema Transformar gratuitamente, analisamos as principais plataformas disponíveis no mercado. Cada uma oferece vantagens específicas e limitações que devem ser consideradas na escolha da melhor opção para suas necessidades.

### Comparativo das Plataformas

| Plataforma | Limite de Banda | Limite de Build | Domínio Personalizado | Suporte a Backend | Facilidade de Uso |
|------------|-----------------|-----------------|----------------------|-------------------|-------------------|
| **Vercel** | 100GB/mês | 6.000 min/mês | ✅ Gratuito | ✅ Serverless | ⭐⭐⭐⭐⭐ |
| **Netlify** | 100GB/mês | 300 min/mês | ✅ Gratuito | ✅ Functions | ⭐⭐⭐⭐⭐ |
| **Firebase** | 10GB/mês | Ilimitado | ✅ Gratuito | ✅ Cloud Functions | ⭐⭐⭐⭐ |
| **Railway** | 500h/mês | Ilimitado | ✅ Pago | ✅ Full Stack | ⭐⭐⭐ |
| **Render** | 750h/mês | Ilimitado | ✅ Pago | ✅ Full Stack | ⭐⭐⭐⭐ |

### Vercel (Recomendado)

O Vercel é nossa recomendação principal para hospedar o sistema Transformar devido à sua excelente integração com aplicações full-stack e facilidade de configuração. A plataforma oferece suporte nativo para Python Flask através de suas Serverless Functions, tornando o deploy extremamente simples.

**Vantagens do Vercel:**
- Deploy automático a partir de repositórios Git
- Suporte nativo para Python e Flask
- CDN global para performance otimizada
- HTTPS automático em todos os domínios
- Preview deployments para cada commit
- Integração fácil com bancos de dados externos
- Monitoramento e analytics integrados

**Limitações:**
- Serverless functions têm timeout de 10 segundos no plano gratuito
- Banco de dados SQLite não persiste entre deployments (requer migração para PostgreSQL)
- Limite de 100GB de bandwidth por mês

### Netlify

O Netlify é uma excelente alternativa, especialmente conhecido por sua facilidade de uso e recursos avançados para sites estáticos e JAMstack. Para aplicações full-stack como o Transformar, utiliza Netlify Functions baseadas em AWS Lambda.

**Vantagens do Netlify:**
- Interface muito intuitiva e amigável
- Deploy contínuo automático
- Form handling nativo (útil para formulários de contato)
- Split testing A/B integrado
- Edge functions para performance
- Excelente documentação e comunidade

**Limitações:**
- Limite de build time mais restritivo (300 minutos/mês)
- Functions têm limitações de memória no plano gratuito
- Configuração de backend mais complexa que o Vercel

### Firebase Hosting

O Firebase, da Google, oferece uma solução robusta e integrada com outros serviços do Google Cloud. É particularmente vantajoso para o sistema Transformar devido à integração natural com Google Calendar API.

**Vantagens do Firebase:**
- Integração nativa com serviços Google
- Firestore como banco de dados NoSQL gratuito
- Authentication integrado
- Cloud Functions para backend
- Hosting com CDN global
- Analytics detalhado

**Limitações:**
- Curva de aprendizado mais íngreme
- Configuração inicial mais complexa
- Menor limite de bandwidth (10GB/mês)
- Vendor lock-in com ecossistema Google

### Considerações para Escolha

A escolha da plataforma deve considerar fatores específicos do seu uso:

**Para iniciantes ou deploys rápidos:** Recomendamos o Vercel pela simplicidade e documentação excelente. O processo de deploy pode ser concluído em menos de 10 minutos.

**Para projetos que crescerão rapidamente:** O Firebase oferece melhor escalabilidade e integração com outros serviços, mas requer mais tempo de configuração inicial.

**Para máximo controle e customização:** O Netlify oferece o melhor equilíbrio entre facilidade de uso e flexibilidade, sendo ideal para desenvolvedores que querem controle granular sobre o deploy.

**Para integração máxima com Google:** Se você já utiliza outros serviços Google (Gmail, Drive, Analytics), o Firebase oferece a melhor sinergia e facilita futuras integrações.

---


## Configuração do Google Calendar API

A integração com o Google Calendar é o coração do sistema Transformar, permitindo que os agendamentos feitos pelos pacientes sejam automaticamente sincronizados com a agenda do fisioterapeuta. Esta seção detalha todo o processo de configuração necessário.

### Passo 1: Criação do Projeto no Google Cloud Console

O primeiro passo é criar um projeto no Google Cloud Console que servirá como container para todas as configurações da API.

1. **Acesse o Google Cloud Console**
   - Navegue até [console.cloud.google.com](https://console.cloud.google.com)
   - Faça login com sua conta Google (a mesma que será usada para o calendário)

2. **Criar Novo Projeto**
   - Clique no seletor de projeto no topo da página
   - Selecione "Novo Projeto"
   - Nome sugerido: "Transformar Agendamentos"
   - Deixe a organização como padrão
   - Clique em "Criar"

3. **Aguardar Criação**
   - O processo pode levar alguns minutos
   - Você receberá uma notificação quando o projeto estiver pronto
   - Certifique-se de que o projeto correto está selecionado

### Passo 2: Habilitação da Google Calendar API

Com o projeto criado, é necessário habilitar especificamente a API do Google Calendar.

1. **Acessar Biblioteca de APIs**
   - No menu lateral, navegue até "APIs e Serviços" > "Biblioteca"
   - Use a barra de pesquisa para encontrar "Google Calendar API"
   - Clique no resultado "Google Calendar API"

2. **Habilitar a API**
   - Clique no botão "Ativar"
   - Aguarde alguns segundos para a ativação
   - Você será redirecionado para a página de visão geral da API

3. **Verificar Status**
   - Confirme que o status mostra "API habilitada"
   - Anote o nome do projeto para referência futura

### Passo 3: Configuração de Credenciais OAuth 2.0

O sistema utiliza OAuth 2.0 para autenticação segura com o Google Calendar. Este processo garante que apenas usuários autorizados possam acessar e modificar o calendário.

1. **Criar Credenciais**
   - Navegue até "APIs e Serviços" > "Credenciais"
   - Clique em "Criar Credenciais" > "ID do cliente OAuth"
   - Se solicitado, configure a tela de consentimento OAuth primeiro

2. **Configurar Tela de Consentimento**
   - Selecione "Externo" como tipo de usuário
   - Preencha as informações obrigatórias:
     - Nome do aplicativo: "Sistema Transformar"
     - Email de suporte: seu email profissional
     - Domínios autorizados: adicione seu domínio quando disponível
   - Adicione escopos necessários:
     - `https://www.googleapis.com/auth/calendar`
     - `https://www.googleapis.com/auth/calendar.events`

3. **Criar ID do Cliente OAuth**
   - Tipo de aplicativo: "Aplicativo da Web"
   - Nome: "Transformar Web Client"
   - Origens JavaScript autorizadas:
     - `http://localhost:5000` (para desenvolvimento)
     - Seu domínio de produção (será adicionado após deploy)
   - URIs de redirecionamento autorizados:
     - `http://localhost:5000/oauth/callback`
     - Seu domínio de produção + `/oauth/callback`

4. **Download das Credenciais**
   - Após criar, clique no ícone de download
   - Salve o arquivo como `credentials.json`
   - **IMPORTANTE**: Mantenha este arquivo seguro e nunca o compartilhe publicamente

### Passo 4: Configuração do Arquivo de Credenciais

O arquivo `credentials.json` contém informações sensíveis que devem ser tratadas com cuidado especial.

```json
{
  "web": {
    "client_id": "seu-client-id.googleusercontent.com",
    "project_id": "transformar-agendamentos",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_secret": "seu-client-secret",
    "redirect_uris": ["http://localhost:5000/oauth/callback"]
  }
}
```

**Segurança das Credenciais:**
- Nunca commite o arquivo `credentials.json` no Git
- Use variáveis de ambiente em produção
- Adicione `credentials.json` ao `.gitignore`
- Considere usar serviços de gerenciamento de secrets

### Passo 5: Primeiro Acesso e Autorização

O primeiro acesso requer autorização manual para estabelecer a conexão entre o sistema e o Google Calendar.

1. **Executar Aplicação Localmente**
   - Inicie o servidor Flask
   - Acesse a aplicação no navegador
   - Tente fazer um agendamento de teste

2. **Processo de Autorização**
   - O sistema redirecionará para a página de login do Google
   - Faça login com a conta que contém o calendário desejado
   - Autorize as permissões solicitadas:
     - Ver e editar eventos do calendário
     - Criar novos eventos
     - Enviar convites por email

3. **Geração do Token**
   - Após autorização, um arquivo `token.json` será criado automaticamente
   - Este arquivo contém o token de acesso renovável
   - **IMPORTANTE**: Trate este arquivo com a mesma segurança que as credenciais

### Passo 6: Configuração de Variáveis de Ambiente

Para produção, as credenciais devem ser configuradas como variáveis de ambiente para maior segurança.

```bash
# Variáveis necessárias para produção
GOOGLE_CLIENT_ID=seu-client-id.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu-client-secret
GOOGLE_PROJECT_ID=transformar-agendamentos
GOOGLE_CALENDAR_ID=primary
```

**Configuração por Plataforma:**

**Vercel:**
```bash
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add GOOGLE_PROJECT_ID
```

**Netlify:**
- Acesse Site Settings > Environment Variables
- Adicione cada variável individualmente

**Firebase:**
```bash
firebase functions:config:set google.client_id="seu-client-id"
firebase functions:config:set google.client_secret="seu-client-secret"
```

### Passo 7: Teste da Integração

Após configurar todas as credenciais, é essencial testar a integração para garantir funcionamento correto.

1. **Teste de Conexão**
   - Acesse a aplicação
   - Verifique se não há erros de autenticação nos logs
   - Confirme que o status da API mostra "conectado"

2. **Teste de Criação de Evento**
   - Faça um agendamento de teste
   - Verifique se o evento aparece no Google Calendar
   - Confirme que as informações estão corretas:
     - Data e horário
     - Título do evento
     - Descrição com dados do paciente
     - Email do paciente como convidado

3. **Teste de Sincronização**
   - Modifique um evento diretamente no Google Calendar
   - Verifique se as mudanças são refletidas no sistema
   - Teste cancelamento de eventos

### Solução de Problemas Comuns

**Erro: "Access blocked: This app's request is invalid"**
- Verifique se a tela de consentimento OAuth está configurada
- Confirme que todos os escopos necessários foram adicionados
- Certifique-se de que o domínio está autorizado

**Erro: "Invalid redirect URI"**
- Verifique se o URI de redirecionamento está correto nas credenciais
- Confirme que o protocolo (http/https) está correto
- Para produção, use sempre HTTPS

**Erro: "Token expired"**
- Delete o arquivo `token.json` e refaça a autorização
- Verifique se o refresh token está sendo usado corretamente
- Confirme que as credenciais não expiraram

**Eventos não aparecem no calendário**
- Verifique se o calendário correto está sendo usado
- Confirme que o usuário tem permissões de escrita
- Teste com um calendário secundário se necessário

---


## Deploy no Vercel (Recomendado)

O Vercel oferece a melhor experiência para hospedar o sistema Transformar, combinando simplicidade de uso com recursos avançados. Esta seção fornece um guia passo a passo completo para realizar o deploy.

### Preparação do Projeto

Antes de fazer o deploy, é necessário preparar o projeto para o ambiente de produção do Vercel.

1. **Estrutura de Arquivos para Vercel**
   
   O Vercel requer uma estrutura específica para aplicações Python Flask. Crie os seguintes arquivos na raiz do projeto:

   **vercel.json:**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "backend/src/main.py",
         "use": "@vercel/python"
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "backend/src/main.py"
       },
       {
         "src": "/(.*)",
         "dest": "backend/src/static/$1"
       }
     ],
     "env": {
       "PYTHONPATH": "backend"
     }
   }
   ```

   **requirements.txt (na raiz):**
   ```txt
   Flask==3.0.0
   flask-cors==4.0.0
   flask-sqlalchemy==3.1.1
   google-auth==2.40.3
   google-auth-oauthlib==1.2.2
   google-auth-httplib2==0.2.0
   google-api-python-client==2.175.0
   ```

2. **Configuração de Variáveis de Ambiente**
   
   Crie um arquivo `.env.example` para documentar as variáveis necessárias:
   ```bash
   GOOGLE_CLIENT_ID=seu-client-id.googleusercontent.com
   GOOGLE_CLIENT_SECRET=seu-client-secret
   GOOGLE_PROJECT_ID=transformar-agendamentos
   FLASK_SECRET_KEY=sua-chave-secreta-aqui
   DATABASE_URL=sqlite:///app.db
   ```

3. **Atualização do Código para Produção**
   
   Modifique o arquivo `main.py` para suportar o ambiente Vercel:
   ```python
   import os
   from flask import Flask
   
   # Configuração para Vercel
   app = Flask(__name__, static_folder='static', static_url_path='')
   
   # Usar variáveis de ambiente em produção
   app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET_KEY', 'dev-key')
   
   # Configuração de banco para produção
   if os.environ.get('VERCEL'):
       # Em produção no Vercel, usar PostgreSQL
       app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
   else:
       # Em desenvolvimento, usar SQLite
       app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
   ```

### Passo 1: Criação de Conta no Vercel

1. **Registro**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "Sign Up"
   - Recomendamos usar sua conta GitHub para facilitar a integração
   - Complete o processo de verificação de email

2. **Configuração Inicial**
   - Escolha um nome de usuário único
   - Selecione "Personal" como tipo de conta (gratuito)
   - Pule a configuração de equipe por enquanto

### Passo 2: Preparação do Repositório Git

O Vercel funciona melhor com integração Git, permitindo deploys automáticos a cada commit.

1. **Inicializar Repositório**
   ```bash
   cd transformar_consultorio
   git init
   git add .
   git commit -m "Initial commit - Sistema Transformar"
   ```

2. **Criar Repositório no GitHub**
   - Acesse [github.com](https://github.com) e crie um novo repositório
   - Nome sugerido: "transformar-agendamentos"
   - Mantenha como público ou privado conforme preferência
   - Não inicialize com README (já temos arquivos)

3. **Conectar Repositório Local ao GitHub**
   ```bash
   git remote add origin https://github.com/seu-usuario/transformar-agendamentos.git
   git branch -M main
   git push -u origin main
   ```

### Passo 3: Deploy via Dashboard Vercel

1. **Importar Projeto**
   - No dashboard do Vercel, clique em "New Project"
   - Selecione "Import Git Repository"
   - Escolha o repositório "transformar-agendamentos"
   - Clique em "Import"

2. **Configuração do Deploy**
   - **Framework Preset**: Selecione "Other"
   - **Root Directory**: Deixe como padrão (.)
   - **Build Command**: Deixe vazio (não necessário para Python)
   - **Output Directory**: Deixe vazio
   - **Install Command**: `pip install -r requirements.txt`

3. **Configuração de Variáveis de Ambiente**
   - Na seção "Environment Variables", adicione:
     - `GOOGLE_CLIENT_ID`: Seu client ID do Google
     - `GOOGLE_CLIENT_SECRET`: Seu client secret do Google
     - `GOOGLE_PROJECT_ID`: ID do projeto no Google Cloud
     - `FLASK_SECRET_KEY`: Uma chave secreta forte
     - `VERCEL`: `true` (para identificar ambiente de produção)

4. **Iniciar Deploy**
   - Clique em "Deploy"
   - Aguarde o processo de build (geralmente 2-5 minutos)
   - Acompanhe os logs para identificar possíveis erros

### Passo 4: Configuração de Banco de Dados

O Vercel não suporta SQLite persistente, sendo necessário migrar para PostgreSQL.

1. **Criar Banco PostgreSQL Gratuito**
   
   **Opção 1: Vercel Postgres (Recomendado)**
   ```bash
   # Instalar Vercel CLI
   npm i -g vercel
   
   # Login no Vercel
   vercel login
   
   # Adicionar banco Postgres
   vercel postgres create
   ```

   **Opção 2: Supabase (Alternativa gratuita)**
   - Acesse [supabase.com](https://supabase.com)
   - Crie uma conta e novo projeto
   - Copie a connection string PostgreSQL
   - Adicione como variável `DATABASE_URL` no Vercel

2. **Atualizar Código para PostgreSQL**
   ```python
   # Adicionar ao requirements.txt
   psycopg2-binary==2.9.9
   
   # Atualizar configuração do banco
   import os
   from urllib.parse import urlparse
   
   if os.environ.get('DATABASE_URL'):
       # Configuração para PostgreSQL
       url = urlparse(os.environ.get('DATABASE_URL'))
       app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
   ```

3. **Migração de Dados**
   - Execute as migrações no primeiro deploy
   - Teste a criação de tabelas
   - Verifique se os agendamentos são salvos corretamente

### Passo 5: Configuração de Domínio

1. **Domínio Vercel Gratuito**
   - Após o deploy, você receberá um domínio como `transformar-agendamentos.vercel.app`
   - Este domínio é gratuito e funcional para testes e uso inicial

2. **Domínio Personalizado (Opcional)**
   - No dashboard do projeto, vá para "Settings" > "Domains"
   - Clique em "Add Domain"
   - Digite seu domínio personalizado (ex: `agendamentos.transformar.com.br`)
   - Siga as instruções para configurar DNS

3. **Atualização das Credenciais Google**
   - Acesse o Google Cloud Console
   - Atualize as "Origens JavaScript autorizadas" com seu novo domínio
   - Adicione o novo URI de redirecionamento

### Passo 6: Configuração de HTTPS e Segurança

O Vercel configura HTTPS automaticamente, mas algumas configurações adicionais são recomendadas.

1. **Verificação de HTTPS**
   - Acesse seu site via HTTPS
   - Verifique se o certificado SSL está válido
   - Teste redirecionamento automático de HTTP para HTTPS

2. **Configuração de Headers de Segurança**
   
   Adicione ao `vercel.json`:
   ```json
   {
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           {
             "key": "X-Content-Type-Options",
             "value": "nosniff"
           },
           {
             "key": "X-Frame-Options",
             "value": "DENY"
           },
           {
             "key": "X-XSS-Protection",
             "value": "1; mode=block"
           }
         ]
       }
     ]
   }
   ```

### Passo 7: Monitoramento e Analytics

1. **Vercel Analytics**
   - Ative o Vercel Analytics no dashboard
   - Monitore performance e uso
   - Acompanhe Core Web Vitals

2. **Logs e Debugging**
   - Acesse logs em tempo real via dashboard
   - Configure alertas para erros críticos
   - Use `vercel logs` via CLI para debugging

### Passo 8: Deploy Contínuo

1. **Configuração de Branches**
   - Branch `main`: Deploy automático para produção
   - Branches de feature: Preview deployments automáticos
   - Configure proteção de branch no GitHub

2. **Workflow de Desenvolvimento**
   ```bash
   # Criar nova feature
   git checkout -b feature/nova-funcionalidade
   
   # Fazer alterações e commit
   git add .
   git commit -m "Adiciona nova funcionalidade"
   
   # Push para preview
   git push origin feature/nova-funcionalidade
   
   # Merge para produção
   git checkout main
   git merge feature/nova-funcionalidade
   git push origin main
   ```

### Solução de Problemas Específicos do Vercel

**Erro: "Function timeout"**
- Serverless functions no Vercel têm timeout de 10s no plano gratuito
- Otimize consultas ao banco de dados
- Considere cache para operações lentas

**Erro: "Module not found"**
- Verifique se todas as dependências estão no `requirements.txt`
- Confirme que a estrutura de pastas está correta
- Use imports absolutos sempre que possível

**Erro: "Database connection failed"**
- Verifique se a `DATABASE_URL` está configurada corretamente
- Teste a conexão localmente primeiro
- Confirme que o banco PostgreSQL está acessível

**Build falha**
- Verifique logs detalhados no dashboard
- Confirme que o `vercel.json` está correto
- Teste o build localmente com `vercel dev`

---


## Deploy no Netlify

O Netlify é uma excelente alternativa para hospedar o sistema Transformar, oferecendo uma interface intuitiva e recursos avançados para aplicações JAMstack.

### Preparação para Netlify

1. **Estrutura de Arquivos**
   
   Crie um arquivo `netlify.toml` na raiz do projeto:
   ```toml
   [build]
     publish = "backend/src/static"
     command = "pip install -r requirements.txt"
   
   [build.environment]
     PYTHON_VERSION = "3.11"
   
   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/:splat"
     status = 200
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Configuração de Functions**
   
   Crie a pasta `netlify/functions` e mova o backend:
   ```bash
   mkdir -p netlify/functions
   cp -r backend/src/* netlify/functions/
   ```

### Deploy no Firebase Hosting

O Firebase oferece integração nativa com outros serviços Google, sendo ideal para o sistema Transformar.

### Preparação para Firebase

1. **Instalação do Firebase CLI**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Inicialização do Projeto**
   ```bash
   firebase init hosting
   firebase init functions
   ```

3. **Configuração do firebase.json**
   ```json
   {
     "hosting": {
       "public": "backend/src/static",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
       "rewrites": [
         {
           "source": "/api/**",
           "function": "api"
         },
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     },
     "functions": {
       "runtime": "python311"
     }
   }
   ```

## Configuração de Domínio Personalizado

### Registro de Domínio

Para um domínio profissional, recomendamos:
- **Registro.br** (para domínios .com.br)
- **Namecheap** (para domínios internacionais)
- **Cloudflare** (registro + CDN integrado)

### Configuração DNS

1. **Para Vercel:**
   ```
   CNAME: www -> cname.vercel-dns.com
   A: @ -> 76.76.19.61
   ```

2. **Para Netlify:**
   ```
   CNAME: www -> seu-site.netlify.app
   A: @ -> 75.2.60.5
   ```

3. **Para Firebase:**
   ```
   A: @ -> 199.36.158.100
   CNAME: www -> seu-projeto.web.app
   ```

## Manutenção e Monitoramento

### Backup Regular

1. **Backup do Banco de Dados**
   ```bash
   # Para PostgreSQL
   pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
   
   # Automatizar com cron
   0 2 * * * pg_dump $DATABASE_URL > /backups/backup_$(date +\%Y\%m\%d).sql
   ```

2. **Backup de Arquivos**
   - Configure backup automático dos arquivos estáticos
   - Use serviços como AWS S3 ou Google Cloud Storage
   - Mantenha pelo menos 30 dias de histórico

### Monitoramento de Performance

1. **Métricas Importantes**
   - Tempo de resposta da API
   - Taxa de erro de agendamentos
   - Uso de bandwidth
   - Disponibilidade do serviço

2. **Ferramentas Recomendadas**
   - **UptimeRobot**: Monitoramento de disponibilidade gratuito
   - **Google Analytics**: Análise de uso do site
   - **Sentry**: Monitoramento de erros em tempo real

### Atualizações de Segurança

1. **Dependências**
   ```bash
   # Verificar vulnerabilidades
   pip audit
   
   # Atualizar dependências
   pip install --upgrade -r requirements.txt
   ```

2. **Certificados SSL**
   - Renovação automática nas plataformas de hospedagem
   - Verificar validade mensalmente
   - Configurar alertas de expiração

## Solução de Problemas

### Problemas Comuns de Deploy

**Erro: "Build failed"**
- Verifique se todas as dependências estão listadas
- Confirme compatibilidade de versões Python
- Teste build localmente primeiro

**Erro: "Database connection timeout"**
- Verifique configuração de variáveis de ambiente
- Teste conectividade do banco
- Considere usar connection pooling

**Erro: "Google Calendar API quota exceeded"**
- Monitore uso da API no Google Cloud Console
- Implemente cache para reduzir chamadas
- Considere upgrade do plano se necessário

### Performance Issues

**Site carregando lentamente**
- Otimize imagens (use WebP quando possível)
- Minimize CSS e JavaScript
- Configure cache headers adequadamente
- Use CDN para assets estáticos

**API respondendo lentamente**
- Adicione índices no banco de dados
- Implemente cache Redis se necessário
- Otimize queries SQL
- Considere paginação para listas grandes

### Problemas de Integração

**Eventos não sincronizam com Google Calendar**
- Verifique se o token não expirou
- Confirme permissões do usuário
- Teste autenticação manualmente
- Verifique logs de erro da API

**Formulário de agendamento não funciona**
- Teste validação JavaScript
- Verifique CORS headers
- Confirme endpoints da API
- Teste em diferentes navegadores

## Referências

[1] Vercel Documentation - https://vercel.com/docs  
[2] Netlify Documentation - https://docs.netlify.com  
[3] Firebase Hosting Guide - https://firebase.google.com/docs/hosting  
[4] Google Calendar API Reference - https://developers.google.com/calendar/api  
[5] Flask Deployment Options - https://flask.palletsprojects.com/en/2.3.x/deploying/  
[6] Progressive Web Apps Guide - https://web.dev/progressive-web-apps/  
[7] OAuth 2.0 Security Best Practices - https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics  
[8] HTTPS Configuration Guide - https://letsencrypt.org/docs/  
[9] Database Migration Strategies - https://martinfowler.com/articles/evodb.html  
[10] Web Performance Optimization - https://web.dev/performance/

---

**Nota Final:** Este guia foi desenvolvido para fornecer instruções completas e atualizadas para hospedar o sistema Transformar. Para suporte adicional ou dúvidas específicas, consulte a documentação oficial de cada plataforma ou entre em contato com o desenvolvedor do sistema.

**Última atualização:** Janeiro 2025  
**Versão do guia:** 1.0  
**Compatibilidade:** Python 3.11+, Flask 3.0+

---

