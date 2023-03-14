"use strict"

import * as Cm from './cmapi.js'
import * as U from './util.js'

/**
 * Para las prácticas de IU, pon aquí (o en otros js externos incluidos desde tus .htmls) el código
 * necesario para añadir comportamientos a tus páginas.
 *
 * Este fichero, `eventos.js`, contiene código para asociar comportamientos a acciones.
 *
 * Fuera de las prácticas, lee la licencia: dice lo que puedes hacer con él:
 * lo que quieras siempre y cuando
 * - no digas que eres el autor original
 * - no me eches la culpa si algo no funciona como esperas
 *
 * @Author manuel.freire@fdi.ucm.es
 */

export function bindDetails(clickSelector, detailsSelector, htmlGenerationFn, listenersFn) {
    U.all(clickSelector).forEach(o => o.addEventListener('click', e => {
        const id = e.target.dataset.id || e.target.closest("tr").dataset.id;
        console.log(e, id);
        U.one(detailsSelector).innerHTML = htmlGenerationFn(id);
        listenersFn(id);
    }))
}


export function bindRmFromEdition(clickSelector, callback) {
    U.all(clickSelector).forEach(o => o.addEventListener('click', function() {
        let id = $(clickSelector).val();
        console.log(id);
        let array = id.split('&');
        const edition = Cm.resolve(array[1]);
        edition.students = edition.students.filter(o => o != array[0]);
        edition.teachers = edition.students.filter(o => o != array[0]);
        Cm.setEdition(edition);
        let rows = document.getElementsByClassName('user-edition-table-row');
        for(let r of rows){
            if(r.dataset.user === array[0] && r.dataset.edition === array[1]){
                r.remove();
            }
        }
        callback();
    }));
    
}

export function bindRmEditionDetails(clickSelector, callback) {
    U.one(clickSelector).addEventListener('click', e => {
        const id = e.target.dataset.id;
        console.log(e, id);
        Cm.rmEdition(id);
        callback();
    });
}

export function bindAddEditionToCourse(clickSelector, callback) {
    U.all(clickSelector).forEach(o => o.addEventListener('click', e => {
        const id = e.target.closest("tr").dataset.id;
        const year = e.target.dataset.year;
        console.log(e, id, year);
        Cm.addEdition(Cm.resolve(id), year);
        callback();
    }));
}

export function bindRmCourseRow(tableSel, id) {
    document.querySelectorAll(tableSel + ' input[type=checkbox]').forEach(o =>{
        let row = o.closest("tr");
        let idR = row.dataset.id;
        if(idR === id){
            Cm.rmUser(id);
            row.remove();
        }
    });
}

export function bindRmUserRow(tableSel, id) {
    document.querySelectorAll(tableSel + ' input[type=checkbox]').forEach(o =>{
        let row = o.closest("tr");
        let idR = row.dataset.id;
        if(idR === id){
            Cm.rmUser(id);
            row.remove();
        }
    });
}


export function bindAddUserToEdition(clickSelector, formTitleSelector, formSelector, formAcceptSelector,
    modalFn, formTitleFn, formContentsFn, callback) {

    U.one(clickSelector).addEventListener('click', e => {
        const id = e.target.dataset.id;
        console.log(e, id);
        const edition = Cm.resolve(id);

        modalFn().show();
        const form = U.one(formSelector);
        U.one(formTitleSelector).innerHTML = formTitleFn(edition);
        form.innerHTML = formContentsFn(edition);
        const acceptButton = U.one(formAcceptSelector);
        const acceptListener = ae => {
            const dniInput = form.querySelector("select[name=dni]");
            console.log(dniInput, dniInput.value);
            const dni = dniInput.value;
            const candidates = Cm.getUsers({ dni });
            if (candidates.length == 1) {
                candidates[0].role == Cm.UserRole.STUDENT ?
                    edition.students.push(candidates[0].id) :
                    edition.teachers.push(candidates[0].id);
                Cm.setEdition(edition);
                modalFn().hide();
                acceptButton.removeEventListener('click', acceptListener);
                callback();
            } else {
                // show errors by clicking hidden submit button only if there *are* errors
                dniInput.setCustomValidity("No hay nadie con ese DNI");
                form.querySelector("button[type=submit]").click()
            }
        }
        acceptButton.addEventListener('click', acceptListener);
    });
};

