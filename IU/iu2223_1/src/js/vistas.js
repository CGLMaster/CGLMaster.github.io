"use strict"

import * as Cm from './cmapi.js'

/**
 * Para las prácticas de IU, pon aquí (o en otros js externos incluidos desde tus .htmls) el código
 * necesario para añadir comportamientos a tus páginas.
 *
 * Este fichero, `vistas.js` contiene código para generar html dinámicamente 
 * a partir del modelo (cmapi.js); y también código de comportamiento. 
 * El fichero `pegamento.js` contiene código para asociar vistad de este fichero
 * a partes de páginas.
 *
 * Fuera de las prácticas, lee la licencia: dice lo que puedes hacer con él:
 * lo que quieras siempre y cuando
 * - no digas que eres el autor original
 * - no me eches la culpa si algo no funciona como esperas
 *
 * @Author manuel.freire@fdi.ucm.es
 */

const roleClasses = {
    [Cm.UserRole.TEACHER]: "badge text-bg-primary ",
    [Cm.UserRole.STUDENT]: "badge text-bg-success ",
    [Cm.UserRole.ADMIN]: "badge text-bg-warning "
}

const areaClasses = {
    [Cm.CourseArea.OFFICE]: "badge text-bg-secondary",
    [Cm.CourseArea.INTERNET]: "badge text-bg-info",
    [Cm.CourseArea.IT]: "badge text-bg-dark"
}

const levelClasses = {
    [Cm.CourseLevel.INITIATION]: "badge opacity-50",
    [Cm.CourseLevel.GENERALIST]: "badge opacity-75",
    [Cm.CourseLevel.SPECIALIST]: "badge opacity-100"
}


function userRow(user, editions, check) {
    const matriculas = editions.filter(o => o.students.indexOf(user.id) != -1)
    const docencia = editions.filter(o => o.teachers.indexOf(user.id) != -1)
    return `
    <tr data-id="${user.id}" class="user-table-row">
        <td><input type="checkbox" class="ms-2 mt-2" value="${user.id}" name="users"/></td>
        <td>${user.name}</td>
        <td><span class="${roleClasses[user.role]}">${user.role}</span></td>
        <td>${user.email}</td>
        <td>${user.dni}</td>
        <td>${Math.max(matriculas.length, docencia.length)}</td>
        <td>
        <div class="btn-group">
            <button id="d${user.id}" title="Muestra las ediciones en las que figura ${user.name}" 
                class="edition-link btn btn-sm ">👁️</button>        
            <button title="Edita el usuario ${user.name}" 
                class="set-user btn btn-sm">✏️</button>
            <button title="Elimina a ${user.name} del sistema, y de todas las ediciones" 
                class="btn btn-sm" data-bs-toggle="modal" data-bs-target="#modalDelete" data-id="U&${user.id}" style="background-color: crimson;">🗑️</button>
        </div>
        </td>
    </tr>
    `;
}

function editionOptions(editions){
    let s = ``;
    for(let e of editions){
        s += `<option value="${e.id}">${e.name}</option>`;
    }
    return s;
}

