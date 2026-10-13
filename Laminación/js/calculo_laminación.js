/*calculo_laminación.js*/
import { cilindro_AH, cilindro_ovalo, cilindro_redondo, cilindro_C1, cilindro_RSM } from './cilindro.js';
import { aplicarLuz, simetria, truncarRelleno, calcular_X, interpolarY } from './calculos.js';

/**
 * Calcula el ensanchamiento y genera el perfil de salida usando Ekelund Modificado (Ideal para Perfil AH)
 * @param {Object} perfilCilindro - { X, Y } devuelto por cilindro_AH
 * @param {Object} P_in - Objeto de la palanquilla de entrada { W0, A0, obtenerAlturaEn(x) }
 * @param {number} g - Luz entre cilindros (mm)
 * @param {number} R_nom - Radio nominal del cilindro (mm)
 * @param {number} mu - Coeficiente de fricción (ej. 0.35 para acero de alto carbono en caliente)
 * @param {number} n_puntos_libre - Puntos para discretizar la zona libre
 */
export function generarPerfilSalidaEkelund(perfilCilindro, P_in, g, R_nom, mu = 0.35, n_puntos_libre = 25) {
    const half_g = g / 2;
    const X_c = perfilCilindro.X;
    const Y_c = perfilCilindro.Y;
    const Y_luz = Y_c.map(y => y + half_g);

    const W0 = P_in.W0;
    const A0 = P_in.A0; // Área inicial de la palanquilla cuadrada
    
    let Ah = 0;
    let y_c_suma = 0;
    let n_contacto = 0;
    let idx_contacto = 0;

    // 1. Integración numérica para hallar el área reducida (Ah)
    for (let i = 0; i < X_c.length; i++) {
        let x = X_c[i];
        if (x > W0 / 2) break;

        let H0_x = P_in.obtenerAlturaEn(x); 
        let Y_canal_total = 2 * Y_luz[i];  
        let dh = Math.max(0, H0_x - Y_canal_total);
        
        if (i > 0) {
            let dx = X_c[i] - X_c[i - 1];
            Ah += dh * dx;
        }

        if (dh > 0) {
            y_c_suma += Y_c[i];
            n_contacto++;
            idx_contacto = i;
        }
    }
    Ah = Ah * 2; // Simetría de medio ancho

    // 2. Parámetros equivalentes de Ekelund para calibres
    const h0_eq = A0 / W0;
    const dH_eq = Ah / W0;
    const h1_eq = h0_eq - dH_eq;
    
    const y_c_media = n_contacto > 0 ? (y_c_suma / n_contacto) : 0;
    const R_eff = R_nom - y_c_media;

    // Coeficiente m de Ekelund adaptado
    let divisor_h = h0_eq + h1_eq;
    let m_eq = divisor_h > 0 ? (1.6 * mu * Math.sqrt(R_eff * dH_eq)) / divisor_h : 0;

    // Fórmula clásica de Ekelund para el ensanchamiento equivalente (Delta b)
    let numerador_ekelund = m_eq * dH_eq * Math.sqrt(R_eff * dH_eq);
    let denominador_ekelund = h0_eq + m_eq * h1_eq;
    let delta_b_eq = denominador_ekelund > 0 ? (numerador_ekelund / denominador_ekelund) : 0;

    const W1 = W0 + delta_b_eq;
    const half_W1 = W1 / 2;

    // 3. Construcción de la matriz de puntos de salida (X_out, Y_out)
    let X_out = [];
    let Y_out = [];

    // --- ZONA DE CONTACTO ---
    for (let i = 0; i <= idx_contacto; i++) {
        X_out.push(X_c[i]);
        Y_out.push(Y_luz[i]);
    }

    const x_cont = X_out[X_out.length - 1];
    const y_cont = Y_out[Y_out.length - 1];

    // --- ZONA LIBRE / ABOMBAMIENTO (Parábola de transición) ---
    if (half_W1 > x_cont) {
        let dx_libre = (half_W1 - x_cont) / n_puntos_libre;

        for (let i = 1; i <= n_puntos_libre; i++) {
            let x = x_cont + i * dx_libre;
            let t = (x - x_cont) / (half_W1 - x_cont);
            let y = y_cont - (y_cont - half_g) * Math.pow(t, 2);

            X_out.push(x);
            Y_out.push(y);
        }
    }

    return {
        X: X_out,
        Y: Y_out,
        W1: W1,
        half_W1: half_W1,
        x_contacto: x_cont,
        Ah: Ah,
        A0: A0
    };
}

