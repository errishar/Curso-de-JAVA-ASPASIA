import { cilindro_AH, cilindro_ovalo, cilindro_redondo, cilindro_C1, cilindro_RSM } from './cilindro.js';
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
            nombre: "Caja AH",
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
            nombre: "Caja BH",
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
            nombre: "Caja CV",
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
            nombre: "Caja 1",
            tipo: "C1",
            B: 140,
            H: 35,
            R1: 160,
            R2: 40,
            r: 8,
            a: 0,
            n: 100,
            Valor_luz: 16,
            R_transfor: 1.116
        },
        {
            id: "C2",
            nombre: "Caja C2",
            tipo: "ovalo",
            B: 146.64,
            H: 28,
            R: 110,
            r: 8,
            a: 0,
            n: 100,
            Valor_luz: 13,
            R_transfor: 1.183
        },
        {
            id: "C3",
            nombre: "Caja C3",
            tipo: "redondo",
            B: 90.3,
            H: 36,
            R: 42.2,
            r: 6,
            a: 30,
            n: 100,
            Valor_luz: 14,
            R_transfor: 1.21
        },{
            id: "C4",
            nombre: "Caja C4",
            tipo: "ovalo",
            B: 112.62,
            H: 21,
            R: 86,
            r: 6,
            a: 0,
            n: 100,
            Valor_luz: 12,
            R_transfor: 1.227
        },
        {
            id: "C5",
            nombre: "Caja C5",
            tipo: "redondo",
            B: 69.28,
            H: 27,
            R: 33,
            r: 4,
            a: 30,
            n: 100,
            Valor_luz: 12,
            R_transfor: 1.219
        },{
            id: "C6",
            nombre: "Caja C6",
            tipo: "ovalo",
            B: 86.16,
            H: 16,
            R: 66,
            r: 6,
            a: 0,
            n: 100,
            Valor_luz: 10,
            R_transfor: 1.228,
        },
        {
            id: "C7",
            nombre: "Caja C7",
            tipo: "redondo",
            B: 53.12,
            H: 21,
            R: 25,
            r: 4,
            a: 30,
            n: 100,
            Valor_luz: 10,
            R_transfor: 1.213
        },{
            id: "C8",
            nombre: "Caja C8",
            tipo: "ovalo",
            B: 65.36,
            H: 12,
            R: 50.5,
            r: 4,
            a: 0,
            n: 100,
            Valor_luz: 9,
            R_transfor: 1.22
        },
        {
            id: "C9",
            nombre: "Caja C9",
            tipo: "redondo",
            B: 42.15,
            H: 16.5,
            R: 20,
            r: 4,
            a: 30,
            n: 100,
            Valor_luz: 7,
            R_transfor: 1.22
        },{
            id: "C10",
            nombre: "Caja C10",
            tipo: "ovalo",
            B: 52.65,
            H: 9,
            R: 43,
            r: 4,
            a: 0,
            n: 100,
            Valor_luz: 6.8,
            R_transfor: 1.225
        },
        {
            id: "C11",
            nombre: "Caja C11",
            tipo: "redondo",
            B: 33.20,
            H: 13,
            R: 15.75,
            r: 3,
            a: 30,
            n: 100,
            Valor_luz: 6,
            R_transfor: 1.3
        },{
            id: "C12",
            nombre: "Caja C12",
            tipo: "ovalo",
            B: 39.33,
            H: 8.5,
            R: 27,
            r: 1.5,
            a: 0,
            n: 100,
            Valor_luz: 5,
            R_transfor: 1.3
        },
        {
            id: "C13",
            nombre: "Caja C13",
            tipo: "redondo",
            B: 26.79,
            H: 10.7,
            R: 12.5,
            r: 1.5,
            a: 30,
            n: 100,
            Valor_luz: 5,
            R_transfor: 1.3
        },{
            id: "C14",
            nombre: "Caja C14",
            tipo: "ovalo",
            B: 35.46,
            H: 5.8,
            R: 30,
            r: 1.5,
            a: 0,
            n: 100,
            Valor_luz: 5,
            R_transfor: 1.3
        },
        {
            id: "C15",
            nombre: "Caja C15",
            tipo: "redondo",
            B: 20.78,
            H: 8.2,
            R: 9.8,
            r: 1.5,
            a: 30,
            n: 100,
            Valor_luz: 5,
            R_transfor: 1.13
        },{
            id: "C16",
            nombre: "Caja C16",
            tipo: "ovalo",
            B: 27.95,
            H: 5.5,
            R: 20.5,
            r: 1.5,
            a: 0,
            n: 100,
            Valor_luz: 3,
            R_transfor: 1.3
        },
        {
            id: "C17",
            nombre: "Caja C17",
            tipo: "redondo",
            B: 17.9,
            H: 7,
            R: 8.5,
            r: 1.5,
            a: 30,
            n: 100,
            Valor_luz: 3.15,
            R_transfor: 1.3
        },{
            id: "C18",
            nombre: "Caja C18",
            tipo: "ovalo",
            B: 21.22,
            H: 4.2,
            R: 15.5,
            r: 1.5,
            a: 0,
            n: 100,
            Valor_luz: 3.27,
            R_transfor: 1.3
        },
        {
            id: "C19",
            nombre: "Caja C19",
            tipo: "redondo",
            B: 12.9,
            H: 5.5,
            R: 6.35,
            r: 0,
            a: 20,
            n: 100,
            Valor_luz: 2.1,
            R_transfor: 1.3
        },{
            id: "C20",
            nombre: "Caja C20",
            tipo: "ovalo",
            B: 18.89,
            H: 3.5,
            R: 14.5,
            r: 1.5,
            a: 0,
            n: 100,
            Valor_luz: 2.11,
            R_transfor: 1.13
        },
        {
            id: "C21",
            nombre: "Caja C21",
            tipo: "redondo",
            B: 11.3,
            H: 4.75,
            R: 5.6,
            r: 0,
            a: 20,
            n: 100,
            Valor_luz: 1.85,
            R_transfor: 1.13
        },{
            id: "C22",
            nombre: "Caja C22",
            tipo: "ovalo",
            B: 18.89,
            H: 3.5,
            R: 14.5,
            r: 1.5,
            a: 0,
            n: 100,
            Valor_luz: 1.19,
            R_transfor: 1.13
        },
        {
            id: "C23",
            nombre: "Caja C23",
            tipo: "redondo",
            B: 9.42,
            H: 3.8,
            R: 4.56,
            r: 0,
            a: 25,
            n: 100,
            Valor_luz: 1.4,
            R_transfor: 1.3
        },{
            id: "C24",
            nombre: "Caja C24",
            tipo: "ovalo",
            B: 13.56,
            H: 2.1,
            R: 12,
            r: 1.5,
            a: 0,
            n: 100,
            Valor_luz: 1.1,
            R_transfor: 1.3
        },
        {
            id: "C25",
            nombre: "Caja C25",
            tipo: "redondo",
            B: 7.69,
            H: 3.1,
            R: 3.68,
            r: 0,
            a: 25,
            n: 100,
            Valor_luz: 0.9,
            R_transfor: 1.3
        },{
            id: "C26",
            nombre: "Caja C26",
            tipo: "ovalo",
            B: 9.48,
            H: 1.35,
            R: 19,
            r: 1.5,
            a: 0,
            n: 100,
            Valor_luz: 1.2,
            R_transfor: 1
        },
        /*cilindro_RSM(n = 100, B = 120.09, H = 49, R = 55, a = 30, z=2) */
        {
            id: "C27", /*cilindro_RSM(p.n, p.B, p.H, p.R, p.a, p.z)*/
            nombre: "Caja C27",
            tipo: "RSM",
            B: 6.22,
            H: 2.45,
            R: 2.74,
            a: 100,
            z: 2,
            n: 100,
            Valor_luz: 1.25, /* 1.25,*/
            R_transfor: 1.3/*1.3*/
        },
        {
            id: "C28", /*cilindro_RSM(p.n, p.B, p.H, p.R, p.a, p.z)*/
            nombre: "Caja C28",
            tipo: "RSM",
            B: 6.43,
            H: 2.24,
            R: 2.96,
            a: 90,
            z: 3,
            n: 100,
            Valor_luz: 1.2,
            R_transfor: 1.1
        },{
            id: "C29", /*cilindro_RSM(p.n, p.B, p.H, p.R, p.a, p.z)*/
            nombre: "Caja C29",
            tipo: "RSM",
            B: 5.87,
            H: 2.29,
            R: 2.79,
            a: 117,
            z: 3,
            n: 100,
            Valor_luz: 1.2,
            R_transfor: 1
        },
        
        
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
        } else if (p.tipo === "RSM") {
            perfilCuadrante = cilindro_RSM(p.n, p.B, p.H, p.R, p.a, p.z)
        } 
        

        let perfilConLuz = aplicarLuz(perfilCuadrante, p.Valor_luz);
        let perfilSimetrico = simetria(perfilConLuz);

        let x_corte = calcular_X(perfilConLuz, areaSalidaPaseCuadrante);
        let rellenocuadrante = truncarRelleno(perfilConLuz, x_corte);
        let rellenoSimetrico = simetria(rellenocuadrante);
        /*console.log("Relleno X: " + rellenocuadrante.X);*/
        if (contenedor) {
            const card = document.createElement("div");
            card.className = "cilindro-card";
            
            const canvasId = `canvas_${p.id}`;

            const tipoCilindro = p.tipo || "AH";
            const areaEntradaFmt = areaEntradaTotal.toFixed(2);
            const areaSalidaFmt = areaSalidaTotal.toFixed(2);
            const rTransFmt = p.R_transfor ? p.R_transfor.toFixed(2) : "0.00";
            const luzVal = p.Valor_luz !== undefined ? p.Valor_luz : 0;
            const anchomax= (Math.max(...rellenocuadrante.X)*2).toFixed(2);
            const altomax= (Math.max(...rellenocuadrante.Y)*2).toFixed(2);

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
                    <tr style="border-bottom: 1px solid #dee2e6;">
                        <td style="padding: 6px 0; font-weight: bold; color: #495057;">Luz:</td>
                        <td style="padding: 6px 0; text-align: right; color: #212529;">${luzVal} mm</td>
                    </tr>
                     <tr style="border-bottom: 1px solid #dee2e6;">
                        <td style="padding: 6px 0; font-weight: bold; color: #495057;">Ancho de figura:</td>
                        <td style="padding: 6px 0; text-align: right; color: #212529;">${anchomax} mm</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #dee2e6;">
                        <td style="padding: 6px 0; font-weight: bold; color: #495057;">Alto de figura:</td>
                        <td style="padding: 6px 0; text-align: right; color: #212529;">${altomax} mm</td>
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