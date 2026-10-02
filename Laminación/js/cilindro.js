// cilindro.js
import { linespace, simetria, aplicarLuz } from './calculos.js';
import {graficarCilindroGenerico} from './grafica.js'

let n = 100; /* número de puntos */

function cilindro_AH(n, B, H, R, r, a) {
    let a_rad = (a / 180) * Math.PI;

    // 1. Centro del radio r (esquina inferior cóncava)
    let x_cr = B / 2;
    let y_cr = r;

    // 2. Centro del radio R (esquina superior convexa)
    let dy = H - R - r;
    let dx = dy * Math.tan(a_rad) + (R + r) / Math.cos(a_rad);
    let x_cR = x_cr - dx;
    let y_cR = H - R;

    // Puntos de tangencia geométricos exactos
    let xt1 = x_cR;                          // Fin recta superior plana
    let yt1 = H;

    let xt2 = x_cR + R * Math.sin(a_rad);    // Fin arco R / Inicio recta inclinada
    let yt2 = y_cR + R * Math.cos(a_rad);

    let xt3 = x_cr - r * Math.sin(a_rad);    // Fin recta inclinada / Inicio arco r
    let yt3 = y_cr - r * Math.cos(a_rad);

    let xt4 = x_cr;                          // Fin arco r (apoyo en y = 0)
    let yt4 = 0;

    let xt5 = (B / 2) + 30;                  // Prolongación plana horizontal
    let yt5 = 0;

    n = Math.max(n, Math.trunc(B));

    /* Tramo 1: Recta superior plana */
    let X1 = linespace(0, xt1, n);
    let Y1 = X1.map(() => yt1);

    /* Tramo 2: Arco R (esquina superior convexa) */
    let X2 = linespace(xt1, xt2, n);
    let Y2 = X2.map(x => y_cR + Math.sqrt(Math.max(0, R * R - Math.pow(x - x_cR, 2))));

    /* Tramo 3: Recta inclinada */
    let X3 = linespace(xt2, xt3, n);
    let Y3 = X3.map(x => yt2 + (yt3 - yt2) * ((x - xt2) / (xt3 - xt2)));

    /* Tramo 4: Arco r (esquina inferior cóncava) */
    let X4 = linespace(xt3, xt4, n);
    let Y4 = X4.map(x => y_cr - Math.sqrt(Math.max(0, r * r - Math.pow(x - x_cr, 2))));

    /* Tramo 5: Base plana exterior sobrante */
    let X5 = linespace(xt4, xt5, n);
    let Y5 = X5.map(() => yt5);

    return {
        X: X1.concat(X2, X3, X4, X5),
        Y: Y1.concat(Y2, Y3, Y4, Y5)
    };
}

document.addEventListener("DOMContentLoaded", () => {
    let B = 180;
    let H = 46;
    let a = 12;
    let R = 15;
    let r = 8;
    let valorLuz = 20;

    // 1. Obtener coordenadas base
    let AH = cilindro_AH(n, B, H, R, r, a);
    let AH_luz = aplicarLuz(AH, valorLuz);
    let AH_sim = simetria(AH);
    
    // 2. Crear el objeto cilindro genérico con sus coordenadas
    /*let AH_luz = aplicarLuz(AH_sim, valorLuz);*/

    // 3. Enviar a graficar
    graficarCilindroGenerico(AH_sim);
});


