const body = document.body;
const header = document.getElementById('siteHeader');
const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const themeToggle = document.getElementById('themeToggle');
const navLinks = [...document.querySelectorAll('.nav a')];
const sections = [...document.querySelectorAll('main section[id]')];

function setTheme(theme) {
  const light = theme === 'light';
  body.classList.toggle('light-mode', light);
  themeToggle.innerHTML = `<i class="bx ${light ? 'bx-sun' : 'bx-moon'}"></i>`;
  localStorage.setItem('portfolio-theme', theme);
}

const savedTheme = localStorage.getItem('portfolio-theme');
const systemLight = window.matchMedia?.('(prefers-color-scheme: light)').matches;
setTheme(savedTheme || (systemLight ? 'light' : 'dark'));

themeToggle.addEventListener('click', () => setTheme(body.classList.contains('light-mode') ? 'dark' : 'light'));

menuToggle.addEventListener('click', () => {
  navbar.classList.toggle('open');
  const open = navbar.classList.contains('open');
  menuToggle.innerHTML = `<i class="bx ${open ? 'bx-x' : 'bx-menu'}"></i>`;
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});

navLinks.forEach(link => link.addEventListener('click', () => {
  navbar.classList.remove('open');
  menuToggle.innerHTML = '<i class="bx bx-menu"></i>';
}));

function updateActiveLink() {
  header.classList.toggle('scrolled', window.scrollY > 30);
  let activeId = 'home';
  for (const section of sections) {
    const top = section.offsetTop - 180;
    if (window.scrollY >= top) activeId = section.id;
  }
  navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`));
}
window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const tiltCard = document.querySelector('.tilt-card');
if (tiltCard && window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  tiltCard.addEventListener('mousemove', (event) => {
    const rect = tiltCard.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    tiltCard.style.transform = `perspective(1000px) rotateX(${y * -5}deg) rotateY(${x * 7}deg)`;
  });
  tiltCard.addEventListener('mouseleave', () => tiltCard.style.transform = '');
}

document.getElementById('year').textContent = new Date().getFullYear();

// EmailJS contact form.
const EMAILJS_PUBLIC_KEY = 'lCukDs5TYm6CR08TK';
const EMAILJS_SERVICE_ID = 'service_gnwrklb';
const EMAILJS_TEMPLATE_ID = 'template_jsswalh';
const PORTFOLIO_INBOX = 'surajkumarsubudhi20@gmail.com';

const form = document.getElementById('contact-form');
const formStatus = document.getElementById('formStatus');
let lastSubmitAt = 0;

if (window.emailjs) {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

if (form) {
  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');
    const buttonText = submitButton?.querySelector('span');
    const data = new FormData(form);
    const now = Date.now();

    if ((data.get('website') || '').trim()) return;

    if (now - lastSubmitAt < 15000) {
      formStatus.className = 'form-status error';
      formStatus.textContent = 'Please wait a few seconds before sending another message.';
      return;
    }

    const name = (data.get('name') || '').trim();
    const email = (data.get('email') || '').trim();
    const message = (data.get('message') || '').trim();

    if (!name || !email || !message) {
      formStatus.className = 'form-status error';
      formStatus.textContent = 'Please complete your name, email and message.';
      return;
    }

    // Populate hidden EmailJS variables expected by the template.
    form.elements.to_email.value = PORTFOLIO_INBOX;
    form.elements.from_name.value = name;
    form.elements.from_email.value = email;
    form.elements.reply_to.value = email;
    form.elements.time.value = new Date().toLocaleString();

    submitButton.disabled = true;
    if (buttonText) buttonText.textContent = 'Sending...';
    formStatus.className = 'form-status';
    formStatus.textContent = 'Sending your message...';

    try {
      if (!window.emailjs) throw new Error('EmailJS browser SDK did not load.');

      const response = await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        form
      );

      console.log('EmailJS success:', response.status, response.text);
      lastSubmitAt = Date.now();
      formStatus.className = 'form-status success';
      formStatus.textContent = 'Message sent successfully. Thank you!';
      form.reset();
    } catch (error) {
      console.error('EmailJS send failed:', error);
      const detail = error?.text || error?.message || 'Unknown EmailJS error';
      formStatus.className = 'form-status error';
      formStatus.textContent = `Message could not be sent. (${detail})`;
    } finally {
      submitButton.disabled = false;
      if (buttonText) buttonText.textContent = 'Send Message';
    }
  });
}
