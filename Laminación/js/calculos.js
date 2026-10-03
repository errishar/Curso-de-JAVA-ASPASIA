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
    return simetria({ X: X_tr, Y: Y_tr });
}