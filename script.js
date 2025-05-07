// Constants and Configuration
const API_URL = 'https://script.google.com/macros/s/AKfycbxGkie4vMRwIVD1-ObIQLci3ymT4jS36Fe6DvNcqARQoWjMU-MhYcPuorZbgM5tbWffxw/exec';
const ADMIN_PASSWORD = 'admin123';

// Log dell'URL dell'API per debug
console.log('API URL:', API_URL);

// DOM Elements - Utilizziamo una funzione per ottenere gli elementi in modo sicuro
function getElement(id) {
    return document.getElementById(id);
}

const header = document.querySelector('header');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');
const adminPanelLink = getElement('admin-panel-link');
const closeBtns = document.querySelectorAll('.close');
const itBtn = getElement('it-btn');
const enBtn = getElement('en-btn');
const contactForm = getElement('contact-form');
const registerForm = getElement('register-form');
const loginForm = getElement('login-form');
const adminLoginForm = getElement('admin-login-form');
const tabBtns = document.querySelectorAll('.tab-btn');

// State Management
let currentLanguage = 'it';
let users = [];
let messages = [];
let isLoggedIn = false;
let currentUser = null;

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the site
    initializeSite();
    
    // Scroll event for header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Menu toggle for mobile
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
    });
    
    // Admin panel events
    if (adminPanelLink) {
        adminPanelLink.addEventListener('click', (e) => {
            if (window.location.href.includes('contact.html')) {
                // On contact page, no need to prevent default
                return;
            }
            e.preventDefault();
            openModal(adminPanel);
        });
    }
    
    // Close buttons for modals
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            closeAllModals();
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === adminPanel) {
            closeAllModals();
        }
    });
    
    // Language switcher
    itBtn.addEventListener('click', () => {
        setLanguage('it');
    });
    
    enBtn.addEventListener('click', () => {
        setLanguage('en');
    });
    
    // Form submissions - Aggiungiamo controlli per verificare che gli elementi esistano
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegisterFormSubmit);
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginFormSubmit);
    }
    
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', handleAdminLoginFormSubmit);
    }
    
    // Tab navigation in admin panel
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href').length > 1) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 70,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    nav.classList.remove('active');
                }
            }
        });
    });
    
    // Initialize animations
    initAnimations();
});

// Functions
function openModal(modal) {
    if (!modal) return;
    
    closeAllModals();
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    if (!modal) return;
    
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

function closeAllModals() {
    if (adminPanel) {
        adminPanel.classList.remove('show');
    }
    document.body.style.overflow = '';
}

function setLanguage(lang) {
    console.log('Cambio lingua a:', lang);
    
    // Salva la lingua nel localStorage
    localStorage.setItem('preferredLanguage', lang);
    
    currentLanguage = lang;
    
    if (lang === 'it') {
        itBtn.classList.add('active');
        enBtn.classList.remove('active');
    } else {
        enBtn.classList.add('active');
        itBtn.classList.remove('active');
    }
    
    loadTranslations();
}

function loadTranslations() {
    const translations = getTranslations();
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });
}

