// ===== CONFIGURAÇÃO INICIAL =====
document.addEventListener('DOMContentLoaded', function () {
    initializeTheme();
    initializeNavigation();
    initializeSmoothScroll();
    initializeFormHandlers();
    initializeAnimations();
    initializeEventHandlers();
});

// ===== GERENCIAMENTO DE TEMA =====
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');

    const savedTheme = localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(themeIcon, savedTheme);

    // Alternar tema ao clicar
    themeToggle.addEventListener('click', function () {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(themeIcon, newTheme);
    });
}

function updateThemeIcon(icon, theme) {
    if (theme === 'dark') {
        icon.className = 'fas fa-moon';
    } else {
        icon.className = 'fas fa-sun';
    }
}

// ===== NAVEGAÇÃO RESPONSIVA =====
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');

            // Animação do ícone do menu
            const icon = navToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });

        // Fechar menu ao clicar em um link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                navMenu.classList.remove('active');
                navToggle.querySelector('i').className = 'fas fa-bars';
            });
        });
    }

    // Efeito de scroll do header
    window.addEventListener('scroll', function () {
        const header = document.getElementById('header');
        if (window.scrollY > 100) {
            header.style.background = 'var(--bg-primary)';
            header.style.boxShadow = 'var(--shadow-lg)';
        } else {
            header.style.background = 'var(--bg-primary)';
            header.style.boxShadow = 'var(--shadow)';
        }
    });
}

// ===== SCROLL SUAVE =====
function initializeSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== MANIPULAÇÃO DE FORMULÁRIOS =====
function initializeFormHandlers() {
    const ajudaForm = document.querySelector('.ajuda-form');

    if (ajudaForm) {
        ajudaForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Validação básica
            const institutionName = document.getElementById('institution-name').value;
            const contact = document.getElementById('contact').value;
            const helpType = document.getElementById('help-type').value;
            const message = document.getElementById('message').value;

            if (!institutionName || !contact || !helpType || !message) {
                showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
                return;
            }

            // Simulação de envio
            showNotification('Solicitação enviada com sucesso! Entraremos em contato em breve.', 'success');
            ajudaForm.reset();

            // Atualizar progresso
            updateProgressSteps(2);
        });
    }

    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        if (button.textContent.includes('Solicitar Apresentação') ||
            button.textContent.includes('Quero Participar') ||
            button.textContent.includes('Apoiar Campanha') ||
            button.textContent.includes('Seja Parceiro')) {

            button.addEventListener('click', function () {
                const action = this.textContent.trim();
                showNotification(`Ação "${action}" registrada com sucesso!`, 'success');
            });
        }
    });
}

function updateProgressSteps(step) {
    const steps = document.querySelectorAll('.progress-step');

    steps.forEach((stepElement, index) => {
        if (index < step) {
            stepElement.classList.add('active');
        } else {
            stepElement.classList.remove('active');
        }
    });
}

// ===== ANIMAÇÕES E EFEITOS VISUAIS =====
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    const animatedElements = document.querySelectorAll('.card, .section-header, .hero-content');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    initializeCounters();
}

function initializeCounters() {
    const counters = document.querySelectorAll('.metrica-value');

    const counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.textContent);
                animateCounter(counter, target);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const duration = 2000;
    const stepTime = duration / 100;

    const timer = setInterval(function () {
        current += increment;
        if (current >= target) {
            element.textContent = target + (element.textContent.includes('+') ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '');
        }
    }, stepTime);
}

// ===== MANIPULAÇÃO DE EVENTOS =====
function initializeEventHandlers() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');
            filterVolunteers(filter);
        });
    });

    const cards = document.querySelectorAll('.card-hover');

    cards.forEach(card => {
        card.addEventListener('click', function (e) {
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                return;
            }
        });
    });

    // Compartilhamento de campanhas
    const shareButtons = document.querySelectorAll('.campanha-share');

    shareButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.stopPropagation();

            const campanhaTitle = this.closest('.card').querySelector('.campanha-title').textContent;
            shareContent(campanhaTitle);
        });
    });
}

function filterVolunteers(filter) {
    console.log(`Filtrando voluntários por: ${filter}`);

    const volunteers = document.querySelectorAll('.voluntarios-grid .card');
    volunteers.forEach(volunteer => {
        volunteer.style.display = 'block';
    });
}

function shareContent(title) {
    if (navigator.share) {
        navigator.share({
            title: 'Música Social - Campanha',
            text: `Confira a campanha: ${title}`,
            url: window.location.href
        })
            .then(() => console.log('Conteúdo compartilhado com sucesso'))
            .catch(error => console.log('Erro ao compartilhar:', error));
    } else {
        const tempInput = document.createElement('input');
        tempInput.value = window.location.href;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);

        showNotification('Link copiado para a área de transferência!', 'success');
    }
}

// ===== NOTIFICAÇÕES =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Adicionar estilos
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--bg-primary);
        color: var(--text-primary);
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-lg);
        border-left: 4px solid ${getNotificationColor(type)};
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        max-width: 400px;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Animação de entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Botão de fechar
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', function () {
        closeNotification(notification);
    });

    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            closeNotification(notification);
        }
    }, 5000);
}

function closeNotification(notification) {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        success: '#4ECDC4',
        error: '#FF6B6B',
        warning: '#FFD93D',
        info: '#8B5FBF'
    };
    return colors[type] || '#8B5FBF';
}

// ===== CARREGAMENTO DE DADOS DINÂMICOS =====
function loadDynamicData() {
    fetchEvents();
    fetchCampaigns();
}

function fetchEvents() {
    setTimeout(() => {
        console.log('Eventos carregados');
    }, 1000);
}

function fetchCampaigns() {
    setTimeout(() => {
        console.log('Campanhas carregadas');
    }, 1000);
}

// ===== UTILITÁRIOS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

loadDynamicData();