// NAVBAR CHANGE
window.addEventListener("scroll", () => {
    if (window.innerWidth > 834) {
        var navbar = document.querySelector("nav");
        navbar.classList.toggle("sticky", window.scrollY > 0);
    }
});

// OWN DROPDOWN MENU AND SCROLLBAR LINKS

document.addEventListener('DOMContentLoaded', function () {
    var scrollLinks = document.querySelectorAll('a.scrollLink');
    var dropdownToggle = document.querySelector('.dropdown-toggle');
    var dropdownMenu = document.querySelector('.dropdown-menu');

    scrollLinks.forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            var targetId = this.getAttribute('href');
            var targetElement = document.querySelector(targetId);
            var targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            var offset = window.innerWidth < 835 ? 0 : window.innerWidth < 1140 ? 80 : 0;
            window.scrollTo({
                top: targetPosition - offset,
                behavior: 'smooth'
            });
        });
    });

    dropdownToggle.addEventListener('click', function () {
        dropdownMenu.classList.toggle('open');
    });

    document.addEventListener('click', function (event) {
        var target = event.target;
        if (!target.closest('.dropdown')) {
            dropdownMenu.classList.remove('open');
        }
    });
});


// HIDDEN OBSERVER FOR SELECTS

const observer = new IntersectionObserver((a) => {
    a.forEach((b) => {
        if (b.isIntersecting) {
            b.target.classList.add('show');
        }
        else {
            b.target.classList.remove('show');
        }
    });
});

const hidden = document.querySelectorAll('.hidden');
hidden.forEach((h) => observer.observe(h));

// HIDDEN INFO FOR LENGUAGUES

const info = document.querySelectorAll('.len');
info.forEach((i) => {
    i.addEventListener("mouseover", () => {
        i.classList.add('showInfo');
    })

    i.addEventListener("mouseout", () => {
        i.classList.remove('showInfo');
    })
})

// TRUNCATE CARD FUNCTION

const paragraphs = document.querySelectorAll('#proyects .card .info p');

paragraphs.forEach((p) => {
    const lineHeight = parseInt(window.getComputedStyle(p).getPropertyValue('line-height'), 10);
    const maxHeight = lineHeight * 3;

    if (p.offsetHeight > maxHeight) {
        p.classList.add('truncate');
    }
});

// MOBILE VERSION

const menuIcon = document.querySelector('.menu-icon');
const menuIcon2 = document.querySelector('.menu-icon2');
const nav = document.querySelector('nav');

menuIcon.addEventListener('click', function () {
    nav.classList.add('open');
    menuIcon.classList.add('open');
    menuIcon2.classList.remove('open');
    toggleMenu();
});

menuIcon2.addEventListener('click', function () {
    nav.classList.remove('open');
    menuIcon2.classList.add('open');
    menuIcon.classList.remove('open');
    toggleMenu();
});

document.addEventListener('click', function (event) {
    if (!nav.contains(event.target) && nav.classList.contains('open')) {
      nav.classList.remove('open');
      menuIcon2.classList.add('open');
      menuIcon.classList.remove('open');
      toggleMenu();
    }
  });

// BLUR (DESENFOQUE)

function toggleMenu() {
    var content = document.getElementById("content");
    var about = document.getElementById("about");
    var lenguagues = document.getElementById("lenguagues");
    var frontEnd = document.getElementById("frontEnd");
    var backEnd = document.getElementById("backEnd");
    var proyects = document.getElementById("proyects");
    content.classList.toggle("blur");
    about.classList.toggle("blur");
    lenguagues.classList.toggle("blur");
    frontEnd.classList.toggle("blur");
    backEnd.classList.toggle("blur");
    proyects.classList.toggle("blur");
}


