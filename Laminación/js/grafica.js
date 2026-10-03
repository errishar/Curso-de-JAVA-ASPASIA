let chartInstance = null;

export function graficarCilindroGenerico(cilindroGenerico, cilindroRelleno = null) {
    const canvasEl = document.getElementById("AH_graf");
    if (!canvasEl) return;

    // 1. Perfiles de cilindro exterior
    const datosSup = cilindroGenerico.X_sup.map((xVal, index) => ({
        x: xVal,
        y: cilindroGenerico.Y_sup[index]
    }));

    const datosInf = cilindroGenerico.X_inf.map((xVal, index) => ({
        x: xVal,
        y: cilindroGenerico.Y_inf[index]
    }));

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

    // 2. Polígono de relleno continuo con color sólido/translúcido
    if (cilindroRelleno && cilindroRelleno.X_sup.length > 0) {
        let poligonoRelleno = [];

        // A) Tramo superior (-x_corte -> +x_corte)
        for (let i = 0; i < cilindroRelleno.X_sup.length; i++) {
            poligonoRelleno.push({
                x: cilindroRelleno.X_sup[i],
                y: cilindroRelleno.Y_sup[i]
            });
        }

        // B) Tramo inferior en sentido inverso (+x_corte -> -x_corte)
        for (let i = cilindroRelleno.X_inf.length - 1; i >= 0; i--) {
            poligonoRelleno.push({
                x: cilindroRelleno.X_inf[i],
                y: cilindroRelleno.Y_inf[i]
            });
        }

        // C) Cerramos el polígono volviendo al primer punto
        poligonoRelleno.push({ ...poligonoRelleno[0] });

        datasets.push({
            label: 'Relleno',
            data: poligonoRelleno,
            borderColor: 'green',
            backgroundColor: 'rgba(0, 200, 80, 0.45)', // Verde translúcido para el área
            borderWidth: 1,
            pointRadius: 0,
            fill: 'shape', // Fuerza a Chart.js a rellenar el cuerpo del polígono
            showLine: true
        });
    }

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



/*
En Chart.js (versiones 3 y 4), la propiedad fill del dataset define cómo y hacia dónde se rellena el área de un gráfico de líneas (line).
Las opciones disponibles se dividen en cuatro categorías según el comportamiento deseado:

1. Valores absolutos y de forma
    fill: 'shape': Rellena la forma poligonal cerrada definida por la propia secuencia de puntos del dataset (de principio a fin). Es la opción ideal para dibujar geometrías personalizadas o superficies cerradas sin proyectar hacia los ejes.   
    fill: 'origin': Rellena desde la línea hacia el origen de coordenadas ($y = 0$). Si la línea está por encima de cero rellena hacia abajo, y si está por debajo rellena hacia arriba.fill: 'start': Rellena desde la línea hasta el límite inferior del gráfico (el borde del eje Y).
    fill: 'end': Rellena desde la línea hasta el límite superior del gráfico.fill: false: Desactiva el relleno por completo, dibujando únicamente el trazo o borde de la línea.

2. Relleno entre datasets (Relativo)Permite rellenar la franja comprendida entre el dataset actual y otro dataset del mismo gráfico:Paso relativo ('-1', '+1', '-2'): Indicado como cadena de texto.fill: '-1': Rellena el espacio entre este dataset y el dataset inmediatamente anterior en el arreglo.fill: '+1': Rellena el espacio hacia el dataset siguiente.Índice absoluto (0, 1, 2): Indicado como número entero.
    fill: 0: Rellena el área comprendida entre este dataset y el dataset en el índice 0 del array datasets.

3. Relleno por identificador (target)
Si los datasets tienen la propiedad id definida, puedes especificar el objetivo exacto mediante un objeto: 
    fill: {
    target: 'idDelOtroDataset',
    above: 'rgba(0, 200, 80, 0.4)', // Color cuando este dataset está por encima del objetivo
    below: 'rgba(200, 0, 0, 0.4)'  // Color cuando este dataset está por debajo del objetivo
}

4. Relleno avanzado con colores condicionales (above / below)
Permite aplicar colores diferentes según si la curva se encuentra por encima o por debajo de una referencia (origin, start, end o un valor de baseline):
fill: {
    target: 'origin',
    above: 'rgba(75, 192, 192, 0.4)', // Verde/Azul para valores positivos
    below: 'rgba(255, 99, 132, 0.4)'   // Rojo para valores negativos
}*/
