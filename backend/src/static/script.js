// Configurações globais
const CONFIG = {
    // URL base da API
    apiBaseUrl: '/api',
    // Horários de funcionamento
    workingHours: {
        monday: { start: '08:00', end: '18:00' },
        tuesday: { start: '08:00', end: '18:00' },
        wednesday: { start: '08:00', end: '18:00' },
        thursday: { start: '08:00', end: '18:00' },
        friday: { start: '08:00', end: '18:00' },
        saturday: { start: '08:00', end: '12:00' },
        sunday: null // Fechado
    },
    // Duração das consultas em minutos
    appointmentDuration: 60,
    // Intervalo entre consultas em minutos
    appointmentInterval: 15
};

// Estado da aplicação
let appState = {
    isLoading: true,
    currentDate: new Date(),
    availableSlots: [],
    selectedSlot: null
};

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    console.log('Inicializando aplicação Transformar...');
    
    // Simular carregamento
    setTimeout(() => {
        hideLoadingScreen();
        setupEventListeners();
        setupDateInput();
        setupMobileMenu();
        loadAvailableSlots();
    }, 2000);
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
    appState.isLoading = false;
}

function setupEventListeners() {
    // Formulário de agendamento
    const appointmentForm = document.getElementById('appointment-form');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', handleAppointmentSubmit);
    }

    // Campo de data
    const dateInput = document.getElementById('data');
    if (dateInput) {
        dateInput.addEventListener('change', handleDateChange);
    }

    // Navegação suave
    setupSmoothScrolling();

    // Modais
    setupModals();

    // Service Worker para PWA
    if ('serviceWorker' in navigator) {
        registerServiceWorker();
    }
}

function setupMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Fechar menu ao clicar em um link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

function setupDateInput() {
    const dateInput = document.getElementById('data');
    if (dateInput) {
        // Definir data mínima como hoje
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];
        dateInput.min = todayString;

        // Definir data máxima como 3 meses à frente
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        const maxDateString = maxDate.toISOString().split('T')[0];
        dateInput.max = maxDateString;
    }
}

function setupSmoothScrolling() {
    // Navegação suave para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

async function handleDateChange(event) {
    const selectedDate = event.target.value;
    if (selectedDate) {
        await loadAvailableSlotsForDate(selectedDate);
    }
}

async function loadAvailableSlots() {
    // Carregar horários para hoje por padrão
    const today = new Date().toISOString().split('T')[0];
    await loadAvailableSlotsForDate(today);
}

async function loadAvailableSlotsForDate(dateString) {
    try {
        const response = await fetch(`${CONFIG.apiBaseUrl}/appointments/available-slots?date=${dateString}`);
        const data = await response.json();
        
        const horarioSelect = document.getElementById('horario');
        if (!horarioSelect) return;

        // Limpar opções existentes
        horarioSelect.innerHTML = '<option value="">Selecione um horário</option>';

        if (data.success && data.slots.length > 0) {
            data.slots.forEach(slot => {
                const option = document.createElement('option');
                option.value = slot;
                option.textContent = slot;
                horarioSelect.appendChild(option);
            });
        } else {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'Nenhum horário disponível';
            option.disabled = true;
            horarioSelect.appendChild(option);
        }
    } catch (error) {
        console.error('Erro ao carregar horários:', error);
        // Fallback para geração local
        generateTimeSlotsForDate(dateString);
    }
}

function generateTimeSlotsForDate(dateString) {
    const date = new Date(dateString);
    const dayOfWeek = getDayOfWeek(date);
    const workingHours = CONFIG.workingHours[dayOfWeek];
    
    const horarioSelect = document.getElementById('horario');
    if (!horarioSelect) return;

    // Limpar opções existentes
    horarioSelect.innerHTML = '<option value="">Selecione um horário</option>';

    if (!workingHours) {
        // Dia não útil
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'Não atendemos neste dia';
        option.disabled = true;
        horarioSelect.appendChild(option);
        return;
    }

    // Gerar horários disponíveis
    const slots = generateAvailableSlots(workingHours.start, workingHours.end);
    
    slots.forEach(slot => {
        const option = document.createElement('option');
        option.value = slot;
        option.textContent = slot;
        horarioSelect.appendChild(option);
    });
}

function getDayOfWeek(date) {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
}

function generateAvailableSlots(startTime, endTime) {
    const slots = [];
    const start = timeToMinutes(startTime);
    const end = timeToMinutes(endTime);
    
    for (let time = start; time < end; time += CONFIG.appointmentInterval) {
        // Verificar se há tempo suficiente para uma consulta completa
        if (time + CONFIG.appointmentDuration <= end) {
            slots.push(minutesToTime(time));
        }
    }
    
    return slots;
}

function timeToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
}

function minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

async function handleAppointmentSubmit(event) {
    event.preventDefault();
    
    const submitButton = event.target.querySelector('.submit-button');
    const buttonText = submitButton.querySelector('.button-text');
    const buttonLoading = submitButton.querySelector('.button-loading');
    
    // Mostrar estado de carregamento
    submitButton.disabled = true;
    buttonText.style.display = 'none';
    buttonLoading.style.display = 'inline';
    
    try {
        // Coletar dados do formulário
        const formData = new FormData(event.target);
        const appointmentData = {
            nome: formData.get('nome'),
            telefone: formData.get('telefone'),
            email: formData.get('email'),
            servico: formData.get('servico'),
            data: formData.get('data'),
            horario: formData.get('horario'),
            observacoes: formData.get('observacoes') || ''
        };

        // Validar dados
        if (!validateAppointmentData(appointmentData)) {
            throw new Error('Por favor, preencha todos os campos obrigatórios.');
        }

        // Enviar para o backend
        const result = await submitAppointment(appointmentData);
        
        if (result.success) {
            showSuccessModal();
            event.target.reset();
            // Recarregar horários disponíveis
            const dateInput = document.getElementById('data');
            if (dateInput.value) {
                await loadAvailableSlotsForDate(dateInput.value);
            } else {
                await loadAvailableSlots();
            }
        } else {
            throw new Error(result.message || 'Erro ao agendar consulta');
        }
        
    } catch (error) {
        console.error('Erro no agendamento:', error);
        showErrorModal(error.message);
    } finally {
        // Restaurar estado do botão
        submitButton.disabled = false;
        buttonText.style.display = 'inline';
        buttonLoading.style.display = 'none';
    }
}

function validateAppointmentData(data) {
    const required = ['nome', 'telefone', 'email', 'servico', 'data', 'horario'];
    return required.every(field => data[field] && data[field].trim() !== '');
}

async function submitAppointment(appointmentData) {
    try {
        const response = await fetch(`${CONFIG.apiBaseUrl}/appointments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(appointmentData)
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro na requisição:', error);
        return {
            success: false,
            message: 'Erro de conexão. Verifique sua internet e tente novamente.'
        };
    }
}

function setupModals() {
    // Configurar fechamento de modais
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close');
    
    closeButtons.forEach(button => {
        button.addEventListener('click', closeModal);
    });
    
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    });
}

function showSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function showErrorModal(message) {
    const modal = document.getElementById('error-modal');
    const messageElement = document.getElementById('error-message');
    
    if (modal && messageElement) {
        messageElement.textContent = message;
        modal.style.display = 'block';
    }
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

// Service Worker para PWA
async function registerServiceWorker() {
    try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registrado com sucesso:', registration);
    } catch (error) {
        console.log('Falha ao registrar Service Worker:', error);
    }
}

// Aplicar máscaras aos campos
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('telefone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 11) {
                if (value.length <= 2) {
                    value = value.replace(/(\d{0,2})/, '($1');
                } else if (value.length <= 7) {
                    value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
                } else {
                    value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
                }
            }
            
            e.target.value = value;
        });
    }
});

// Exportar funções para uso global
window.scrollToSection = scrollToSection;
window.closeModal = closeModal;

console.log('Script Transformar carregado com sucesso!');

