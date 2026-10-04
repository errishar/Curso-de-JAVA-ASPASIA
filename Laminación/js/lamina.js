import { cilindro_AH, cilindro_ovalo, cilindro_redondo, cilindro_C1 } from './cilindro.js';
import { aplicarLuz, simetria, truncarRelleno } from './calculos.js';
import { graficarCilindroGenerico } from './grafica.js';

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

    const pasadas = [
        {
            id: "AH",
            nombre: "Pasada 1 - Caja AH",
            tipo: "AH",
            B: 180.0,
            H: 46,
            R: 120,
            r: 8,
            a: 12,
            n: 100,
            Valor_luz: 10,
            R_transfor: 1.5
        },
        {
            id: "BH",
            nombre: "Pasada 2ª - Caja óvalo",
            tipo: "ovalo",
            B: 209.37,
            H: 39,
            R: 160,
            r: 10,
            a: 0,
            n: 100,
            Valor_luz: 5,
            R_transfor: 1.5
        },
        {
            id: "CV",
            nombre: "Pasada 3ª - Caja CV",
            tipo: "redondo",
            B: 120.09,
            H: 49,
            R: 55,
            r: 8,
            a: 30,
            n: 100,
            Valor_luz: 5,
            R_transfor: 1.5
        },
        {
            id: "C1",
            nombre: "Pasada 4ª - Caja C1",
            tipo: "C1",
            B: 140,
            H: 35,
            R1: 160,
            R2: 40,
            r: 8,
            a: 0,
            n: 100,
            Valor_luz: 2,
            R_transfor: 1.5
        }
    ];

    const contenedor = document.getElementById("contenedor-tablas");
    if (contenedor) contenedor.innerHTML = "";

    let areaEntradaActual = area_palanquilla_cuadrante;

    pasadas.forEach((p) => {
        let areaEntradaPaseCuadrante = areaEntradaActual;
        let areaSalidaPaseCuadrante = areaEntradaPaseCuadrante / p.R_transfor;

        let areaEntradaTotal = areaEntradaPaseCuadrante * 4;
        let areaSalidaTotal = areaSalidaPaseCuadrante * 4;

        let perfilCuadrante;
        if (p.tipo === "AH") {
            perfilCuadrante = cilindro_AH(p.n, p.B, p.H, p.R, p.r, p.a);
        } else if (p.tipo === "ovalo") {
            perfilCuadrante = cilindro_ovalo(p.n, p.B, p.H, p.R, p.r);
        } else if (p.tipo === "redondo") {
            perfilCuadrante = cilindro_redondo(p.n, p.B, p.H, p.R, p.r, p.a);
        } else if (p.tipo === "C1") {
            perfilCuadrante = cilindro_C1(p.n, p.B, p.H, p.R1, p.R2, p.r);
        }

        let perfilConLuz = aplicarLuz(perfilCuadrante, p.Valor_luz);
        let perfilSimetrico = simetria(perfilConLuz);

        let x_corte = calcular_X(perfilConLuz, areaSalidaPaseCuadrante);
        let rellenoSimetrico = truncarRelleno(perfilConLuz, x_corte);

        if (contenedor) {
            const card = document.createElement("div");
            card.className = "cilindro-card";
            
            const canvasId = `canvas_${p.id}`;

            const tipoCilindro = p.tipo || "AH";
            const areaEntradaFmt = areaEntradaTotal.toFixed(2);
            const areaSalidaFmt = areaSalidaTotal.toFixed(2);
            const rTransFmt = p.R_transfor ? p.R_transfor.toFixed(2) : "0.00";
            const luzVal = p.Valor_luz !== undefined ? p.Valor_luz : 0;

            card.innerHTML = `
    <h2>${p.nombre}</h2>
    <div class="pasada-content" style="display: flex; gap: 20px; align-items: flex-start; flex-wrap: wrap;">
        <div class="grafica-container" style="flex: 1; min-width: 300px; max-width: 800px;">
            <canvas id="${canvasId}"></canvas>
        </div>
        <div class="datos-pasada-card" style="background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 15px; min-width: 250px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <h3 style="margin-top: 0; font-size: 1.1em; color: #333; border-bottom: 2px solid #007bff; padding-bottom: 5px;">Datos de la Pasada</h3>
            
            <!-- TABLA DE DOS COLUMNAS -->
            <table style="width: 100%; border-collapse: collapse; font-size: 0.95em;">
                <tbody>
                    <tr style="border-bottom: 1px solid #dee2e6;">
                        <td style="padding: 6px 0; font-weight: bold; color: #495057;">Caja:</td>
                        <td style="padding: 6px 0; text-align: right; color: #212529;">${p.id}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #dee2e6;">
                        <td style="padding: 6px 0; font-weight: bold; color: #495057;">Tipo Cilindro:</td>
                        <td style="padding: 6px 0; text-align: right; color: #212529;">${tipoCilindro}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #dee2e6;">
                        <td style="padding: 6px 0; font-weight: bold; color: #495057;">Área Entrada:</td>
                        <td style="padding: 6px 0; text-align: right; color: #212529;">${areaEntradaFmt} mm²</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #dee2e6;">
                        <td style="padding: 6px 0; font-weight: bold; color: #495057;">Área Salida:</td>
                        <td style="padding: 6px 0; text-align: right; color: #212529;">${areaSalidaFmt} mm²</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #dee2e6;">
                        <td style="padding: 6px 0; font-weight: bold; color: #495057;">R. Transformación:</td>
                        <td style="padding: 6px 0; text-align: right; color: #212529;">${rTransFmt}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0; font-weight: bold; color: #495057;">Luz:</td>
                        <td style="padding: 6px 0; text-align: right; color: #212529;">${luzVal} mm</td>
                    </tr>
                </tbody>
            </table>

        </div>
    </div>
`;

            contenedor.appendChild(card);
            graficarCilindroGenerico(canvasId, perfilSimetrico, rellenoSimetrico);
        }

        areaEntradaActual = areaSalidaPaseCuadrante;
    });
});




