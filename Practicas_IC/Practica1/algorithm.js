"use strict;"
// COLUMNAS Y FILAS POR DEFECTO

let cols = 8;
let rows = 8;

// MATRIZ Y GRID

let matriz = new Array(rows);
let grid = document.getElementById("grid");

// NODO DE INICIO Y FINAL

let start;
let end;

// ARRAY DE LOS waypointS

let waypoints = [];

// COMPROBADOR DEL BOTON QUE ESTÁ ACTIVO

let addWallSeleccionado = false;
let buttonPared = document.getElementById("buttonPared");

let addPenaltySeleccionado = false;
let buttonPenalizacion = document.getElementById("buttonPenalizacion");

let inputPenalizacion = document.getElementById("inputPenalizacion");
let D = Math.round(Math.sqrt((4 * 4) + (4 * 4))) * 0.1;                 // Cálculo para obtnener el 10% de la diagonal, que va a ser el máximo a poder penalizar
inputPenalizacion.setAttribute("max", D);

let addStartSeleccionado = false;
let buttonInicio = document.getElementById("buttonInicio");

let addEndSeleccionado = false;
let buttonFinal = document.getElementById("buttonFinal");

let addWaypointSeleccionado = false;
let buttonWaypoint = document.getElementById("buttonWaypoint");

let addHeightSeleccionado = false;
let buttonHeight = document.getElementById("buttonHeight");
let mountainHeight = parseInt(document.getElementById("inputMountainHeight").value);
document.getElementById("inputMountainHeight").addEventListener("change", function () {
    mountainHeight = parseInt(this.value);
});
let planeHeight = parseInt(document.getElementById("inputHeight").value);
document.getElementById("inputHeight").addEventListener("change", function () {
    planeHeight = parseInt(this.value);
});

// CLASE DEL NODO QUE CONFORMA CADA CELDA

class node {

    constructor(id, x, y) {
        this.x = x;                                     // Posición de la columna
        this.y = y;                                     // Posición de la fila
        this.g = 0;                                     // Coste del nodo desde el inicio
        this.h = 0;                                     // Coste heuristico estimado hasta el final
        this.p = 0;                                     // Coste penalizacion
        this.f = 0;                                     // Coste total
        this.parent = undefined;                        // El nodo padre a este, es decir del que viene
        this.neighbors = [];                            // Array de los nodos vecinos al actual
        this.walkable = false;                          // si es accesible o no
        this.id = id;                                   // id del nodo
        this.inPath = false;                            // Inicializa el nodo como que no pertenece a la mejor ruta para llegar
        this.waypoint = false;                        // Indica si es un waypoint o no
        this.height = 0;                                // Indica la altura de ese nodo
        this.visited = false;                           // Comprueba si el nodo ha sido visitado
    }

    changeWalkable() {
        this.walkable = !this.walkable;
    }

    getValueF() {
        this.f = this.g + this.h + this.p;
        return this.f;
    }

    // COLOREAR CADA NODO

    createWall() {
        let nodo = document.getElementById(this.id);
        nodo.classList.add("createWall");
    }

    startNode() {
        let nodo = document.getElementById(this.id);
        nodo.classList.add("startNode");
    }

    endNode() {
        let nodo = document.getElementById(this.id);
        nodo.classList.add("endNode");
    }

    heightNode() {
        let nodo = document.getElementById(this.id);
        nodo.classList.add("heightNode");
    }

    pathNode(giro) {
        let nodo = document.getElementById(this.id);
        let clase = "";
        if (this !== end) {
            clase = "pathNode"
        }
        if (giro === "top") {
            nodo.innerHTML = "<img src='img/planeTop.png' class='" + clase + "' height='60'/>";
        }
        if (giro === "down") {
            nodo.innerHTML = "<img src='img/planeDown.png' class='" + clase + "' height='60'/>";
        }
        if (giro === "left") {
            nodo.innerHTML = "<img src='img/planeLeft.png' class='" + clase + "' height='60'/>";
        }
        if (giro === "right") {
            nodo.innerHTML = "<img src='img/planeRight.png' class='" + clase + "' height='60'/>";
        }
        if (giro === "topLeft") {
            nodo.innerHTML = "<img src='img/planeTopLeft.png' class='" + clase + "' height='60'/>";
        }
        if (giro === "topRight") {
            nodo.innerHTML = "<img src='img/planeTopRight.png' class='" + clase + "' height='60'/>";
        }
        if (giro === "downLeft") {
            nodo.innerHTML = "<img src='img/planeDownLeft.png' class='" + clase + "' height='60'/>";
        }
        if (giro === "downRight") {
            nodo.innerHTML = "<img src='img/planeDownRight.png' class='" + clase + "' height='60'/>";
        }
    }

