let chartInstance = null;

/**
 * Recibe un objeto cilindro genérico con la estructura:
 * { X_sup: [...], Y_sup: [...], X_inf: [...], Y_inf: [...] }
 * y genera o actualiza la gráfica en Chart.js.
 */
export function graficarCilindroGenerico(cilindroGenerico) {
    const canvasEl = document.getElementById("AH_graf");
    if (!canvasEl) return;

    // Formatear los datos para Chart.js
    const datosSup = cilindroGenerico.X_sup.map((xVal, index) => ({
        x: xVal,
        y: cilindroGenerico.Y_sup[index]
    }));

    const datosInf = cilindroGenerico.X_inf.map((xVal, index) => ({
        x: xVal,
        y: cilindroGenerico.Y_inf[index]
    }));

    // Si ya existe una instancia del gráfico, la destruimos antes de redibujar
    if (chartInstance) {
        chartInstance.destroy();
    }

    const ctx = canvasEl.getContext("2d");
    chartInstance = new Chart(ctx, {
        type: "line",
        data: {
            datasets: [
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
            ]
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