export function createUserTable(users) {
    const editions = Cm.getEditions();
    const filas = users.map(o => userRow(o, editions)).join('');
    const listEdition = editionOptions(editions);

    const botonNuevoUsuario = `
        <button title="Crea un nuevo usuario" 
            class="add-user btn ">➕</button>`

    return `
    
    <h4 class="mt-3 text-center" style="font-size:40px; color:white;">Usuarios</h4>
    <hr style="color: white;">
    <div class="row m-2">
        <div class="col md-auto input-group">
            <input id="search-in-users-input" type="search" class="form-control" placeholder="Filtrar" />
            <span class="input-group-text bg-primary bg-gradient opacity-75" id="search-in-users-button">🔍</span>
        </div>
        <div class="col ms-2">
            <button id="search-advanced-toggle" title="Búsqueda avanzada" class="btn btn-primary"><i class="bi bi-funnel-fill"></i></button>
        </div>
        <div class="col md-auto text-end d-flex flex-row justify-content-end btn-group">
            <button title="Elimina varios usuarios" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#cmModalDel" data-id="U" style="color:white">🗑️</button>
            <button title="Matricula varios usuarios" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#cmMatricularModal">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                </svg>
            </button>
            ${botonNuevoUsuario}
        </div>
        
    </div>

    <form id="filter-in-users" class="m-2 row p-2 border border-2 rounded" autocomplete="off">
        <input type="search" name="name" class="col-md-8 m-1  form-control form-control-sm" id="nameUser" placeholder="Nombre o fragmento">
        <input type="search" name="dni" class="col-md-4 m-1 form-control form-control-sm" id="dni" placeholder="DNI o fragmento">
        <input type="search" name="email" class="col-md-6 m-1 form-control form-control-sm" id="email" placeholder="correo o fragmento">
        <select name="role" id="role" class="col-md-6 m-1 form-select form-select-sm">
            <option value="" selected>Ninguna rol seleccionado</option>
            <option value="admin">admin</option>
            <option value="alumno">alumno</option>
            <option value="profesor">profesor</option>
        </select> 
        <div class="m-1">
            <button type="reset" class=" btn btn-primary" id="limpiarUser" onclick="limpiarUsers()">Limpiar filtros</button>
        </div>    
    </form>

    <table class="table table-striped">
    <tr>
        <td><input type="checkbox" class="ms-2 mt-2" name="toggle"/></td>
        <th>Nombre</th>
        <th>Rol</th>
        <th>Correo</th>
        <th>DNI</th>
        <th title="número de ediciones en las que es alumno y/ó profesor">A/P</th>
        <th>Acciones</th>        
    </tr>
    ${filas}
    </table>

    <div class="modal fade " id="cmMatricularModal" tabindex="-1" aria-labelledby="cmMatricularModal" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="cmMatriculaLabel">
                        ¿En qué edición los quieres matricular?
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form class="row" id="cmMatricularForm">
                        <select name="edition" id="editionSelect" class="col-md-6 m-1 form-select form-select-sm">
                            <option value="">Selecciona una edición</option>
                            ${listEdition}
                        </select>    
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" id="matricular" data-bs-dismiss="modal">Matricular</button>
                </div>
            </div>
        </div>
    </div>
 `;
}

function ratingForEdition(results, e) {
    let rating = 0;
    let n = 0,
        max = 0;
    results.filter(o => o.edition == e.id).forEach(r => {
        if (r.rating) {
            rating += r.rating;
            n++;
        }
        max++;
    });
    const estrellitas = n ?
        `${''.padStart(Math.floor(rating/n), '⭐')} ${(rating/n).toFixed(1)}` :
        '(no disponible)'
    return `${estrellitas} ${n}/${max}`;
}

function courseRow(course, editions, results) {
    const ratings = editions.filter(o => o.course == course.id).map(e =>
        `<button id="d${e.id}" data-id="${e.id}" 
            class="edition-link btn btn-outline-secondary btn-sm" 
            title="${ratingForEdition(results, e)}">${e.year}</button>`
    );

    const year = new Date().getFullYear();
    const hasCurrentEdition = editions.filter(o => o.course == course.id && o.year == year).length == 0;

    return `
    <tr data-id="${course.id}" class="course-table-row">
        <td><input type="checkbox" class="ms-2 mt-2" value="${course.id}" name="courses"/></td>
        <td>${course.name}</td>
        <td><span class=" ${areaClasses[course.area]}" style="color: white; background-color: #38811b;">${course.area}</span></td>
        <td><span class="${levelClasses[course.level]}" style="color: white; background-color: #38811b;">${course.level}</span></td>
        <td>${ratings.join(' ')} 
            <button data-year="${year}" title="Crea una edición ${year} para el curso ${course.name}" 
                class="add-edition btn btn-sm" 
                ${hasCurrentEdition ? "":"disabled"}>➕</button>
        </td>
        <td>
        <div class="btn-group">
            <button title="Edita el curso ${course.name}" 
                class="set-course btn btn-sm">✏️</button>
            <button title="Elimina el curso ${course.name} del sistema, y todas sus ediciones" 
                class="btn btn-sm" data-bs-toggle="modal" data-bs-target="#modalDelete" data-id="C&${course.id}" style="background-color: crimson;">🗑️</button>                
        </div>
        </td>        
    </tr>
    `;
}