    penaltyNode() {
        let nodo = document.getElementById(this.id);
        nodo.classList.add("createPenalty");
        this.p = parseInt(inputPenalizacion.value);
    }

    waypointNode() {
        let nodo = document.getElementById(this.id);
        nodo.classList.add("waypointNode");
    }

    // BÚSQUEDA DE CADA VECINO

    seeNeighbors() {
        if (this.x < rows - 1) {                        // Comprueba la posición de en su misma columna encima suyo
            this.neighbors.push(matriz[this.x + 1][this.y]);
        }
        if (this.x > 0) {                             // Comprueba la posición de en su misma columna debajo suyo
            this.neighbors.push(matriz[this.x - 1][this.y]);
        }
        if (this.y < cols - 1) {                        // Comprueba la posición de su misma fila a la derecha
            this.neighbors.push(matriz[this.x][this.y + 1]);
        }
        if (this.y > 0) {                             // Comprueba la posición de su misma fila a la izquierda
            this.neighbors.push(matriz[this.x][this.y - 1]);
        }
        if (this.x < rows - 1 && this.y < cols - 1) {     // Comprueba la diagonal superior derecha
            this.neighbors.push(matriz[this.x + 1][this.y + 1]);
        }
        if (this.x < rows - 1 && this.y > 0) {          // Comprueba la diagonal superior izquierda
            this.neighbors.push(matriz[this.x + 1][this.y - 1]);
        }
        if (this.x > 0 && this.y < cols - 1) {          // Comprueba la diagonal inferior derecha
            this.neighbors.push(matriz[this.x - 1][this.y + 1]);
        }
        if (this.x > 0 && this.y > 0) {               // Comprueba la diagonal inferior izquierda
            this.neighbors.push(matriz[this.x - 1][this.y - 1]);
        }
    }
}

// FUNCIÓN PARA OBTENER LA HEURISTICA DE UN NODO CON RESPCTO A OTRO

function heuristic(position0, position1) {
    let d1 = Math.abs(position1.x - position0.x);
    let d2 = Math.abs(position1.y - position0.y);

    return Math.sqrt(Math.pow(d1, 2) + Math.pow(d2, 2));
}

// FUNCIÓN PARA DIBUJAR EL GRID E INICIALIZAR LA MATRIZ

