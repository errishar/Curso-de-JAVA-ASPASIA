     
        // 1. Matriz A de dimensiones 2x3 (2 filas y 3 columnas)
        const A = math.matrix([[1, 2, 3], [4, 5, 6]]);

        // 2. Matriz B de dimensiones 3x2 (3 filas y 2 columnas)
        const B = math.matrix([[7, 8], [9, 1], [2, 3]]);

        // 3. Multiplicamos A x B (Resultado será una matriz de 2x2)
        const P = math.multiply(A, B);

        X=math.matrix([1,2,3,4]);

        resultado= math.add(math.multiply(X,2),7);
        Y= resultado.toString();



        // 4. Lo pintamos en la pantalla
        document.write("<h3>Producto de matrices:</h3>"+"\n");
        document.write("P = " + P.toString()+"\n");
        document.write("<br/>");
        document.write("X = " + X.toString()+"\n");
        document.write("<br/>");
        document.write("<p> La operación: Y = 2 * X + 7 </p>")
        document.write("Y = " + Y.toString()+"\n");

        /*Ahora a calcular determinantes*/
        document.write("<p> Ahora a calcular un determiante<P> <br>");
        X1=math.multiply(X,2);
        Xc=[[3,4,3,6],[4,6,3,5],[2,5,6,7],[2,4,5,2]]
        /*Xc=math.matrix([X,X,X,X1]);*/
        document.write("Xc=" + Xc);
        d=math.det(Xc);
        document.write("<p> El determiante de Xc: <P>" + d +"<p></P>");
        document.write("<br>");
        Ar = ["HTML", 5, true];
        document.write("Ar = " + Ar);
        document.write("<br>");
        let persona={
            name: "María",
            age: 12
        }
        let nombre = "Carmelo";
        let edad = 12;
        let altura = Math.PI/2;
        let tienecarnet =true;
        let datosindefinir;
        let datovacio= null;
        let lenguajes=["HTML", "CSS", "JAVA"];

        console.log(    "Nombre:"  , nombre , "- Tipo: ", typeof nombre,
                        "\nEdad:"  , edad   , "- Tipo: ", typeof edad,
                        "\nAltura:", altura , "- Tipo: ", typeof altura,
                        "\ntiene carnet:", tienecarnet , "- Tipo: ", typeof tienecarnet,
                        "\ndatos sin definir:", datosindefinir , "- Tipo: ", typeof datosindefinir,
                        "\ndato vacío:", datovacio , "- Tipo: ", typeof datovacio,
                        "\nLenguajes:", lenguajes , "- Tipo: ", typeof lenguajes
        );

        document.write("<br>  Nombre: " + nombre + " - Tipo: " + typeof nombre +
                        "<br> Edad: " + edad + " - Tipo: " + typeof edad +
                        "<br> Altura: " + altura + " - Tipo: " + typeof altura +
                        "<br> tiene carnet: " + tienecarnet + " - Tipo: " + typeof tienecarnet +
                        "<br> datos sin definir: " + datosindefinir + " - Tipo: " + typeof datosindefinir +
                        "<br> dato vacío: " + datovacio + " - Tipo: " + typeof datovacio +
                        "<br> Lenguajes: " + lenguajes + " - Tipo: " + typeof lenguajes
                        );

        document.write("<br>");
        document.write("<br>");
        let personas={
            María: {age : 12, city: "Gijón"},
            Pedro: {age : 15, city: "Avilés"},
            Mario: {age : 20, city: "Oviedo"}
        };

        document.write("Cuéntame sobre María. María tiene " +  personas["María"].age + " años y es de "+ personas["María"].city + "<br>");

        /*declaracion de una función*/
        function miFuncion(){
            let mensaje = "Hola a todos"+ "<br>";
            console.log(mensaje);
        };

        miFuncion();
        



        
        


      /* pruebaas IF THEN ELSE*/
       
        if (altura <=1.50)
        {
            document.write("Es pequeño"+ "<br>");
        } 
        else if (altura > 1.50  && altura < 1.8 ){
            document.write("Es mediana"+ "<br>");
        } 

        else if (altura >1.8) { document.write("Es grandote" + "<br>");

        }

        document.write(altura+ "<br>");

        /*BUCLE WHILE*/
        /*document.write("<br>"+"Vamos a probar el bucle while "+"<br>")

        let contador=1;
        while (contador>0 && contador< 2.5){
            document.write(" Contador: " + contador + "<br>" );
            contador +=1;
        }
        document.write("<br>");*/

        /*BUCLE FOR*/
        /*document.write("<br>"+"Vamos a probar el bucle for "+"<br>")
        for (let i=0; i<40; i++){
            document.write( "el número i es : " + i+ "<br>");
        };
        document.write("<br>");
        */
        /*BUCLE DO WHILE*/
        
       /* document.write("<br>"+"Vamos a probar el bucle do..while "+"<br>")
        
        let contador1=0;
        do 
            {contador1 +=1;
            document.write("contador = " + contador1 + "<br>");
            
            }
        while(contador1<15);
        document.write("<br>");*/

