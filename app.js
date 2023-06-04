// NAVBAR CHANGE
window.addEventListener("scroll", () => {
    if (window.innerWidth > 834) {
        var navbar = document.querySelector("nav");
        navbar.classList.toggle("sticky", window.scrollY > 0);
    }
});

document.addEventListener('DOMContentLoaded', function () {

    // OWN DROPDOWN MENU AND SCROLLBAR LINKS

    var scrollLinks = document.querySelectorAll('a.scrollLink');
    var dropdownToggle = document.querySelector('.dropdown-toggle');
    var dropdownMenu = document.querySelector('.dropdown-menu');

    scrollLinks.forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            let targetId = this.getAttribute('href');
            let targetElement = document.querySelector(targetId);
            let targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            let offset = window.innerWidth < 835 ? 0 : window.innerWidth < 1140 ? 80 : 0;
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
        let target = event.target;
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

// CAMBIO DE IDIOMA

let languageButton = document.getElementById('language-button');

languageButton.addEventListener('click', function () {
    let currentLanguage = languageButton.getAttribute('data-lang');
    let lang;

    if (currentLanguage === 'es') {
        lang = "en";
        languageButton.innerHTML = '<span id="spanLenguage" class="fi fi-gb"></span>&nbsp;EN';
        changeToEnglish();
    } else {
        lang = "es";
        languageButton.innerHTML = '<span id="spanLenguage" class="fi fi-es"></span>&nbsp;ES';
        changeToSpanish();
    }

    languageButton.setAttribute('data-lang', lang);
});

function changeToEnglish() {

    // NAVBAR

    let translationsNavbar = {
        "Inicio": "Home",
        "Sobre mi": "About me",
        "Habilidades": "Skills",
        "Lenguajes": "Lenguages",
        "Front-End": "Front-End",
        "Back-end": "Back-end",
        "Proyectos": "Projects"
    };

    let menuItems = document.getElementsByClassName("scrollLink");

    translate(menuItems, translationsNavbar);

    // INIT

    let translationsInit = {
        "Hola, mi nombre es": "Hi, my name is",
        "Y soy un estudiante de Ingeniería de Software": "And I am a Software Engineering student"
    };

    let content = document.getElementById("content");
    let hiddenElements = content.getElementsByClassName("hidden");

    translate(hiddenElements, translationsInit);

    // ABOUT ME

    let aboutTitle = document.getElementById("aboutTitle");
    aboutTitle.textContent = "About me";

    let paragraph = document.getElementById("paragraph");
    paragraph.innerHTML = "Hi, I'm Carlos Gómez López. <br> I'm currently a fourth-year student in Software Engineering at <a href='https://www.ucm.es/'>Complutense University of Madrid (UCM)</a>. <br> I became interested in computering at a young age, and my studies have further fueled my interest and desire to learn new skills and specialize in different areas. In recent years, I've focused on front-end development, although I'm proficient in both front-end and back-end. <br> Furthermore, throughout my degree, I have gained knowledge in cybersecurity, graph analysis, efficient algorithm usage, etc. <br> In my free time, I enjoy acquiring new knowledge for personal growth, hanging out with friends, and participating in sports."

    let contact = document.getElementById("contact");
    contact.textContent = "Get in touch with me";

    // PROGRAMMING LENGUAGUES, FRONT-END AND BACK-END

    let lenguaguesTitle = document.getElementById("lenguaguesTitle");
    lenguaguesTitle.textContent = "Programming Languages";

    let levels = document.getElementsByClassName("level");
    changeLevelEnglish(levels);

    // PROYECTS

    let translationParagraphs = {
        "The VideoGameBox es una aplicación de escritorio enfocada a aquellas personas que tienen grandes colecciones de videojuegos y quieren poder gestionarlas y organizarlas de una manera sencilla.": "The VideoGameBox is a desktop application aimed at those who have large video game collections and want to be able to manage and organize them in a simple way.",
        "The VideoGameBox Web es una aplicación web enfocada a aquellas personas que quieren informarse sobre videojuegos y quieren poder gestionarlos y organizarlos de una manera sencilla.": "The VideoGameBox Web is a web application aimed at those who want to get information about video games and want to be able to manage and organize them in a simple way.",
        "The GamuSinner es una juego web sobre una gran aventura a través de distintos escenarios de España en la que te enfrentarás a mazmorras repletas de criaturas fantásticas y mitológicas.": "The GamuSinner is a web game about a great adventure through different scenarios of Spain, where you will face dungeons filled with fantastic and mythological creatures.",
        "Supermercado es una aplicación de escritorio para controlar las compras que se realicen, los productos, las marcas de éstos y los proveedores que las distribuyen.": "Supermercado is a desktop application for managing purchases, products, brands, and suppliers involved in the distribution.",
        "Restaurante es una aplicación de escritorio para controlar un restaurante basado en pedidos, los cuales contienen platos y cada uno de éstos es atendido por el personal del restaurante.": "Restaurante is a desktop application for managing a restaurant based on orders, which include dishes that are served by the restaurant staff."
    }

    let proyectsTitle = document.getElementById("proyectsTitle");
    proyectsTitle.textContent = "Projects Completed";

    let proyectParagraphs = document.getElementsByClassName("proyectParagraph");
    translate(proyectParagraphs, translationParagraphs);

    let buttons = document.getElementsByClassName("button");
    for (let button of buttons) {
        button.textContent = "Read more";
    }

}

function changeToSpanish() {

    // NAVBAR

    let translationsNavbar = {
        "Home": "Inicio",
        "About me": "Sobre mi",
        "Skills": "Habilidades",
        "Lenguages": "Lenguajes",
        "Front-End": "Front-End",
        "Back-end": "Back-end",
        "Projects": "Proyectos"
    };

    let menuItems = document.getElementsByClassName("scrollLink");

    translate(menuItems, translationsNavbar);

    // INIT

    let translationsInit = {
        "Hi, my name is": "Hola, mi nombre es",
        "And I am a Software Engineering student": "Y soy un estudiante de Ingeniería de Software"
    };

    let content = document.getElementById("content");
    let hiddenElements = content.getElementsByClassName("hidden");

    translate(hiddenElements, translationsInit);

    // ABOUT ME

    let aboutTitle = document.getElementById("aboutTitle");
    aboutTitle.textContent = "Sobre mi";

    let paragraph = document.getElementById("paragraph");
    paragraph.innerHTML = "Buenas, soy Carlos Gómez López. <br> Actualmente soy estudiante de cuarto en el grado de Ingeniería de Software en la <a href='https://www.ucm.es/'>Universidad Complutense de Madrid (UCM)</a>. <br> Empecé a interesarme en la informática desde joven y gracias a lo que me ha enseñado la carrera ha generado que tenga más interés y ganas de aprender nuevos conocimientos y especializarme en otros. En mis últimos años me he especializado en front, aunque simplemente como entretenimiento, ya que me desenvuelvo bien tanto en front-end como en back-end. <br> Además, a lo largo de la carrera he podido aprender conocimientos con respecto a la ciberseguridad, análisis de grafos, empleo de algoritmos eficientes, etc. <br> En mi tiempo libre me gusta adquirir conocimientos nuevos para beneficio propio, salir con los amigos y realizar deporte."

    let contact = document.getElementById("contact");
    contact.textContent = "Ponte en contacto conmigo";

    // PROGRAMMING LENGUAGUES, FRONT-END AND BACK-END

    let lenguaguesTitle = document.getElementById("lenguaguesTitle");
    lenguaguesTitle.textContent = "Lenguajes De Programación";

    let levels = document.getElementsByClassName("level");
    changeLevelSpanish(levels);

    // PROYECTS

    let translationParagraphs = {
        "The VideoGameBox is a desktop application aimed at those who have large video game collections and want to be able to manage and organize them in a simple way.": "The VideoGameBox es una aplicación de escritorio enfocada a aquellas personas que tienen grandes colecciones de videojuegos y quieren poder gestionarlas y organizarlas de una manera sencilla.",
        "The VideoGameBox Web is a web application aimed at those who want to get information about video games and want to be able to manage and organize them in a simple way.": "The VideoGameBox Web es una aplicación web enfocada a aquellas personas que quieren informarse sobre videojuegos y quieren poder gestionarlos y organizarlos de una manera sencilla.",
        "The GamuSinner is a web game about a great adventure through different scenarios of Spain, where you will face dungeons filled with fantastic and mythological creatures.": "The GamuSinner es una juego web sobre una gran aventura a través de distintos escenarios de España en la que te enfrentarás a mazmorras repletas de criaturas fantásticas y mitológicas.",
        "Supermercado is a desktop application for managing purchases, products, brands, and suppliers involved in the distribution.": "Supermercado es una aplicación de escritorio para controlar las compras que se realicen, los productos, las marcas de éstos y los proveedores que las distribuyen.",
        "Restaurante is a desktop application for managing a restaurant based on orders, which include dishes that are served by the restaurant staff.": "Restaurante es una aplicación de escritorio para controlar un restaurante basado en pedidos, los cuales contienen platos y cada uno de éstos es atendido por el personal del restaurante."
    }

    let proyectsTitle = document.getElementById("proyectsTitle");
    proyectsTitle.textContent = "Proyectos Realizados";

    let proyectParagraphs = document.getElementsByClassName("proyectParagraph");
    translate(proyectParagraphs, translationParagraphs);

    let buttons = document.getElementsByClassName("button");
    for (let button of buttons) {
        button.textContent = "Leer más";
    }
}

function translate(array, textToTranslate) {
    for (let i = 0; i < array.length; i++) {
        let currentText = array[i].innerText.trim();
        let translatedText = textToTranslate[currentText];
        if (translatedText) {
            array[i].innerHTML = translatedText;
        }
    }
}

function changeLevelEnglish(levels) {
    for (let level of levels) {
        let content = level.textContent;
        let l = content.split(":")[1].trim();
        let en = "Low";
        if (l === "Alto") en = "High";
        else if (l === "Medio") en = "Medium";
        let s = "Level: <span>" + en + "</span>";
        level.innerHTML = s;
    }
}

function changeLevelSpanish(levels) {
    for (let level of levels) {
        let content = level.textContent;
        let l = content.split(":")[1].trim();
        let es = "Bajo";
        if (l === "High") es = "Alto";
        else if (l === "Medium") es = "Medio";
        let s = "Nivel: <span>" + es + "</span>";
        level.innerHTML = s;
    }
}