export function bindAddOrEditUser(clickSelector, formTitleSelector, formSelector, formAcceptSelector,
    modalFn, formTitleFn, formContentsFn, callback) {

    U.all(clickSelector).forEach(o => o.addEventListener('click', e => {
        const id = e.target.closest("tr") ?
            e.target.closest("tr").dataset.id :
            undefined;
        const user = id ? Cm.resolve(id) : undefined;

        console.log(e, user);
        modalFn().show();
        const form = U.one(formSelector);
        U.one(formTitleSelector).innerHTML = formTitleFn(user);
        form.innerHTML = formContentsFn(user);
        const acceptButton = U.one(formAcceptSelector);
        const acceptListener = ae => {
            const dniInput = form.querySelector("input[name=dni]");

            dniInput.setCustomValidity(U.isValidDni(dniInput.value) ?
                "" : "DNI inválido");

            console.log(dniInput, dniInput.value, U.generateDni(dniInput.value.substring(0, 8)));
            if (form.checkValidity()) {
                const u = new Cm.User(id || -1,
                    form.querySelector("input[name=dni]").value,
                    form.querySelector("input[name=name]").value,
                    form.querySelector("input[name=email]").value,
                    form.querySelector("input[name=role]:checked").value, // sin ':checked' falla
                )
                if (id) { Cm.setUser(u); } else { Cm.addUser(u); }
                modalFn().hide();
                acceptButton.removeEventListener('click', acceptListener);
                callback();
            } else {
                // show errors by clicking hidden submit button only if there *are* errors
                form.querySelector("button[type=submit]").click()
            }
        };
        acceptButton.addEventListener('click', acceptListener);
    }));
};

export function bindAddOrEditCourse(clickSelector, formTitleSelector, formSelector, formAcceptSelector,
    modalFn, formTitleFn, formContentsFn, callback) {

    U.all(clickSelector).forEach(o => o.addEventListener('click', e => {
        const id = e.target.closest("tr") ?
            e.target.closest("tr").dataset.id :
            undefined;
        const course = id ? Cm.resolve(id) : undefined;

        console.log(e, course);
        modalFn().show();
        const form = U.one(formSelector);
        U.one(formTitleSelector).innerHTML = formTitleFn(course);
        form.innerHTML = formContentsFn(course);
        const acceptButton = U.one(formAcceptSelector);
        const acceptListener = ae => {
            if (form.checkValidity()) {
                const c = new Cm.Course(id || -1,
                    form.querySelector("input[name=name]").value,
                    form.querySelector("select[name=area]").value,
                    form.querySelector("select[name=level]").value
                )
                if (id) { Cm.setCourse(c); } else { Cm.addCourse(c); }
                modalFn().hide();
                acceptButton.removeEventListener('click', acceptListener);
                callback();
            } else {
                // show errors by clicking hidden submit button only if there *are* errors
                form.querySelector("button[type=submit]").click()
            }
        };
        acceptButton.addEventListener('click', acceptListener);
    }));
};

export function bindSearch(inputSelector, rowSelector) {
    const input = U.one(inputSelector);
    if (input == null) {
        return;
    }
    input.addEventListener("input", e => {
        const v = e.target.value.toLowerCase();
        if (!v) {
            U.all(rowSelector).forEach(row => row.style.display = '');
        } else {
            U.all(rowSelector).forEach(row => {
                const o = row.innerText.toLowerCase();
                row.style.display = o.indexOf(v) != -1 ? '' : 'none';
            });
        }
    })
}

function stopEditingPreviousResults(callback) {
    const gradeInput = U.one("#grade-input");
    const ratingInput = U.one("#rating-select");
    if (gradeInput && ratingInput) {
        gradeInput.parentElement.innerText = gradeInput.value || '?';
        ratingInput.parentElement.innerText = ratingInput.value || '?';
        callback();
    }
}

export function bindSetResults(clickSelector, callback) {
    U.all(clickSelector).forEach(o => o.addEventListener('click', e => {
        const row = e.target.closest("tr");

        const ratingCell = row.querySelector(".ed-rating");
        let ratingValue = ratingCell.innerText;
        ratingCell.innerHTML = `
        <select class="form-select" id='rating-select'>
            <option value="1" ${ratingValue == 1 ? "selected" : ""}>⭐</option>
            <option value="2" ${ratingValue == 2 ? "selected" : ""}>⭐⭐</option>
            <option value="3" ${ratingValue == 3 ? "selected" : ""}>⭐⭐⭐</option>
            <option value="4" ${ratingValue == 4 ? "selected" : ""}>⭐⭐⭐⭐</option>
            <option value="5" ${ratingValue == 5 ? "selected" : ""}>⭐⭐⭐⭐⭐</option>
        </select>
        `;

        const gradeCell = row.querySelector(".ed-grade");
        let gradeValue = gradeCell.innerText;
        gradeCell.innerHTML = `
        <input class="form-input" id='grade-input' 
            size="3" type="number" value="${gradeValue == '?' ? "" : gradeValue}"/>
        `;

        // handle lost focus
        row.querySelectorAll("select,input").forEach(e => e.addEventListener("blur",
            () => stopEditingPreviousResults(callback)));

        // handle a change
        row.querySelectorAll("select,input").forEach(e => e.addEventListener("input", ae => {
            const grade = U.one("#grade-input").value || null;
            const rating = U.one("#rating-select").value || null;
            const result = new Cm.Result(-1,
                row.dataset.editionId,
                row.dataset.studentId,
                grade,
                rating
            )
            Cm.setResult(result);
        }));
    }));
}

