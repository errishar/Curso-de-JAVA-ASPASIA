
import { cilindro_AH } from './cilindro';
import { linespace, simetria, aplicarLuz, calcularAreaHastaX, calcular_X, truncarCilindro } from './calculos.js';



/*calcularAreaHastaX(AH, xCorte)*/
/*truncarCilindro(AH, xCorte) */
palanquilla = 150

area_palanquilla=Math.pow(150,2)

let B = 180;
let H = 46;
let a = 12;
let R = 15;
let r = 8;
let valorLuz = 20;

// 1. Obtener coordenadas base
let AH = cilindro_AH(n, B, H, R, r, a);
let AH_con_luz = aplicarLuz(AH, valorLuz);
let R_AH= 1.3
let Area_AH = area_palanquilla/R_AH 

let x_AH=calcular_X(AH_con_luz,Area_AH);
let Relleno_AH=truncarCilindro(AH_con_luz, R);

