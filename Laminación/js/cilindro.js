/* cilindro.js*/
import { linespace } from './calculos.js';


export function cilindro_AH(n, B, H, R, r, a_deg) {
    let factor= 0.25
    
    let a_rad = (a_deg * Math.PI) / 180;             // 12° en radianes
    let beta_rad = ((90 - a_deg) * Math.PI) / 180;   // 78° (90° - 12°) en radianes
    let half_B = B / 2;

    // 1. Centro del arco inferior r
    let x_cr = half_B ;
    let y_cr = r;

    // 2. Punto exacto de inicio de r (Tangencia a 78° con la recta T3)
    let x3_fin = x_cr - r * Math.sin(a_rad);          // B/2 - r + r*sin(12°)
    let y_tan_r = y_cr - r * Math.cos(a_rad);         // r - r*cos(12°)

    // 3. Geometría del arco superior R
    let y_cR = H - R;
    let y_tan_R = y_cR + R * Math.cos(a_rad);
    
    // Distancia horizontal entre tangencias usando la pendiente a 12°
    let delta_y = y_tan_R - y_tan_r;
    let delta_x = delta_y * Math.tan(a_rad);

    let x2_fin = x3_fin - delta_x;
    let x_cR = x2_fin - R * Math.sin(a_rad);
    if (x_cR < 0) x_cR = 0;

    let x1_fin = x_cR;
    let n_puntos = Math.floor(n* factor);

    // --- TRAMO 1: Parte plana superior (Y = H) ---
    let X1 = linespace(0, x1_fin, n_puntos);
    let Y1 = X1.map(() => H);

    // --- TRAMO 2: Arco de empalme R ---
    let X2 = linespace(x1_fin, x2_fin, n_puntos);
    let Y2 = X2.map(x => y_cR + Math.sqrt(Math.max(0, Math.pow(R, 2) - Math.pow(x - x_cR, 2))));

    // --- TRAMO 3: Recta inclinada (Une las tangencias de R a 12° y r a 78°) ---
    let X3 = linespace(x2_fin, x3_fin, n_puntos);
    let Y3 = X3.map(x => {
        let t = (x - x2_fin) / (x3_fin - x2_fin);
        return y_tan_R - t * delta_y;
    });

    // --- TRAMO 4: Arco r desde el punto de tangencia a 78° hasta (B/2, 0) ---
    let X4 = linespace(x3_fin, half_B, n_puntos);
    let Y4 = X4.map(x => {
        let val = Math.pow(r, 2) - Math.pow(x - x_cr, 2);
        return y_cr - Math.sqrt(Math.max(0, val));
    });

    // --- TRAMO 5: Cuello plano exterior a nivel Y = 0 (de B/2 en adelante) ---
    let X5 = linespace(half_B, half_B + 15, Math.floor(n_puntos * factor));
    let Y5 = X5.map(() => 0);

    let X = [].concat(X1, X2, X3, X4, X5);
    let Y = [].concat(Y1, Y2, Y3, Y4, Y5);

    return { X: X, Y: Y };
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