
let n=100; /* número de puntos*/


function linespace(x1, x2, n) {
    let X = [];
    let paso=(x2-x1)/(n-1)
    for (let i = 0; i < n; i++) {
        X.push(x1+i*paso);
    }
    return X;
}

function cilindro(n, B, a, r, R, H) {
    a_rad= a/180*Math.PI;
    let xcr= B/2+r*Math.cos(a_rad);
    let ycr= r;
    let xt1=xcr+R*Math.cos(a_rad);
    let yt1=H;
    let xt2=xt1+R*Math.cos(a_rad);
    let yt2=(H-R)+R*Math.sin(a_rad);
    let xt3=B/2;
    let yt3=r-r*Math.sin(a_rad);
    let xt4=B/2+r*Math.cos(a_rad);
    let yt4=yt3;
    let xcR= xcr-(H-R-r)*Math.tan(a_rad)-(R-r);
    let ycR= H-R;

    n=Math.max(n,Math.trunc(B));

    /* recta*/
    let X1=linespace(0, xt1, n);
    let Y1=[]
    for (let i = 1; i <= n; i++) {
        Y1.push(yt1);
    }

    /* curva radio R */
    let X2=linespace(xt1, xt2, n);
    let Y2=X2.map(x=>{ 
        return ycR+Math.sqrt(Math.max(0,R*R-Math.pow((x-xcR),2)));
    });

    /* Recta inclinada*/
    let X3=linespace(xt2,xt3,n);
    let Y3=X3.map(x=>{ 
        return r*(1-Math.sin(a_rad))-(1/Math.tan(a_rad))*(x-B/2);
    });

    /* curva radio r */
    let X4=linespace(xt3,xt4,n);
    let Y4=X4.map(x=>{
        return ycr+Math.sqrt(Math.max(0,r*r-Math.pow((x-xcR),2))); 
    });        

    let X_Total= X1.concat(X2,X3,X4);
    let Y_Total= Y1.concat(Y2,Y3,Y4);

    return{
        X: X_Total,
        Y: Y_Total
    };

}



function simetria(A){
    let X1 = A.X;
    let Y1 = A.Y;
    
    // Cuadrante 2 (X negativa, Y positiva) -> Espejo horizontal
    // Usamos .slice().reverse() para invertir el orden de los puntos y mantener la continuidad
    let X2 = X1.map(x => -x).slice().reverse();
    let Y2 = Y1.slice().reverse();

    // Cuadrante 3 (X negativa, Y negativa) -> Espejo diagonal
    let X3 = X2; 
    let Y3 = Y2.map(y => -y);

    // Cuadrante 4 (X positiva, Y negativa) -> Espejo vertical
    let X4 = X1.slice().reverse();
    let Y4 = Y1.map(y => -y).slice().reverse();


    let X_Total= X1.concat(X2,X3,X4);
    let Y_Total= Y1.concat(Y2,Y3,Y4);

    return{
        X: X_Total,
        Y: Y_Total
    };

}

// CORRECCIÓN: Envolvemos la inicialización de la gráfica en un evento 'DOMContentLoaded'
// Esto asegura que el HTML y el <canvas> ya existan en la página antes de que Chart.js intente buscarlos.
document.addEventListener("DOMContentLoaded", () => {
let AH = cilindro(100, 100, 10, 2, 15, 20 );
let AH_sim= simetria(AH);


const X = AH_sim.X;
const Y = AH_sim.Y;


/* Formateamos los datos para Chart.js
/* Chart.js en gráficas de tipo 'line' requiere un array de objetos {x: valor, y: valor} 
/* para que las curvas e inversiones de dirección se dibujen correctamente.*/
const datosGrafica = X.map((xVal, index) => ({ x: xVal, y: Y[index] }));

const ctx = document.getElementById("AH_graf").getContext("2d");
const AH_graf = new Chart(ctx, {
    type: "line", 
    data:{
        labels: X,
        datasets:[
            {
                label: 'AH', /*// Buena práctica: añadir una etiqueta al dataset*/
                data: datosGrafica, /*CORRECCIÓN: Pasamos los puntos mapeados {x, y}*/
                borderColor: 'blue', 
                backgroundColor: 'transparent', // Evita que el relleno tape otras líneas
                borderWidth: 1.5,
                pointRadius: 0 /* Oculta los puntos individuales para que la gráfica cargue rápido con 2000 datos*/

            }
        ]},
    options:{
        responsive: true,
        maintainAspectRatio: true, /* Mantiene la proporción geométrica de tu cilindro*/
        ascpectratio: 2, /*// OPTIMIZACIÓN: Forzamos la relación de aspecto del lienzo (ej. 2:1 o 1:1) */
        scales:{
             x: {
                type: 'linear', /* CORRECCIÓN: Obligatorio para que los valores de X negativos y positivos se ordenen geométricamente y no como texto*/
                position: 'bottom'
                },
            y: {
                beginAtZero: false 
                }
                } 
            }  
}); /*Cierre correcto del constructor de Chart*/
});
