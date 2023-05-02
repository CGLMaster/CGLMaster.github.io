let dataLloyd = [];

let dataEjemploLloyd = [];

let centrosIniciales = [
    [4.6, 3.0, 4.0, 0.0, "Iris-setosa"],
    [6.8, 3.4, 4.6, 0.7, "Iris-versicolor"]
];

let tolerancia = Math.pow(10, -10);
let kMax = 10;
let razonAprendizaje = 0.1;

// FUNCION PARA LEER LOS FICHEROS QUE GENERARAN LA TABLA
function lecturaFicherosLloyd() {

    const ejemplosInput = document.getElementById("ejemplosFileLloyd");

    if (!ejemplosInput.files[0]) {
        alert("Por favor seleccione los archivos que desea cargar.");
        return;
    }


    const lectorEjemplos = new FileReader();
    lectorEjemplos.readAsText(ejemplosInput.files[0], "utf-8");
    lectorEjemplos.onload = () => {
        const contenidoEjemplos = lectorEjemplos.result;
        const filas = contenidoEjemplos.trim().split("\n");
        let ejemplos = filas.map((fila) => fila.trim().split(","));

        ejemplos.forEach(ejemplo => {
            ejemplo.pop()
        })

        console.log(ejemplos);

        dataLloyd = ejemplos;

    };


}

function lecturaFicheroEjemploLloyd() {
    const ejemplosInput = document.getElementById("ejemploEjemploFileLloyd");

    if (!ejemplosInput.files[0]) {
        alert("Por favor seleccione los archivos que desea cargar.");
        return;
    }


    const lectorEjemplos = new FileReader();
    lectorEjemplos.readAsText(ejemplosInput.files[0], "utf-8");
    lectorEjemplos.onload = () => {
        const contenidoEjemplos = lectorEjemplos.result;
        const ejemplo = contenidoEjemplos.trim().split(",");

        ejemplo.pop();

        console.log(ejemplo);

        dataEjemploLloyd = ejemplo;

    };
}

// FUNCION PARA CALCULAR LA DISTANCIA ENTRE DOS PUNTOS
function calculoDistancia(punto, clase) {
    let num = 0;
    for (let i = 0; i < punto.length; i++) {
        num = num + Math.pow((punto[i] - clase[i]), 2);
    }
    return Math.sqrt(num);
}

// FUNCION PARA CALCULAR LA DISTANCIA MINIMA ENTRE LAS OBTENIDAS
function calculoMinDistancia(distancias) {
    let minDist = distancias[0]
    let minPos = 0;
    for (let k = 1; k < distancias.length; k++) {
        if (distancias[k] < minDist) {
            minDist = distancias[k];
            minPos = k;
        }
    }
    return minPos;
}

// FUNCION PARA COPIAR ARRAYS
function copyArrays(centros){
    let nuevos = []
    for(let c of centros){
        let clase = [];
        for(let x of c){
            clase.push(x);
        }
        nuevos.push(clase);
    }
    return nuevos;
}

function ejecutarLloyd() {
    let ite = 0;
    let parar = false;
    while (ite < kMax && !parar) {
        let nuevosCentros = copyArrays(centrosIniciales);
        for (let i = 0; i < dataLloyd.length; i++) {
            let punto = dataLloyd[i];
            let distancias = [];
            for (let j = 0; j < nuevosCentros.length; j++) {
                let clase = nuevosCentros[j];
                distancias.push(calculoDistancia(punto, clase));
            }
            let minPos = calculoMinDistancia(distancias);

            let claseActualizar = nuevosCentros[minPos];
            for (let l = 0; l < punto.length; l++) {
                nuevosCentros[minPos][l] = claseActualizar[l] + razonAprendizaje * (punto[l] - claseActualizar[l]);
            }
        }
        console.log(nuevosCentros)
        let todosMasTolerancia = true;
        for(let i = 0; i < nuevosCentros.length; i++){
            let nuevo = nuevosCentros[i].slice(0,3);
            console.log("Nuevo", nuevo);
            let antiguo = centrosIniciales[i].slice(0,3);
            console.log("Antiguo", antiguo);
            if(calculoDistancia(nuevo, antiguo) >= tolerancia){
                todosMasTolerancia = false;
            }
        }
        if (todosMasTolerancia) {
            console.log("Se para por la tolerancia")
            parar = true;
        }
        centrosIniciales = nuevosCentros;
        console.log("Iteración " + ite)
        ite = ite + 1;
    }
    console.log("Centros iniciales");
    console.log(centrosIniciales)
}

function ejecutarEjemploLloyd() {
    let distancias = [];
    for (let i = 0; i < centrosIniciales.length; i++) {
        let centroide = centrosIniciales[i];
        let distancia = 0;
        for (let j = 0; j < centroide.length - 1; j++) {
            console.log("Data: " + dataEjemploLloyd[j])
            console.log("Centroide: " + centroide[j])
            distancia = distancia + Math.pow(dataEjemploLloyd[j] - centroide[j], 2);
        }
        distancias.push(Math.sqrt(distancia));
    }
    console.log(distancias)
    let clase = 0;
    let menor = distancias[0];
    for(let d of distancias){
        if(d < menor){
            clase = distancias.indexOf(d);
            menor = d;
        }
    }
    console.log(clase)
    console.log(menor)
    let size = centrosIniciales[clase].length - 1;
    console.log(`El punto ${dataEjemploLloyd} pertenece a la clase ${centrosIniciales[clase][size]}`);
    let r = document.getElementById("resultado");
    r.textContent = "El punto " + dataEjemploLloyd + " pertenece a la clase " + centrosIniciales[clase][size];
}

