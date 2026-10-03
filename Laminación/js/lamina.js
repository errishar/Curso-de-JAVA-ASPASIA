import { cilindro_AH, cilindro_ovalo } from './cilindro.js';
import { aplicarLuz, simetria, truncarRelleno } from './calculos.js';
import { graficarCilindroGenerico } from './grafica.js';

// Función para calcular el punto de corte X donde la curva encierra el área deseada
function calcular_X(perfil, areaObjetivo) {
    let areaAcumulada = 0;
    for (let i = 1; i < perfil.X.length; i++) {
        let dx = perfil.X[i] - perfil.X[i - 1];
        let yPromedio = (perfil.Y[i] + perfil.Y[i - 1]) / 2;
        areaAcumulada += yPromedio * dx;
        if (areaAcumulada >= areaObjetivo) {
            return perfil.X[i];
        }
    }
    return perfil.X[perfil.X.length - 1];
}

document.addEventListener("DOMContentLoaded", () => {
    let palanquilla = 150;
    let area_palanquilla_cuadrante = Math.pow(palanquilla, 2) / 4; // 5625 mm² (por cuadrante)

    // Definición de la secuencia de pasadas
    const pasadas = [
        {
            id: "AH",
            nombre: "Pasada 1 - Perfil AH",
            tipo: "AH",
            B: 180.0,
            H: 46,
            R: 120,
            r: 8,
            a: 12,
            n: 100,
            Valor_luz: 20,
            R_transfor: 1.5
        },
        {
            id: "Cv",
            nombre: "Pasada 2 - Perfil óvalo",
            tipo: "ovalo",
            B: 209.37,
            H: 39,
            R: 160,
            r: 10,
            a: 0,
            n: 100,
            Valor_luz: 10,
            R_transfor: 1.5
        }
    ];

    const contenedor = document.getElementById("contenedor-tablas");
    if (contenedor) contenedor.innerHTML = "";

    // Variable acumuladora del área para el cuadrante
    let areaEntradaActual = area_palanquilla_cuadrante;

    pasadas.forEach((p, idx) => {
        // --- 0. Cálculos de Áreas ---
        let areaEntradaPaseCuadrante = areaEntradaActual;
        let areaSalidaPaseCuadrante = areaEntradaPaseCuadrante / p.R_transfor;

        // Convertir a áreas totales (multiplicando los cuadrantes por 4)
        let areaEntradaTotal = areaEntradaPaseCuadrante * 4;
        let areaSalidaTotal = areaSalidaPaseCuadrante * 4;

        // --- 1. Calcular la geometría en el 1er cuadrante según el tipo ---
        let perfilCuadrante;
        if (p.tipo === "AH") {
            perfilCuadrante = cilindro_AH(p.n, p.B, p.H, p.R, p.r, p.a);
        } else {
            perfilCuadrante = cilindro_ovalo(p.n, p.B, p.H, p.R, p.r);
        }

        // --- 2. Aplicar la luz (+luz/2 en Y) ---
        let perfilConLuz = aplicarLuz(perfilCuadrante, p.Valor_luz);

        // --- 3. Generar la simetría completa (-X a +X, +Y superior e -Y inferior) ---
        let perfilSimetrico = simetria(perfilConLuz);

        // --- 4. Calcular el relleno truncado según el área de salida ---
        let x_corte = calcular_X(perfilConLuz, areaSalidaPaseCuadrante);
        let rellenoSimetrico = truncarRelleno(perfilConLuz, x_corte);

        // --- 5. Crear dinámicamente la tarjeta HTML y el Canvas para la pasada ---
        if (contenedor) {
            const card = document.createElement("div");
            card.className = "cilindro-card";
            
            const canvasId = `canvas_${p.id}`;

            // Mapeo seguro de propiedades calculadas
            const tipoCilindro = p.tipo || "AH";
            const areaEntradaFmt = areaEntradaTotal.toFixed(2);
            const areaSalidaFmt = areaSalidaTotal.toFixed(2);
            const rTransFmt = p.R_transfor ? p.R_transfor.toFixed(2) : "0.00";
            const luzVal = p.Valor_luz !== undefined ? p.Valor_luz : 0;

            card.innerHTML = `
                <h2>${p.nombre}</h2>
                <div class="pasada-content" style="display: flex; gap: 20px; align-items: flex-start; flex-wrap: wrap;">
                    
                    <!-- Contenedor de la gráfica -->
                    <div class="grafica-container" style="flex: 1; min-width: 300px; max-width: 800px;">
                        <canvas id="${canvasId}"></canvas>
                    </div>

                    <!-- Letrero de datos de la pasada -->
                    <div class="datos-pasada-card" style="background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 15px; min-width: 230px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                        <h3 style="margin-top: 0; font-size: 1.1em; color: #333; border-bottom: 2px solid #007bff; padding-bottom: 5px;">Datos de la Pasada</h3>
                        <p style="margin: 8px 0;"><strong>ID Pasada:</strong> <span>${p.id}</span></p>
                        <p style="margin: 8px 0;"><strong>Tipo Cilindro:</strong> <span>${tipoCilindro}</span></p>
                        <p style="margin: 8px 0;"><strong>Área Entrada:</strong> <span>${areaEntradaFmt} mm²</span></p>
                        <p style="margin: 8px 0;"><strong>Área Salida:</strong> <span>${areaSalidaFmt} mm²</span></p>
                        <p style="margin: 8px 0;"><strong>R. Transformación:</strong> <span>${rTransFmt}</span></p>
                        <p style="margin: 8px 0;"><strong>Luz:</strong> <span>${luzVal} mm</span></p>
                    </div>

                </div>
            `;

            contenedor.appendChild(card);

            // --- 6. Graficar usando el canvasId recién creado ---
            graficarCilindroGenerico(canvasId, perfilSimetrico, rellenoSimetrico);
        }

        // --- 7. Acumular el área para que la salida de esta pasada sea la entrada de la siguiente ---
        areaEntradaActual = areaSalidaPaseCuadrante;
    });
});