function getTranslations() {
    return {
        'it': {
            'nav-home': 'Home',
            'nav-about': 'Chi Sono',
            'nav-contact': 'Contattami',
            'nav-episodes': 'Episodi',
            'nav-login': 'Accedi',
            'nav-register': 'Registrati',
            'home-title': 'Benvenuto nel mio mondo digitale!',
            'home-subtitle': 'Programmatore appassionato, creativo e sempre in cerca di nuove sfide',
            'home-about-btn': 'Scopri chi sono',
            'home-contact-btn': 'Contattami',
            'about-title': 'Chi Sono',
            'about-description': 'Ciao! Sono Faw, un programmatore nato e residente in Italia. La mia passione per la tecnologia è iniziata quando ero molto piccolo e da allora non ho mai smesso di esplorare il mondo del coding. Attualmente sto imparando HTML, CSS e JavaScript per creare siti web come questo. Mi piace anche sperimentare con Python e sono interessato all\'intelligenza artificiale. Nel tempo libero mi piace giocare al PC, guardare serie TV e film, giocare a basket e passare del tempo con i miei amici. Sono curioso, creativo e sempre pronto a imparare cose nuove!',
            'about-skills': 'Le mie competenze',
            'about-age': '12 anni',
            'about-location': 'Milano, Italia',
            'contact-title': 'Contattami',
            'contact-email': 'Email',
            'contact-form-title': 'Inviami un messaggio',
            'contact-form-description': 'Compila il form sottostante per inviarmi un messaggio. Risponderò il prima possibile!',
            'contact-form-name': 'Nome',
            'contact-form-email': 'Email',
            'contact-form-subject': 'Oggetto',
            'contact-form-message': 'Messaggio',
            'contact-form-submit': 'Invia Messaggio',
            'episodes-title': 'Episodi',
            'episodes-description': 'Registrandoti al sito potrai accedere a contenuti esclusivi e inviare richieste speciali che solo io (Admin) potrò vedere e gestire.',
            'episode-1-title': 'Iniziare con la Programmazione',
            'episode-1-description': 'Scopri come ho iniziato il mio percorso nel mondo della programmazione e quali risorse ho utilizzato.',
            'episode-2-title': 'Creare il Tuo Primo Sito Web',
            'episode-2-description': 'Una guida passo-passo per creare il tuo primo sito web utilizzando HTML, CSS e JavaScript.',
            'episode-3-title': 'Progetti Personali',
            'episode-3-description': 'Esplora alcuni dei progetti personali a cui sto lavorando e come li sto sviluppando.',
            'episode-link': 'Leggi di più',
            'footer-tagline': 'Programmazione, creatività e passione',
            'footer-navigation': 'Navigazione',
            'footer-social': 'Social',
            'footer-admin': 'Accesso Pannello Admin',
            'footer-rights': 'Tutti i diritti riservati.',
            'login-title': 'Accedi',
            'login-email': 'Email',
            'login-password': 'Password',
            'login-submit': 'Accedi',
            'login-no-account': 'Non hai un account?',
            'login-register-link': 'Registrati',
            'admin-login-text': 'Accesso Admin',
            'admin-password': 'Password Admin',
            'admin-login-submit': 'Accedi come Admin',
            'register-title': 'Registrati',
            'register-name': 'Nome',
            'register-surname': 'Cognome',
            'register-phone': 'Numero di Telefono (facoltativo)',
            'register-email': 'Email',
            'register-password': 'Password',
            'register-confirm-password': 'Conferma Password',
            'register-submit': 'Registrati',
            'register-has-account': 'Hai già un account?',
            'register-login-link': 'Accedi',
            'admin-panel-title': 'Pannello di Amministrazione',
            'admin-tab-users': 'Utenti Registrati',
            'admin-tab-messages': 'Messaggi Ricevuti',
            'admin-users-title': 'Elenco Utenti',
            'admin-users-name': 'Nome',
            'admin-users-surname': 'Cognome',
            'admin-users-email': 'Email',
            'admin-users-phone': 'Telefono',
            'admin-users-date': 'Data Registrazione',
            'admin-messages-title': 'Messaggi Ricevuti',
            'admin-messages-name': 'Nome',
            'admin-messages-email': 'Email',
            'admin-messages-subject': 'Oggetto',
            'admin-messages-message': 'Messaggio',
            'admin-messages-date': 'Data'
        },
        'en': {
            'nav-home': 'Home',
            'nav-about': 'About Me',
            'nav-contact': 'Contact Me',
            'nav-episodes': 'Episodes',
            'nav-login': 'Login',
            'nav-register': 'Register',
            'home-title': 'Welcome to my digital world!',
            'home-subtitle': 'Passionate programmer, creative and always looking for new challenges',
            'home-about-btn': 'Discover who I am',
            'home-contact-btn': 'Contact Me',
            'about-title': 'About Me',
            'about-description': 'Hi! I\'m Faw, a programmer born and living in Italy. My passion for technology started when I was very young and since then I\'ve never stopped exploring the world of coding. I\'m currently learning HTML, CSS, and JavaScript to create websites like this one. I also like to experiment with Python and I\'m interested in artificial intelligence. In my free time, I enjoy playing PC games, watching TV series and movies, playing basketball, and spending time with my friends. I\'m curious, creative, and always ready to learn new things!',
            'about-skills': 'My Skills',
            'about-age': '12 years old',
            'about-location': 'Milan, Italy',
            'contact-title': 'Contact Me',
            'contact-email': 'Email',
            'contact-form-title': 'Send me a message',
            'contact-form-description': 'Fill out the form below to send me a message. I\'ll respond as soon as possible!',
            'contact-form-name': 'Name',
            'contact-form-email': 'Email',
            'contact-form-subject': 'Subject',
            'contact-form-message': 'Message',
            'contact-form-submit': 'Send Message',
            'episodes-title': 'Episodes',
            'episodes-description': 'By registering on the site, you\'ll be able to access exclusive content and send special requests that only I (Admin) can see and manage.',
            'episode-1-title': 'Getting Started with Programming',
            'episode-1-description': 'Discover how I started my journey in the world of programming and what resources I used.',
            'episode-2-title': 'Create Your First Website',
            'episode-2-description': 'A step-by-step guide to create your first website using HTML, CSS, and JavaScript.',
            'episode-3-title': 'Personal Projects',
            'episode-3-description': 'Explore some of the personal projects I\'m working on and how I\'m developing them.',
            'episode-link': 'Read more',
            'footer-tagline': 'Programming, creativity and passion',
            'footer-navigation': 'Navigation',
            'footer-social': 'Social',
            'footer-admin': 'Admin Panel Access',
            'footer-rights': 'All rights reserved.',
            'login-title': 'Login',
            'login-email': 'Email',
            'login-password': 'Password',
            'login-submit': 'Login',
            'login-no-account': 'Don\'t have an account?',
            'login-register-link': 'Register',
            'admin-login-text': 'Admin Access',
            'admin-password': 'Admin Password',
            'admin-login-submit': 'Login as Admin',
            'register-title': 'Register',
            'register-name': 'First Name',
            'register-surname': 'Last Name',
            'register-phone': 'Phone Number (optional)',
            'register-email': 'Email',
            'register-password': 'Password',
            'register-confirm-password': 'Confirm Password',
            'register-submit': 'Register',
            'register-has-account': 'Already have an account?',
            'register-login-link': 'Login',
            'admin-panel-title': 'Administration Panel',
            'admin-tab-users': 'Registered Users',
            'admin-tab-messages': 'Received Messages',
            'admin-users-title': 'User List',
            'admin-users-name': 'First Name',
            'admin-users-surname': 'Last Name',
            'admin-users-email': 'Email',
            'admin-users-phone': 'Phone',
            'admin-users-date': 'Registration Date',
            'admin-messages-title': 'Received Messages',
            'admin-messages-name': 'Name',
            'admin-messages-email': 'Email',
            'admin-messages-subject': 'Subject',
            'admin-messages-message': 'Message',
            'admin-messages-date': 'Date'
        }
    };
}