export function bindSortColumn(clickSelector) {
    U.all(clickSelector).forEach(o => o.addEventListener('click', e => {
        const th = e.target;
        const table = th.closest('table');

        // devuelve el valor en la columna i-esima
        // ver https://stackoverflow.com/a/49041392/15472
        const valueAt = (row, i) => row.children[i].innerText || row.children[i].textContent;

        // devuelve una función de comparación para 2 elementos, sobre col. idx, creciente o no (asc)
        const comparador = (idx, asc) => (a, b) => ((v1, v2) =>
            v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ?
            v1 - v2 :
            v1.toString().localeCompare(v2)
        )(valueAt(asc ? a : b, idx), valueAt(asc ? b : a, idx));

        // comprueba y actualiza asc (ascendente)
        let asc = th.dataset.asc || 0;
        th.setAttribute("data-asc", asc == 0 ? 1 : 0)

        // reordena las filas y almacena la ordenación para la siguiente iteración
        Array.from(table.querySelectorAll('tr:nth-child(n+2)'))
            .sort(comparador(Array.from(th.parentNode.children).indexOf(th), asc == 1))
            .forEach(tr => table.appendChild(tr));

    }));

}

export function alternaBusquedaAvanzadaUsuarios(selBoton, selNormal, selAvanzada) {
    //console.log(selBoton, selNormal, selAvanzada);
    const avanzado = document.querySelector(selAvanzada);
    let normal = document.querySelector(selNormal);
    if(!normal) return;
    else normal = normal.parentElement;
    document.querySelector(selBoton)
        .addEventListener('click', e => {
            const visible = avanzado.style.display != 'none';
            avanzado.style.display = visible ? 'none' : '';
            normal.style.display = visible ? '' : 'none';
        });
    avanzado.style.display = 'none';
}

export function advancedUserFilter(filterSel, rowSel) {
    const filterDiv = document.querySelector(filterSel);
    const name = filterDiv.querySelector("input[name=name]").value.toLowerCase();
    const dni = filterDiv.querySelector("input[name=dni]").value.toLowerCase();
    const email = filterDiv.querySelector("input[name=email]").value.toLowerCase();
    const role = filterDiv.querySelector("select[name=role]").value.toLowerCase();
    
    const valueAt = (row, i) => row.children[i].innerText || row.children[i].textContent;
    
    for (let r of document.querySelectorAll(rowSel)) {
        let ok = true;
        for (let [f, col] of 
            [[name, 1], [email, 3], [dni, 4], [role, 2]]) {
                if (f == '' || ! ok) continue;
                const v = valueAt(r, col).toLowerCase();
                console.log(v, f, col, v.indexOf(f));
                if (v.indexOf(f) == -1) ok = false;
        }
        r.style.display = ok ? '' : 'none';
    }
}

export function advancedCourseFilter(filterSel, rowSel) {
    const filterDiv = document.querySelector(filterSel);
    const name = filterDiv.querySelector("input[name=name]").value.toLowerCase();
    const area = filterDiv.querySelector("select[name=area]").value.toLowerCase();
    const nivel = filterDiv.querySelector("select[name=nivel]").value.toLowerCase();
    const anio = filterDiv.querySelector("select[name=anio]").value.toLowerCase();
    // const valoration = filterDiv.querySelector("input[name=valoration]").value.toLowerCase();
    
    const valueAt = (row, i) => row.children[i].innerText || row.children[i].textContent;
    
    for (let r of document.querySelectorAll(rowSel)) {
        let ok = true;
        for (let [f, col] of 
            [[name, 1], [area, 2], [nivel, 3], [anio, 4]]) {
                if (f == '' || ! ok) continue;
                const v = valueAt(r, col).toLowerCase();
                console.log(v, f, col, v.indexOf(f));
                if (v.indexOf(f) == -1) ok = false;
        }
        r.style.display = ok ? '' : 'none';
    }
}

