# Transformar Consultório - Fisioterapia, Estética e Bem-Estar

# Sistema de Agendamentos Transformar

**Fisioterapia, Estética e Bem-Estar**

Um sistema completo de agendamentos online com integração ao Google Calendar, desenvolvido como Progressive Web App (PWA) para funcionar como um aplicativo móvel.

## 🚀 Características Principais

- ✅ **Interface Responsiva**: Design moderno que funciona perfeitamente em desktop e mobile
- ✅ **Progressive Web App**: Pode ser instalado como app no celular
- ✅ **Integração Google Calendar**: Sincronização automática com a agenda do fisioterapeuta
- ✅ **Sistema de Agendamentos**: Formulário completo com validação e confirmação
- ✅ **Horários Dinâmicos**: Geração automática de horários disponíveis
- ✅ **Cache Offline**: Funciona mesmo sem conexão à internet
- ✅ **Notificações**: Sistema de confirmação por email
- ✅ **Segurança**: Autenticação OAuth 2.0 com Google

## 📱 Funcionalidades

### Para Pacientes
- Visualização de serviços oferecidos
- Agendamento online de consultas
- Seleção de data e horário disponível
- Preenchimento de dados pessoais e observações
- Confirmação automática por email
- Acesso via navegador ou app instalado

### Para o Fisioterapeuta
- Sincronização automática com Google Calendar
- Recebimento de notificações de novos agendamentos
- Visualização de dados completos do paciente
- Gerenciamento de horários de atendimento
- Histórico de agendamentos

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Design responsivo com variáveis CSS e animações
- **JavaScript ES6+**: Funcionalidades interativas e PWA
- **Service Worker**: Cache offline e notificações

### Backend
- **Python 3.11**: Linguagem principal do backend
- **Flask 3.0**: Framework web minimalista e eficiente
- **SQLAlchemy**: ORM para gerenciamento do banco de dados
- **SQLite/PostgreSQL**: Banco de dados (SQLite local, PostgreSQL produção)

### Integrações
- **Google Calendar API**: Sincronização de eventos
- **Google OAuth 2.0**: Autenticação segura
- **CORS**: Comunicação frontend-backend
- **PWA Manifest**: Configuração de aplicativo

## 📁 Estrutura do Projeto

```
transformar_consultorio/
├── backend/                    # Aplicação Flask
│   ├── src/
│   │   ├── models/            # Modelos do banco de dados
│   │   │   ├── appointment.py # Modelo de agendamentos
│   │   │   └── user.py        # Modelo de usuários
│   │   ├── routes/            # Rotas da API
│   │   │   ├── appointment.py # Endpoints de agendamento
│   │   │   └── user.py        # Endpoints de usuário
│   │   ├── services/          # Serviços externos
│   │   │   └── google_calendar.py # Integração Google Calendar
│   │   ├── static/            # Arquivos estáticos (frontend)
│   │   │   ├── icons/         # Ícones PWA
│   │   │   ├── index.html     # Página principal
│   │   │   ├── style.css      # Estilos CSS
│   │   │   ├── script.js      # JavaScript principal
│   │   │   ├── manifest.json  # Manifesto PWA
│   │   │   └── sw.js          # Service Worker
│   │   ├── database/          # Banco de dados
│   │   └── main.py            # Arquivo principal Flask
│   ├── venv/                  # Ambiente virtual Python
│   └── requirements.txt       # Dependências Python
├── GUIA_HOSPEDAGEM.md         # Guia completo de hospedagem
└── README.md                  # Este arquivo
```

## 🚀 Instalação e Configuração

### Pré-requisitos
- Python 3.11 ou superior
- Conta Google (para Calendar API)
- Git (para versionamento)

### Passo 1: Clone o Repositório
```bash
git clone https://github.com/seu-usuario/transformar-agendamentos.git
cd transformar-agendamentos
```

### Passo 2: Configuração do Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

pip install -r requirements.txt
```

### Passo 3: Configuração do Google Calendar
1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto
3. Ative a Google Calendar API
4. Crie credenciais OAuth 2.0
5. Baixe o arquivo `credentials.json`
6. Coloque o arquivo na pasta `backend/`

### Passo 4: Executar Localmente
```bash
python src/main.py
```

Acesse: `http://localhost:5000`

## 🌐 Deploy em Produção

