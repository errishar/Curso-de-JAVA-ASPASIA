     
        
        
        const edad = document.getElementById('edad');
        pregunta_carnet.classList.remove('oculto');
        pregunta_experiencia.classList.add('oculto'); 
        
        if (edad>=18){
            document.getElementById("edad").innerHTML+=`<br> Vale, es mayorín, pero ¿tiene carnetde guiar? <br>`
            const tienecarnet = document.getElementById('tienecarnet');
            

            if (tienecarnet ==SI) {
                    document.getElementById("carnet").innerHTML+=`<br>Muy bien, tiene el carnet<br>`;
                     pregunta_experiencia.classList.add('oculto'); 
                    const experiencia = document.getElementById('experiencia');
                    if (experiencia < 2){
                        document.getElementById("experiencia").innerHTML+=`Conductor de experiencia media`;
                }       
                else if ( experiencia >= 2 && experiencia <= 5 ){
                    document.getElementById("experiencia").innerHTML+=`Conductor de experiencia media`;
                }
                else {
                    document.getElementById("experiencia").innerHTML+=`Conductor experimentado`;
                }}
            else {
                document.getElementById("carnet").innerHTML+=`<br>Saca el carnet y no andes por ahí faciendo el fangio`;
            }
        }   
        else {
            document.getElementById("edad").innerHTML+=`<br> Yes muy guaje para conducir, come yogurinos<br>`;
        }
