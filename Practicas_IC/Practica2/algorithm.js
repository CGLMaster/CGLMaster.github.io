const tabla = [
    ["soleado", "caluroso", "alta", "falso", "no"],
    ["soleado", "caluroso", "alta", "verdad", "no"],
    ["nublado", "caluroso", "alta", "falso", "si"],
    ["lluvioso", "templado", "alta", "falso", "si"],
    ["lluvioso", "frio", "normal", "falso", "si"],
    ["lluvioso", "frio", "normal", "verdad", "no"],
    ["nublado", "frio", "normal", "verdad", "si"],
    ["soleado", "templado", "alta", "falso", "no"],
    ["soleado", "frio", "normal", "falso", "si"],
    ["lluvioso", "templado", "normal", "falso", "si"],
    ["soleado", "templado", "normal", "verdad", "si"],
    ["nublado", "templado", "alta", "verdad", "si"],
    ["nublado", "caluroso", "normal", "falso", "si"],
    ["lluvioso", "templado", "alta", "verdad", "no"],
];

const atributos = ["TiempoExterior", "Temperatura", "Humedad", "Viento"];

const rows = 14;

const array = ["TiempoExterior", "Temperatura", "Humedad", "Viento"];

// class atributos{
//     constructor(title){
//         this.title = title;
//         this.merito = 0;
//         this.clases = [];
//     }


// }

class clase {
    constructor(tipo,p,n){
        this.clase = tipo;
        this.cont = 1;
        this.p = p;
        this.n = n;
        this.r = 0;
    }
}

function info(p,n){
    console.log("P: " + p + " || N: " + n);
    if(p === 0){
        return -n*Math.log2(n);
    }
    else if(n === 0){
        return -p*Math.log2(p);
    }
    else{
        return -p*Math.log2(p)-n*Math.log2(n);
    }
}

function calculoMerito(pos){
    let lista = [];
    let clases = [];
    for(let i = 0; i < rows; i++){
        if(!lista.includes(tabla[i][pos])){
            lista.push(tabla[i][pos]);
            if(tabla[i][4] === "si"){
                clases.push(new clase(tabla[i][pos],1,0));
            }else{
                clases.push(new clase(tabla[i][pos],0,1));
            }
        }
        else{
            for(let c of clases){
                if(c.clase === tabla[i][pos]){
                    if(tabla[i][4] === "si"){
                        c.p = c.p + 1;
                    }else{
                        c.n = c.n + 1;
                    }
                    c.cont = c.cont +1;
                }
            }
        }
    }
    console.log(lista)
    let merito = 0;
    for(let c of clases){
        console.log("Cont: " + c.cont)
        let val = (c.cont/rows)*info((c.p/c.cont),(c.n/c.cont));
        console.log("Merito: " + val)
        console.log("===============================");
        merito = merito + val;
    }
    return merito;
}

function algorithm(){
    let meritos = [];
    for(let atributo of array){
        let i = 0;
        while(i < atributos.length){
            if(atributo === atributos[i]) break;
            i++;
        }
        meritos.push(calculoMerito(i));
    }
    console.log(meritos);
}