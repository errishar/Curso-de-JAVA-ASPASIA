export function linespace(x1, x2, n) {
    let X = [];
    let paso = (x2 - x1) / (n - 1);
    for (let i = 0; i < n; i++) {
        X.push(x1 + i * paso);
    }
    return X;
}

// 1. Desplaza el perfil en Y según la luz
export function aplicarLuz(cuadrante, valorLuz) {
    let offset = valorLuz / 2;
    return {
        X: [...cuadrante.X],
        Y: cuadrante.Y.map(y => y + offset)
    };
}

// 2. Simetría completa: Contorno de -X a +X (Superior +Y, Inferior -Y)
export function simetria(A) {
    if (!A || !A.X || A.X.length === 0) return { X_sup: [], Y_sup: [], X_inf: [], Y_inf: [] };

    let X1 = A.X;
    let Y1 = A.Y;

    let X_izq = [];
    let Y_izq = [];

    // 1. Lado izquierdo: de -X_max hasta justo antes del centro (0)
    for (let i = X1.length - 1; i > 0; i--) {
        X_izq.push(-X1[i]);
        Y_izq.push(Y1[i]);
    }

    // 2. Concatenación continua de izquierda a derecha (-X_max -> +X_max)
    let X_completo = X_izq.concat(X1);
    
    // Perfil Superior (+Y): todo sobre el plano positivo
    let Y_sup = Y_izq.concat(Y1);
    
    // Perfil Inferior (-Y): espejo exacto negativo
    let Y_inf = Y_sup.map(y => -y);

    return {
        X_sup: X_completo,
        Y_sup: Y_sup,
        X_inf: X_completo,
        Y_inf: Y_inf
    };
}

// 3. Truncar curva para el relleno entre -xCorte y +xCorte
export function truncarRelleno(perfilLuz, xCorte) {
    let X_tr = [];
    let Y_tr = [];

    for (let i = 0; i < perfilLuz.X.length; i++) {
        if (perfilLuz.X[i] <= xCorte) {
            X_tr.push(perfilLuz.X[i]);
            Y_tr.push(perfilLuz.Y[i]);
        }
    }

    // Si el último punto no cae exacto en xCorte, se fuerza el límite horizontal
    if (X_tr.length > 0 && X_tr[X_tr.length - 1] < xCorte) {
        X_tr.push(xCorte);
        Y_tr.push(Y_tr[Y_tr.length - 1]);
    }

    // Retorna las coordenadas simétricas del área de relleno
    return { X: X_tr, Y: Y_tr };
}

export function calcularCentroC2(x1, y1, x3, y3, R1, R2, r) {
    const d1 = R1 - R2;   // distancia C1–C2 (tangencia interior)
    const d3 = R2 + r;    // distancia C3–C2 (tangencia exterior)

    const dx = x3 - x1;
    const dy = y3 - y1;
    const d = Math.hypot(dx, dy);

    // Comprobación de intersección física entre las dos circunferencias auxiliares
    if (d === 0 || d > (d1 + d3) || d < Math.abs(d1 - d3)) {
        console.warn("No existe intersección física real entre los radios.");
        return null;
    }

    const a = (d1 * d1 - d3 * d3 + d * d) / (2 * d);
    const h = Math.sqrt(d1 * d1 - a * a);

    // Punto base sobre la recta C1–C3
    const x_p0 = x1 + (a / d) * dx;
    const y_p0 = y1 + (a / d) * dy;

    // Vector unitario perpendicular a (C3 - C1)
    const nx = -dy / d;
    const ny =  dx / d;

    // Dos soluciones posibles
    const x2_1 = x_p0 + h * nx;
    const y2_1 = y_p0 + h * ny;

    const x2_2 = x_p0 - h * nx;
    const y2_2 = y_p0 - h * ny;

    return [
        { x: x2_1, y: y2_1 },
        { x: x2_2, y: y2_2 }
    ];
}

export function interseccion_dos_circunferencias(x1, y1, R1, x2, y2, R2) {
    /* 1. Distancia entre centros (D) */
    let dx = x2 - x1;
    let dy = y2 - y1;
    let D = Math.sqrt(dx ** 2 + dy ** 2);

    /* 2. Condición de existencia de solución real */
    if (D === 0) {
        console.log("Centros coincidentes");
        return null;
    }

    if (D > (R1 + R2) || D < Math.abs(R1 - R2)) {
        console.log("Las circunferencias no se tocan");
        return null;
    }

    /* 3. Proyección horizontal sobre la línea de centros (a) */
    let a = (R1 ** 2 - R2 ** 2 + D ** 2) / (2 * D);

    /* 4. Distancia perpendicular al eje (h) */
    let h2 = R1 ** 2 - a ** 2;
    let h = Math.sqrt(Math.max(0, h2));

    /* 5. Punto medio sobre la línea de centros (P_0) */
    let x0 = x1 + (a * dx) / D;
    let y0 = y1 + (a * dy) / D; // Corregido 'dy'

    /* 6. Puntos de intersección finales (P_1, P_2) */
    let x_1 = x0 + (h * dy) / D;
    let y_1 = y0 - (h * dx) / D;

    let x_2 = x0 - (h * dy) / D;
    let y_2 = y0 + (h * dx) / D;

    if (h === 0) {
        console.log("Son tangentes en un único punto");
        return { x: x_1, y: y_1 };
    }

    console.log("Existen dos puntos de intersección, buscando en el Cuadrante 1...");

    // Selección de la solución en el Cuadrante 1 (x >= 0, y >= 0)
    if (x_1 >= 0 && y_1 >= 0) {
        return { x: x_1, y: y_1 };
    } else if (x_2 >= 0 && y_2 >= 0) {
        return { x: x_2, y: y_2 };
    } else {
        console.log("Ninguna intersección está en el cuadrante 1");
        return null;
    }
}



export function calcular_X(perfil, areaObjetivo) {
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