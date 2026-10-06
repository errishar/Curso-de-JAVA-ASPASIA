const n_puntos=40;



const cil_BDM = [
            { id: "AH", nombre: "Caja AH", tipo: "AH",      B: 180.0,   H: 46,  R: 120, r: 8,  a: 12 },
            { id: "BH", nombre: "Caja BH", tipo: "ovalo",   B: 209.37,  H: 39,  R: 160, r: 10, a: 0  },
            { id: "CV", nombre: "Caja CV", tipo: "redondo", B: 120.09,  H: 49,  R: 55,  r: 8,  a: 30 }
        ];

const cil_cont = [
    { id: "C1", nombre: "Caja 1",    tipo: "C1",        B: 140,     H: 35,      R1: 160,    R2: 40, r: 8,   a: 0, },
    { id: "C2", nombre: "Caja C2",   tipo: "ovalo",     B: 146.64,  H: 28,      R: 110,     r: 8,   a: 0,   },
    { id: "C3", nombre: "Caja C3",   tipo: "redondo",   B: 90.3,    H: 36,      R: 42.2,    r: 6,   a: 30,  },
    { id: "C4", nombre: "Caja C4",   tipo: "ovalo",     B: 112.62,  H: 21,      R: 86,      r: 6,   a: 0,   },
    { id: "C5", nombre: "Caja C5",   tipo: "redondo",   B: 69.28,   H: 27,      R: 33,      r: 4,   a: 30,  },
    { id: "C6", nombre: "Caja C6",   tipo: "ovalo",     B: 86.16,   H: 16,      R: 66,      r: 6,   a: 0,   },
    { id: "C7", nombre: "Caja C7",   tipo: "redondo",   B: 53.12,   H: 21,      R: 25,      r: 4,   a: 30,  },
    { id: "C8", nombre: "Caja C8",   tipo: "ovalo",     B: 65.36,   H: 12,      R: 50.5,    r: 4,   a: 0,   },
    { id: "C9", nombre: "Caja C9",   tipo: "redondo",   B: 42.15,   H: 16.5,    R: 20,      r: 4,   a: 30,  },
    { id: "C10", nombre: "Caja C10", tipo: "ovalo",     B: 52.65,   H: 9,       R: 43,      r: 4,   a: 0,   },
    { id: "C11", nombre: "Caja C11", tipo: "redondo",   B: 33.20,   H: 13,      R: 15.75,   r: 3,   a: 30,  },
];

const cil_rey =[
    { id: "C12", nombre: "Caja C12", tipo: "ovalo",     B: 39.33,   H: 8.5,     R: 27,      r: 1.5, a: 0,   },
    { id: "C13", nombre: "Caja C13", tipo: "redondo",   B: 26.79,   H: 10.7,    R: 12.5,    r: 1.5, a: 30,  },
    { id: "C14", nombre: "Caja C14", tipo: "ovalo",     B: 35.46,   H: 5.8,     R: 30,      r: 1.5, a: 0,   },
    { id: "C15", nombre: "Caja C15", tipo: "redondo",   B: 20.78,   H : 8.2,    R: 9.8,     r: 1.5, a: 30,  },
]

const cil_NTM1 = [
    { id: "C16", nombre: "Caja C16", tipo: "ovalo",     B: 27.95,   H: 5.5,     R: 20.5,    r: 1.5, a: 0,   },
    { id: "C17", nombre: "Caja C17", tipo: "redondo",   B: 17.9,    H: 7,       R: 8.5,     r: 1.5, a: 30,  },
    { id: "C18", nombre: "Caja C18", tipo: "ovalo",     B: 21.22,   H: 4.2,     R: 15.5,    r: 1.5, a: 0,   },
    { id: "C19", nombre: "Caja C19", tipo: "redondo",   B: 12.9,    H: 5.5,     R: 6.35,    r: 0,   a: 20,  },
    { id: "C20", nombre: "Caja C20", tipo: "ovalo",     B: 18.89,   H: 3.5,     R: 14.5,    r: 1.5, a: 0,   },
    { id: "C21", nombre: "Caja C21", tipo: "redondo",   B: 11.3,    H: 4.75,    R: 5.6,     r: 0,   a: 20,  },
    { id: "C22", nombre: "Caja C22", tipo: "ovalo",     B: 18.89,   H: 3.5,     R: 14.5,    r: 1.5, a: 0,   },
    { id: "C23", nombre: "Caja C23", tipo: "redondo",   B: 9.42,    H: 3.8,     R: 4.56,    r: 0,   a: 25,  },
    { id: "C24", nombre: "Caja C24", tipo: "ovalo",     B: 13.56,   H: 2.1,     R: 12,      r: 1.5, a: 0,   },
    { id: "C25", nombre: "Caja C25", tipo: "redondo",   B: 7.69,    H: 3.1,     R: 3.68,    r: 0,   a: 25,  },
]









