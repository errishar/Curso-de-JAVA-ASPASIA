/*Registro de temperaturas semanales
Crea un programa que solicite al usuario las temperaturas de los siete días de la semana
utiliza un bucle for para pedir las temperaturas
El programa debe calcular:
la suma de todas la temperaturas
la temperatura media de la semana
cuantos días superaron los 25ºC
la temperatura máxima registrada
la temperatura mínima registrada
muestra los resultados */


package JAVA;

import java.util.Scanner;

public class temperaturas {
    public static void main(String[] args){
        Double[] temperatura = new Double[7];
        Scanner teclado = new Scanner(System.in);
        for (int i=0; i<7; i++){
            System.out.print("introduce la temperatura del " + (i+1) +" día: ");
            temperatura[i]= Double.parseDouble(teclado.nextLine());
        }

        Double max=temperatura[0];
        Double min=temperatura[0];
        Double sum=temperatura[0];
        int contador =0;
        if (temperatura[0]>25){contador =1;}
        for (int i=1; i<temperatura.length; i++ ){
            if (temperatura[i]> max) {max= temperatura[i];}
            if (temperatura[i]< min) {min= temperatura[i];}
            if (temperatura[i]>25){contador ++ ;}
            sum = sum + temperatura[i];

        }
         

       System.out.printf("La temperatura máxima es %.2fºC. La temperatura mínima es de %.2fºC. Los días que superaron los 25ºC fueron %d días. La media de las temperaturas es %.2fºC.\n", max, min, contador, sum / temperatura.length); 
    }
}
