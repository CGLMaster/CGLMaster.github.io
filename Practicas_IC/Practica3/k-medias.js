
let centrosKmedias = [
    [4.6, 3.0, 4.0, 0.0],
    [6.8, 3.4, 4.6, 0.7]
];

let centrosKmediasAnteriores = [];

const B = 2;
const TOLERANCIA = 0.01;




//-------------------

let puntos = []

let puntoEjemplo = [];


// FUNCION PARA LEER LOS FICHEROS QUE GENERARAN LA TABLA
function lecturaFicherosKMedias() {

  const ejemplosInput = document.getElementById("ejemplosFileKMedias");

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

    puntos = ejemplos;

  };

}

function lecturaFicheroEjemploKMedias() {
  const ejemplosInput = document.getElementById("ejemploEjemploFileKMedias");

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

    puntoEjemplo = ejemplo;

  };
}


function d(i,j){

    let distancia = 0;

    puntos[j].forEach((elemento, e) => {

        distancia += Math.pow(puntos[j][e] - centrosKmedias[i][e], 2); 

    })

    return distancia;

}

function distanciaACentroAnterior(i){

    let distancia = 0;

    centrosKmedias[i].forEach((elemento, e) => {

        distancia += Math.pow(centrosKmedias[i][e] - centrosKmediasAnteriores[i][e], 2); 

    })

    distancia = Math.sqrt(distancia);

    return distancia;

}


function dEntrePuntos(punto1, punto2){

    let distancia = 0;

    punto1.forEach((elemento, e) => {

        distancia += Math.pow(punto1[e] - punto2[e], 2); 

    })

    return distancia;

}


function ejecutarKMedias() {

    // calcular matriz de grados de pertenencia

    // calcular los nuevos centros

    // comprobamos si hay que seguir iterando o no


    let hayQueSeguirIterando = true;
    
    while(hayQueSeguirIterando){
        
        // Calcular matriz de pertenencias
        let matrizPertenencias = [];
    
        puntos.forEach((punto,j)=>{
    
            let pertenencias = [];
    
            let denominadorPertenencia = 0;
            centrosKmedias.forEach((centro,i)=>{
                denominadorPertenencia += Math.pow(1/d(i,j), 1/(B-1));
            });
    
    
            centrosKmedias.forEach((centro,i)=>{
    
                let pertenencia = Math.pow(1/d(i,j), 1/(B-1)) / denominadorPertenencia;
    
                pertenencias.push(pertenencia);
            })
    
            matrizPertenencias.push(pertenencias);
    
        })
    
        console.log("matrizPertenencias", matrizPertenencias);
    
    
        // calcular los nuevos centros
    
        centrosKmediasAnteriores = [...centrosKmedias];
    
        centrosKmedias.forEach((centro,i)=>{
    
            let nuevoCentro = [];
    
            let denominadorNuevoCentro = 0;
    
            puntos.forEach((punto,j)=>{
                denominadorNuevoCentro += Math.pow(matrizPertenencias[j][i], B)
            });
    
            let elementos = puntos[0].length;
    
            for(let e = 0; e < elementos ; e++){
    
                let valorElemento = 0;
    
                puntos.forEach((punto,j)=>{
    
                    valorElemento += Math.pow(matrizPertenencias[j][i], B) * puntos[j][e]
    
                })
    
                valorElemento = valorElemento/denominadorNuevoCentro;
    
                nuevoCentro.push(valorElemento);
    
            }
    
            centrosKmedias[i] = nuevoCentro;
    
        })
        
        console.log("Nuevos centros", centrosKmedias);
    
    
    
        // comprobamos si hay que seguir iterando o no
    
    
        centrosKmedias.forEach((centro,i)=>{
    
            if(distanciaACentroAnterior(i) < TOLERANCIA){
                hayQueSeguirIterando = false;
            }
    
        });
    
        console.log("hayQueSeguirIterando", hayQueSeguirIterando);

    }

    console.log("Centros finales", centrosKmedias);



  
}

function ejecutarEjemploKMedias() {

    let indexCentroMasCercano = 0;
    let menorDistancia = dEntrePuntos(puntoEjemplo, centrosKmedias[0]);


    centrosKmedias.forEach((centro,i)=>{

        let distancia = dEntrePuntos(puntoEjemplo, centro);

        if(distancia < menorDistancia){

            menorDistancia = distancia;
            indexCentroMasCercano = i;
        }

    })

    let r = document.getElementById("resultado");
    r.textContent = "El ejemplo (" + puntoEjemplo + ") pertenece al centro (" + centrosKmedias[indexCentroMasCercano] + ") y está a una distancia de " + menorDistancia;
    console.log("Pertenece al centro", centrosKmedias[indexCentroMasCercano]);
    console.log("Distancia", menorDistancia);

}



