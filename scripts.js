

/*=====menu icon navbar======*/
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
  menuIcon.classList.toggle('bx-x');
  navbar.classList.toggle('active');
};

/*=====scroll section active link======*/
let sections = document.querySelectorAll('section');
let navlinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
  sections.forEach(sec => {
    let top = window.scrollY;
    let offset = sec.offsetTop - 150;
    let height = sec.offsetHeight;
    let id = sec.getAttribute('id');

    if (top >= offset && top < offset + height) {
      navlinks.forEach(links => {
        links.classList.remove('active');
        document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
      });
    }
  });

  /*=====sticky navbar======*/
  let header = document.querySelector('.header');
  header.classList.toggle('sticky', window.scrollY > 100);

  /*=====remove menu icon navbar when click scroll======*/
  menuIcon.classList.remove('bx-x');
  navbar.classList.remove('active');
};

/*=====swiper======*/
var swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  spaceBetween: 50,
  loop: true,
  grabCursor: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

/*=====dark light mode======*/
let darkModeIcon = document.querySelector('#darkMode-icon');

darkModeIcon.onclick = () => {
  darkModeIcon.classList.toggle('bx-sun');
  document.body.classList.toggle('dark-mode');
};

/*=====scroll reveal======*/
ScrollReveal({
  // reset: true,
  distance: '80px',
  duration: 2000,
  delay: 200,
});

ScrollReveal().reveal('.home-content, .heading', {
  origin: 'top'
});

ScrollReveal().reveal('.home-img img, .services-container, .portfolio-box, .testimonial-wrapper, .contact form', {
  origin: 'bottom'
});

ScrollReveal().reveal('.home-content h1, .about-img img', {
  origin: 'left'
});

ScrollReveal().reveal('.home-content h3, .home-content p, .about-content', {
  origin: 'right'
});

/*===== EmailJS Contact Form Submission =====*/
(function () {
  emailjs.init("lCukDs5TYm6CR08TK");
})();

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Set timestamp for `time` field
      const timeField = document.getElementById("time");
      if (timeField) {
        timeField.value = new Date().toLocaleString();
      }

      emailjs.sendForm("service_gnwrklb", "template_jsswalh", this)
        .then(() => {
          alert("✅ Message sent to Suraj Kumar Subudhi!");
          this.reset();
        }, (error) => {
          alert("❌ Failed to send: " + JSON.stringify(error));
        });
    });
  }
});
