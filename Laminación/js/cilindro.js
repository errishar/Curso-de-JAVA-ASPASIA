/* cilindro.js*/
import { linespace } from './calculos.js';

export function cilindro_AH(n, B, H, R, r, a) {
    let a_rad = (a / 180) * Math.PI;

    let x_cr = B / 2;
    let y_cr = r;

    let dy = H - R - r;
    let dx = dy * Math.tan(a_rad) + (R + r) / Math.cos(a_rad);
    let x_cR = x_cr - dx;
    let y_cR = H - R;

    let xt1 = x_cR;
    let yt1 = H;

    let xt2 = x_cR + R * Math.sin(a_rad);
    let yt2 = y_cR + R * Math.cos(a_rad);

    let xt3 = x_cr - r * Math.sin(a_rad);
    let yt3 = y_cr - r * Math.cos(a_rad);

    let xt4 = x_cr;
    let yt4 = 0;

    let xt5 = (B / 2) + 30;
    let yt5 = 0;

    n = Math.max(n, Math.trunc(B));

    let X1 = linespace(0, xt1, n);
    let Y1 = X1.map(() => yt1);

    let X2 = linespace(xt1, xt2, n);
    let Y2 = X2.map(x => {
        let val = R * R - Math.pow(x - x_cR, 2);
        return y_cR + Math.sqrt(Math.max(0, val));
    });

    let X3 = linespace(xt2, xt3, n);
    let Y3 = X3.map(x => yt2 + (yt3 - yt2) * ((x - xt2) / (xt3 - xt2)));

    let X4 = linespace(xt3, xt4, n);
    let Y4 = X4.map(x => {
        let val = r * r - Math.pow(x - x_cr, 2);
        return y_cr - Math.sqrt(Math.max(0, val));
    });

    let X5 = linespace(xt4, xt5, n);
    let Y5 = X5.map(() => yt5);

    return {
        X: [].concat(X1, X2, X3, X4, X5),
        Y: [].concat(Y1, Y2, Y3, Y4, Y5)
    };
}


export cilindro_ovalo(n, B, H, R, r){
    let x_cR = 0;
    let y_cR = H - R;
    let x_cr = B / 2 - r;
    let y_cr = 0;
    
    let X1 = linespace(0, xt1, n);
    
}