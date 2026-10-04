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


export function cilindro_redondo(n = 100, B = 120.09, H = 49, R = 55, r = 8, a = 30) {
    let alfa = (a * Math.PI) / 180; // Ángulo de inclinación en radianes (30°)
    n = Math.max(n, Math.trunc(B / 2));

    /* 1. TÉRMINO GEOMÉTRICO DE TRANSLACIÓN */
    let term_recta = ((H - R) + R * Math.sin(alfa) - r * (1 - Math.sin(alfa))) / Math.tan((Math.PI / 2) - alfa);

    /* 2. PUNTOS CRÍTICOS EN X DE TANGENCIA */
    let x_T1 = 0.0;
    let x_T2 = -R * Math.cos(alfa);
    let x_T3 = x_T2 - term_recta;
    let x_T4 = -B / 2; // Extremo de la base exacto

    /* 3. CENTRO DEL ARCO DE ACUERDO LATERAL r */
    let cx_C2 = -term_recta - (R + r) * Math.cos(alfa);

    /* 4. MUESTREO Y ECUACIONES DE LOS TRAMOS */

    // Tramo 1: Arco Superior Central (de x_T1 a x_T2)
    let X1 = linespace(x_T1, x_T2, n);
    let Y1 = X1.map(x => (H - R) + Math.sqrt(Math.max(0, Math.pow(R, 2) - Math.pow(x, 2))));

    // Tramo 2: Recta Inclinada de Transición (de x_T2 a x_T3)
    let X2 = linespace(x_T2, x_T3, n);
    let Y2 = X2.map(x => (H - R) + R * Math.sin(alfa) + Math.tan((Math.PI / 2) - alfa) * (x + R * Math.cos(alfa)));

    // Tramo 3: Arco Inferior de Esquina r (de x_T3 a x_T4 en orden ordenado para Chart.js)
    let X3 = linespace(x_T3, x_T4, n);
    let Y3 = X3.map(x => r - Math.sqrt(Math.max(0, Math.pow(r, 2) - Math.pow(x - cx_C2, 2))));

    /* 5. UNIÓN Y APLICACIÓN DE SIGNOS */
    let Xi = [].concat(X1, X2, X3);
    let Yi = [].concat(Y1, Y2, Y3);

    // Mapeamos -Xi para orientar las coordenadas al cuadrante correcto
    return {
        X: Xi.map(x => -x),
        Y: Yi
    };
}

