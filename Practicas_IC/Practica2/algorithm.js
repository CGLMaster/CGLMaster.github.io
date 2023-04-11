// TABLA DEL EJERCICIO
var ejemplos = [];

// ATRIBUTOS DE LA TABLA
var Atributos = [];

// DIV GUARDADO INFROMACION HTML
const info = document.getElementById("info");

// TIPOS DE RESULTADOS A TENER
let tipoResultado = []

// CLASE NODO QUE CONTENDRA SU ATRIBUTO, SUS HIJOS Y EL VALOR EN CASO DE QUE SEA HOJA
class Nodo {
    constructor(atributo, hijos, valor) {
        this.atributo = atributo;
        this.hijos = hijos;
        this.valor = valor;
    }
}

// FUNCION QUE COMPRUEBA SI TODOS LOS EJEMPLOS TIENEN LA MISMA CLASE (JUEGO)
function tieneMismaClase(ejemplos, atributo_objetivo) {
    const clase = ejemplos[0][atributo_objetivo];
    console.log("Clase a comprobar: " + clase)
    for (let i = 0; i < ejemplos.length; i++) {
        if (ejemplos[i][atributo_objetivo] !== clase) {
            return false;
        }
    }
    return true;
}

// FUNCION PARA BUSCAR CUAL ES LA CLASE QUE APARECE CON MAYOR FRECUENCIA DE LOS EJEMPLOS
function clase_mas_comun(ejemplos, atributo_objetivo) {
    const frecuencias = {}; // Objeto que va a almacenar las frecuencias de "si" y de "no"
    for (const ejemplo of ejemplos) {
        const clase = ejemplo[atributo_objetivo];
        frecuencias[clase] = (frecuencias[clase] || 0) + 1; // --> Si existe ya esa frecuencia se añade uno, si no se inicializa a 0 y se añade 1
    }
    // Devolvemos la mayor frecuencia obtenida ("si" o "no")
    let max_frecuencia = -1;
    let clase_max_frecuencia = null;
    for (const clase in frecuencias) {
        if (frecuencias[clase] > max_frecuencia) {
            max_frecuencia = frecuencias[clase];
            clase_max_frecuencia = clase;
        }
    }
    return clase_max_frecuencia;
}

// FUNCION PARA DIVIDIR LA TABLA SEGUN LOS VALORES DE ATRIBUTO
function valoresDistintos(ejemplos, atributo) {
    const valores = new Set();
    for (const ejemplo of ejemplos) {
        valores.add(ejemplo[atributo]);
    }
    return valores;
}

// FUNCION PARA SABER LA ENTROPIA
function entropia(p, n) {
    console.log("P: " + p + " || N: " + n);
    if (p === 0) {
        return -n * Math.log2(n);
    }
    else if (n === 0) {
        return -p * Math.log2(p);
    }
    else {
        return -p * Math.log2(p) - n * Math.log2(n);
    }
}

// FUNCION PARA CALCULAR EL MERITO
function calculoMerito(atributo, ejemplos, atributo_objetivo, div) {
    let index = 0;
    while (index < Atributos.length) {
        if (atributo === Atributos[index]) break;
        index++;
    }
    console.log(atributo_objetivo);
    // Para evitar que se repitan valores de los ejemplos se utiliza un Set
    const valoresDistintos = new Set(ejemplos.map((e) => e[index]));
    let merito = 0;
    for (const valor of valoresDistintos) {
        const ejemplos_valor = ejemplos.filter((e) => e[index] === valor);
        const rows = ejemplos.length;

        console.log("Valor de " + atributo + ": " + valor)
        console.log("Nº de Filas: " + rows)
        ejemplos_valor.filter((e) => {
            console.log("Fila: " + e)
        })
        console.log(tipoResultado)
        // Guardamos en un objeto el contador de cantidad de ejemplos de este valor, la cantidad de positivos ("si") y de negativos ("no")
        const c = { cont: ejemplos_valor.length, p: ejemplos_valor.filter((e) => e[atributo_objetivo] === tipoResultado[1]).length, n: ejemplos_valor.filter((e) => e[atributo_objetivo] === tipoResultado[0]).length };
        const proporcion_ejemplos_valor = c.cont / rows;
        const info_ejemplos_valor = entropia(c.p / c.cont, c.n / c.cont);
        merito += proporcion_ejemplos_valor * info_ejemplos_valor;
    }
    console.log("Merito de " + atributo + ": " + merito);
    let p = document.createElement("p");
    p.setAttribute("id", index);
    p.classList.add("merito");
    p.innerText = "Mérito de " + atributo + ": " + merito;
    div.appendChild(p);
    console.log("======================================")
    return merito;
}