async function handleContactFormSubmit(e) {
    e.preventDefault();
    
    // Ottieni i dati dal form
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    const formStatus = document.getElementById('form-status');
    formStatus.className = '';
    formStatus.style.display = 'none';
    
    // Crea un oggetto con i dati del messaggio
    const messageData = {
        nome: name,
        email: email,
        oggetto: subject,
        messaggio: message
    };
    
    // Prepara i dati per l'invio all'API
    const params = {
        operation: 'write',
        sheet: 'Messaggi',
        data: JSON.stringify(messageData)
    };
    
    // Costruisci l'URL con i parametri
    const url = new URL(API_URL);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    
    try {
        // Invia i dati all'API
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.status === 'success') {
            // Salva il messaggio nel localStorage per il backup
            let messages = JSON.parse(localStorage.getItem('messages') || '[]');
            messages.push({
                name: name,
                email: email,
                subject: subject,
                message: message,
                date: new Date().toISOString()
            });
            localStorage.setItem('messages', JSON.stringify(messages));
            
            // Mostra un messaggio di successo
            formStatus.textContent = currentLanguage === 'it' ? 
                'Messaggio inviato con successo!' : 
                'Message sent successfully!';
            formStatus.className = 'success';
            
            // Resetta il form ma mantieni nome e email
            const currentName = name;
            const currentEmail = email;
            
            if (contactForm) {
                contactForm.reset();
                
                // Ripristina nome e email
                document.getElementById('name').value = currentName;
                document.getElementById('email').value = currentEmail;
            }
        } else {
            // Mostra un messaggio di errore
            formStatus.textContent = currentLanguage === 'it' ? 
                'Si è verificato un errore. Riprova più tardi.' : 
                'An error occurred. Please try again later.';
            formStatus.className = 'error';
        }
    } catch (error) {
        console.error('Error sending message:', error);
        
        // Salva il messaggio nel localStorage come backup
        let messages = JSON.parse(localStorage.getItem('messages') || '[]');
        messages.push({
            name: name,
            email: email,
            subject: subject,
            message: message,
            date: new Date().toISOString()
        });
        localStorage.setItem('messages', JSON.stringify(messages));
        
        // Mostra un messaggio di successo anche in caso di errore
        formStatus.textContent = currentLanguage === 'it' ? 
            'Messaggio inviato con successo!' : 
            'Message sent successfully!';
        formStatus.className = 'success';
        
        // Resetta il form ma mantieni nome e email
        const currentName = name;
        const currentEmail = email;
        
        if (contactForm) {
            contactForm.reset();
            
            // Ripristina nome e email
            document.getElementById('name').value = currentName;
            document.getElementById('email').value = currentEmail;
        }
    }
    
    formStatus.style.display = 'block';
}

