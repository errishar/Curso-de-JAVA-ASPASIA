export function linespace(x1, x2, n) {
    let X = [];
    let paso = (x2 - x1) / (n - 1);
    for (let i = 0; i < n; i++) {
        X.push(x1 + i * paso);
    }
    return X;
}


export function aplicarLuz(A, valorLuz) {
    let offset = valorLuz / 2;
    let Y_sup = A.Y.map(y => y + offset);
    
    return {
        X: A.X,
        Y: Y_sup,
        
    };
}


export function simetria(A) {
    let X1 = A.X;
    let Y1 = A.Y;

    // Generar el eje X continuo de izquierda a derecha (-X_max a +X_max)
    let X_izq = X1.slice().reverse().map(x => -x);
    let Y_izq = Y1.slice().reverse();

    // Eliminar duplicado del punto central (0)
    X_izq.pop();
    Y_izq.pop();

    let X_eje = X_izq.concat(X1);
    let Y_sup = Y_izq.concat(Y1);

    // Espejo inferior exactamente con las mismas coordenadas X
    let Y_inf = Y_sup.map(y => -y);

    return {
        X_sup: X_eje,
        Y_sup: Y_sup,
        X_inf: X_eje,
        Y_inf: Y_inf
    };
}


/**
* Calcula el área bajo la curva Y(X) desde x = 0 hasta x = xCorte (x <= B/2)
 * utilizando la regla del trapecio sobre los puntos del primer cuadrante.
 * @param {Object} AH - Objeto con arreglos { X, Y } del primer cuadrante.
 * @param {number} xCorte - Valor de X hasta donde calcular el área (xCorte <= B/2).
 * @returns {number} Área acumulada.
 */
export function calcularAreaHastaX(AH, xCorte) {
    let X = AH.X;
    let Y = AH.Y;

    // Validar que el valor de corte esté dentro del rango
    if (xCorte <= 0) return 0;
    let xMax = X[X.length - 1];
    if (xCorte > xMax) xCorte = xMax;

    let area = 0;

    for (let i = 0; i < X.length - 1; i++) {
        let x0 = X[i];
        let x1 = X[i + 1];
        let y0 = Y[i];
        let y1 = Y[i + 1];

        // Caso 1: El intervalo está completamente dentro de [0, xCorte]
        if (x1 <= xCorte) {
            area += ((y0 + y1) / 2) * (x1 - x0);
        } 
        // Caso 2: El valor xCorte cae dentro del intervalo [x0, x1]
        else if (x0 < xCorte && x1 > xCorte) {
            // Interpolación lineal para hallar la y correspondiente a xCorte
            let yCorte = y0 + (y1 - y0) * ((xCorte - x0) / (x1 - x0));
            area += ((y0 + yCorte) / 2) * (xCorte - x0);
            break; // Se alcanzó el límite de integración
        }
    }

    return area;
}


/**
 * Dado un objetivo de área, calcula el valor x exacto.
 * @param {Object} cilindro - Objeto { X, Y } del primer cuadrante.
 * @param {number} area_inicio - Área objetivo a encontrar.
 * @param {number} [tolerancia=0.001] - Tolerancia relativa deseada (ej. 0.001 = 0.1%).
 * @returns {number} Valor de x que produce el área objetivo.
 */
export function calcular_X(cilindro, area_inicio, tolerancia = 0.001) {
    let x_min = 0;
    let x_max = cilindro.X[cilindro.X.length - 1]; // Máximo X del arreglo

    // Validar área máxima disponible
    let area_total = calcularAreaHastaX(cilindro, x_max);
    if (area_inicio >= area_total) return x_max;
    if (area_inicio <= 0) return 0;

    let x_corte = 0;
    let area_calculada = 0;
    let max_iteraciones = 100; // Evita bucle infinito por seguridad
    let iter = 0;

    while (iter < max_iteraciones) {
        x_corte = (x_min + x_max) / 2;
        area_calculada = calcularAreaHastaX(cilindro, x_corte);

        let error_relativo = Math.abs(area_calculada - area_inicio) / area_inicio;

        // Si estamos dentro del margen de tolerancia, devolvemos x_corte
        if (error_relativo <= tolerancia) {
            break;
        }

        // Ajustar los límites de la búsqueda binaria
        if (area_calculada < area_inicio) {
            x_min = x_corte;
        } else {
            x_max = x_corte;
        }

        iter++;
    }

    return x_corte;
}

/**
 * Trunca la curva del primer cuadrante { X, Y } hasta un valor xCorte.
 * @param {Object} AH - Objeto con arreglos { X, Y }.
 * @param {number} xCorte - Límite máximo en X para truncar la geometría.
 * @returns {Object} Nuevo objeto { X, Y } truncado exactamente en xCorte.
 */
export function truncarCilindro(AH, xCorte) {
    let X = AH.X;
    let Y = AH.Y;

    let xMax = X[X.length - 1];

    // Si el valor de corte es igual o mayor al x máximo, se devuelve el objeto original
    if (xCorte >= xMax) {
        return { X: [...X], Y: [...Y] };
    }

    // Si el valor de corte es menor o igual a cero
    if (xCorte <= 0) {
        return { X: [0], Y: [Y[0]] };
    }

    let X_trunc = [];
    let Y_trunc = [];

    for (let i = 0; i < X.length; i++) {
        // Caso 1: El punto está estrictamente antes del valor de corte
        if (X[i] < xCorte) {
            X_trunc.push(X[i]);
            Y_trunc.push(Y[i]);
        } 
        // Caso 2: El punto coincide exactamente con xCorte
        else if (X[i] === xCorte) {
            X_trunc.push(X[i]);
            Y_trunc.push(Y[i]);
            break;
        } 
        // Caso 3: Nos pasamos de xCorte -> Interpolamos el punto final exacto y terminamos
        else {
            let x0 = X[i - 1];
            let x1 = X[i];
            let y0 = Y[i - 1];
            let y1 = Y[i];

            // Interpolación lineal para hallar el Y en xCorte
            let yCorte = y0 + (y1 - y0) * ((xCorte - x0) / (x1 - x0));

            X_trunc.push(xCorte);
            Y_trunc.push(yCorte);
            break;
        }
    }

    return {
        X: X_trunc,
        Y: Y_trunc
    };
}


