

import { pasadas_55 } from './pasadas.js';


const chartsInstances = {};

export function graficarCilindroGenerico(canvasId, cilindroGenerico, cilindroRelleno = null) {
    const canvasEl = document.getElementById(canvasId);
    if (!canvasEl) return;

    // 1. Mapeo de datos exteriores
    const datosSup = cilindroGenerico.X_sup.map((xVal, i) => ({ x: xVal, y: cilindroGenerico.Y_sup[i] }));
    const datosInf = cilindroGenerico.X_inf.map((xVal, i) => ({ x: xVal, y: cilindroGenerico.Y_inf[i] }));

    // 2. Límites máximos para escala isométrica 1:1
    const maxAbsX = Math.max(...cilindroGenerico.X_sup.map(x => Math.abs(x)));
    const maxAbsY = Math.max(...cilindroGenerico.Y_sup.map(y => Math.abs(y)));

    const limiteX = Math.ceil(maxAbsX + 5);
    const limiteY = Math.ceil(maxAbsY + 5);

    const datasets = [
        {
            label: 'Perfil Superior',
            data: datosSup,
            borderColor: 'blue',
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            pointRadius: 0
        },
        {
            label: 'Perfil Inferior',
            data: datosInf,
            borderColor: 'red',
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            pointRadius: 0
        }
    ];

    // 3. Polígono de Relleno (Tapa Superior -> Tapa Inferior -> Cierre)
    if (cilindroRelleno && cilindroRelleno.X_sup && cilindroRelleno.X_sup.length > 0) {
        let poligonoRelleno = [];

        // Borde superior: de -xCorte a +xCorte
        for (let i = 0; i < cilindroRelleno.X_sup.length; i++) {
            poligonoRelleno.push({ x: cilindroRelleno.X_sup[i], y: cilindroRelleno.Y_sup[i] });
        }

        // Borde inferior: de +xCorte a -xCorte
        for (let i = cilindroRelleno.X_inf.length - 1; i >= 0; i--) {
            poligonoRelleno.push({ x: cilindroRelleno.X_inf[i], y: cilindroRelleno.Y_inf[i] });
        }

        // Cierre inicial
        if (poligonoRelleno.length > 0) {
            poligonoRelleno.push({ ...poligonoRelleno[0] });
        }

        datasets.push({
            label: 'Relleno',
            data: poligonoRelleno,
            borderColor: 'green',
            backgroundColor: 'rgba(0, 200, 80, 0.45)',
            borderWidth: 1,
            pointRadius: 0,
            fill: 'shape',
            showLine: true
        });
    }

    if (chartsInstances[canvasId]) {
        chartsInstances[canvasId].destroy();
    }

    const ctx = canvasEl.getContext("2d");
    chartsInstances[canvasId] = new Chart(ctx, {
        type: "line",
        data: { datasets: datasets },
        options: {
            responsive: true,
            maintainAspectRatio: true, // MANTIENE PROPORCIÓN 1:1 REAL
            aspectRatio: limiteX / limiteY, // CALCULA EL ASPECT RATIO DINÁMICO SEGÚN LA GEOMETRÍA
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    min: -limiteX,
                    max: limiteX
                },
                y: {
                    min: -limiteY,
                    max: limiteY
                }
            }
        }
    });
}


