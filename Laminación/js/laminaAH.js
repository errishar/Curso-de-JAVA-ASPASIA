import { cilindro_AH, cilindro_ovalo } from './cilindro.js';
import { linespace, simetria, aplicarLuz, calcular_X, truncarCilindro } from './calculos.js';
import { graficarCilindroGenerico } from './grafica.js';


document.addEventListener("DOMContentLoaded", () => {
    // -------------------------------------------------------------
    // 1. DATOS DE ENTRADA Y PARÁMETROS GEOMÉTRICOS
    // -------------------------------------------------------------
    let palanquilla = 150;
    let area_palanquilla = Math.pow(palanquilla, 2);
    let area_palanquilla_cuadrante = area_palanquilla / 4; // Trabajo exclusivo en 1er cuadrante

    let B = 180;
    let H = 46;
    let a = 12;
    let R = 15;
    let r = 8;
    let n = 100;
    let valorLuz = 25;

    let R_AH = 1.4; // Coeficiente / relación de reducción
    let Area_AH = area_palanquilla_cuadrante / R_AH; // Área objetivo del cuadrante

    // -------------------------------------------------------------
    // 2. CÁLCULOS (EXCLUSIVAMENTE EN EL PRIMER CUADRANTE)
    // -------------------------------------------------------------
    // A) Generar perfil base del cuadrante
    let AH = cilindro_AH(n, B, H, R, r, a);
    
    // B) Aplicar luz al primer cuadrante
    let AH_luz = aplicarLuz(AH, valorLuz);

    // C) Calcular el punto de corte X correspondiente al área del cuadrante
    let x_AH = calcular_X(AH_luz, Area_AH, 0.001);

    // D) Truncar la curva del cuadrante en el valor x_AH
    let Relleno_AH_cuadrante = truncarCilindro(AH_luz, x_AH);

    // -------------------------------------------------------------
    // 3. PREPARACIÓN PARA REPRESENTACIÓN GRÁFICA (APLICAR SIMETRÍA)
    // -------------------------------------------------------------
    // Generamos el espejo simétrico únicamente para enviar a la gráfica
    let AH_sim = simetria(AH_luz);
    let Relleno_AH_sim = simetria(Relleno_AH_cuadrante);

    // Renderizado en el Canvas de Chart.js
    graficarCilindroGenerico(AH_sim, Relleno_AH_sim);

    // -------------------------------------------------------------
    // 4. SALIDA DE DATOS EN EL DOM
    // -------------------------------------------------------------
    const contenedor = document.getElementById("AH_luz");
    if (contenedor) {
        contenedor.innerHTML = `
            <strong>Resultados del cálculo (1er Cuadrante):</strong><br>
            • Luz aplicada: ${valorLuz} mm<br>
            • La R de laminación aplicada: ${R_AH}<br>;
            • Área de palanquilla: ${area_palanquilla.toFixed(2)} mm²<br>
            • Área salida (Area_AH): ${4*Area_AH.toFixed(2)} mm²<br>
            • Ancho de la figura: ${2*x_AH.toFixed(2)} mm <br>
            • La altura máxima de la figura: ${(2 * Math.max(...Relleno_AH_cuadrante.Y)).toFixed(2)} mm <br>
        `;
    }
});