const luces_BDM = [
    {palanquilla: 130,
        pasadas: [
            { id: "AH", Valor_luz: 10 },
            { id: "BH", Valor_luz: 5 },
            { id: "CV", Valor_luz: 5 }
        ]
    },
    {palanquilla: 140,
        pasadas: [
            { id: "AH", Valor_luz: 10 },
            { id: "BH", Valor_luz: 5 },
            { id: "CV", Valor_luz: 5 }
        ]
    },
    {palanquilla: 150,
        pasadas: [
            { id: "AH", Valor_luz: 10 },
            { id: "BH", Valor_luz: 5 },
            { id: "CV", Valor_luz: 5 }
        ]
    },
    {palanquilla: 160,
        pasadas: [
            { id: "AH", Valor_luz: 10 },
            { id: "BH", Valor_luz: 5 },
            { id: "CV", Valor_luz: 5 }
        ]
    }
];

const R_BDM = [
    {palanquilla: 130,
        pasadas: [
            { id: "AH", R_transfor: 1.5 },
            { id: "BH", R_transfor: 1.5 },
            { id: "CV", R_transfor: 1.5 }
        ]
    },
    {palanquilla: 140,
        pasadas: [
            { id: "AH", R_transfor: 1.5 },
            { id: "BH", R_transfor: 1.5 },
            { id: "CV", R_transfor: 1.5 }
        ]
    },
    {palanquilla: 150,
        pasadas: [
            { id: "AH", R_transfor: 1.5 },
            { id: "BH", R_transfor: 1.5 },
            { id: "CV", R_transfor: 1.5 }
        ]
    },
    {palanquilla: 160,
        pasadas: [
            { id: "AH", R_transfor: 1.5 },
            { id: "BH", R_transfor: 1.5 },
            { id: "CV", R_transfor: 1.5 }
        ]
    }
];


















/* ===================================== NTM ================================================*/





