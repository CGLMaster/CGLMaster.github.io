let dataBayes = [];

let dataEjemploBayes = [];

let resultBayes = [];

let clases = [];

let modelo = [];

let clase = {
    nombre: '',
    puntos: []
}

// FUNCION PARA LEER LOS FICHEROS QUE GENERARAN LA TABLA
function lecturaFicherosBayes() {

    const ejemplosInput = document.getElementById("ejemplosFileBayes");

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

        ejemplos.map(
            (fila) => {
                if (!clases.includes(fila[fila.length - 1])) {
                    clases.push(fila[fila.length - 1])
                    let clase = {
                        nombre: fila[fila.length - 1],
                        puntos: []
                    }
                    fila.pop();
                    let nums = []
                    for (let n of fila) {
                        nums.push(n);
                    }
                    clase.puntos.push(nums);
                    dataBayes.push(clase);
                }
                else {
                    for (let d of dataBayes) {
                        if (d.nombre === fila[fila.length - 1]) {
                            fila.pop();
                            let nums = []
                            for (let n of fila) {
                                nums.push(n);
                            }
                            d.puntos.push(nums);
                        }
                    }
                }
            }
        )
        console.log(dataBayes);

    };

}

function lecturaFicheroEjemploBayes() {
    const ejemplosInput = document.getElementById("ejemploEjemploFileBayes");

    if (!ejemplosInput.files[0]) {
        alert("Por favor seleccione los archivos que desea cargar.");
        return;
    }


    const lectorEjemplos = new FileReader();
    lectorEjemplos.readAsText(ejemplosInput.files[0], "utf-8");
    lectorEjemplos.onload = () => {
        const contenidoEjemplos = lectorEjemplos.result;
        const filas = contenidoEjemplos.trim().split("\n");
        const ejemplo = filas.map((fila) => fila.trim().split(","));

        console.log(ejemplo);

        dataEjemploBayes = ejemplo;

    };
}

// FUNCION DE DISTRIBUCION ACUMULATIVA DE UNA DISTRIBUCION NORMAL
function cdf(x) {
    let t = 1 / (1 + 0.2316419 * Math.abs(x));
    let d = 0.3989423 * Math.exp(-x * x / 2);
    let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    if (x > 0) {
        p = 1 - p;
    }
    return p;
}

// FUNCION DE DENSIDAD DE PROBABILIDAD DE UNA DISTRIBUCION NORMAL
function probDensidad(x, media, desviacion) {
    const a = 1 / (desviacion * Math.sqrt(2 * Math.PI));
    const b = Math.exp(-0.5 * Math.pow((x - media) / desviacion, 2));
    return cdf(a * b);
}

// FUNCION PARA ENTRENAR EL MODELO
function entrenar() {
    modelo = {};

    // ME GUARDO EN LA VARIABLE DATA LOS MISMO MUESTREOS QUE EN DATABAYES PERO TENIENDO TAMBIEN LA CLASE A LA QUE CORRESPONDEN
    const data = [];
    for (let i = 0; i < dataBayes.length; i++) {
        const class_name = dataBayes[i].nombre;
        const points = dataBayes[i].puntos;
        for (let j = 0; j < points.length; j++) {
            const row = points[j].concat(class_name);
            data.push(row);
        }
    }

    // CALCULO LAS PROBABILIDADES Y LAS DISTRIBUCIONES DE PROBABILIDAD DE CADA CLASE
    const classes = [...new Set(dataBayes.map(obj => obj.nombre))]; // [...X] se utilizan para desempacar los valores de un iterable
    console.log(classes)
    for (let i = 0; i < classes.length; i++) {
        const class_name = classes[i];
        console.log("************** Clase: " + class_name + " **************")
        const class_data = data.filter(row => row[row.length - 1] === class_name);
        const class_prob = class_data.length / data.length;
        const distrib = [];

        // CALCULO DE LAS DISTRIBUCIONES PARA ESTA CLASE
        for (let j = 0; j < dataBayes[0].puntos[0].length; j++) {
            const distrib_data = class_data.map(row => parseFloat(row[j]));
            const media = distrib_data.reduce((a, b) => a + b) / distrib_data.length;
            console.log("Media " + j + ": " + media);
            const desviacion = Math.sqrt(distrib_data.map(x => Math.pow(x - media, 2)).reduce((a, b) => a + b) / distrib_data.length);
            console.log("Desviación estandar: " + desviacion);
            distrib.push({ media, desviacion });
            console.log("---------------------------------")
        }

        modelo[class_name] = { class_prob, distrib };
    }

    return modelo;
}

// FUNCION PARA COMPROBAR A QUE CLASE PERTENECE EL EJEMPLO
function ejecutarEjemploBayes() {
    console.log("======================================")
    const ejemplos = dataEjemploBayes;
    const numEjemplos = ejemplos.length;

    for (let i = 0; i < numEjemplos; i++) {
        const ejemplo = ejemplos[i];
        ejemplo.pop();
        console.log(ejemplo);
        const numCaract = ejemplo.length;
        console.log(numCaract);
        const class_probs = {};

        // CALCULAR LA PROBABILIDAD DE VER LAS CARACTERISTICAS DEL EJEMPLO EN CADA CLASE
        for (const class_name in modelo) {
            console.log("Clase: " + class_name);
            const class_data = modelo[class_name];
            const class_prob = class_data.class_prob;
            let probEjemplo = 1;

            for (let j = 0; j < ejemplo.length; j++) {
                const feature_value = ejemplo[j];
                const { media, desviacion } = class_data.distrib[j];
                const pdf = probDensidad(feature_value, media, desviacion);
                probEjemplo *= pdf;
            }
            console.log("Probabilidad de pertenecer a esa clase: " + class_prob)
            console.log("Probabilidad de ver las caracteristicas del ejemplo: " + probEjemplo)
            class_probs[class_name] = class_prob * probEjemplo;
        }
        console.log("Probabilidades obtenidas para cada clase:");
        console.log(class_probs);
        const predicted_class = Object.keys(class_probs).reduce((a, b) => class_probs[a] > class_probs[b] ? a : b);
        resultBayes.push({ ejemplo: ejemplo, clase: predicted_class, probabilidad: class_probs[predicted_class] });
    }
    console.log(resultBayes)
    let r = document.getElementById("resultado");
    r.textContent = "El ejemplo (" + resultBayes[0].ejemplo + ") pertenece a la clase " + resultBayes[0].clase + " con una probabilidad de " + resultBayes[0].probabilidad;
}

function ejecutarBayes() {
    modelo = entrenar();
    console.log(modelo);
}