/**
 * Calcula el ensanchamiento y genera el perfil de salida usando Shinokura-Takai (Óvalos, Redondos, C1, RSM)
 * @param {Object} perfilCilindro - { X, Y } devuelto por cilindro_ovalo, cilindro_C1, etc.
 * @param {Object} P_in - Objeto de la barra de entrada { W0, A0, obtenerAlturaEn(x) }
 * @param {number} g - Luz entre cilindros (mm)
 * @param {number} R_nom - Radio nominal del cilindro (mm)
 * @param {number} alpha - Coeficiente de Shinokura (típicamente 0.83 - 0.92)
 * @param {number} n_puntos_libre - Puntos para discretizar la zona libre
 */
export function generarPerfilSalidaShinokura(perfilCilindro, P_in, g, R_nom, alpha = 0.85, n_puntos_libre = 25) {
    const half_g = g / 2;
    const X_c = perfilCilindro.X;
    const Y_c = perfilCilindro.Y;
    const Y_luz = Y_c.map(y => y + half_g);

    const W0 = P_in.W0;
    const A0 = P_in.A0;
    
    let Ah = 0;
    let y_c_suma = 0;
    let n_contacto = 0;
    let idx_contacto = 0;

    for (let i = 0; i < X_c.length; i++) {
        let x = X_c[i];
        if (x > W0 / 2) break;

        let H0_x = P_in.obtenerAlturaEn(x); 
        let Y_canal_total = 2 * Y_luz[i];  
        
        let dh = Math.max(0, H0_x - Y_canal_total);
        
        if (i > 0) {
            let dx = X_c[i] - X_c[i - 1];
            Ah += dh * dx;
        }

        if (dh > 0) {
            y_c_suma += Y_c[i];
            n_contacto++;
            idx_contacto = i;
        }
    }
    Ah = Ah * 2; 

    // Ecuación de Shinokura y Takai
    const H0_eq = A0 / W0;
    const dH_eq = Ah / W0;
    const y_c_media = n_contacto > 0 ? (y_c_suma / n_contacto) : 0;
    const R_eff = R_nom - y_c_media;

    const factorGeometria = Math.sqrt(R_eff * dH_eq) / (W0 + 0.5 * H0_eq);
    const W1 = W0 * (1 + alpha * (Ah / A0) * factorGeometria);
    const half_W1 = W1 / 2;

    let X_out = [];
    let Y_out = [];

    for (let i = 0; i <= idx_contacto; i++) {
        X_out.push(X_c[i]);
        Y_out.push(Y_luz[i]);
    }

    const x_cont = X_out[X_out.length - 1];
    const y_cont = Y_out[Y_out.length - 1];

    if (half_W1 > x_cont) {
        let dx_libre = (half_W1 - x_cont) / n_puntos_libre;

        for (let i = 1; i <= n_puntos_libre; i++) {
            let x = x_cont + i * dx_libre;
            let t = (x - x_cont) / (half_W1 - x_cont);
            let y = y_cont - (y_cont - half_g) * Math.pow(t, 2);

            X_out.push(x);
            Y_out.push(y);
        }
    }

    return {
        X: X_out,
        Y: Y_out,
        W1: W1,
        half_W1: half_W1,
        x_contacto: x_cont,
        Ah: Ah,
        A0: A0
    };
}

/**
 * Rota el perfil de salida de una caja 90° para que sirva como entrada (P_in) de la siguiente caja.
 * @param {Object} salidaAnterior - Objeto { X, Y, W1 } devuelto por la función de salida de la caja previa.
 * @returns {Object} P_in - Objeto de entrada estandarizado para la siguiente caja.
 */
export function rotarSalidaAEntrada(salidaAnterior) {
    // 1. En la rotación de 90°, el antiguo medio ancho (W1 / 2) se convierte en la altura máxima de la nueva figura, 
    // y el perfil de altura Y se convierte en el nuevo eje horizontal X.
    const X_prev = salidaAnterior.X;
    const Y_prev = salidaAnterior.Y;

    // El nuevo ancho de entrada (W0) es el doble de la altura máxima alcanzada en el paso anterior
    const nuevo_W0 = 2 * Math.max(...Y_prev);

    // Conservación del área transversal exacta del paso anterior
    // (Se calcula por integración numérica simple de los puntos del primer cuadrante multiplicada por 2)
    let nuevo_A0 = 0;
    for (let i = 0; i < X_prev.length - 1; i++) {
        let dx = Math.abs(X_prev[i + 1] - X_prev[i]);
        let y_prom = (Y_prev[i] + Y_prev[i + 1]) / 2;
        nuevo_A0 += y_prom * dx;
    }
    nuevo_A0 = nuevo_A0 * 4; // Simetría completa de los 4 cuadrantes

    // 2. Crear la función de interpolación de altura para la nueva entrada
    // Al rotar 90°, lo que antes era X ahora es la altura H0(x)
    return {
        W0: nuevo_W0,
        A0: nuevo_A0,
        obtenerAlturaEn: function(x_actual) {
            // Buscamos en el perfil anterior qué valor de X_prev corresponde al x_actual solicitado
            // Recordando que los ejes se intercambiaron: buscamos en Y_prev el valor cercano a x_actual/2
            let target_y = x_actual / 2;
            
            // Buscar por interpolación lineal inversa en los puntos anteriores
            for (let i = 0; i < Y_prev.length - 1; i++) {
                if (target_y >= Math.min(Y_prev[i], Y_prev[i+1]) && target_y <= Math.max(Y_prev[i], Y_prev[i+1])) {
                    let t = (target_y - Y_prev[i]) / (Y_prev[i+1] - Y_prev[i]);
                    let x_correspondiente = X_prev[i] + t * (X_prev[i+1] - X_prev[i]);
                    return Math.abs(x_correspondiente) * 2; // Altura total simétrica
                }
            }
            // Si está en los extremos
            return 0;
        }
    };
}