export function createCoursesTable(courses) {
    const editions = Cm.getEditions();
    const results = Cm.getResults();
    const filas = courses.map(o => courseRow(o, editions, results)).join('');
    const botonNuevoCurso = `
        <button title="Crea un nuevo curso" 
            class="add-course btn">➕</button>`

    return `
    <h4 class="mt-3 text-center"  style="font-size:40px; color:white;">Cursos</h4>
    <hr style="color: white;">
    <div class="row m-2">
        <div class="col md-auto input-group">
            <input id="search-in-courses-input" type="search" class="form-control" placeholder="Filtrar" />
            <span class="input-group-text bg-primary bg-gradient opacity-75" id="search-in-users-button">🔍</span>
        </div>
        <div class="col">
            <button id="search-advanced-toggle-course" title="Búsqueda avanzada" class="btn text-bg-primary"><i class="bi bi-funnel-fill"></i></button>
        </div>
        <div class="col-1 md-auto text-end d-flex flex-row justify-content-end btn-group">
            <button title="Elimina varios cursos" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#cmModalDel" data-id="C" style="color:white;">🗑️</button>
            ${botonNuevoCurso}
        </div>
    </div>

    <form id="filter-in-courses" class="m-2 row p-2 border border-2 rounded" autocomplete="off">
        <input type="search" name="name" class="col-md-8 m-1  form-control form-control-sm" id="nameCourse" placeholder="Nombre o fragmento">
        <select name="area" id="area" class="col-md-6 m-1 form-select form-select-sm">
            <option value="" selected>Ninguna area seleccionada</option>
            <option value="ofimática">ofimática</option>
            <option value="internet" >internet</option>
            <option value="tec. informáticas">tec. informáticas</option>
        </select>
        <select name="nivel" id="nivel" class="col-md-6 m-1 form-select form-select-sm">
            <option value="" selected>Ningun nivel seleccionado</option>
            <option value="iniciación">iniciación</option>
            <option value="especialización" >especialización</option>
            <option value="generalista">generalistas</option>
        </select> 
        <select name="anio" id="anio" class="col-md-6 m-1 form-control form-control-sm" placeholder="Año de Edición" max="2022" min="1991">
            <option value="" selected>Ningun año seleccionado</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
            <option value="2019">2019</option>
            <option value="2018">2018</option>
            <option value="2017">2017</option>
            <option value="2016">2016</option>
            <option value="2015">2015</option>
            <option value="2014">2014</option>
            <option value="2013">2013</option>
            <option value="2012">2012</option>
            <option value="2011">2011</option>
            <option value="2010">2010</option>
            <option value="2009">2009</option>
            <option value="2008">2008</option>
            <option value="2007">2007</option>
            <option value="2006">2006</option>
            <option value="2005">2005</option>
            <option value="2004">2004</option>
            <option value="2003">2003</option>
            <option value="2002">2002</option>
            <option value="2001">2001</option>
            <option value="2000">2000</option>
            <option value="1999">1999</option>
            <option value="1998">1998</option>
            <option value="1997">1997</option>
            <option value="1996">1996</option>
            <option value="1995">1995</option>
            <option value="1994">1994</option>
            <option value="1993">1993</option>
            <option value="1992">1992</option>
            <option value="1991">1991</option>
        </select>
        <div>
            <input type="range" id="valoration" name="valoration" list="mydata" min="0" max="5" step="0.5" style="background-color: transparent !important;"/>
            <label for="temp" style="color: white;">Valoración ⭐</label>
            <datalist id="mydata">
            <option value="0"></option>
            <option value="1"></option>
            <option value="2"></option>
            <option value="3"></option>
            <option value="4"></option>
            <option value="5"></option>
            </datalist>
        </div>
        <div class="m-1">
            <button class="btn btn-primary" id="limpiar_filtro_courses" onclick="limpiarCourses()">Limpiar filtros</button>
        </div>
    </form>

    <table class="table table-striped">
    <tr>
        <td><input type="checkbox" class="ms-2 mt-2" name="toggle"/></td>
        <th>Nombre</th>
        <th>Área</th>
        <th>Nivel</th>
        <th>Ediciones</th>
        <th>Acciones</th>
    </tr>
    ${filas}
    </table>
 `;
}