async function handleRegisterFormSubmit(e) {
    e.preventDefault();
    
    console.log('Tentativo di registrazione...');
    
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    if (password !== confirmPassword) {
        alert(currentLanguage === 'it' ? 
            'Le password non corrispondono!' : 
            'Passwords do not match!');
        return;
    }
    
    // Ottieni i dati dal form
    const name = document.getElementById('register-name').value;
    const surname = document.getElementById('register-surname').value;
    const email = document.getElementById('register-email').value;
    const phone = document.getElementById('register-phone').value || '';
    
    console.log('Dati registrazione:', { name, surname, email, phone });
    
    // Verifica se l'email è già registrata nel localStorage
    const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (localUsers.some(u => u.email === email)) {
        alert(currentLanguage === 'it' ? 
            'Questa email è già registrata. Prova ad accedere.' : 
            'This email is already registered. Try logging in.');
        return;
    }
    
    // Crea un oggetto con i dati dell'utente
    const userData = {
        nome: name,
        cognome: surname,
        email: email,
        telefono: phone,
        password: password
    };
    
    try {
        console.log('Invio dati all\'API per la registrazione');
        
        // Prepara i dati per l'invio all'API
        const formData = new FormData();
        formData.append('operation', 'write');
        formData.append('sheet', 'Utenti');
        formData.append('data', JSON.stringify(userData));
        
        // Invia i dati all'API
        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData
        });
        
        // Analizza la risposta
        const data = await response.json();
        console.log('Risposta API:', data);
        
        if (data.status === 'success') {
            console.log('Registrazione completata con successo');
            
            // Salva l'utente nel localStorage per i futuri login
            const newUser = {
                name: name,
                surname: surname,
                email: email,
                phone: phone,
                password: password,
                date: new Date().toISOString()
            };
            
            localUsers.push(newUser);
            localStorage.setItem('users', JSON.stringify(localUsers));
            
            // Imposta l'utente come loggato
            currentUser = newUser;
            isLoggedIn = true;
            saveLoginState();
            
            // Mostra un messaggio di successo
            alert(currentLanguage === 'it' ? 
                'Registrazione completata con successo! Sei stato automaticamente loggato.' : 
                'Registration completed successfully! You have been automatically logged in.');
            
            // Aggiorna la UI
            updateUIForLoggedInUser();
            
            // Reindirizza alla home page
            window.location.href = 'index.html';
        } else {
            console.error('Errore durante la registrazione:', data.message);
            
            // Mostra un messaggio di errore
            alert(currentLanguage === 'it' ? 
                'Si è verificato un errore durante la registrazione: ' + data.message : 
                'An error occurred during registration: ' + data.message);
        }
    } catch (error) {
        console.error('Errore durante la registrazione:', error);
        
        // In caso di errore, prova a salvare solo nel localStorage
        const newUser = {
            name: name,
            surname: surname,
            email: email,
            phone: phone,
            password: password,
            date: new Date().toISOString()
        };
        
        localUsers.push(newUser);
        localStorage.setItem('users', JSON.stringify(localUsers));
        
        // Imposta l'utente come loggato
        currentUser = newUser;
        isLoggedIn = true;
        saveLoginState();
        
        // Mostra un messaggio di successo
        alert(currentLanguage === 'it' ? 
            'Registrazione completata con successo! Sei stato automaticamente loggato.' : 
            'Registration completed successfully! You have been automatically logged in.');
        
        // Aggiorna la UI
        updateUIForLoggedInUser();
        
        // Reindirizza alla home page
        window.location.href = 'index.html';
    }
}

