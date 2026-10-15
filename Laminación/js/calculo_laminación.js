/*calculo_laminación.js*/
import { cilindro_AH, cilindro_ovalo, cilindro_redondo, cilindro_C1, cilindro_RSM } from './cilindro.js';
import { aplicarLuz, simetria, truncarRelleno, calcular_X, interpolarY, calcularAreaDesdePuntos, crearFuncionAltura } from './calculos.js';

/** 
 * Genera el perfil de salida para la Caja AH usando el Modelo de Ekelund Modificado.
 * Recibe únicamente las coordenadas (X, Y) del primer cuadrante de entrada.
 * 
 * @param {Object} perfilCilindro - { X, Y } devuelto por tu función cilindro_AH
 * @param {Object} P_in - { X, Y } de la barra de entrada en el primer cuadrante
 * @param {number} g - Luz total entre cilindros (mm)
 * @param {number} R_nom - Radio nominal del cilindro (mm)
 * @param {number} mu - Coeficiente de fricción (ej. 0.35 para acero de alto carbono en caliente)
 * @param {number} n_puntos_libre - Puntos para discretizar la zona libre de abombamiento
 */
export function generarPerfilSalidaEkelund(perfilCilindro, P_in, g, R_nom, mu = 0.35, n_puntos_libre = 25) {
    const half_g = g / 2;
    const X_c = perfilCilindro.X;
    const Y_c = perfilCilindro.Y;
    const Y_luz = Y_c.map(y => y + half_g);

    const X_in = P_in.X;
    const Y_in = P_in.Y;

    // 1. Cálculo automático de W0 y A0 reutilizando la función de área
    const half_W0 = Math.max(...X_in);
    const W0 = 2 * half_W0;
    const A0 = calcularAreaDesdePuntos(X_in, Y_in);


    // Función interna para consultar la altura de entrada interpolando los puntos
    const obtenerAlturaEn = function(x) {
        let x_abs = Math.abs(x);
        if (x_abs > half_W0) return 0;
        
        for (let i = 0; i < X_in.length - 1; i++) {
            if (x_abs >= X_in[i] && x_abs <= X_in[i + 1]) {
                let t = (x_abs - X_in[i]) / (X_in[i + 1] - X_in[i]);
                return 2 * (Y_in[i] + t * (Y_in[i + 1] - Y_in[i]));
            }
        }
        return 2 * Y_in[Y_in.length - 1];
    };

    // 2. Generación de puntos de la diferencia (dh) para calcular el Ah total con la función reutilizable
    let X_dh = [];
    let Y_dh = [];
    let y_c_suma = 0;
    let n_contacto = 0;
    let idx_contacto = 0;

    for (let i = 0; i < X_c.length; i++) {
        let x = X_c[i];
        if (x > half_W0) break;

        let H0_x = obtenerAlturaEn(x); 
        let Y_canal_total = 2 * Y_luz[i];  
        let dh = Math.max(0, H0_x - Y_canal_total);
        
        X_dh.push(x);
        Y_dh.push(dh); // Almacenamos la diferencia de altura temporalmente en Y

        // Detección de contacto físico con el calibre
        if (dh > 0) {
            y_c_suma += Y_c[i];
            n_contacto++;
            idx_contacto = i;
        }
    }

    // Obtenemos el Ah total mediante la integración trapezoidal reutilizada
    const Ah = calcularAreaDesdePuntos(X_dh, Y_dh);


 /*==================Asta aquí comun ambos modelos ======== */


    // 3. Aplicación del Modelo de Ekelund Modificado para el ensanchamiento (delta_b)
    const H0_eq = A0 / W0;
    const dH_eq = Ah / W0;
    const h1_eq = H0_eq - dH_eq;
    
    const y_c_media = n_contacto > 0 ? (y_c_suma / n_contacto) : 0;
    const R_eff = R_nom - y_c_media; // Radio efectivo ponderado localmente

    let divisor_h = H0_eq + h1_eq;
    let m_eq = divisor_h > 0 ? (1.6 * mu * Math.sqrt(R_eff * dH_eq)) / divisor_h : 0;

    let numerador = m_eq * dH_eq * Math.sqrt(R_eff * dH_eq);
    let denominador = H0_eq + m_eq * h1_eq;
    let delta_b = denominador > 0 ? (numerador / denominador) : 0;

    const W1 = W0 + delta_b;
    const half_W1 = W1 / 2;
    /* ================== Hasta aquí común ambos modelos ================== */

    // 4. Construcción de la matriz de puntos de salida (X_out, Y_out) en el 1er cuadrante
    let X_out = [];
    let Y_out = [];

    // --- Zona de Contacto con el Calibre ---
    for (let i = 0; i <= idx_contacto; i++) {
        X_out.push(X_c[i]);
        Y_out.push(Y_luz[i]);
    }

    const x_cont = X_out[X_out.length - 1];
    const y_cont = Y_out[Y_out.length - 1];

    // --- Zona Libre / Abombamiento Lateral (Curva Parabólica de Transición) ---
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

    // Devuelve estrictamente el objeto {X, Y} del primer cuadrante listo para la rotación de 90°
    return {
        X: X_out,
        Y: Y_out
    };
}