function studentRow(user, edition, results) {
    const resultados = results.filter(o => o.student == user.id);
    const nota = resultados.length ? resultados[0].grade : '?';
    return `
    <tr class="student-table-row" data-id="${user.id}&${edition.id}">
        <td><input type="checkbox" class="ms-2 mt-2" value="S&${user.id}&${edition.id}" name="students"/></td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.dni}</td>
        <td class="text-end">${nota != null ? nota : '?'}</td>
        <td>&nbsp;
            <button title="Desmatricula a ${user.name} de ${edition.name}"                 
                class="rm-from-edition btn btn-sm">🗑️</button>
        </td>
    </tr>
    `;
}

function teacherRow(user, edition, results) {
    return `
    <tr class="teacher-table-row" data-id="${user.id}&${edition.id}">
        <td><input type="checkbox" class="ms-2 mt-2" value="P&${user.id}&${edition.id}" name="professors"/></td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.dni}</td>
        <td>&nbsp;
            <button title="Hace que ${user.name} deje de ser profesor de ${edition.name}" 
                class="rm-from-edition btn btn-sm">🗑️</button>
        </td>
    </tr>
    `;
}

export function createDetailsForEdition(edition) {
    const results = Cm.getResults({ edition: edition.id });
    const students = edition.students.map(o => Cm.resolve(o));
    const filasAlumno = students.map(o => studentRow(o, edition, results)).join('');
    const teachers = edition.teachers.map(o => Cm.resolve(o));
    const filasProfesor = teachers.map(o => teacherRow(o, edition)).join('')

    const botonBorrado = `
        <button title="Elimina la edición ${edition.name} del sistema" 
            data-id="${edition.id}"
            class="rm-edition btn">🗑️</button>`

    const botonMatricula = (tipo) => `
        <button title="Matricula un ${tipo} para ${edition.name}" 
            data-id="${edition.id}"
            class="add-${tipo}-to-edition btn bg-success">➕</button>`

    return `
    <div class="row mt-2 me-2 mt-4">
        <div class="col md-auto"><h4 class="md-auto" style="color: white;"><i>${edition.name}</i></h4></div>
        <div class="col text-end">${botonBorrado}</div>
    </div>
    <h5 class="mt-3" style="color: white;">Profesores</h5>
    <div class="d-flex flex-row justify-content-between me-2">
        <div class="md-auto">
            <div class="input-group">
                <input id="search-in-teachers-input" type="search" class="form-control" placeholder="Filtrar" />
                <span class="input-group-text bg-primary bg-gradient opacity-75">🔍</span>
            </div>
        </div>
        <div class="md-auto text-end d-flex flex-row justify-content-end btn-group">
            <button title="Elimina varios profesores de la edición" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#cmModalDel" data-id="P" style="color:white;">🗑️</button>
            ${botonMatricula("profesor")}
        </div>
    </div>
    <table class="table table-striped w-100 ml-4" id="professors">
    <tr>
        <td><input type="checkbox" class="ms-2 mt-2" name="toggle"/></td>
        <th>Nombre</th>
        <th>Correo</th>
        <th>DNI</th>
        <th>Acciones</th>
    </tr>
    ${filasProfesor}
    </table>

    <h5 class="mt-3" style="color: white;">Alumnos</h5>
    <div class="row mt-2 me-2 mb-2">
        <div class="col md-auto input-group">
            <input id="search-in-students-input" type="search" class="form-control" placeholder="Filtrar" />
            <span class="input-group-text bg-primary bg-gradient opacity-75">🔍</span>
        </div>
        <div class="col">
            <button id="search-advanced-toggle-group" title="Búsqueda avanzada" class="btn text-bg-primary"><i class="bi bi-funnel-fill"></i></button>
        </div>
        <div class="col-1 md-auto text-end d-flex flex-row justify-content-end btn-group">
            <button title="Elimina varios estudiantes de la edición" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#cmModalDel" data-id="S" style="color:white;">🗑️</button>
            ${botonMatricula("alumno")}
        </div>
    </div>

    <form id="filter-in-users-group" class="m-2 row p-2 border border-2 rounded" autocomplete="off">
            <input type="search" name="name" class="col-md-8 m-1  form-control form-control-sm" id="nameStudent" placeholder="Nombre o fragmento">
            <input type="search" name="dni" class="col-md-4 m-1 form-control form-control-sm" id="dniStudent" placeholder="DNI o fragmento">
            <input type="search" name="email" class="col-md-6 m-1 form-control form-control-sm" id="emailStudent" placeholder="correo o fragmento">
            <select name="note" id="note" class="col-md-6 m-1 form-select form-select-sm">
                <option value="" selected>Ninguna nota seleccionada</option>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
            </select> 
            <!-- <div>
                <label for="note">Nota:</label>
                <input type="range" value="" id="note" name="note" list="mynote" min="0" max="10" step="1" style="width:300px"/>
                <datalist id="mynote">
                    <option value="0"></option>
                    <option value="1"></option>
                    <option value="2"></option>
                    <option value="3"></option>
                    <option value="4"></option>
                    <option value="5"></option>
                    <option value="6"></option>
                    <option value="7"></option>
                    <option value="8"></option>
                    <option value="9"></option>
                    <option value="10"></option>
                </datalist>
            </div> -->
            <div class="m-1">
                <button class=" btn btn-primary" id="limpiar_filtro_students" onclick="limpiarStudents()">Limpiar filtros</button>
            </div>    
        </form>

    <table class="table table-striped w-100 ml-4" id="students">
    <tr>
        <td><input type="checkbox" class="ms-2 mt-2" name="toggle"/></td>
        <th>Nombre</th>
        <th>Correo</th>
        <th>DNI</th>
        <th>Nota</th>
        <th>Acciones</th>
    </tr>
    ${filasAlumno}
    </table>

 `;
}

