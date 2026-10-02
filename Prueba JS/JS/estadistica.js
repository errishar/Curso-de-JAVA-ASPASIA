 /* preparo un array de precios aleatorios en un intervalo máximo y mínimopara calcular la media móvil*/
        /*let intervalost= prompt('ingresa el intevalo de la media móvil:', 12); 
        let intervalo = Number(intervalost);*/
        /*document.write("Intervalo: "+ intervalo+ "<br>");*/
        let min=20;
        let max=70;
        /*document.write("Max: ", max, "<br>", "Min:", min, "<br>");*/
        document.getElementById("Max_min").innerHTML+=`Max: ${max} <br> Min: ${min} <br>`;
        /*const precios=Array.from({length:100}, () =>Math.floor(Math.random()*(max-min+1)+min));*/

        /* funcion para generar precios aleatorios en un intervalo máximo y mínimo, con con forma senoidal*/

        function precio(min, max, cantidad, frecuencia) {
            let precios = [];
            let amplitud = (max - min) / 2; // Amplitud real del movimiento
            let centro = min + amplitud;    // Punto medio del canal de precio

            for (let i = 0; i < cantidad; i++) {
                let desfase = Math.random() * 0.1; // Pequeño ruido aleatorio por ciclo
                // Generamos una onda senoidal limpia que nunca se sale del rango min y max
                let valorSenoidal = centro + amplitud * Math.sin(2 * Math.PI * frecuencia * (i / cantidad) + desfase);
                let precioTruncado = TruncarDecimales(Math.abs(valorSenoidal), 2);
                
                precios.push(precioTruncado);
            }
            return precios;
        }

        /* preparo una función para truncar decimales a un número determinado de decimales*/
        function TruncarDecimales(numero,decimales){
           return Math.trunc(numero*10**decimales)/(10**decimales);
            /*return Math.trunc(numero* (10**decimales))/(10**decimales);*/
        }

        /* preparo una función para calcular la media móvil de un array de precios y un intervalo determinado*/
        function mediaMovil(array, intervalo){
            let resultado= new Array(array.length).fill(null);
            for (let i=0; i<intervalo-1; i++){
                resultado[i]=0;
            }
            for (let i=intervalo-1; i<array.length; i++){
                let suma=0;
                for (let j=0; j<intervalo; j++){
                    suma+=array[i-j];
                }

                resultado[i]=TruncarDecimales(suma/intervalo, 2);
            }
            return resultado;
        }

        function EMA(precios,intervalo){
            /*a=2/(n+1*/
            /*EMA=(precio(t)*a)+(EMA(t-1)*(1-a))*/
            if(precios.length < intervalo){
                /*document.write("El array de precios es menor que el intervalo, no se puede calcular la media móvil exponencial");*/
                document.getElementById("Alerta_array_menor_intervalo").innerHTML+=`El array de precios es menor que el intervalo, no se puede calcular la media móvil exponencial`;
                return; 
            }

            let multiplicador=2/(intervalo+1); 
            let emas=new Array(precios.length).fill(null);
            let sumInicial = 0;
            /*document.write("emas: ", emas, "<br>");*/
            /*document.write("Primer for para calcular la suma inicial de los primeros ", intervalo, " precios: <br>");*/

            for (let i=0; i<intervalo; i++){
                sumInicial += precios[i];
            /*document.write("<br>sumaInicial: ", sumInicial, "<br>");*/
            }
            /*document.write("<br>sumaInicial: ", TruncarDecimales(sumInicial/intervalo,2), "<br>");*/
            let smaInicial=TruncarDecimales(sumInicial/intervalo,2);

            /*document.write("<br>smaInicial: ", smaInicial, "<br>");*/
            emas[intervalo-1]=smaInicial;
            /*document.write("<br>EMA inicial: ", emas[intervalo-1], "<br>");*/
            
            for (let i=intervalo; i<precios.length; i++){
                emas[i]=TruncarDecimales(((precios[i]-emas[i-1])*multiplicador)+emas[i-1],2);  
            }

            for (let i=0; i<intervalo-1; i++){
                emas[i]=0;
            }
            return emas;
        }


        function detectar_cruces(media1, media2){
            let cruces=[];
            for (let i=1; i<media1.length; i++){
                if (media1[i-1] < media2[i-1] && media1[i] > media2[i]){
                    cruces.push([i, "alcista",media1[i], media2[i]]);
                    /*document.write("<br>cruce alcista en el índice: ", i, "<br>", "cruces: ", cruces, "<br>");*/
                } else if (media1[i-1] > media2[i-1] && media1[i] < media2[i]){
                    cruces.push([ i, "bajista",media1[i], media2[i]]);
                    /*document.write("<br>cruce bajista en el índice: ", i, "<br>", "cruces: ", cruces, "<br>");*/
                }
            }
            return cruces;
        }


        /*Generamos un array de precios aleatorios en un intervalo máximo y mínimo*/
        let precios=precio(30, 40, 2000, 20)
        /*document.write("Precios: ", precios, "<br>", "longitud del precios: ", precios.length,  "<br>");*/
        document.getElementById("precios").innerHTML+=`Precios: ${precios} <br> longitud del precios: ${precios.length} <br>`;

        /*Ejecutamos la función mediaMovil con el array de precios y el intervalo 10*/
        let intervalo = 10;
        let SMA10=mediaMovil(precios, intervalo);
        /*document.write("la media móvil (SMA) de ", intervalo, " es: <br>", SMA10);*/
        document.getElementById("media_movil_10").innerHTML+=`la media móvil (SMA) de ${intervalo} es: <br>${SMA10}`;

        /*Ejecutamos la función mediaMovil con el array de precios y el intervalo 30*/
        intervalo = 30;
        let SMA30=mediaMovil(precios, intervalo);
        
        document.getElementById("media_movil_30").innerHTML+=`la media móvil (SMA) de ${intervalo} es: <br>${SMA30}`;


        let cruces=detectar_cruces(SMA10, SMA30);
        for (let i=0; i<cruces.length; i++){
            /*document.write("<br>Cruce ", cruces[i][1], " en el índice: ", cruces[i][0],  ", valor SMA10: ", cruces[i][2], ", ", "valor SMA30: ", cruces[i][3], "<br>");*/
            document.getElementById("cruces").innerHTML+=`Cruce ${cruces[i][1]}, en el índice: ${cruces[i][0]}, valor SMA10: ${cruces[i][2]}, valor SMA30: ${cruces[i][3]}<br>`;
           
        }   


        /*document.write("<br> vamos a calcular la media móvil exponencial de (EMA) ", intervalo, "<br>");*/
        document.getElementById("EMA1").innerHTML+=`<br> vamos a calcular la media móvil exponencial de (EMA) ${intervalo} <br>`;
        let ema=EMA(precios, intervalo);
        /*document.write("<br>la media móvil exponencial de", intervalo, " es: <br>", ema);*/
        document.getElementById("EMA2").innerHTML+=`<br>la media móvil exponencial de ${intervalo} es: <br> ${ema}`;