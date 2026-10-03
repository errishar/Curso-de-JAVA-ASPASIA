/*calculos.js*/

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
        X: [...A.X],
        Y: Y_sup
    };
}

export function simetria(A) {
    let X1 = A.X;
    let Y1 = A.Y;

    // Crear mitad izquierda (valores X negativos)
    let X_izq = [];
    let Y_izq = [];

    for (let i = X1.length - 1; i > 0; i--) {
        X_izq.push(-X1[i]);
        Y_izq.push(Y1[i]);
    }

    let X_eje = X_izq.concat(X1);
    let Y_sup = Y_izq.concat(Y1);
    let Y_inf = Y_sup.map(y => -y);

    return {
        X_sup: X_eje,
        Y_sup: Y_sup,
        X_inf: X_eje,
        Y_inf: Y_inf
    };
}

export function calcularAreaHastaX(AH, xCorte) {
    let X = AH.X;
    let Y = AH.Y;

    if (xCorte <= 0) return 0;
    let xMax = X[X.length - 1];
    if (xCorte > xMax) xCorte = xMax;

    let area = 0;

    for (let i = 0; i < X.length - 1; i++) {
        let x0 = X[i];
        let x1 = X[i + 1];
        let y0 = Y[i];
        let y1 = Y[i + 1];

        if (x1 <= xCorte) {
            area += ((y0 + y1) / 2) * (x1 - x0);
        } else if (x0 < xCorte && x1 > xCorte) {
            let yCorte = y0 + (y1 - y0) * ((xCorte - x0) / (x1 - x0));
            area += ((y0 + yCorte) / 2) * (xCorte - x0);
            break;
        }
    }

    return area;
}

export function calcular_X(cilindro, area_inicio, tolerancia = 0.001) {
    let x_min = 0;
    let x_max = cilindro.X[cilindro.X.length - 1];

    let area_total = calcularAreaHastaX(cilindro, x_max);
    if (area_inicio >= area_total) return x_max;
    if (area_inicio <= 0) return 0;

    let x_corte = 0;
    let area_calculada = 0;
    let iter = 0;

    while (iter < 100) {
        x_corte = (x_min + x_max) / 2;
        area_calculada = calcularAreaHastaX(cilindro, x_corte);

        let error_relativo = Math.abs(area_calculada - area_inicio) / area_inicio;

        if (error_relativo <= tolerancia) {
            break;
        }

        if (area_calculada < area_inicio) {
            x_min = x_corte;
        } else {
            x_max = x_corte;
        }

        iter++;
    }

    return x_corte;
}

export function truncarCilindro(AH, xCorte) {
    let X = AH.X;
    let Y = AH.Y;
    let xMax = X[X.length - 1];

    if (xCorte >= xMax) return { X: [...X], Y: [...Y] };
    if (xCorte <= 0) return { X: [0], Y: [Y[0]] };

    let X_trunc = [];
    let Y_trunc = [];

    for (let i = 0; i < X.length; i++) {
        if (X[i] < xCorte) {
            X_trunc.push(X[i]);
            Y_trunc.push(Y[i]);
        } else if (X[i] === xCorte) {
            X_trunc.push(X[i]);
            Y_trunc.push(Y[i]);
            break;
        } else {
            let x0 = X[i - 1];
            let x1 = X[i];
            let y0 = Y[i - 1];
            let y1 = Y[i];

            let yCorte = y0 + (y1 - y0) * ((xCorte - x0) / (x1 - x0));
            X_trunc.push(xCorte);
            Y_trunc.push(yCorte);
            break;
        }
    }

    return { X: X_trunc, Y: Y_trunc };
}