/**
 * Calcula el ensanchamiento usando Tafel-Sedlaczek y genera la matriz de puntos de salida (1er cuadrante)
 * @param {Object} perfilCilindro - Objeto { X, Y } devuelto por tu función de cilindro (ej. cilindro_AH)
 * @param {Object} P_in - Objeto de entrada { W0, H0, A0, obtenerAlturaEn(x) }
 * @param {number} g - Luz o separación entre cilindros (mm)
 * @param {number} R_nom - Radio nominal de la tabla del cilindro (mm)
 * @param {number} n_puntos_libre - Puntos para discretizar la zona libre de abombamiento
 */
export function generarPerfilSalidaTafelSedlaczek(perfilCilindro, P_in, g, R_nom, n_puntos_libre = 25) {
    const half_g = g / 2;
    const X_c = perfilCilindro.X;
    const Y_c = perfilCilindro.Y;
    const Y_luz = Y_c.map(y => y + half_g);

    const W0 = P_in.W0; // Ancho inicial (bin)
    const H0 = P_in.H0; // Espesor/altura inicial de entrada (hin)
    const Hout = g;     // Espesor de salida de referencia en la luz (hout)
    
    let Ah_cuadrante = 0;
    let y_c_suma = 0;
    let n_contacto = 0;
    let idx_contacto = 0;

    // 1. Integración numérica para hallar el área reducida (Ah) en el primer cuadrante
    for (let i = 0; i < X_c.length; i++) {
        let x = X_c[i];
        if (x > W0 / 2) break;

        let H0_x = P_in.obtenerAlturaEn(x); 
        let Y_canal_total = 2 * Y_luz[i];  
        let dh = Math.max(0, H0_x - Y_canal_total);
        
        if (i > 0) {
            let dx = X_c[i] - X_c[i - 1];
            Ah_cuadrante += dh * dx;
        }

        if (dh > 0) {
            y_c_suma += Y_c[i];
            n_contacto++;
            idx_contacto = i;
        }
    }
    const Ah_total = Ah_cuadrante * 2; // Simetría completa de medio ancho

    // 2. Aplicación de la fórmula de Tafel y Sedlaczek
    // Δb = (Δh * bin * sqrt(bin * R)) / (3 * (bin^2 + (hin * hout)))
    const dh_global = H0 - Hout;
    let delta_b = 0;

    if (dh_global > 0) {
        let y_c_media = n_contacto > 0 ? (y_c_suma / n_contacto) : 0;
        let R_eff = R_nom - y_c_media; // Radio efectivo ponderado con la profundidad local

        let numerador = dh_global * W0 * Math.sqrt(W0 * R_eff);
        let denominador = 3 * (Math.pow(W0, 2) + (H0 * Hout));
        
        delta_b = denominador !== 0 ? numerador / denominador : 0;
    }

    // Ancho total de salida W1 y su límite en el primer cuadrante
    const W1 = W0 + delta_b;
    const half_W1 = W1 / 2;

    // 3. Construcción de la matriz de puntos de salida (X_out, Y_out) en el primer cuadrante
    let X_out = [];
    let Y_out = [];

    // --- TRAMO A: Zona de Contacto (el metal calca el canal del cilindro) ---
    for (let i = 0; i <= idx_contacto; i++) {
        X_out.push(X_c[i]);
        Y_out.push(Y_luz[i]);
    }

    const x_cont = X_out[X_out.length - 1];
    const y_cont = Y_out[Y_out.length - 1];

    // --- TRAMO B: Zona Libre / Abombamiento lateral (Curva parabólica de transición) ---
    if (half_W1 > x_cont) {
        let dx_libre = (half_W1 - x_cont) / n_puntos_libre;

        for (let i = 1; i <= n_puntos_libre; i++) {
            let x = x_cont + i * dx_libre;
            let t = (x - x_cont) / (half_W1 - x_cont);
            // Parábola que suaviza desde el último punto de contacto hasta la altura de la luz (half_g)
            let y = y_cont - (y_cont - half_g) * Math.pow(t, 2);

            X_out.push(x);
            Y_out.push(y);
        }
    }

    return {
        X: X_out,
        Y: Y_out,
        W1: W1,
        half_W1: half_W1,
        x_contacto: x_cont,
        delta_b: delta_b,
        Ah: Ah_total
    };
}