function draw() {
    for (let i = 0; i < rows; i++) {
        matriz[i] = new Array(cols);
    }

    let cont = 0;

    for (let i = 0; i < rows; i++) {
        let div = document.createElement("div");
        div.classList.add("row");

        for (let j = 0; j < cols; j++) {
            let s = "id_" + cont;
            matriz[i][j] = new node(s, i, j);

            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.setAttribute('id', s);

            cell.addEventListener('click', () => {

                // EN FUNCIÓN DEL BOTÓN ACTIVO, APLICARÁ UN EFECTO DISTINTO AL NODO

                let currentNode = matriz[i][j];
                console.log("Es muro: " + currentNode.walkable)
                let nodo = document.getElementById(currentNode.id);
                if (addWallSeleccionado) {
                    nodo.classList.remove("waypointNode");
                    currentNode.waypoint = false;
                    nodo.classList.remove("createPenalty");
                    currentNode.p = 0;
                    nodo.classList.remove("heightNode");
                    currentNode.height = 0;
                    if(nodo.classList.contains("startNode")){
                        nodo.classList.remove("startNode");
                        start = null;
                    }
                    if(nodo.classList.contains("endNode")){
                        nodo.classList.remove("endNode");
                        end = null;
                    }
                    if (!currentNode.walkable) {
                        currentNode.createWall();
                        currentNode.changeWalkable();
                    } else {
                        nodo.classList.remove("createWall");
                        currentNode.changeWalkable();
                    }
                }
                else if (addPenaltySeleccionado) {
                    nodo.classList.remove("createWall");
                    currentNode.walkable = false;
                    nodo.classList.remove("waypointNode");
                    currentNode.waypoint = false;
                    nodo.classList.remove("heightNode");
                    currentNode.height = 0;
                    if(nodo.classList.contains("startNode")){
                        nodo.classList.remove("startNode");
                        start = null;
                    }
                    if(nodo.classList.contains("endNode")){
                        nodo.classList.remove("endNode");
                        end = null;
                    }
                    if (currentNode.p === 0) {
                        currentNode.penaltyNode();
                        currentNode.getValueF();
                    }
                    else {
                        nodo.classList.remove("createPenalty");
                        currentNode.p = 0;
                        currentNode.getValueF();
                    }
                }
                else if (addStartSeleccionado) {
                    nodo.classList.remove("createWall");
                    currentNode.walkable = false;
                    nodo.classList.remove("waypointNode");
                    currentNode.waypoint = false;
                    nodo.classList.remove("createPenalty");
                    currentNode.p = 0;
                    nodo.classList.remove("heightNode");
                    currentNode.height = 0;
                    if(nodo.classList.contains("endNode")){
                        nodo.classList.remove("endNode");
                        end = null;
                    }
                    if (start !== currentNode) {
                        if (start !== null) {
                            let startNodo = document.getElementById(start.id);
                            startNodo.classList.remove("startNode");
                        }
                        currentNode.startNode();
                        start = currentNode;
                    }
                    else {
                        nodo.classList.remove("startNode");
                        start = null;
                    }
                }
                else if (addEndSeleccionado) {
                    nodo.classList.remove("createWall");
                    currentNode.walkable = false;
                    nodo.classList.remove("waypointNode");
                    currentNode.waypoint = false;
                    nodo.classList.remove("heightNode");
                    currentNode.height = 0;
                    if(nodo.classList.contains("startNode")){
                        nodo.classList.remove("startNode");
                        start = null;
                    }
                    if (end !== currentNode) {
                        if (end !== null) {
                            let endNodo = document.getElementById(end.id);
                            endNodo.classList.remove("endNode");
                        }
                        currentNode.endNode();
                        end = currentNode;
                    }
                    else {
                        nodo.classList.remove("endNode");
                        end = null;
                    }
                }
                else if (addWaypointSeleccionado) {
                    nodo.classList.remove("createWall");
                    currentNode.walkable = false;
                    nodo.classList.remove("createPenalty");
                    currentNode.p = 0;
                    nodo.classList.remove("heightNode");
                    currentNode.height = 0;
                    if(nodo.classList.contains("endNode")){
                        nodo.classList.remove("endNode");
                        end = null;
                    }
                    if(nodo.classList.contains("startNode")){
                        nodo.classList.remove("startNode");
                        start = null;
                    }
                    if (!currentNode.waypoint) {
                        currentNode.waypointNode();
                        currentNode.waypoint = true;
                        waypoints.push(currentNode);
                    }
                    else {
                        nodo.classList.remove("waypointNode");
                        currentNode.waypoint = false;
                        let resultado = waypoints.filter(n => n != currentNode);
                        waypoints = resultado;
                    }
                }
                else if (addHeightSeleccionado) {
                    nodo.classList.remove("createWall");
                    currentNode.walkable = false;
                    nodo.classList.remove("waypointNode");
                    currentNode.waypoint = false;
                    nodo.classList.remove("createPenalty");
                    currentNode.p = 0;
                    if(nodo.classList.contains("startNode")){
                        nodo.classList.remove("startNode");
                        start = null;
                    }
                    if(nodo.classList.contains("endNode")){
                        nodo.classList.remove("endNode");
                        end = null;
                    }
                    if (currentNode.height === 0) {
                        currentNode.height = mountainHeight;
                        currentNode.heightNode();
                    } else {
                        nodo.classList.remove("heightNode");
                        currentNode.height = 0;
                    }
                    console.log(currentNode.height)
                }

            })

            div.appendChild(cell);
            cont = cont + 1;
        }

        grid.appendChild(div);
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            matriz[i][j].seeNeighbors();
        }
    }
}

// DIBUJA TODOS LOS NODOS COMO PAREDES

function drawWalls(){
    for(let i = 0; i < rows; i++){
        for(let j = 0; j < cols; j++){
            if(start !== matriz[i][j] && end !== matriz[i][j]){
                matriz[i][j].changeWalkable();
                matriz[i][j].createWall();
            }
        }
    }
}

