/* cilindro.js*/
import { linespace } from './calculos.js';

export function cilindro_AH(n, B, H, R, r, a) {
    let a_rad = (a / 180) * Math.PI;

    let x_cr = B / 2;
    let y_cr = r;

    let dy = H - R - r;
    let dx = dy * Math.tan(a_rad) + (R + r) / Math.cos(a_rad);
    let x_cR = x_cr - dx;
    let y_cR = H - R;

    let xt1 = x_cR;
    let yt1 = H;

    let xt2 = x_cR + R * Math.sin(a_rad);
    let yt2 = y_cR + R * Math.cos(a_rad);

    let xt3 = x_cr - r * Math.sin(a_rad);
    let yt3 = y_cr - r * Math.cos(a_rad);

    let xt4 = x_cr;
    let yt4 = 0;

    let xt5 = (B / 2) + 30;
    let yt5 = 0;

    n = Math.max(n, Math.trunc(B/2));

    let X1 = linespace(0, xt1, n);
    let Y1 = X1.map(() => yt1);

    let X2 = linespace(xt1, xt2, n);
    let Y2 = X2.map(x => {
        let val = R * R - Math.pow(x - x_cR, 2);
        return y_cR + Math.sqrt(Math.max(0, val));
    });

    let X3 = linespace(xt2, xt3, n);
    let Y3 = X3.map(x => yt2 + (yt3 - yt2) * ((x - xt2) / (xt3 - xt2)));

    let X4 = linespace(xt3, xt4, n);
    let Y4 = X4.map(x => {
        let val = r * r - Math.pow(x - x_cr, 2);
        return y_cr - Math.sqrt(Math.max(0, val));
    });

    let X5 = linespace(xt4, xt5, n);
    let Y5 = X5.map(() => yt5);

    return {
        X: [].concat(X1, X2, X3, X4, X5),
        Y: [].concat(Y1, Y2, Y3, Y4, Y5)
    };
}


export function cilindro_ovalo(n, B, H, R, r_fijo) {
    n = Math.max(n, 25);
    let x_final = B / 2.0;

    // 1. Control de seguridad geométrica
    if (R < x_final) {
        R = x_final + 0.1;
    }

    // 2. Cálculo del ángulo alfa y del punto de tangencia
    let sin_alfa = Math.min(Math.max(x_final / R, 0.0), 1.0); // Equivalente a np.clip
    let alfa = Math.asin(sin_alfa);
    let cos_alfa = Math.cos(alfa);

    // Coordenadas exactas del punto de tangencia
    let xt = x_final;
    let yt = R * cos_alfa - (R - H);

    // 3. Despeje analítico del radio dependiente 'r' de suavizado
    let divisor_r = 1.0 - cos_alfa;
    if (Math.abs(divisor_r) < 1e-6) {
        divisor_r = 1e-6;
    }

    let r_calculado = yt / divisor_r;
    r_calculado = Math.max(0.5, r_calculado); // Evitar colapsos a cero

    // 4. Determinación de los centros de los arcos
    let xc1 = 0;
    let yc1 = H - R;

    let xc2 = (R + r_calculado) * sin_alfa;
    let yc2 = r_calculado;

    // 5. CONSTRUCCIÓN DE LA MATRIZ DE PUNTOS (Primer Cuadrante)
    // Tramo 1: Arco Mayor (desde X=0 hasta la tangencia xt)
    let X1 = linespace(0, xt, n);
    let Y1 = X1.map(x => {
        let val = Math.pow(R, 2) - Math.pow(x, 2);
        return yc1 + Math.sqrt(Math.max(0.0, val));
    });

    // Tramo 2: Arco Menor (desde xt hasta el limite exterior xc2)
    let x_limite_exterior = xc2;
    let X2 = linespace(xt, x_limite_exterior, n);
    let Y2 = X2.map(x => {
        let val = Math.pow(r_calculado, 2) - Math.pow(x - xc2, 2);
        return yc2 - Math.sqrt(Math.max(0.0, val));
    });

    // Combinamos las curvas en una sola matriz continua
    let Xi = [].concat(X1, X2);
    let Yi = [].concat(Y1, Y2);

    // 6. FILTRADO Y AJUSTE MILIMÉTRICO DE EXTREMOS
    let Xi_filt = [];
    let Yi_filt = [];

    for (let i = 0; i < Xi.length; i++) {
        if (Xi[i] >= 0 && Yi[i] >= 0 && Yi[i] <= H) {
            Xi_filt.push(Xi[i]);
            Yi_filt.push(Yi[i]);
        }
    }

    if (Xi_filt.length > 0) {
        Yi_filt[0] = H; // Cresta inicial en X=0
        Xi_filt[Xi_filt.length - 1] = x_limite_exterior;
        Yi_filt[Yi_filt.length - 1] = 0.0; // Muere en cota cero
    }

    return {
        X: Xi_filt,
        Y: Yi_filt
    };
}