const luz_NTM =[
{perfil: 5.5, 
    pasadas:[
        { id: "16", Valor_luz: 3},
        { id: "17", Valor_luz: 3.15},
        { id: "18", Valor_luz: 3.27},
        { id: "19", Valor_luz: 2.},
        { id: "20", Valor_luz: 2.1}, 
        { id: "21", Valor_luz: 1.85}, 
        { id: "22", Valor_luz: 1.19}, 
        { id: "23", Valor_luz: 1.4}, 
        { id: "24", Valor_luz: 1.1}, 
        { id: "25", Valor_luz: 0.9}
         ]},
{perfil: 6, 
    pasadas:[
        { id: "16", Valor_luz: 3.75},
        { id: "17", Valor_luz: 3.45},
        { id: "18", Valor_luz: 3.55},
        { id: "19", Valor_luz: 2.35},
        { id: "20", Valor_luz: 2.38}, 
        { id: "21", Valor_luz: 2.}, 
        { id: "22", Valor_luz: 1.35}, 
        { id: "23", Valor_luz: 1.6}, 
        { id: "24", Valor_luz: 1.33}, 
        { id: "25", Valor_luz: 1.25}
        ]},
{perfil: 6.5, 
    pasadas:[
    { id: "16", Valor_luz: 3.7},
    { id: "17", Valor_luz: 3.4},
    { id: "18", Valor_luz: 3.48},
    { id: "19", Valor_luz: 2.2},
    { id: "20", Valor_luz: 2.2}, 
    { id: "21", Valor_luz: 1.96}, 
    { id: "22", Valor_luz: 1.43}, 
    { id: "23", Valor_luz: 1.4}
    ]},
{perfil:  7, 
    pasadas:[
    { id: "16", Valor_luz: 3.5},
    { id: "17", Valor_luz: 3.35},
    { id: "18", Valor_luz: 3.48},
    { id: "19", Valor_luz: 2.},
    { id: "20", Valor_luz: 2.1}, 
    { id: "21", Valor_luz: 1.85}, 
    { id: "22", Valor_luz: 1.19}, 
    { id: "23", Valor_luz: 1.4},
]},
{perfil: 7.5, 
    pasadas:[
    { id: "16", Valor_luz: 3.65},
    { id: "17", Valor_luz: 3.4},
    { id: "18", Valor_luz: 3.48},
    { id: "19", Valor_luz: 2.2},
    { id: "20", Valor_luz: 2.22}, 
    { id: "21", Valor_luz: 1.96}, 
    { id: "22", Valor_luz: 1.3}, 
    { id: "23", Valor_luz: 1.5}
]},
{perfil: 8, 
    pasadas:[
    { id: "16", Valor_luz: 3.4},
    { id: "17", Valor_luz: 3.4},
    { id: "18", Valor_luz: 3.48},
    { id: "19", Valor_luz: 2.2},
    { id: "20", Valor_luz: 2.2}, 
    { id: "21", Valor_luz: 1.85},
]},
{perfil: 8.5, 
    pasadas:[
    { id: "16", Valor_luz: 3.5},
    { id: "17", Valor_luz: 3.4},
    { id: "18", Valor_luz: 3.48},
    { id: "19", Valor_luz: 2.2},
    { id: "20", Valor_luz: 2.2},
    { id: "21", Valor_luz: 1.85},
]},
{perfil:  9, 
    pasadas:[
    { id: "16", Valor_luz: 3.5},
    { id: "17", Valor_luz: 3.4},
    { id: "18", Valor_luz: 3.45},
    { id: "19", Valor_luz: 2.5},
    { id: "20", Valor_luz: 2.2}, 
    { id: "21", Valor_luz: 1.85},
]},
{perfil: 9.5, 
    pasadas:[
    { id: "16", Valor_luz: 3.7},
    { id: "17", Valor_luz: 3.4},
    { id: "18", Valor_luz: 3.48},
    { id: "19", Valor_luz: 2.2},
    { id: "20", Valor_luz: 2.22}, 
    { id: "21", Valor_luz: 1.96},
]},
{perfil: 10, 
    pasadas:[
    { id: "16", Valor_luz: 3.5},
    { id: "17", Valor_luz: 3.4},
    { id: "18", Valor_luz: 3.45},
    { id: "19", Valor_luz: 2.1}
]},
{perfil: 10.5, 
    pasadas:[
    { id: "16", Valor_luz: 3.5},
    { id: "17", Valor_luz: 3.4},
    { id: "18", Valor_luz: 3.45},
    { id: "19", Valor_luz: 2.5}
]},
{perfil: 11, 
    pasadas:[
    { id: "16", Valor_luz: 3.8},
    { id: "17", Valor_luz: 3.4},
    { id: "18", Valor_luz: 3.48},
    { id: "19", Valor_luz: 2.22}
]},
{perfil: 11.5, 
    pasadas:[
    { id: "16", Valor_luz: 3.6},
    { id: "17", Valor_luz: 3.4},
    { id: "18", Valor_luz: 3.48},
    { id: "19", Valor_luz: 2.22}
]},
{perfil: 12, 
    pasadas:[
    { id: "16", Valor_luz: 3.6},
    { id: "17", Valor_luz: 3.4}
]},
{perfil: 12.5, 
    pasadas:[
    { id: "16", Valor_luz: 3.6},
    { id: "17", Valor_luz: 3.4}
]},
{perfil: 13, 
    pasadas:[
    { id: "16", Valor_luz: 3.6},
    { id: "17", Valor_luz: 3.4}
]},
{perfil: 13.5, 
    pasadas:[
    { id: "16", Valor_luz: 0 },
    { id: "17", Valor_luz: 0 }
]},
{perfil: 14, 
    pasadas:[
    { id: "16", Valor_luz: 3.7},
    { id: "17", Valor_luz: 3.45}
]}]




/*========================================= RSM ===============================================


export const pasadas_55 = [
    { id: "C26", nombre: "Caja C26", tipo: "ovalo",     B: 9.48,    H: 1.35,    R: 19,      r: 1.5, a: 0,   n: n_puntos,        Valor_luz: 1.2,     R_transfor: 1 },
    { id: "C27", nombre: "Caja C27", tipo: "RSM",       B: 6.22,    H: 2.45,    R: 2.74,    a: 100, z: 2,   n: n_puntos,        Valor_luz: 1.25,    R_transfor: 1.3 },
    { id: "C28", nombre: "Caja C28", tipo: "RSM",       B: 6.43,    H: 2.24,    R: 2.96,    a: 90,  z: 3,   n: n_puntos,        Valor_luz: 1.2,     R_transfor: 1.1 },
    { id: "C29", nombre: "Caja C29", tipo: "RSM",       B: 5.87,    H: 2.29,    R: 2.79,    a: 117, z: 3,   n: n_puntos,        Valor_luz: 1.2,     R_transfor: 1 }
];