// INICIALIZA EL GRID CON UNAS PAREDES, UN NODO DE INICIO Y UNO FINAL TODO DE MANERA AELATORIA

function init() {
    draw();
    start = matriz[Math.floor(Math.random() * rows)][Math.floor(Math.random() * cols)];
    start.startNode();
    end = matriz[Math.floor(Math.random() * rows)][Math.floor(Math.random() * cols)];
    end.endNode();
    drawWalls();
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (matriz[i][j] !== start && matriz[i][j] !== end && matriz[i][j].walkable) {
            let rand = Math.random();
            if (rand > 0.3) {
              matriz[i][j].changeWalkable();
              let nodo = document.getElementById(matriz[i][j].id);
              nodo.classList.remove("createWall");
            }
          }
        }
    }
}

// RESETEA TODO EL GRID

function reset() {
    waypoints = [];
    grid.innerHTML = '';
    start = null;
    end = null;
    draw();
}

// RESETEA SOLO EL PATH GENERADO

function resetPath() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let nodo = document.getElementById(matriz[i][j].id);
            if (matriz[i][j].inPath) {
                nodo.innerHTML = "";
                nodo.style.backgroundImage = "";
                nodo.classList.remove("pathNode")
                matriz[i][j].inPath = false;
            }
            nodo.style.backgroundColor = "transparent";
        }
    }
}

// FUNCIÓN PARA REALIZAR EL ALGORITMO

async function findPath(start, end) {
    let openSet = [];
    openSet.push(start);
    document.getElementById(start.id).style.backgroundColor = "rgba(113, 255, 167, 0.6)";
    await new Promise(resolve => setTimeout(resolve, 5));
    let closeSet = [];
    while (openSet.length > 0) {
        // Ordena el conjunto abierto por el valor de f
        openSet.sort((a, b) => a.f - b.f);

        let currentNode = openSet.shift(); // Elimina el primer nodo del array
        document.getElementById(currentNode.id).style.backgroundColor = "rgba(113, 163, 255, 0.6)";
        await new Promise(resolve => setTimeout(resolve, 5));

        if (currentNode === end) {
            let path = [];
            let temp = currentNode;
            while (temp.parent) {
                path.unshift(temp); // Añade el nodo al inicio del array
                temp.inPath = true;
                console.log("ID:" + temp.id);
                console.log("Heuristic:" + temp.h);
                console.log("G:" + temp.g);
                console.log("P: " + temp.p);
                console.log("F: " + temp.f);
                console.log("---------------------------------");
                temp = temp.parent;
            }
            console.log("Encontrado un camino");
            return path;
        }

        // Agrega el nodo al conjunto cerrado
        closeSet.push(currentNode);

        let neighbors = currentNode.neighbors;

        for (let i = 0; i < neighbors.length; i++) {
            let neighbor = neighbors[i];

            // Saltea los nodos no caminables o los que están en el conjunto cerrado
            if (neighbor.walkable || closeSet.includes(neighbor) || neighbor.height > planeHeight) {
                continue;
            }
            // Calcula los valores de g, h y f para el vecino
            let gScore = 0;
            if (currentNode.x !== neighbor.x && currentNode.y !== neighbor.y) {   // Si es una de las diagonales el coste es raiz cuadrada de dos
                gScore = currentNode.g + Math.sqrt(2);
            }
            else {                                                               // Si no es 1
                gScore = currentNode.g + 1;
            }
            let hScore = heuristic(neighbor, end);
            let fScore = gScore + hScore + neighbor.p;

            if (!openSet.includes(neighbor)) {  // Agrega el vecino al conjunto abierto
                neighbor.g = gScore;
                neighbor.h = hScore;
                neighbor.f = fScore;
                neighbor.parent = currentNode;
                openSet.push(neighbor);
                document.getElementById(neighbor.id).style.backgroundColor = "rgba(113, 255, 167, 0.6)";
                await new Promise(resolve => setTimeout(resolve, 5));
            } else if (gScore < neighbor.g) {   // El vecino ya está en el conjunto abierto, pero esta es una mejor ruta
                neighbor.g = gScore;
                neighbor.h = hScore;
                neighbor.f = fScore;
                neighbor.parent = currentNode;
            }
        }
    }
    console.log("No se encontro camino");

    return null;
}