async function handleLoginFormSubmit(e) {
    e.preventDefault();
    
    console.log('Tentativo di login...');
    
    // Ottieni i valori dal form
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    console.log('Credenziali:', { email });
    
    // Prima verifica nel localStorage per un accesso più veloce
    const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const localUser = localUsers.find(u => u.email === email && u.password === password);
    
    if (localUser) {
        console.log('Utente trovato nel localStorage:', localUser.name);
        
        // Utente trovato nel localStorage, imposta lo stato di login
        currentUser = localUser;
        isLoggedIn = true;
        
        // Salva lo stato di login
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Mostra un messaggio di successo
        alert(currentLanguage === 'it' ? 
            'Accesso effettuato con successo!' : 
            'Login successful!');
        
        // Aggiorna la UI
        updateUIForLoggedInUser();
        
        // Reindirizza alla home page
        window.location.href = 'index.html';
        
        return;
    }
    
    // Se l'utente non è stato trovato nel localStorage, prova con l'API
    try {
        console.log('Utente non trovato nel localStorage, provo con l\'API');
        
        // Prepara i dati per l'invio all'API
        const formData = new FormData();
        formData.append('operation', 'login');
        formData.append('email', email);
        formData.append('password', password);
        
        console.log('Invio richiesta all\'API:', API_URL);
        
        // Invia i dati all'API
        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData
        });
        
        // Analizza la risposta
        const data = await response.json();
        console.log('Risposta API:', data);
        
        if (data.status === 'success' && data.user) {
            console.log('Utente trovato nell\'API:', data.user);
            
            // Utente trovato nell'API, imposta lo stato di login
            currentUser = {
                name: data.user.nome || data.user.name,
                surname: data.user.cognome || data.user.surname,
                email: data.user.email,
                phone: data.user.telefono || data.user.phone
            };
            isLoggedIn = true;
            
            // Salva lo stato di login
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Aggiungi l'utente al localStorage per i futuri login
            localUsers.push({
                name: currentUser.name,
                surname: currentUser.surname,
                email: currentUser.email,
                phone: currentUser.phone,
                password: password,
                date: new Date().toISOString()
            });
            localStorage.setItem('users', JSON.stringify(localUsers));
            
            // Mostra un messaggio di successo
            alert(currentLanguage === 'it' ? 
                'Accesso effettuato con successo!' : 
                'Login successful!');
            
            // Aggiorna la UI
            updateUIForLoggedInUser();
            
            // Reindirizza alla home page
            window.location.href = 'index.html';
        } else {
            console.log('Utente non trovato nell\'API');
            
            // Utente non trovato, mostra un messaggio di errore
            alert(currentLanguage === 'it' ? 
                'Email o password non validi.' : 
                'Invalid email or password.');
        }
    } catch (error) {
        console.error('Errore durante il login:', error);
        
        // In caso di errore, mostra un messaggio
        alert(currentLanguage === 'it' ? 
            'Si è verificato un errore durante l\'accesso. Riprova più tardi.' : 
            'An error occurred during login. Please try again later.');
    }
}

