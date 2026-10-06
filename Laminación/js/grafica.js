




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

