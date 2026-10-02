
let chartInstance = null;

/**
 * Grafica uno o dos cilindros. El segundo se dibuja con relleno interno.
 * @param {Object} cilindroGenerico - Cilindro principal (líneas).
 * @param {Object} [cilindroRelleno] - Cilindro opcional con área rellena.
 */
export function graficarCilindroGenerico1(cilindroGenerico, cilindroRelleno = null) {
    const canvasEl = document.getElementById("AH_graf");
    if (!canvasEl) return;

    // 1. Datos del Cilindro Principal (Líneas)
    const datosSup = cilindroGenerico.X_sup.map((xVal, index) => ({
        x: xVal,
        y: cilindroGenerico.Y_sup[index]
    }));

    const datosInf = cilindroGenerico.X_inf.map((xVal, index) => ({
        x: xVal,
        y: cilindroGenerico.Y_inf[index]
    }));

    // Construcción del conjunto de datasets
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

    // 2. Si se proporciona un segundo cilindro, lo añadimos con relleno
    if (cilindroRelleno) {
        const datosSupRelleno = cilindroRelleno.X_sup.map((xVal, index) => ({
            x: xVal,
            y: cilindroRelleno.Y_sup[index]
        }));

        const datosInfRelleno = cilindroRelleno.X_inf.map((xVal, index) => ({
            x: xVal,
            y: cilindroRelleno.Y_inf[index]
        }));

        // Línea superior del cilindro relleno
        datasets.push({
            id: 'rellenoSup',
            label: 'Cilindro Relleno (Superior)',
            data: datosSupRelleno,
            borderColor: 'rgba(0, 128, 0, 0.6)',
            borderWidth: 1,
            pointRadius: 0,
            fill: false // No se rellena hacia el eje Y
        });

        // Línea inferior del cilindro relleno (se rellena HASTA la línea superior '-1')
        datasets.push({
            id: 'rellenoInf',
            label: 'Cilindro Relleno (Área)',
            data: datosInfRelleno,
            borderColor: 'rgba(0, 128, 0, 0.6)',
            backgroundColor: 'rgba(0, 200, 80, 0.35)', // Color translúcido del relleno
            borderWidth: 1,
            pointRadius: 0,
            fill: '-1' // Rellena el espacio entre este dataset y el inmediatamente anterior ('rellenoSup')
        });
    }

    // Destruir instancia previa de Chart.js si existe
    if (chartInstance) {
        chartInstance.destroy();
    }

    const ctx = canvasEl.getContext("2d");
    chartInstance = new Chart(ctx, {
        type: "line",
        data: {
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom'
                },
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