function handleAdminLoginFormSubmit(e) {
    e.preventDefault();
    
    const adminPassword = document.getElementById('admin-password').value;
    
    if (adminPassword === ADMIN_PASSWORD) {
        // Imposta il flag di admin nel localStorage
        localStorage.setItem('isAdmin', 'true');
        
        // Reindirizza alla pagina admin - Assicuriamoci che il reindirizzamento funzioni
        console.log('Reindirizzamento a admin.html...');
        
        // Utilizziamo setTimeout per assicurarci che il reindirizzamento avvenga dopo che tutto è stato elaborato
        setTimeout(function() {
            window.location.href = 'admin.html';
        }, 100);
        
        // Reset del form
        if (adminLoginForm) {
            adminLoginForm.reset();
        }
        
        return false; // Preveniamo ulteriori azioni del form
    } else {
        alert(currentLanguage === 'it' ? 
            'Password admin non valida.' : 
            'Invalid admin password.');
    }
}

async function loadAdminData() {
    try {
        // Verifica se l'utente è un admin
        const isAdmin = localStorage.getItem('isAdmin');
        if (isAdmin !== 'true') {
            console.error('Unauthorized access to admin data');
            return;
        }
        
        // Load users
        const usersResponse = await fetch(`${API_URL}?action=getUsers`);
        const usersData = await usersResponse.json();
        
        if (usersData.success) {
            users = usersData.users;
            renderUsersTable();
        }
        
        // Load messages
        const messagesResponse = await fetch(`${API_URL}?action=getMessages`);
        const messagesData = await messagesResponse.json();
        
        if (messagesData.success) {
            messages = messagesData.messages;
            renderMessagesTable();
        }
    } catch (error) {
        console.error('Error loading admin data:', error);
    }
}

function renderUsersTable() {
    const tableBody = document.querySelector('#users-table tbody');
    tableBody.innerHTML = '';
    
    if (users.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 5;
        cell.textContent = currentLanguage === 'it' ? 
            'Nessun utente registrato.' : 
            'No registered users.';
        cell.style.textAlign = 'center';
        row.appendChild(cell);
        tableBody.appendChild(row);
        return;
    }
    
    users.forEach(user => {
        const row = document.createElement('tr');
        
        const nameCell = document.createElement('td');
        nameCell.textContent = user.name;
        
        const surnameCell = document.createElement('td');
        surnameCell.textContent = user.surname;
        
        const emailCell = document.createElement('td');
        emailCell.textContent = user.email;
        
        const phoneCell = document.createElement('td');
        phoneCell.textContent = user.phone || '-';
        
        const dateCell = document.createElement('td');
        dateCell.textContent = new Date(user.date).toLocaleDateString();
        
        row.appendChild(nameCell);
        row.appendChild(surnameCell);
        row.appendChild(emailCell);
        row.appendChild(phoneCell);
        row.appendChild(dateCell);
        
        tableBody.appendChild(row);
    });
}

function renderMessagesTable() {
    const tableBody = document.querySelector('#messages-table tbody');
    tableBody.innerHTML = '';
    
    if (messages.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 5;
        cell.textContent = currentLanguage === 'it' ? 
            'Nessun messaggio ricevuto.' : 
            'No messages received.';
        cell.style.textAlign = 'center';
        row.appendChild(cell);
        tableBody.appendChild(row);
        return;
    }
    
    messages.forEach(message => {
        const row = document.createElement('tr');
        
        const nameCell = document.createElement('td');
        nameCell.textContent = message.name;
        
        const emailCell = document.createElement('td');
        emailCell.textContent = message.email;
        
        const subjectCell = document.createElement('td');
        subjectCell.textContent = message.subject;
        
        const messageCell = document.createElement('td');
        messageCell.textContent = message.message;
        
        const dateCell = document.createElement('td');
        dateCell.textContent = new Date(message.date).toLocaleDateString();
        
        row.appendChild(nameCell);
        row.appendChild(emailCell);
        row.appendChild(subjectCell);
        row.appendChild(messageCell);
        row.appendChild(dateCell);
        
        tableBody.appendChild(row);
    });
}