/**
 * Genera el perfil de salida usando el modelo de Shinokura y Takai.
 * Recibe únicamente las coordenadas (X, Y) del primer cuadrante de entrada.
 * 
 * @param {Object} perfilCilindro - { X, Y } devuelto por tu función de cilindro (ej. óvalo/redondo)
 * @param {Object} P_in - { X, Y } de la barra de entrada en el primer cuadrante
 * @param {number} g - Luz total entre cilindros (mm)
 * @param {number} R_nom - Radio nominal del cilindro (mm)
 * @param {number} alpha - Coeficiente de Shinokura (por defecto 0.85)
 * @param {number} n_puntos_libre - Puntos para discretizar la zona libre de abombamiento
 */

export function generarPerfilSalidaShinokura(perfilCilindro, P_in, g, R_nom, alpha = 0.85, n_puntos_libre = 25) {
    const half_g = g / 2;
    const X_c = perfilCilindro.X;
    const Y_c = perfilCilindro.Y;
    const Y_luz = Y_c.map(y => y + half_g);

    const X_in = P_in.X;
    const Y_in = P_in.Y;

    // 1. Cálculo automático de W0 y A0 desde el primer cuadrante
    const half_W0 = Math.max(...X_in);
    const W0 = 2 * half_W0;
    const A0 = calcularAreaDesdePuntos(X_in, Y_in);

    // Función interna para consultar la altura de entrada interpolando los puntos
    const obtenerAlturaEn = function(x) {
        let x_abs = Math.abs(x);
        if (x_abs > half_W0) return 0;
        
        for (let i = 0; i < X_in.length - 1; i++) {
            if (x_abs >= X_in[i] && x_abs <= X_in[i + 1]) {
                let t = (x_abs - X_in[i]) / (X_in[i + 1] - X_in[i]);
                return 2 * (Y_in[i] + t * (Y_in[i + 1] - Y_in[i]));
            }
        }
        return 2 * Y_in[Y_in.length - 1];
    };

    // 2. Generación de puntos de la diferencia (dh) para calcular el Ah total de forma modular
    let X_dh = [];
    let Y_dh = [];
    let y_c_suma = 0;
    let n_contacto = 0;
    let idx_contacto = 0;

    for (let i = 0; i < X_c.length; i++) {
        let x = X_c[i];
        if (x > half_W0) break;

        let H0_x = obtenerAlturaEn(x); 
        let Y_canal_total = 2 * Y_luz[i];  
        let dh = Math.max(0, H0_x - Y_canal_total);
        
        X_dh.push(x);
        Y_dh.push(dh); // Almacenamos la diferencia de altura temporalmente en Y

        // Detección de contacto físico con el calibre cerrado
        if (dh > 0) {
            y_c_suma += Y_c[i];
            n_contacto++;
            idx_contacto = i;
        }
    }

    // Obtenemos el Ah total mediante la integración trapezoidal reutilizada
    const Ah = calcularAreaDesdePuntos(X_dh, Y_dh);

    /* ================== Hasta aquí común ambos modelos ================== */

    // 3. Aplicación del Modelo de Shinokura y Takai para el ensanchamiento
    const H0_eq = A0 / W0;
    const dH_eq = Ah / W0;
    const y_c_media = n_contacto > 0 ? (y_c_suma / n_contacto) : 0;
    const R_eff = R_nom - y_c_media; // Radio efectivo ponderado localmente

    const factorGeometria = Math.sqrt(R_eff * dH_eq) / (W0 + 0.5 * H0_eq);
    const W1 = W0 * (1 + alpha * (Ah / A0) * factorGeometria);
    const half_W1 = W1 / 2;

/* ================== Hasta aquí común ambos modelos ================== */
    
// 4. Construcción de la matriz de puntos de salida (X_out, Y_out) en el 1er cuadrante
    let X_out = [];
    let Y_out = [];

    // --- Zona de Contacto con el Calibre ---
    for (let i = 0; i <= idx_contacto; i++) {
        X_out.push(X_c[i]);
        Y_out.push(Y_luz[i]);
    }

    const x_cont = X_out[X_out.length - 1];
    const y_cont = Y_out[Y_out.length - 1];

    // --- Zona Libre / Abombamiento Lateral (*Free Surface Bulging*) ---
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

    // Devuelve estrictamente y únicamente el perfil laminado { X, Y } del primer cuadrante
    return {
        X: X_out,
        Y: Y_out
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
 * Genera el perfil de salida usando el modelo de Tafel y Sedlaczek.
 * Recibe únicamente las coordenadas (X, Y) del primer cuadrante de entrada.
 * 
 * @param {Object} perfilCilindro - { X, Y } devuelto por tu función de cilindro
 * @param {Object} P_in - { X, Y } de la barra de entrada en el primer cuadrante
 * @param {number} g - Luz total entre cilindros (mm)
 * @param {number} R_nom - Radio nominal del cilindro (mm)
 * @param {number} n_puntos_libre - Puntos para discretizar la zona libre de abombamiento
 */
export function generarPerfilSalidaTafelSedlaczek(perfilCilindro, P_in, g, R_nom, n_puntos_libre = 25) {
    const half_g = g / 2;
    const X_c = perfilCilindro.X;
    const Y_c = perfilCilindro.Y;
    const Y_luz = Y_c.map(y => y + half_g);

    const X_in = P_in.X;
    const Y_in = P_in.Y;

    // 1. Cálculo automático de propiedades desde el primer cuadrante
    const half_W0 = Math.max(...X_in);
    const W0 = 2 * half_W0;
    
    // Altura/espesor inicial de entrada máximo (2 veces la máxima altura del 1er cuadrante)
    const H0 = 2 * Math.max(...Y_in); 
    const Hout = g; // Espesor de salida de referencia en la luz

    // Función interna para consultar la altura de entrada interpolando los puntos
    const obtenerAlturaEn = function(x) {
        let x_abs = Math.abs(x);
        if (x_abs > half_W0) return 0;
        
        for (let i = 0; i < X_in.length - 1; i++) {
            if (x_abs >= X_in[i] && x_abs <= X_in[i + 1]) {
                let t = (x_abs - X_in[i]) / (X_in[i + 1] - X_in[i]);
                return 2 * (Y_in[i] + t * (Y_in[i + 1] - Y_in[i]));
            }
        }
        return 2 * Y_in[Y_in.length - 1];
    };

    // 2. Integración numérica para hallar el área reducida (Ah) y detectar contacto
    let Ah_cuadrante = 0;
    let y_c_suma = 0;
    let n_contacto = 0;
    let idx_contacto = 0;

    for (let i = 0; i < X_c.length; i++) {
        let x = X_c[i];
        if (x > half_W0) break;

        let H0_x = obtenerAlturaEn(x); 
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

    // 3. Aplicación de la fórmula de Tafel y Sedlaczek para el ensanchamiento
    const dh_global = H0 - Hout;
    let delta_b = 0;

    if (dh_global > 0) {
        let y_c_media = n_contacto > 0 ? (y_c_suma / n_contacto) : 0;
        let R_eff = R_nom - y_c_media; // Radio efectivo ponderado localmente

        let numerador = dh_global * W0 * Math.sqrt(W0 * R_eff);
        let denominador = 3 * (Math.pow(W0, 2) + (H0 * Hout));
        
        delta_b = denominador !== 0 ? numerador / denominador : 0;
    }

    const W1 = W0 + delta_b;
    const half_W1 = W1 / 2;

    // 4. Construcción de la matriz de puntos de salida (X_out, Y_out) en el primer cuadrante
    let X_out = [];
    let Y_out = [];

    // --- TRAMO A: Zona de Contacto ---
    for (let i = 0; i <= idx_contacto; i++) {
        X_out.push(X_c[i]);
        Y_out.push(Y_luz[i]);
    }

    const x_cont = X_out[X_out.length - 1];
    const y_cont = Y_out[Y_out.length - 1];

    // --- TRAMO B: Zona Libre / Abombamiento Lateral (Curva parabólica) ---
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

    // Devuelve estrictamente el objeto { X, Y } del primer cuadrante para la siguiente etapa
    return {
        X: X_out,
        Y: Y_out
    };
}


/**
 * Genera el perfil de salida usando el modelo de Koncevicz.
 * Recibe únicamente las coordenadas (X, Y) del primer cuadrante de entrada.
 * 
 * @param {Object} perfilCilindro - { X, Y } devuelto por tu función de cilindro
 * @param {Object} P_in - { X, Y } de la barra de entrada en el primer cuadrante
 * @param {number} g - Luz total entre cilindros (mm)
 * @param {number} R_nom - Radio nominal del cilindro (mm)
 * @param {number} n_puntos_libre - Puntos para discretizar la zona libre de abombamiento
 */
export function generarPerfilSalidaKoncevicz(perfilCilindro, P_in, g, R_nom, n_puntos_libre = 25) {
    const half_g = g / 2;
    const X_c = perfilCilindro.X;
    const Y_c = perfilCilindro.Y;
    const Y_luz = Y_c.map(y => y + half_g);

    const X_in = P_in.X;
    const Y_in = P_in.Y;

    // 1. Cálculo automático de propiedades desde el primer cuadrante
    const half_W0 = Math.max(...X_in);
    const W0 = 2 * half_W0;
    
    // Espesor/altura inicial de entrada (2 veces la altura máxima del 1er cuadrante)
    const H0 = 2 * Math.max(...Y_in); 
    const Hout = g; // Espesor de salida de referencia en la luz

    // Función interna para consultar la altura de entrada interpolando los puntos
    const obtenerAlturaEn = function(x) {
        let x_abs = Math.abs(x);
        if (x_abs > half_W0) return 0;
        
        for (let i = 0; i < X_in.length - 1; i++) {
            if (x_abs >= X_in[i] && x_abs <= X_in[i + 1]) {
                let t = (x_abs - X_in[i]) / (X_in[i + 1] - X_in[i]);
                return 2 * (Y_in[i] + t * (Y_in[i + 1] - Y_in[i]));
            }
        }
        return 2 * Y_in[Y_in.length - 1];
    };

    // 2. Integración numérica para hallar el área reducida (Ah) y detectar contacto
    let Ah_cuadrante = 0;
    let y_c_suma = 0;
    let n_contacto = 0;
    let idx_contacto = 0;

    for (let i = 0; i < X_c.length; i++) {
        let x = X_c[i];
        if (x > half_W0) break;

        let H0_x = obtenerAlturaEn(x); 
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

    // 3. Aplicación de la fórmula de Koncevicz para el ensanchamiento
    const dh_global = H0 - Hout;
    let delta_b = 0;

    if (dh_global > 0) {
        let y_c_media = n_contacto > 0 ? (y_c_suma / n_contacto) : 0;
        let R_eff = R_nom - y_c_media; // Radio efectivo ponderado localmente

        // Δb = 0.66 * (Δh / (hin + hout)) * sqrt(Δh * R_eff)
        delta_b = 0.66 * (dh_global / (H0 + Hout)) * Math.sqrt(dh_global * R_eff);
    }

    const W1 = W0 + delta_b;
    const half_W1 = W1 / 2;

    // 4. Construcción de la matriz de puntos de salida (X_out, Y_out) en el primer cuadrante
    let X_out = [];
    let Y_out = [];

    // --- TRAMO A: Zona de Contacto ---
    for (let i = 0; i <= idx_contacto; i++) {
        X_out.push(X_c[i]);
        Y_out.push(Y_luz[i]);
    }

    const x_cont = X_out[X_out.length - 1];
    const y_cont = Y_out[Y_out.length - 1];

    // --- TRAMO B: Zona Libre / Abombamiento Lateral (Curva parabólica) ---
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

    // Devuelve estrictamente el objeto { X, Y } del primer cuadrante listo para la rotación de 90°
    return {
        X: X_out,
        Y: Y_out
    };
}