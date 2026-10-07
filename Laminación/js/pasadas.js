/* pasadas.js */

const n_puntos = 40;

// Tablas BDM según la palanquilla
const luces_BDM = [
    { palanquilla: 130, pasadas: { AH: { luz: 8, R: 1.3 }, BH: { luz: 3, R: 1.3 }, CV: { luz: 3, R: 1.3 } } },
    { palanquilla: 140, pasadas: { AH: { luz: 9, R: 1.4 }, BH: { luz: 4, R: 1.4 }, CV: { luz: 4, R: 1.4 } } },
    { palanquilla: 150, pasadas: { AH: { luz: 10, R: 1.5 }, BH: { luz: 5, R: 1.5 }, CV: { luz: 5, R: 1.5 } } },
    { palanquilla: 160, pasadas: { AH: { luz: 11, R: 1.6 }, BH: { luz: 6, R: 1.6 }, CV: { luz: 6, R: 1.6 } } }
];

export function obtenerPasadasActualizadas() {
    // Detectar qué radio está seleccionado
    const radioSeleccionado = document.querySelector('input[name="palanquilla"]:checked');
    const valorPalanquilla = radioSeleccionado ? parseInt(radioSeleccionado.value, 10) : 150;

    // Obtener los datos BDM correspondientes
    const bdm = luces_BDM.find(item => item.palanquilla === valorPalanquilla);
    const datosPases = bdm ? bdm.pasadas : { AH: { luz: 10, R: 1.5 }, BH: { luz: 5, R: 1.5 }, CV: { luz: 5, R: 1.5 } };

    return [
        { id: "AH", nombre: "Caja AH",   tipo: "AH",        B: 180.0,   H: 46,      R: 120,     r: 8,   a: 12,  n: n_puntos,        Valor_luz: datosPases.AH.luz,      R_transfor: datosPases.AH.R },
        { id: "BH", nombre: "Caja BH",   tipo: "ovalo",     B: 209.37,  H: 39,      R: 160,     r: 10,  a: 0,   n: n_puntos,        Valor_luz: datosPases.BH.luz,      R_transfor: datosPases.BH.R },
        { id: "CV", nombre: "Caja CV",   tipo: "redondo",   B: 120.09,  H: 49,      R: 55,      r: 8,   a: 30,  n: n_puntos,        Valor_luz: datosPases.CV.luz,      R_transfor: datosPases.CV.R },
        { id: "C1", nombre: "Caja 1",    tipo: "C1",        B: 140,     H: 35,      R1: 160,    R2: 40, r: 8,   a: 0, n: n_puntos,  Valor_luz: 16,      R_transfor: 1.116 },
        { id: "C2", nombre: "Caja C2",   tipo: "ovalo",     B: 146.64,  H: 28,      R: 110,     r: 8,   a: 0,   n: n_puntos,        Valor_luz: 13,      R_transfor: 1.183 },
        { id: "C3", nombre: "Caja C3",   tipo: "redondo",   B: 90.3,    H: 36,      R: 42.2,    r: 6,   a: 30, n: n_puntos,         Valor_luz: 14,      R_transfor: 1.21 },
        { id: "C4", nombre: "Caja C4",   tipo: "ovalo",     B: 112.62,  H: 21,      R: 86,      r: 6,   a: 0,   n: n_puntos,        Valor_luz: 12,      R_transfor: 1.227 },
        { id: "C5", nombre: "Caja C5",   tipo: "redondo",   B: 69.28,   H: 27,      R: 33,      r: 4,   a: 30,  n: n_puntos,        Valor_luz: 12,      R_transfor: 1.219 },
        { id: "C6", nombre: "Caja C6",   tipo: "ovalo",     B: 86.16,   H: 16,      R: 66,      r: 6,   a: 0,   n: n_puntos,        Valor_luz: 10,      R_transfor: 1.228 },
        { id: "C7", nombre: "Caja C7",   tipo: "redondo",   B: 53.12,   H: 21,      R: 25,      r: 4,   a: 30,  n: n_puntos,        Valor_luz: 10,      R_transfor: 1.213 },
        { id: "C8", nombre: "Caja C8",   tipo: "ovalo",     B: 65.36,   H: 12,      R: 50.5,    r: 4,   a: 0,   n: n_puntos,        Valor_luz: 9,       R_transfor: 1.22 },
        { id: "C9", nombre: "Caja C9",   tipo: "redondo",   B: 42.15,   H: 16.5,    R: 20,      r: 4,   a: 30,  n: n_puntos,        Valor_luz: 7,       R_transfor: 1.22 },
        { id: "C10", nombre: "Caja C10", tipo: "ovalo",     B: 52.65,   H: 9,       R: 43,      r: 4,   a: 0,   n: n_puntos,        Valor_luz: 6.8,     R_transfor: 1.225 },
        { id: "C11", nombre: "Caja C11", tipo: "redondo",   B: 33.20,   H: 13,      R: 15.75,   r: 3,   a: 30,  n: n_puntos,        Valor_luz: 6,       R_transfor: 1.3 },
        { id: "C12", nombre: "Caja C12", tipo: "ovalo",     B: 39.33,   H: 8.5,     R: 27,      r: 1.5, a: 0,   n: n_puntos,        Valor_luz: 5,       R_transfor: 1.3 },
        { id: "C13", nombre: "Caja C13", tipo: "redondo",   B: 26.79,   H: 10.7,    R: 12.5,    r: 1.5, a: 30,  n: n_puntos,        Valor_luz: 5,       R_transfor: 1.3 },
        { id: "C14", nombre: "Caja C14", tipo: "ovalo",     B: 35.46,   H: 5.8,     R: 30,      r: 1.5, a: 0,   n: n_puntos,        Valor_luz: 5,       R_transfor: 1.3 },
        { id: "C15", nombre: "Caja C15", tipo: "redondo",   B: 20.78,   H: 8.2,     R: 9.8,     r: 1.5, a: 30,  n: n_puntos,        Valor_luz: 5,       R_transfor: 1.13 },
        { id: "C16", nombre: "Caja C16", tipo: "ovalo",     B: 27.95,   H: 5.5,     R: 20.5,    r: 1.5, a: 0,   n: n_puntos,        Valor_luz: 3,       R_transfor: 1.3 },
        { id: "C17", nombre: "Caja C17", tipo: "redondo",   B: 17.9,    H: 7,       R: 8.5,     r: 1.5, a: 30,  n: n_puntos,        Valor_luz: 3.15,    R_transfor: 1.3 },
        { id: "C18", nombre: "Caja C18", tipo: "ovalo",     B: 21.22,   H: 4.2,     R: 15.5,    r: 1.5, a: 0,   n: n_puntos,        Valor_luz: 3.27,    R_transfor: 1.3 },
        { id: "C19", nombre: "Caja C19", tipo: "redondo",   B: 12.9,    H: 5.5,     R: 6.35,    r: 0,   a: 20,  n: n_puntos,        Valor_luz: 2.1,     R_transfor: 1.3 },
        { id: "C20", nombre: "Caja C20", tipo: "ovalo",     B: 18.89,   H: 3.5,     R: 14.5,    r: 1.5, a: 0,   n: n_puntos,        Valor_luz: 2.11,    R_transfor: 1.13 },
        { id: "C21", nombre: "Caja C21", tipo: "redondo",   B: 11.3,    H: 4.75,    R: 5.6,     r: 0,   a: 20,  n: n_puntos,        Valor_luz: 1.85,    R_transfor: 1.13 },
        { id: "C22", nombre: "Caja C22", tipo: "ovalo",     B: 18.89,   H: 3.5,     R: 14.5,    r: 1.5, a: 0,   n: n_puntos,        Valor_luz: 1.19,    R_transfor: 1.13 },
        { id: "C23", nombre: "Caja C23", tipo: "redondo",   B: 9.42,    H: 3.8,     R: 4.56,    r: 0,   a: 25,  n: n_puntos,        Valor_luz: 1.4,     R_transfor: 1.3 },
        { id: "C24", nombre: "Caja C24", tipo: "ovalo",     B: 13.56,   H: 2.1,     R: 12,      r: 1.5, a: 0,   n: n_puntos,        Valor_luz: 1.1,     R_transfor: 1.3 },
        { id: "C25", nombre: "Caja C25", tipo: "redondo",   B: 7.69,    H: 3.1,     R: 3.68,    r: 0,   a: 25,  n: n_puntos,        Valor_luz: 0.9,     R_transfor: 1.3 },
        { id: "C26", nombre: "Caja C26", tipo: "ovalo",     B: 9.48,    H: 1.35,    R: 19,      r: 1.5, a: 0,   n: n_puntos,        Valor_luz: 1.2,     R_transfor: 1.246 },
        { id: "C27", nombre: "Caja C27", tipo: "RSM",       B: 6.22,    H: 2.45,    R: 2.74,    a: 100, z: 2,   n: n_puntos,        Valor_luz: 1.25,    R_transfor: 1.158 },
        { id: "C28", nombre: "Caja C28", tipo: "RSM",       B: 6.43,    H: 2.24,    R: 2.96,    a: 90,  z: 3,   n: n_puntos,        Valor_luz: 1.2,     R_transfor: 1.1071 },
        { id: "C29", nombre: "Caja C29", tipo: "RSM",       B: 5.87,    H: 2.29,    R: 2.79,    a: 117, z: 3,   n: n_puntos,        Valor_luz: 1.2,     R_transfor: 1.045 }
    ];
}