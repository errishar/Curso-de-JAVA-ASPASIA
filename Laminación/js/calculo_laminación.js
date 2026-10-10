/*calculo_laminación.js*/
import { cilindro_AH, cilindro_ovalo, cilindro_redondo, cilindro_C1, cilindro_RSM } from './cilindro.js';
import { aplicarLuz, simetria, truncarRelleno, calcular_X, interpolarY } from './calculos.js';




/**
 * Genera la coordenada xCorte (medio ancho W1/2) genérica para cualquier perfil de cilindro y entrada
 * @param {Object} perfilConR - Objeto {X, Y, R} que define el perfil del cilindro en 1er cuadrante y la R del cilindro que le afecta
 * @param {Object} P_in - Objeto de la barra de entrada { W0, A0, obtenerAlturaEn(x) }
 * @param {number} g - Luz total entre cilindros (mm)
 * @param {number} R_nom - Radio nominal del cilindro (mm)
 * @param {number} alpha - Factor de ensanchamiento de Shinokura (default 0.85)
 * @param {number} nPasos - Puntos de integración numérica para garantizar precisión
 * @returns {number} xCorte - Coordenada X límite en el 1er cuadrante (W1 / 2)
 */
export function calcular_xCorte_Shinokura_Con_R_Local(perfilConR, P_in, g, R_nom, alpha = 0.85, nPasos = 100) {
    const W0 = P_in.W0;
    const A0 = P_in.A0;
    const half_W0 = W0 / 2;
    const half_g = g / 2;

    let Ah_cuadrante = 0;
    let suma_R_ponderado = 0;
    let dx = half_W0 / nPasos;

    for (let i = 0; i <= nPasos; i++) {
        let x = i * dx;
        let H0_x = P_in.obtenerAlturaEn(x);
        
        let Y_c_x = interpolarY(perfilConR, x);
        let Y_canal_total = 2 * (Y_c_x + half_g);

        let dh = Math.max(0, H0_x - Y_canal_total);

        if (i > 0) {
            let dh_prom = dh; // Aproximación de integración
            Ah_cuadrante += dh * dx;
        }

        if (dh > 0) {
            // Interpolar el radio local que le afecta a este punto x
            let R_loc_x = interpolarR(perfilConR, x, R_nom);
            
            // Ponderar el radio según la deformación local (dh)
            suma_R_ponderado += R_loc_x * dh;
        }
    }

    const Ah_total = Ah_cuadrante * 2;
    if (Ah_total <= 0) return half_W0;

    // Radio efectivo ponderado por el volumen de deformación local
    const R_eff = suma_R_ponderado / (Ah_cuadrante > 0 ? (Ah_cuadrante) : 1);

    const H0_eq = A0 / W0;
    const dH_eq = Ah_total / W0;

    // Fórmula de Shinokura-Takai usando el R_eff ponderado
    const factorGeom = Math.sqrt(R_eff * dH_eq) / (W0 + 0.5 * H0_eq);
    const W1 = W0 * (1 + alpha * (Ah_total / A0) * factorGeom);

    return W1 / 2;
}