// FUNCION PARA VER CUAL ES EL ATRIBUTO CON MENOR MERITO
function indiceMinimo(array) {
    let indice_min = 0;
    console.log("Lista de todos los méritos: " + array)
    for (let i = 1; i < array.length; i++) {
        if (array[i] < array[indice_min]) {
            indice_min = i;
        }
    }
    return indice_min;
}

function ID3(ejemplos, atributos, atributo_objetivo, cont, subcont) {
    console.log(atributo_objetivo)
    let div = document.createElement('div');
    let fase = document.createElement('h1');
    if (cont === 1) {
        fase.innerHTML = "<span style='font-size: 80px;'>F</span>ase " + cont;
    }
    else {
        fase.innerHTML = "<span style='font-size: 80px;'>F</span>ase " + cont + "." + subcont;
    }
    div.appendChild(fase);
    // CASO BASE: si todos los ejemplos son de la misma clase, devolver una hoja con esa clase
    if (tieneMismaClase(ejemplos, atributo_objetivo)) {
        console.log("Todos los ejemplos tienen las mismas clases");
        return new Nodo(null, null, ejemplos[0][ejemplos[0].length - 1]);
    }

    // CASO BASE: si no quedan atributos para dividir, devolver una hoja con la clase más común
    if (atributos.length === 0) {
        console.log("No quedan atributos para dividir");
        return new Nodo(null, null, clase_mas_comun(ejemplos, ejemplos[0].length - 1));
    }

    // Calcular los méritos de cada atributo
    const meritos = atributos.map((a) => calculoMerito(a, ejemplos, ejemplos[0].length - 1, div));

    // Encontrar el atributo con menor mérito
    const indice_min_merito = indiceMinimo(meritos);
    console.log("Indice de menor merito: " + indice_min_merito);
    let lista = div.getElementsByClassName("merito");
    let num = 0;
    for (let c of lista) {
        if (num === indice_min_merito) {
            c.classList.add("elegido")
        }
        num = num + 1;
    }
    const atributo_min_merito = atributos[indice_min_merito];
    console.log("Atributo de menor merito: " + atributo_min_merito)

    info.appendChild(div);
    cont = cont + 1;

    let indiceAtributo = 0;
    while (indiceAtributo < Atributos.length) {
        if (atributo_min_merito === Atributos[indiceAtributo]) break;
        indiceAtributo++;
    }

    // Crear un nodo con el atributo con menor mérito
    const nodo = new Nodo(atributo_min_merito, {}, null);

    // Dividir los ejemplos según los valores del atributo con menor mérito
    const valores_atributo_min_merito = valoresDistintos(ejemplos, indiceAtributo);

    // CASO RECURSIVO
    for (const valor of valores_atributo_min_merito) {
        console.log("============================= NUEVO ===================================")
        console.log("Valor de " + atributo_min_merito + ": " + valor)
        const ejemplos_valor = ejemplos.filter((row) => row[indiceAtributo] === valor);
        console.log("Ejemplos de " + valor + ": " + ejemplos_valor)
        if (ejemplos_valor.length === 0) {
            nodo.hijos[valor] = new Nodo(null, null, clase_mas_comun(ejemplos, ejemplos[0].length - 1));
        } else {
            const atributos_restantes = atributos.filter((a) => a !== atributo_min_merito);
            console.log("Atributos restantes: " + atributos_restantes)
            subcont = subcont + 1;
            nodo.hijos[valor] = ID3(ejemplos_valor, atributos_restantes, atributo_objetivo, cont, subcont);
        }
    }

    return nodo;
}