Para hospedar o sistema gratuitamente, consulte o **[GUIA_HOSPEDAGEM.md](GUIA_HOSPEDAGEM.md)** que contém instruções detalhadas para:

- **Vercel** (Recomendado)
- **Netlify**
- **Firebase Hosting**
- **Configuração de domínio personalizado**
- **Configuração de SSL/HTTPS**

## 📋 Configuração de Horários

O sistema permite configurar os horários de funcionamento editando o arquivo `script.js`:

```javascript
const CONFIG = {
    workingHours: {
        monday: { start: '08:00', end: '18:00' },
        tuesday: { start: '08:00', end: '18:00' },
        wednesday: { start: '08:00', end: '18:00' },
        thursday: { start: '08:00', end: '18:00' },
        friday: { start: '08:00', end: '18:00' },
        saturday: { start: '08:00', end: '12:00' },
        sunday: null // Fechado
    },
    appointmentDuration: 60,    // Duração em minutos
    appointmentInterval: 15     // Intervalo entre consultas
};
```

## 🔧 Personalização

### Cores e Branding
Edite as variáveis CSS no arquivo `style.css`:

```css
:root {
    --primary-color: #4CAF50;      /* Verde principal */
    --primary-dark: #45a049;       /* Verde escuro */
    --secondary-color: #2196F3;    /* Azul secundário */
    --accent-color: #FF9800;       /* Laranja destaque */
}
```

### Informações de Contato
Atualize as informações no arquivo `index.html`:

```html
<!-- Seção de contato -->
<div class="contact-item">
    <div class="contact-icon">📍</div>
    <div>
        <h4>Endereço</h4>
        <p>Sua Rua, 123<br>Seu Bairro - Sua Cidade/UF</p>
    </div>
</div>
```

### Serviços Oferecidos
Modifique a seção de serviços conforme sua especialidade:

```html
<div class="service-card">
    <div class="service-icon">🦴</div>
    <h3>Seu Serviço</h3>
    <p>Descrição do seu serviço especializado</p>
</div>
```

## 📱 Instalação como App

### Android
1. Acesse o site no Chrome
2. Toque no menu (⋮) > "Adicionar à tela inicial"
3. Confirme a instalação

### iOS
1. Acesse o site no Safari
2. Toque no botão de compartilhar
3. Selecione "Adicionar à Tela de Início"

### Desktop
1. Acesse o site no Chrome/Edge
2. Clique no ícone de instalação na barra de endereços
3. Confirme a instalação

## 🔒 Segurança

- **HTTPS**: Obrigatório em produção
- **OAuth 2.0**: Autenticação segura com Google
- **CORS**: Configurado para domínios autorizados
- **Validação**: Dados validados no frontend e backend
- **Headers de Segurança**: Configurados no servidor

## 📊 Monitoramento

### Métricas Importantes
- Taxa de conversão de agendamentos
- Tempo de carregamento da página
- Erros de integração com Google Calendar
- Uso de bandwidth

### Ferramentas Recomendadas
- **Google Analytics**: Análise de tráfego
- **UptimeRobot**: Monitoramento de disponibilidade
- **Sentry**: Monitoramento de erros

## 🆘 Suporte

### Problemas Comuns

**Site não carrega**
- Verifique se o servidor está rodando
- Confirme configuração de DNS
- Teste em modo incógnito

**Agendamentos não sincronizam**
- Verifique credenciais do Google Calendar
- Confirme permissões da API
- Teste autenticação OAuth

**App não instala**
- Confirme que o site usa HTTPS
- Verifique se o manifest.json está correto
- Teste em navegador compatível

### Contato para Suporte
- **Email**: suporte@transformar.com.br
- **Documentação**: [GUIA_HOSPEDAGEM.md](GUIA_HOSPEDAGEM.md)
- **Issues**: GitHub Issues (se aplicável)

## 📄 Licença

Este projeto foi desenvolvido especificamente para o consultório Transformar. Todos os direitos reservados.

## 🙏 Agradecimentos

Desenvolvido com ❤️ pela equipe Manus AI, utilizando as melhores práticas de desenvolvimento web e tecnologias modernas para criar uma solução completa e profissional para agendamentos online.

---

**Última atualização**: Janeiro 2025  
**Versão**: 1.0.0  
**Compatibilidade**: Todos os navegadores modernos