function switchTab(tabId) {
    // Update tab buttons
    tabBtns.forEach(btn => {
        if (btn.getAttribute('data-tab') === tabId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Update tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
        if (pane.id === `${tabId}-tab`) {
            pane.classList.add('active');
        } else {
            pane.classList.remove('active');
        }
    });
}

function saveLoginState() {
    console.log('Salvataggio stato di login:', isLoggedIn, currentUser);
    
    if (isLoggedIn && currentUser) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        console.log('Stato di login salvato con successo');
    } else {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        console.log('Stato di login rimosso');
    }
}

function checkLoggedInStatus() {
    console.log('Verifica stato di login');
    
    try {
        const savedIsLoggedIn = localStorage.getItem('isLoggedIn');
        const savedCurrentUser = localStorage.getItem('currentUser');
        
        console.log('Stato salvato:', savedIsLoggedIn, savedCurrentUser ? 'presente' : 'assente');
        
        if (savedIsLoggedIn === 'true' && savedCurrentUser) {
            // Prova a parsare l'utente
            const parsedUser = JSON.parse(savedCurrentUser);
            
            // Verifica che l'utente abbia i campi necessari
            if (parsedUser && parsedUser.name && parsedUser.email) {
                isLoggedIn = true;
                currentUser = parsedUser;
                console.log('Utente loggato:', currentUser.name);
                
                // Aggiorna la UI
                updateUIForLoggedInUser();
                
                // Se siamo nella pagina di contatto, mostra il form
                if (window.location.pathname.includes('contact.html')) {
                    const loginRequiredMessage = document.getElementById('login-required-message');
                    const contactFormLoggedIn = document.getElementById('contact-form-logged-in');
                    
                    if (loginRequiredMessage && contactFormLoggedIn) {
                        loginRequiredMessage.style.display = 'none';
                        contactFormLoggedIn.style.display = 'block';
                        
                        // Pre-compila il form con i dati dell'utente
                        const nameInput = document.getElementById('name');
                        const emailInput = document.getElementById('email');
                        
                        if (nameInput) {
                            nameInput.value = currentUser.name || '';
                        }
                        
                        if (emailInput) {
                            emailInput.value = currentUser.email || '';
                        }
                    }
                }
                
                return; // Esci dalla funzione se tutto è andato bene
            }
        }
        
        // Se arriviamo qui, l'utente non è loggato o i dati sono invalidi
        console.log('Nessun utente loggato o dati invalidi');
        isLoggedIn = false;
        currentUser = null;
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        
    } catch (error) {
        console.error('Errore durante la verifica dello stato di login:', error);
        // Resetta lo stato di login in caso di errore
        isLoggedIn = false;
        currentUser = null;
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
    }
}