/**
 * Calcula el ensanchamiento usando el modelo de Koncevicz y genera la matriz de puntos de salida (1er cuadrante)
 * @param {Object} perfilCilindro - Objeto { X, Y } devuelto por tu función de cilindro (ej. cilindro_AH)
 * @param {Object} P_in - Objeto de entrada { W0, H0, A0, obtenerAlturaEn(x) }
 * @param {number} g - Luz o separación entre cilindros (mm)
 * @param {number} R_nom - Radio nominal de la tabla del cilindro (mm)
 * @param {number} n_puntos_libre - Puntos para discretizar la zona libre de abombamiento
 */
export function generarPerfilSalidaKoncevicz(perfilCilindro, P_in, g, R_nom, n_puntos_libre = 25) {
    const half_g = g / 2;
    const X_c = perfilCilindro.X;
    const Y_c = perfilCilindro.Y;
    const Y_luz = Y_c.map(y => y + half_g);

    const W0 = P_in.W0; // Ancho inicial (bin)
    const H0 = P_in.H0; // Espesor/altura inicial de entrada (hin)
    const Hout = g;     // Espesor de salida de referencia en la luz (hout)
    
    let Ah_cuadrante = 0;
    let y_c_suma = 0;
    let n_contacto = 0;
    let idx_contacto = 0;

    // 1. Integración numérica para hallar el área reducida (Ah) en el primer cuadrante
    for (let i = 0; i < X_c.length; i++) {
        let x = X_c[i];
        if (x > W0 / 2) break;

        let H0_x = P_in.obtenerAlturaEn(x); 
        let Y_canal_total = 2 * Y_luz[i];  
        let dh = Math.max(0, H0_x - Y_canal_total);
        
        if (i > 0) {
            let dx = X_c[i] - X_c[i - 1];
            Ah_cuadrante += dh * dx;
        }

        if (dh > 0) {
            y_c_suma += Y_c[i];
            n_contacto++;
            idx_contacto = i;
        }
    }
    const Ah_total = Ah_cuadrante * 2; // Simetría completa de medio ancho

    // 2. Aplicación de la fórmula de Koncevicz
    const dh_global = H0 - Hout;
    let delta_b = 0;

    if (dh_global > 0) {
        let y_c_media = n_contacto > 0 ? (y_c_suma / n_contacto) : 0;
        let R_eff = R_nom - y_c_media; // Radio efectivo ponderado localmente

        // Δb = 0.66 * (Δh / (hin + hout)) * sqrt(Δh * R_eff)
        delta_b = 0.66 * (dh_global / (H0 + Hout)) * Math.sqrt(dh_global * R_eff);
    }

    // Ancho total de salida W1 y su límite en el primer cuadrante
    const W1 = W0 + delta_b;
    const half_W1 = W1 / 2;

    // 3. Construcción de la matriz de puntos de salida (X_out, Y_out) en el primer cuadrante
    let X_out = [];
    let Y_out = [];

    // --- TRAMO A: Zona de Contacto (el metal calca el canal del cilindro) ---
    for (let i = 0; i <= idx_contacto; i++) {
        X_out.push(X_c[i]);
        Y_out.push(Y_luz[i]);
    }

    const x_cont = X_out[X_out.length - 1];
    const y_cont = Y_out[Y_out.length - 1];

    // --- TRAMO B: Zona Libre / Abombamiento lateral (Curva parabólica de transición) ---
    if (half_W1 > x_cont) {
        let dx_libre = (half_W1 - x_cont) / n_puntos_libre;

        for (let i = 1; i <= n_puntos_libre; i++) {
            let x = x_cont + i * dx_libre;
            let t = (x - x_cont) / (half_W1 - x_cont);
            let y = y_cont - (y_cont - half_g) * Math.pow(t, 2);

            X_out.push(x);
            Y_out.push(y);
        }
    }

    return {
        X: X_out,
        Y: Y_out,
        W1: W1,
        half_W1: half_W1,
        x_contacto: x_cont,
        delta_b: delta_b,
        Ah: Ah_total
    };
}