export function cilindro_C1_1(n=100, B=140, H=35, R1=160, R2=40,r=8 ){ /*la original, slae fatal*/
    /*centros*/
    let x_c1 = 0;
    let y_c1 = H-R1;

    let x_c3 = B/2;
    let y_c3=r;

        /* abrimos un inciso para crear unas variables para continuar definiendo centros*/
        let D1=R1-R2;
        let D3=r+R2;
        let M=2*(y_c1-r)/B;
        let N=(Math.pow(D1,2)-Math.pow(D3,2)-Math.pow(y_c1,2)+Math.pow(B,2)/4+Math.pow(r,2))/B;
        let A_coef=Math.pow(M,2)+1;
        let B_coef=2*(M*N-y_c1);
        let C_coef=Math.pow(N,2)+Math.pow(y_c1,2)-Math.pow(D1,2);
        
        let discriminante = Math.pow(B_coef, 2) - 4 * A_coef * C_coef;

        if (discriminante < 0) {
            console.warn("cajas.c1.Error: Los radios no permiten tangencia física real.");
            return { X: [], Y: [] };
        }


    /*Ahora seguimos con los centros, ojo que tenemos dos raices, por lo que hay que considerar entre dos centros*/
    let y_c2_1 = ((-B_coef)+Math.sqrt(Math.max(0, Math.pow(B_coef, 2) - 4*A_coef*C_coef)))/(2*A_coef);
    let y_c2_2 = ((-B_coef)-Math.sqrt(Math.max(0, Math.pow(B_coef, 2) - 4*A_coef*C_coef)))/(2*A_coef);
    let x_c2_1 = M*y_c2_1+N;
    let x_c2_2 = M*y_c2_2+N;

    
    /*# --- FILTRO DE SELECCIÓN POR CUADRANTE DE TANGENCIA ---
    # Calculamos la primera tangencia (T12) simulada para ambas raices*/

    let x_t12_1 = x_c1+ (x_c2_1 - x_c1)* R1/(R1-R2);
    let y_t12_1 = y_c1+ (y_c2_1 - y_c1)* R1/(R1-R2);

    let x_t12_2 = x_c1+ (x_c2_2 - x_c1)* R1/(R1-R2);
    let y_t12_2 = y_c1+ (y_c2_2 - y_c1)* R1/(R1-R2);
        
    /* Como la premisa es siempre trabajar en primer cuadrante, el algoritmo evalúa tu condición: ¿Cuál cae en el primer cuadrante?*/
    // Declaración fuera de las llaves para mantener el ámbito (scope)
    let x_c2 = 0;
    let y_c2 = 0;
    let x_t12 = 0;
    let y_t12 = 0;


    if ((x_t12_1 >=0) && (y_t12_1 >=0)){ /*primera raiz en primer cuadrante*/
        x_c2  = x_c2_1;
        y_c2  = y_c2_1;
        x_t12 = x_t12_1;
        y_t12 = y_t12_1;
    }
    else if ((x_t12_2 >=0) && (y_t12_2 >=0)){ /*segunda raiz en primer cuadrante*/
        x_c2  = x_c2_2;
        y_c2  = y_c2_2;
        x_t12 = x_t12_2;
        y_t12 = y_t12_2;
    }
    else { /*Ninguna raíz matemática genera una tangencia real en el primer cuadrante."*/
        x_c2  = 0;
        y_c2  = 0;
        x_t12 = 0;
        y_t12 = 0;
    }

    /* Continuamos la segunda tangencia*/
    let x_t23 = x_c2+(x_c3 - x_c2)*R2/(r-R2);
    let y_t23 = y_c2+(y_c3 - y_c2)*R2/(r-R2);

    /*definidos los puntos, toca las ecuaciones*/
    let X1 = linespace(0, x_t12, n);
    let Y1 = X1.map(x => y_c1 + Math.sqrt(Math.max(0, Math.pow(R1, 2) - Math.pow((x-x_c1), 2))));


    let X2 = linespace(x_t12, x_t23, n);
    let Y2 = X2.map(x => y_c2 - Math.sqrt(Math.max(0, Math.pow(R2, 2) - Math.pow((x-x_c2), 2))));


    let X3 = linespace(x_t23, B/2 , n);
    let Y3 = X3.map(x => y_c3 - Math.sqrt(Math.max(0, Math.pow(r, 2) - Math.pow((x-x_c3), 2))));

    /* ahora a unir las matrices de los diferentes tramos y devolver una matriz del primer cuadrante*/
    let Xi = [].concat(X1, X2, X3);
    let Yi = [].concat(Y1, Y2, Y3);

    // Mapeamos -Xi para orientar las coordenadas al cuadrante correcto
    return {
        X: Xi,
        Y: Yi
    };



}


export function calcularCentroC2(x1, y1, x3, y3, R1, R2, r) {
    const d1 = R1 - R2;   // distancia C1–C2 (tangencia interior)
    const d3 = R2 + r;    // distancia C3–C2 (tangencia exterior)

    const dx = x3 - x1;
    const dy = y3 - y1;
    const d = Math.hypot(dx, dy);

    // Comprobación de intersección física entre las dos circunferencias auxiliares
    if (d === 0 || d > (d1 + d3) || d < Math.abs(d1 - d3)) {
        console.warn("No existe intersección física real entre los radios.");
        return null;
    }

    const a = (d1 * d1 - d3 * d3 + d * d) / (2 * d);
    const h = Math.sqrt(d1 * d1 - a * a);

    // Punto base sobre la recta C1–C3
    const x_p0 = x1 + (a / d) * dx;
    const y_p0 = y1 + (a / d) * dy;

    // Vector unitario perpendicular a (C3 - C1)
    const nx = -dy / d;
    const ny =  dx / d;

    // Dos soluciones posibles
    const x2_1 = x_p0 + h * nx;
    const y2_1 = y_p0 + h * ny;

    const x2_2 = x_p0 - h * nx;
    const y2_2 = y_p0 - h * ny;

    return [
        { x: x2_1, y: y2_1 },
        { x: x2_2, y: y2_2 }
    ];
}