function updateUIForLoggedInUser() {
    console.log('Aggiornamento UI per utente:', isLoggedIn, currentUser ? currentUser.name : 'nessuno');
    
    try {
        // Aggiorna la barra di navigazione in base allo stato di login
        if (isLoggedIn && currentUser) {
            console.log('Aggiornamento UI per utente loggato:', currentUser.name);
            
            // Nascondi i link di login e registrazione
            const loginLinks = document.querySelectorAll('a[href="login.html"]');
            const registerLinks = document.querySelectorAll('a[href="register.html"]');
            
            loginLinks.forEach(link => {
                const parentLi = link.parentElement;
                if (parentLi) {
                    parentLi.style.display = 'none';
                }
            });
            
            registerLinks.forEach(link => {
                const parentLi = link.parentElement;
                if (parentLi) {
                    parentLi.style.display = 'none';
                }
            });
            
            // Aggiungi il link per il logout e il nome utente se non esistono già
            const navUl = document.querySelector('nav ul');
            if (navUl) {
                // Aggiungi il nome dell'utente
                if (!document.getElementById('username-li')) {
                    const usernameLi = document.createElement('li');
                    usernameLi.id = 'username-li';
                    usernameLi.className = 'username';
                    usernameLi.innerHTML = `<span>${currentUser.name}</span>`;
                    
                    // Inserisci il nome utente prima del selettore di lingua
                    const languageSwitch = document.querySelector('.language-switch');
                    if (languageSwitch) {
                        navUl.insertBefore(usernameLi, languageSwitch);
                    } else {
                        navUl.appendChild(usernameLi);
                    }
                }
                
                // Aggiungi il link di logout
                if (!document.getElementById('logout-li')) {
                    const logoutLi = document.createElement('li');
                    logoutLi.id = 'logout-li';
                    const logoutLink = document.createElement('a');
                    logoutLink.href = '#';
                    logoutLink.id = 'logout-link';
                    logoutLink.textContent = currentLanguage === 'it' ? 'Logout' : 'Logout';
                    
                    // Aggiungi l'event listener per il logout
                    logoutLink.addEventListener('click', function(e) {
                        e.preventDefault();
                        handleLogout(e);
                    });
                    
                    logoutLi.appendChild(logoutLink);
                    
                    // Inserisci il link di logout prima del selettore di lingua
                    const languageSwitch = document.querySelector('.language-switch');
                    if (languageSwitch) {
                        navUl.insertBefore(logoutLi, languageSwitch);
                    } else {
                        navUl.appendChild(logoutLi);
                    }
                }
            }
        } else {
            console.log('Aggiornamento UI per utente non loggato');
            
            // Mostra i link di login e registrazione
            const loginLinks = document.querySelectorAll('a[href="login.html"]');
            const registerLinks = document.querySelectorAll('a[href="register.html"]');
            
            loginLinks.forEach(link => {
                const parentLi = link.parentElement;
                if (parentLi) {
                    parentLi.style.display = '';
                }
            });
            
            registerLinks.forEach(link => {
                const parentLi = link.parentElement;
                if (parentLi) {
                    parentLi.style.display = '';
                }
            });
            
            // Rimuovi il link per il logout e il nome utente se esistono
            const usernameLi = document.getElementById('username-li');
            if (usernameLi) {
                usernameLi.remove();
            }
            
            const logoutLi = document.getElementById('logout-li');
            if (logoutLi) {
                logoutLi.remove();
            }
        }
    } catch (error) {
        console.error('Errore durante l\'aggiornamento della UI:', error);
    }
}

function handleLogout(e) {
    e.preventDefault();
    console.log('Tentativo di logout...');
    
    // Effettua il logout
    isLoggedIn = false;
    currentUser = null;
    
    // Rimuovi i dati dal localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    
    console.log('Logout effettuato');
    
    // Mostra un messaggio di conferma
    alert(currentLanguage === 'it' ? 
        'Logout effettuato con successo!' : 
        'Logout successful!');
    
    // Aggiorna la UI
    updateUIForLoggedInUser();
    
    // Ricarica la pagina corrente
    window.location.reload();
}

function initializeSite() {
    console.log('Inizializzazione del sito...');
    
    // Carica la lingua preferita dal localStorage
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
        console.log('Lingua preferita trovata:', savedLanguage);
        currentLanguage = savedLanguage;
        
        // Aggiorna i pulsanti della lingua
        if (savedLanguage === 'it') {
            if (itBtn) itBtn.classList.add('active');
            if (enBtn) enBtn.classList.remove('active');
        } else {
            if (enBtn) enBtn.classList.add('active');
            if (itBtn) itBtn.classList.remove('active');
        }
    }
    
    // Verifica lo stato di login
    checkLoggedInStatus();
    
    // Carica le traduzioni
    loadTranslations();
    
    console.log('Sito inizializzato');
}

function initAnimations() {
    // Animate skill bars when they come into view
    const skillLevels = document.querySelectorAll('.skill-level');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.width = entry.target.style.width;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    skillLevels.forEach(skillLevel => {
        skillLevel.style.width = '0%';
        observer.observe(skillLevel);
    });
    
    // Animate code in the hero section
    const codeAnimation = document.querySelector('.code-animation pre code');
    if (codeAnimation) {
        const text = codeAnimation.textContent;
        codeAnimation.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                codeAnimation.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 30);
            }
        }
        
        setTimeout(typeWriter, 1000);
    }
}