async function findPathWithWaypoints() {
    let path = [];
    let alert_container = document.getElementById("alert-container");
    resetPath();
    if (waypoints.length === 0) {
        path = await findPath(start, end);
    } else {
        let ini = start;
        for (let i = 0; i < waypoints.length; i++) {
            let waypoint = waypoints[i];
            let segmentPath = await findPath(ini, waypoint);
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    matriz[i][j].parent = null;
                }
            }
            if (segmentPath) {
                path = path.concat(segmentPath);
                ini = waypoint;
            } else {
                alert_container.innerHTML = "<div class='alert'><div class='icon__wrapper'><i class='bi bi-exclamation-triangle-fill'></i></div><p>El algoritmo no ha encontrado un camino al waypoint " + i +".</p></div>";
                window.setTimeout(function() {
                    $(".alert").fadeTo(500, 0).slideUp(500, function(){
                        $(this).remove(); 
                    });
                }, 2800);
                console.log("No se encontro camino al waypoint");
            }
        }
        let finalPathSegment = await findPath(ini, end);
        if (finalPathSegment) {
            path = path.concat(finalPathSegment);
        } else {
            alert_container.innerHTML = "<div class='alert'><div class='icon__wrapper'><i class='bi bi-exclamation-triangle-fill'></i></div><p>El algoritmo no ha encontrado un camino al nodo final.</p></div>";
            window.setTimeout(function() {
                $(".alert").fadeTo(500, 0).slideUp(500, function(){
                    $(this).remove(); 
                });
            }, 2800);
            console.log("No se encontro camino al nodo final");
        }
    }
    if (path !== null) {
        for (let i = -1; i < path.length; i++) {
            let tipo;
            if(i === -1){
                if (start.x === path[i + 1].x && start.y < path[i + 1].y) { tipo = "right" }
                if (start.x === path[i + 1].x && start.y > path[i + 1].y) { tipo = "left" }
                if (start.x < path[i + 1].x && start.y === path[i + 1].y) { tipo = "down" }
                if (start.x > path[i + 1].x && start.y === path[i + 1].y) { tipo = "top" }
                if (start.x < path[i + 1].x && start.y < path[i + 1].y) { tipo = "downRight" }
                if (start.x > path[i + 1].x && start.y < path[i + 1].y) { tipo = "topRight" }
                if (start.x < path[i + 1].x && start.y > path[i + 1].y) { tipo = "downLeft" }
                if (start.x > path[i + 1].x && start.y > path[i + 1].y) { tipo = "topLeft" }
                start.pathNode(tipo);
                document.getElementById(start.id).style.backgroundColor = "rgba(179, 113, 255, 0.6)";
                await new Promise(resolve => setTimeout(resolve, 400));
            }
            else{
                document.getElementById(path[i].id).style.backgroundColor = "rgba(179, 113, 255, 0.6)";
                if (end !== path[i]) {
                    if (path[i].x === path[i + 1].x && path[i].y < path[i + 1].y) { tipo = "right" }
                    if (path[i].x === path[i + 1].x && path[i].y > path[i + 1].y) { tipo = "left" }
                    if (path[i].x < path[i + 1].x && path[i].y === path[i + 1].y) { tipo = "down" }
                    if (path[i].x > path[i + 1].x && path[i].y === path[i + 1].y) { tipo = "top" }
                    if (path[i].x < path[i + 1].x && path[i].y < path[i + 1].y) { tipo = "downRight" }
                    if (path[i].x > path[i + 1].x && path[i].y < path[i + 1].y) { tipo = "topRight" }
                    if (path[i].x < path[i + 1].x && path[i].y > path[i + 1].y) { tipo = "downLeft" }
                    if (path[i].x > path[i + 1].x && path[i].y > path[i + 1].y) { tipo = "topLeft" }
                    path[i].pathNode(tipo);
                    await new Promise(resolve => setTimeout(resolve, 400));
                }
                else {
                    path[i].pathNode("top");
                }
            }
        }
    }
    else{   // En caso de que no se encuentre un camino, muetra una alerta
        alert_container.innerHTML = "<div class='alert'><div class='icon__wrapper'><i class='bi bi-exclamation-triangle-fill'></i></div><p>El algoritmo no ha podido encontrar una solución.</p></div>";
        window.setTimeout(function() {
            $(".alert").fadeTo(500, 0).slideUp(500, function(){
                $(this).remove(); 
            });
        }, 2800);
    }
}