export function advancedStudentFilter(filterSel, rowSel) {
    const filterDiv = document.querySelector(filterSel);
    const name = filterDiv.querySelector("input[name=name]").value.toLowerCase();
    const dni = filterDiv.querySelector("input[name=dni]").value.toLowerCase();
    const correo = filterDiv.querySelector("input[name=email]").value.toLowerCase();
    const nota = filterDiv.querySelector("select[name=note]").value.toLowerCase();
    
    const valueAt = (row, i) => row.children[i].innerText || row.children[i].textContent;
    
    for (let r of document.querySelectorAll(rowSel)) {
        let ok = true;
        for (let [f, col] of 
            [[name, 1], [correo, 2], [dni, 3], [nota, 4]]) {
                if (f == '' || ! ok) continue;
                const v = valueAt(r, col).toLowerCase();
                console.log(v, f, col, v.indexOf(f));
                if (v.indexOf(f) == -1) ok = false;
        }
        r.style.display = ok ? '' : 'none';
    }
}

export function deleteAll(tableSel, val) {
    document.querySelectorAll(tableSel + ' input[type=checkbox]').forEach(o =>{
        if ( ! o.checked) return;
        if(val === "U"){
            const row = o.closest("tr");
            console.log(row);
            const id = row.dataset.id;
            console.log(id);
            if(id !== undefined){
                Cm.rmUser(id);
                row.remove();
            }
        }
        else if(val === "C"){
            const row = o.closest("tr");
            console.log(row);
            const id = row.dataset.id;
            console.log(id);
            if(id !== undefined){
                Cm.rmCourse(id);
                row.remove();
            }
        }
        else{
            const row = o.closest("tr");
            const id = row.dataset.id;
            console.log(id);
            if(id !== undefined){
                console.log(id);
                var array = id.split('&');
                const userId = array[0];
                const editionId = array[1];
                console.log(userId, editionId);
                const edition = Cm.resolve(editionId);
                console.log(edition);
                edition.students = edition.students.filter(o => o != userId);
                edition.teachers = edition.teachers.filter(o => o != userId);
                Cm.setEdition(edition);
                row.remove();
            }
        }
    });
}

export function matriculateUsers(tableSel, idEdition) {
    const edition = Cm.resolve(idEdition);
    document.querySelectorAll(tableSel + ' input[type=checkbox]').forEach(o =>{
        if ( ! o.checked) return;
        const row = o.closest("tr");
        const id = row.dataset.id;
        const user = Cm.getUser(id);
        console.log(user);
        if (user.role == Cm.UserRole.STUDENT) {
            edition.students.push(user.id)
        } else {
            edition.teachers.push(user.id)
        }
    });
    Cm.setEdition(edition);
}
/**
 * Añade manejo de columna de selección a una tabla.
 * 
 * La tabla debe tener un checkbox de cabecera, y otro por fila, con el siguiente formato:
 *         <th><input type="checkbox" name="toggle"/></td>
 * 
 *         <td><input type="checkbox" value="${user.id}" name="users"/></td>
 *
 * Cada vez que se cambie un checkbox, se enviará un evento de tipo evtName, capturable via
 *       table.addEventListener(evtName, e => console.log(e.detail))
 * También se podrá consultar la lista de seleccionados en table.dataset.selected
 * 
 * @param {*} selTabla 
 * @param {*} evtName 
 */
 export function bindCheckboxColumn(selTabla, evtName) {
    const table = U.one(selTabla);
    const toggle = table.querySelector("input[name=toggle]");
    const rows = table.querySelectorAll('tr:nth-child(n+2)');

    const visibleAndSelected = () => {
        const visibleRows = [...rows].filter(r => r.style.display != 'none');
        const checkedRows = visibleRows
            .map(o => o.querySelector('input[type=checkbox]'))
            .filter(r => r.checked);
        table.dataset.selected = JSON.stringify(checkedRows.map(o => o.value));
        if (evtName) table.dispatchEvent(new CustomEvent(evtName, { detail: table.dataset.selected }));
        // lanza un evento que se puede capturar a partir de la tabla, escuchando por evtName
        // ver https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events        
        return [visibleRows, checkedRows];
    }

    const updateToggleState = () => {
        const [visibleRows, checkedRows] = visibleAndSelected()
            // ver https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox
        if (checkedRows.length == 0) {
            toggle.checked = false;
            toggle.indeterminate = false;
        } else if (checkedRows.length == visibleRows.length) {
            toggle.checked = true;
            toggle.indeterminate = true;
        } else {
            toggle.checked = false;
            toggle.indeterminate = true;
        }
    }

    toggle.addEventListener('change', (e) => {
        rows.forEach(row => {
            if (row.style.display != 'none') {
                row.querySelector('input[type=checkbox]').checked = toggle.checked;
            }
        })
        visibleAndSelected()
    });

    rows.forEach(o => o
        .querySelector('input[type=checkbox]')
        .addEventListener('change', o => {
            updateToggleState()
        }))


    // EJEMPLO DE CAPTURA DE EVENTO DE CAMBIO DE SELECCION - usalo en tu código
    if (evtName) table.addEventListener(evtName, e => console.log(e.detail));
}