function interseccion_dos_circunferencias(x1, y1, R1, x2, y2, R2) {
    /* 1. Distancia entre centros (D) */
    let dx = x2 - x1;
    let dy = y2 - y1;
    let D = Math.sqrt(dx ** 2 + dy ** 2);

    /* 2. Condición de existencia de solución real */
    if (D === 0) {
        console.log("Centros coincidentes");
        return null;
    }

    if (D > (R1 + R2) || D < Math.abs(R1 - R2)) {
        console.log("Las circunferencias no se tocan");
        return null;
    }

    /* 3. Proyección horizontal sobre la línea de centros (a) */
    let a = (R1 ** 2 - R2 ** 2 + D ** 2) / (2 * D);

    /* 4. Distancia perpendicular al eje (h) */
    let h2 = R1 ** 2 - a ** 2;
    let h = Math.sqrt(Math.max(0, h2));

    /* 5. Punto medio sobre la línea de centros (P_0) */
    let x0 = x1 + (a * dx) / D;
    let y0 = y1 + (a * dy) / D; // Corregido 'dy'

    /* 6. Puntos de intersección finales (P_1, P_2) */
    let x_1 = x0 + (h * dy) / D;
    let y_1 = y0 - (h * dx) / D;

    let x_2 = x0 - (h * dy) / D;
    let y_2 = y0 + (h * dx) / D;

    if (h === 0) {
        console.log("Son tangentes en un único punto");
        return { x: x_1, y: y_1 };
    }

    console.log("Existen dos puntos de intersección, buscando en el Cuadrante 1...");

    // Selección de la solución en el Cuadrante 1 (x >= 0, y >= 0)
    if (x_1 >= 0 && y_1 >= 0) {
        return { x: x_1, y: y_1 };
    } else if (x_2 >= 0 && y_2 >= 0) {
        return { x: x_2, y: y_2 };
    } else {
        console.log("Ninguna intersección está en el cuadrante 1");
        return null;
    }
}



export function cilindro_C1(n = 100, B = 140, H = 35, R1 = 160, R2 = 40, r = 8) {
    // 1. Centros fijos según el plano técnico
    const x_c1 = 0;
    const y_c1 = H - R1;

    // Centro del radio de esquina r=8
    const x_c3 = (B / 2) - r; 
    const y_c3 = r;

    // 2. Obtener C2 usando calcularCentroC2
    const centros2 = calcularCentroC2(x_c1, y_c1, x_c3, y_c3, R1, R2, r);
    if (!centros2) return { X: [], Y: [] };

    const centro2 = (centros2[0].y > centros2[1].y) ? centros2[0] : centros2[1];
    const x_c2 = centro2.x;
    const y_c2 = centro2.y;

    // 3. Puntos de tangencia exactos
    const d1 = R1 - R2;
    const x_t12 = x_c1 + (x_c2 - x_c1) * (R1 / d1);

    const d3 = R2 + r;
    const x_t23 = x_c2 + (x_c3 - x_c2) * (R2 / d3);

    // 4. Calcular el punto exacto X donde Y3 = 0 (truncado horizontal)
    let x_corte_y0 = B / 2;
    if (r >= Math.abs(y_c3)) {
        x_corte_y0 = x_c3 + Math.sqrt(Math.pow(r, 2) - Math.pow(y_c3, 2));
    }

    // Límites de integración truncados en x_corte_y0
    const x_max = Math.min(B / 2, x_corte_y0);
    const x_m1 = Math.max(0, Math.min(x_t12, x_max));
    const x_m2 = Math.max(x_m1, Math.min(x_t23, x_max));

    const n_puntos = Math.floor(n / 3);

    // Tramo 1: Cresta superior (R1 = 160)
    const X1 = linespace(0, x_m1, n_puntos);
    const Y1 = X1.map(x => {
        const val = R1**2 - (x - x_c1)**2;
        return y_c1 + Math.sqrt(Math.max(0, val));
    });

    // Tramo 2: Transición cóncava
    const X2 = linespace(x_m1, x_m2, n_puntos);
    const Y2 = X2.map(x => {
        const val = R2**2 - (x - x_c2)**2;
        return y_c2 + (Math.max(0, val))**0.5;
    });

    // Tramo 3: Esquina (r = 8) truncada exactamente en Y = 0
    const X3_raw = linespace(x_m2, x_max, n_puntos);
    const X3 = [];
    const Y3 = [];

    for (let i = 0; i < X3_raw.length; i++) {
        const x = X3_raw[i];
        const val = r**2 - (x - x_c3)**2;
        const y = y_c3 - (Math.max(0, val))**0.5;

        // Trunca si el valor pasa de cero
        if (y < 0) {
            X3.push(x);
            Y3.push(0);
            break; // Detiene la generación del trazado al tocar Y=0
        }

        X3.push(x);
        Y3.push(y);
    }

    return {
        X: [].concat(X1, X2, X3),
        Y: [].concat(Y1, Y2, Y3)
    };
}