/*  Esto es una idea para el futuro, para crear código


// 1. Función que actúa como plantilla (Generador del HTML)
function crearPlantillaCard(p, canvasId, tipoCilindro, areaEntradaFmt, areaSalidaFmt, rTransFmt, luzVal) {
    return `
        <h2>${p.nombre}</h2>
        <div class="pasada-content" style="display: grid; grid-template-columns: 1fr 260px; gap: 15px; align-items: start;">
            <div class="grafica-container" style="width: 100%;">
                <canvas id="${canvasId}"></canvas>
            </div>
            <div class="datos-pasada-card" style="background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <h3 style="margin-top: 0; font-size: 1.05em; color: #333; border-bottom: 2px solid #007bff; padding-bottom: 5px; margin-bottom: 8px;">Datos de la Pasada</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 0.88em;">
                    <tbody>
                        <tr style="border-bottom: 1px solid #dee2e6;">
                            <td style="padding: 5px 0; font-weight: bold; color: #495057;">Caja:</td>
                            <td style="padding: 5px 0; text-align: right; color: #212529;">${p.id}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #dee2e6;">
                            <td style="padding: 5px 0; font-weight: bold; color: #495057;">Tipo Cilindro:</td>
                            <td style="padding: 5px 0; text-align: right; color: #212529;">${tipoCilindro}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #dee2e6;">
                            <td style="padding: 5px 0; font-weight: bold; color: #495057;">Área Entrada:</td>
                            <td style="padding: 5px 0; text-align: right; color: #212529;">${areaEntradaFmt} mm²</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #dee2e6;">
                            <td style="padding: 5px 0; font-weight: bold; color: #495057;">Área Salida:</td>
                            <td style="padding: 5px 0; text-align: right; color: #212529;">${areaSalidaFmt} mm²</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #dee2e6;">
                            <td style="padding: 5px 0; font-weight: bold; color: #495057;">R. Transformación:</td>
                            <td style="padding: 5px 0; text-align: right; color: #212529;">${rTransFmt}</td>
                        </tr>
                        <tr>
                            <td style="padding: 5px 0; font-weight: bold; color: #495057;">Luz:</td>
                            <td style="padding: 5px 0; text-align: right; color: #212529;">${luzVal} mm</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// 2. Uso dentro del bucle para N pasadas
for (let i = 0; i < listaPasadas.length; i++) {
    const p = listaPasadas[i];
    const canvasId = `chart-pasada-${p.id}`;
    
    // Variables formateadas
    const tipoCilindro = p.tipoCilindro || 'C1';
    const areaEntradaFmt = p.areaEntrada?.toFixed(2) ?? '0.00';
    const areaSalidaFmt = p.areaSalida?.toFixed(2) ?? '0.00';
    const rTransFmt = p.rTrans?.toFixed(2) ?? '1.00';
    const luzVal = p.luz ?? 0;

    // Se crea el elemento card
    const card = document.createElement("div");
    card.className = "cilindro-card";
    
    // Se invoca la función plantilla pasando las variables requeridas
    card.innerHTML = crearPlantillaCard(p, canvasId, tipoCilindro, areaEntradaFmt, areaSalidaFmt, rTransFmt, luzVal);

    contenedor.appendChild(card);

    // Se renderiza el gráfico Chart.js
    graficarCilindroGenerico(canvasId, perfilSimetrico, rellenoSimetrico);
} */