function userEditionRow(edition, user, results) {
    let result = Cm.getResults({ student: user.id, edition: edition.id });
    result = result.length ? result[0] : 0;
    const student = user.role == Cm.UserRole.STUDENT;

    let buttons = '';
    if (student) {
        const rating = result && result.rating ? result.rating : '?';
        const grade = result && result.grade ? result.grade : '?';
        buttons = `
            <td class="ed-rating">${rating}</td>
            <td class="ed-grade">${grade}</td>
        `;
    }

    return `
    <tr class="user-edition-table-row" data-user="${user.id}" data-edition="${edition.id}">
        <td>${edition.name}</td>
        <td>${ratingForEdition(results, edition)}</td>
        ${buttons}
        <td>
        <div class="btn-group">
            <button title="Cambia nota y/o valoración para ${user.name} en ${edition.name}" 
                class="set-result btn btn-sm ">✏️</button>
            <button title="Saca a ${user.name} de ${edition.name}" 
            class="btn btn-sm" data-bs-toggle="modal" data-bs-target="#modalDeleteUserEdition" data-id="${user.id}&${edition.id}" style="background-color: crimson;">🗑️</button>
        </div>
        </td>
    </tr>
    `;
}

export function createDetailsForUser(user) {
    const studentEditions = Cm.getEditions().filter(o => o.students.indexOf(user.id) != -1);
    const teacherEditions = Cm.getEditions().filter(o => o.teachers.indexOf(user.id) != -1);

    const results = Cm.getResults();
    const filasEdicionUsuario = [...studentEditions, ...teacherEditions].map(
        o => userEditionRow(o, user, results)).join('')

    const student = user.role == Cm.UserRole.STUDENT;

    const botonMatricula = (tipo) => `
        <button title="Matricula un ${tipo} para ${edition.name}" 
            data-id="${edition.id}"
            class="add-${tipo}-to-edition btn bg-success">➕</button>`

    return `
    <div class="row">
        <div class="col md-auto mt-3" style="color: white;"><h4 class="md-auto"><i>${user.name}</i></h4></div>
    </div>
    <h5 class="mt-3" style="color: white;">Ediciones donde participa</h5>
    <div class="row mt-2 mb-3">
        <div class="col md-auto input-group">
            <input id="search-in-user-editions-input" type="search" class="form-control" placeholder="Filtrar" />
            <span class="input-group-text bg-primary bg-gradient opacity-75">🔍</span>
        </div>
    </div>
    <table class="table table-striped w-100">
    <tr>
        <th>Edición</th>
        <th>Valoración global</th>
        ${student ? '<th>Valoración propia</th>': ''}
        ${student ? '<th>Nota</th>': ''}
        <th>Acciones</th>
    </tr>
    ${filasEdicionUsuario}
    </table>   
 `;
}