// FUNCIÓN PARA CAMBIAR LAS DIMENSIONES

function dimensions() {
    let r = document.getElementById("inputRows").value;
    let c = document.getElementById("inputColumns").value;
    rows = r;
    cols = c;
    D = Math.round(Math.sqrt((r * r) + (c * c))) * 0.1;
    inputPenalizacion.setAttribute("max", D);
    grid.innerHTML = '';
    init();
}

// FUNCIONES PARA INDICAR QUE BOTÓN HA SIDO ACTIVADO

function desactivateAll(tipo) {

    let buttons = document.getElementById("container-botones").getElementsByClassName("button-active");
    for (let b of buttons) {
        b.classList.remove("button-active");
    }
    if (tipo === "wall") {
        addWallSeleccionado = !addWallSeleccionado;
        addPenaltySeleccionado = false;
        addStartSeleccionado = false;
        addEndSeleccionado = false;
        addWaypointSeleccionado = false;
        addHeightSeleccionado = false;
    } else if (tipo === "penalty") {
        addPenaltySeleccionado = !addPenaltySeleccionado;
        addWallSeleccionado = false;
        addStartSeleccionado = false;
        addEndSeleccionado = false;
        addWaypointSeleccionado = false;
        addHeightSeleccionado = false;
    } else if (tipo === "start") {
        addStartSeleccionado = !addStartSeleccionado;
        addWallSeleccionado = false;
        addPenaltySeleccionado = false;
        addEndSeleccionado = false;
        addWaypointSeleccionado = false;
        addHeightSeleccionado = false;
    } else if (tipo === "end") {
        addEndSeleccionado = !addEndSeleccionado;
        addWallSeleccionado = false;
        addPenaltySeleccionado = false;
        addStartSeleccionado = false;
        addWaypointSeleccionado = false;
        addHeightSeleccionado = false;
    } else if (tipo === "waypoint") {
        addWaypointSeleccionado = !addWaypointSeleccionado;
        addWallSeleccionado = false;
        addPenaltySeleccionado = false;
        addStartSeleccionado = false;
        addEndSeleccionado = false;
        addHeightSeleccionado = false;
    } else if (tipo === "height") {
        addHeightSeleccionado = !addHeightSeleccionado;
        addWaypointSeleccionado = false;
        addWallSeleccionado = false;
        addPenaltySeleccionado = false;
        addStartSeleccionado = false;
        addEndSeleccionado = false;
    }

}

function addWall() {

    desactivateAll("wall");

    if (addWallSeleccionado) {
        buttonPared.classList.add("button-active");
    }
    else {
        buttonPared.classList.remove("button-active");
    }

}

function addPenalty() {

    desactivateAll("penalty");

    if (addPenaltySeleccionado) {
        buttonPenalizacion.classList.add("button-active");
    }
    else {
        buttonPenalizacion.classList.remove("button-active");
    }

}

function addStart() {

    desactivateAll("start");

    if (addStartSeleccionado) {
        buttonInicio.classList.add("button-active");
    }
    else {
        buttonInicio.classList.remove("button-active");
    }
}

function addEnd() {

    desactivateAll("end");

    if (addEndSeleccionado) {
        buttonFinal.classList.add("button-active");
    }
    else {
        buttonFinal.classList.remove("button-active");
    }
}

function addWaypoint() {

    desactivateAll("waypoint");

    if (addWaypointSeleccionado) {
        buttonWaypoint.classList.add("button-active");
    }
    else {
        buttonWaypoint.classList.remove("button-active");
    }
}

function addHeight() {

    desactivateAll("height");

    if (addHeightSeleccionado) {
        buttonHeight.classList.add("button-active");
    }
    else {
        buttonHeight.classList.remove("button-active");
    }
}


document.getElementById("algorithm").addEventListener("click", function () {
    if (start === null || end === null) {
        let alert_container = document.getElementById("alert-container");
        alert_container.innerHTML = "<div class='alert'><div class='icon__wrapper'><i class='bi bi-exclamation-triangle-fill'></i></div><p>No se puede realizar el algoritmo si no tiene un inicio y un final.</p></div>";
        window.setTimeout(function() {
            $(".alert").fadeTo(500, 0).slideUp(500, function(){
                $(this).remove(); 
            });
        }, 2800);
    }
    else {
        findPathWithWaypoints();
    }
});

init();