// FUNCION PARA LEER LOS FICHEROS QUE GENERARAN LA TABLA
function lecturaFicheros() {

    const atributosInput = document.getElementById("atributosFile");
    const ejemplosInput = document.getElementById("ejemplosFile");

    if (!atributosInput.files[0] || !ejemplosInput.files[0]) {
        alert("Por favor seleccione los archivos que desea cargar.");
        return;
    }
    // LEEMOS LOS ATRIBUTOS
    const lectorAtributos = new FileReader();
    lectorAtributos.readAsText(atributosInput.files[0], "utf-8");
    lectorAtributos.onload = () => {
        const contenidoAtributos = lectorAtributos.result;
        Atributos = contenidoAtributos.trim().split(",");
        // LEEMOS LOS EJEMPLOS
        const lectorEjemplos = new FileReader();
        lectorEjemplos.readAsText(ejemplosInput.files[0], "utf-8");
        lectorEjemplos.onload = () => {
            const contenidoEjemplos = lectorEjemplos.result;
            const filas = contenidoEjemplos.trim().split("\n");
            ejemplos = filas.map((fila) => fila.trim().split(","));
            console.log(Atributos);
            console.log(ejemplos);
            tipoResultado = [];
            for (let i = 0; i < ejemplos.length; i++) {
                if (!tipoResultado.includes(ejemplos[i][ejemplos[0].length - 1])) {
                    tipoResultado.push(ejemplos[i][ejemplos[0].length - 1]);
                }
            }
            dibujar();
        };
    };
}

// FUNCION QUE SE ENCARGA DE REALIZAR EL ALGORITMO Y DIBUJAR EL ÁRBOL
function algorithm() {
    info.innerHTML = '';
    Atributos.pop();
    console.log("Ejemplos iniciales: " + ejemplos)
    let resultado = ID3(ejemplos, Atributos, ejemplos[0].length - 1, 1, 0);
    console.log(resultado);

    let estructura = recorrer_arbol(resultado);

    simple_chart_config.nodeStructure = estructura;

    try {
        let treant = new Treant(simple_chart_config);
    }
    catch (err) {
        console.error("Ocurrió un error al crear el diagrama:", error);
    }
}

function init(){
    ejemplos = [];
    Atributos = [];
    lecturaFicheros();
}

// FUNCION PARA REALIZAR LA CONFIGURACION DE LOS NODOS DEL ARBOL
function recorrer_arbol(nodo) {

    if (nodo.hijos == null) {

        let string = "";

        if (nodo.valor == tipoResultado[1]) {
            string = "+";
            c = 'si';
        }
        else {
            string = "-";
            c = 'no';
        }

        let a = {
            text: { name: string },
            HTMLclass: c
        }

        return a;

    }
    else {

        console.log(nodo.atributo);

        let a = {
            text: { name: nodo.atributo },
            HTMLclass: 'nodo'
        }

        let children = []


        Object.entries(nodo.hijos).forEach(entry => {


            let b = {
                text: { name: entry[0] },
                children: [recorrer_arbol(entry[1])],
                collapsable: false,
                connectors: {
                    type: "curve",
                    style: {
                        'stroke': '#186118',
                        'arrow-end': 'block-wide-long'
                    }
                },
            }


            children.push(b);

        })

        a.children = children;

        return a;

    }

}

// FUNCION PARA DIBUJAR LA TABLA
function dibujar() {
    const tableHTML = document.getElementById("tabla");
    tableHTML.innerHTML = '';

    let thead = document.createElement("thead");
    let trhead = document.createElement("tr");
    for (let i = 0; i < Atributos.length; i++) {
        let th = document.createElement("th");
        th.textContent = Atributos[i];
        trhead.appendChild(th);
    }
    thead.appendChild(trhead);

    let tbody = document.createElement("tbody");
    for (let i = 1; i < ejemplos.length; i++) {
        let tr = document.createElement("tr");
        for (let j = 0; j < Atributos.length; j++) {
            let td = document.createElement("td");
            if (j === 0) {
                td.classList.add("TExterior");
            }
            else if (j === Atributos.length - 1) {
                td.classList.add("jugar");
            }
            if (ejemplos[i][j] === tipoResultado[1]) {
                td.textContent = ejemplos[i][j].toUpperCase();
                td.classList.add("s");
            }
            else if (ejemplos[i][j] === tipoResultado[0]) {
                td.textContent = ejemplos[i][j].toUpperCase();
                td.classList.add("n");
            }
            else {
                td.textContent = ejemplos[i][j];
            }
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }

    tableHTML.appendChild(thead);
    tableHTML.appendChild(tbody);
}

simple_chart_config = {
    chart: {
        container: "#tree-simple",
        animateOnInit: true,
        node: {
            collapsable: true
        },

        connectors: {
            type: "curve",
            style: {
                'stroke': '#186118',
                "stroke-width": 2
            }
        },

        animation: {
            nodeAnimation: "easeOutBounce",
            nodeSpeed: 700,
            connectorsAnimation: "bounce",
            connectorsSpeed: 700
        }
    },

    nodeStructure: {

    }
};