export function prepareAddUserToEditionModal(edition, role) {
    let bad = [...edition.teachers, ...edition.students];
    let candidates = Cm.getUsers({ role }).filter(o => bad.indexOf(o.id) == -1);
    let options = candidates.map(o => `<option value="${o.dni}">${o.name} (${o.dni})</option>`).join();
    return `
    <form class="row">
        <div class="col-md-auto">
            <select class="form-select" name="dni" required>
                ${options}
            </select>
        </div>
        <button style="display: none" type="submit">Invisible, sólo para validación</button>
    </form>
    `;
}

function generateRadio(value, spanStyleDict, prevValue) {
    return `
                <input class="form-check-input" type="radio" name="role" 
                    id="radio-${value}" value="${value}" required
                    ${prevValue && prevValue==value ?"checked":""}>
                <label class="form-check-label" for="radio-student">
                    <span class="${spanStyleDict[value]}">${value}</span></label>
                </label>    
    `
}

export function prepareAddOrEditUserModal(prev) {
    return `
    <form class="row g-3">
            <div class="col-md-12">
                <input type="text" class="form-control m-1" name="name" placeholder="Nombre" 
                ${prev?.name ? 'value="'+prev.name+'"' : ''} required>
            </div>

            <div class="col-md-8">
                <input type="email" class="form-control m-1" name="email" placeholder="email" 
                ${prev?.email ? 'value="'+prev.email+'"' : ''} required">
            </div>
            <div class="col-md-4">
                <input type="text" class="form-control m-1" name="dni" placeholder="DNI/NIE" 
                ${prev?.dni ? 'value="'+prev.dni+'"' : ''} pattern="[0-9]{8}[A-Z]" required>
            </div>
            <div class="col-md-12">
                <hr style="color: white;">
            </div>
            <div class="col-md-4 text-center">
                ${generateRadio(Cm.UserRole.STUDENT, roleClasses, prev?.role)}    
            </div>
            <div class="col-md-4 text-center">
                ${generateRadio(Cm.UserRole.TEACHER, roleClasses, prev?.role)}    
            </div>
            <div class="col-md-4 text-center">
                ${generateRadio(Cm.UserRole.ADMIN, roleClasses, prev?.role)}    
            </div>           
        <button style="display: none" type="submit">Invisible, sólo para validación</button>
    </form>
    `;
}

function generateOption(value, spanStyleDict, prevValue) {
    return `
                <option value="${value}" ${prevValue && prevValue==value ?"selected":""}>
                    <span class="${spanStyleDict[value]}">${value}</span>
                </option>
    `
}

export function prepareAddOrEditCourseModal(prev) {
    return `
    <form class="row g-3">
            <div class="col-md-12">
                <input type="text" class="form-control" name="name" placeholder="Nombre" 
                    ${prev?.name ? 'value="'+prev.name+'"' : ''} required>
            </div>

            <div class="col-md-12">
                <hr style="color: white;">
            </div>
            <div class="col-md-6">
                <select class="form-select" name="area" required> 
                    ${generateOption(Cm.CourseArea.INTERNET, areaClasses, prev?.area)}    
                    ${generateOption(Cm.CourseArea.OFFICE, areaClasses, prev?.area)}    
                    ${generateOption(Cm.CourseArea.IT, areaClasses, prev?.area)}    
                </select>
            </div>
            <div class="col-md-6">
                <select class="form-select" name="level" required> 
                    ${generateOption(Cm.CourseLevel.INITIATION, levelClasses, prev?.level)}    
                    ${generateOption(Cm.CourseLevel.GENERALIST, levelClasses, prev?.level)}    
                    ${generateOption(Cm.CourseLevel.SPECIALIST, levelClasses, prev?.level)}    
                </select>
            </div>
       <button style="display: none" type="submit">Invisible, sólo para validación</button>
    </form>
    `;
}