// 2. FUNCIÓN DE RENDERIZADO GENERAL Y CÁLCULO
export function actualizarPasadas() {
    const contenedor = document.getElementById("contenedor-tablas");
    if (!contenedor) return;
    
    // 1. GUARDAR LA POSICIÓN DEL SCROLL ANTES DE REBUILD
    const scrollPos = window.scrollY;

    contenedor.innerHTML = ""; // Limpiar antes de volver a dibujar

    let areaEntradaActual = area_palanquilla_cuadrante;

    pasadas.forEach((p) => {
        // Tomar el valor modificado si existe, de lo contrario tomar el por defecto
        let rTransVal = p.R_transfor_modificado !== undefined ? p.R_transfor_modificado : p.R_transfor;
        let luzVal = p.Valor_luz_modificado !== undefined ? p.Valor_luz_modificado : p.Valor_luz;

        let areaEntradaPaseCuadrante = areaEntradaActual;
        let areaSalidaPaseCuadrante = areaEntradaPaseCuadrante / rTransVal;

        let areaEntradaTotal = areaEntradaPaseCuadrante * 4;
        let areaSalidaTotal = areaSalidaPaseCuadrante * 4;

        // Generar Geometría del perfil
        let perfilCuadrante;
        if (p.tipo === "AH") perfilCuadrante = cilindro_AH(p.n, p.B, p.H, p.R, p.r, p.a);
        else if (p.tipo === "ovalo") perfilCuadrante = cilindro_ovalo(p.n, p.B, p.H, p.R, p.r);
        else if (p.tipo === "redondo") perfilCuadrante = cilindro_redondo(p.n, p.B, p.H, p.R, p.r, p.a);
        else if (p.tipo === "C1") perfilCuadrante = cilindro_C1(p.n, p.B, p.H, p.R1, p.R2, p.r);
        else if (p.tipo === "RSM") perfilCuadrante = cilindro_RSM(p.n, p.B, p.H, p.R, p.a, p.z);

        let perfilConLuz = aplicarLuz(perfilCuadrante, luzVal);
        let perfilSimetrico = simetria(perfilConLuz);

        let x_corte = calcular_X(perfilConLuz, areaSalidaPaseCuadrante);
        let rellenocuadrante = truncarRelleno(perfilConLuz, x_corte);
        let rellenoSimetrico = simetria(rellenocuadrante);

        // Crear Tarjeta
        const card = document.createElement("div");
        card.className = "cilindro-card";
        const canvasId = `canvas_${p.id}`;

        const tipoCilindro = p.tipo || "AH";
        const areaEntradaFmt = areaEntradaTotal.toFixed(2);
        const areaSalidaFmt = areaSalidaTotal.toFixed(2);
        const rTransFmt = rTransVal.toFixed(2);
        const anchomax = (Math.max(...rellenocuadrante.X) * 2).toFixed(2);
        const altomax = (Math.max(...rellenocuadrante.Y) * 2).toFixed(2);

        // PLANTILLA HTML CON DOS BOTONES RESET INDEPENDIENTES
        card.innerHTML = `
    <h2>${p.nombre}</h2>
    <div class="pasada-content" style="display: flex; gap: 20px; align-items: flex-start; flex-wrap: wrap;">
        <div class="grafica-container" style="flex: 1; min-width: 300px; max-width: 800px;">
            <canvas id="${canvasId}"></canvas>
            
            <!-- CONTROLES Y RESETS INDEPENDIENTES (COLUMNA IZQUIERDA) -->
            <div style="margin-top: 15px; border-top: 1px solid #dee2e6; padding-top: 10px;">
                <div style="margin-bottom: 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <label style="font-size: 0.85em; font-weight: bold;">R. Transformación: 
                            <input type="number" class="input-rtrans-num" data-id="${p.id}" value="${rTransFmt}" 
                                   min="${(0.5 * p.R_transfor).toFixed(2)}" max="${(2 * p.R_transfor).toFixed(2)}" step="0.01" 
                                   style="width: 70px; padding: 2px 4px; font-size: 0.9em; text-align: right; margin-left: 5px;">
                        </label>
                        <button class="btn-reset-param" data-id="${p.id}" data-param="rtrans" style="background: none; border: none; color: #007bff; cursor: pointer; font-size: 0.8em;">↺ Reset R.T.</button>
                    </div>
                    <input type="range" class="slider-rtrans" data-id="${p.id}" min="${(0.5 * p.R_transfor).toFixed(2)}" max="${(2 * p.R_transfor).toFixed(2)}" step="0.01" value="${rTransVal}" style="width: 100%;">
                </div>
                <div style="margin-bottom: 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <label style="font-size: 0.85em; font-weight: bold;">Luz (mm): 
                            <input type="number" class="input-luz-num" data-id="${p.id}" value="${luzVal}" 
                                   min="${(0.5 * p.Valor_luz).toFixed(2)}" max="${(1.5 * p.Valor_luz).toFixed(2)}" step="0.1" 
                                   style="width: 70px; padding: 2px 4px; font-size: 0.9em; text-align: right; margin-left: 5px;">
                        </label>
                        <button class="btn-reset-param" data-id="${p.id}" data-param="luz" style="background: none; border: none; color: #007bff; cursor: pointer; font-size: 0.8em;">↺ Reset Luz</button>
                    </div>
                    <input type="range" class="slider-luz" data-id="${p.id}" min="${(0.5 * p.Valor_luz).toFixed(2)}" max="${(1.5 * p.Valor_luz).toFixed(2)}" step="0.1" value="${luzVal}" style="width: 100%;">
                </div>
                <button class="btn-reset-todo" data-id="${p.id}" style="width: 100%; background-color: #6c757d; color: white; border: none; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 0.85em; margin-top: 5px;">↺ Restablecer Todo</button>
            </div>
        </div>

        <div class="datos-pasada-card" style="background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 15px; min-width: 250px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <h3 style="margin-top: 0; font-size: 1.1em; color: #333; border-bottom: 2px solid #007bff; padding-bottom: 5px;">Datos de la Pasada</h3>
            
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

        // Actualizar el área de entrada para el pase subsiguiente
        areaEntradaActual = areaSalidaPaseCuadrante;
    });

    // Reenganchar eventos a los elementos recién creados
    vincularEventosControles();
    
    // 2. RESTAURAR LA POSICIÓN DEL SCROLL
    window.scrollTo({
        top: scrollPos,
        behavior: 'instant'
    });
}

// 3. LISTENERS DE EVENTOS (SLIDERS Y BOTONES)
export function vincularEventosControles() {
    // Escuchar desplazamientos en sliders
    document.querySelectorAll('.slider-rtrans, .slider-luz').forEach(slider => {
        slider.addEventListener('input', (e) => {
            const idCaja = e.target.dataset.id;
            const valor = parseFloat(e.target.value);
            const esLuz = e.target.classList.contains('slider-luz');

            let pasada = pasadas.find(p => p.id === idCaja);
            if (pasada) {
                if (esLuz) {
                    pasada.Valor_luz_modificado = valor;
                } else {
                    pasada.R_transfor_modificado = valor;
                }
                actualizarPasadas();
            }
        });
    });


    //  Escuchar inputs numéricos (al escribir o cambiar con las flechitas)
    document.querySelectorAll('.input-rtrans-num, .input-luz-num').forEach(input => {
        input.addEventListener('change', (e) => {
            const idCaja = e.target.dataset.id;
            let valor = parseFloat(e.target.value);
            const esLuz = e.target.classList.contains('input-luz-num');

            if (isNaN(valor)) return;

            let pasada = pasadas.find(p => p.id === idCaja);
            if (pasada) {
                if (esLuz) {
                    pasada.Valor_luz_modificado = valor;
                } else {
                    pasada.R_transfor_modificado = valor;
                }
                actualizarPasadas();
            }
        });
    });

    // Escuchar botones de Reset individual (Luz o R. Transformación)
    document.querySelectorAll('.btn-reset-param').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idCaja = e.target.dataset.id;
            const param = e.target.dataset.param;
            let pasada = pasadas.find(p => p.id === idCaja);

            if (pasada) {
                if (param === 'luz') {
                    delete pasada.Valor_luz_modificado;
                } else if (param === 'rtrans') {
                    delete pasada.R_transfor_modificado;
                }
                actualizarPasadas();
            }
        });
    });

    // Escuchar botón de Restablecer Todo
    document.querySelectorAll('.btn-reset-todo').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idCaja = e.target.dataset.id;
            let pasada = pasadas.find(p => p.id === idCaja);
            if (pasada) {
                delete pasada.Valor_luz_modificado;
                delete pasada.R_transfor_modificado;
                actualizarPasadas();
            }
        });
    });
}
