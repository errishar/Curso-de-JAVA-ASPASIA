/*Crea un programa que colicite al usuario:
Nombre del producto
precio unidad
cantidad que desea comprar:
El programa deberá:
Calcular el importe de la compra
aplicar un descuento del 10% si el importe es igual o superior a 100€
calcular el IVA del 21% después del descuento
Calcular el precio final
Mostrar en pantalla
Nombre del producto
precio por unidad
cnatidad comprada
importe incial
descuento aplicado
IVA
Total a pagar
 */
package JAVA;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;
import java.text.NumberFormat;
import java.util.Locale;

public class producto_IVA {

    public static double trun(double n, int d){
    double pot= Math.pow(10,d);
    n=n*pot;
    n=(long)n;
    return n/pot;
    }

    public static void main(String[] args){
        NumberFormat formateador = NumberFormat.getCurrencyInstance(new Locale("es", "ES"));
        Scanner teclado = new Scanner(System.in);
        
        System.out.println(" Nombre del producto:");
        String  nombre = teclado.nextLine();
        
        System.out.println("valor unitario de " + nombre + ":");
        Double valor_unitario= Double.parseDouble(teclado.nextLine());

        System.out.println("Cantidad de " + nombre + ":");
        int cantidad=Integer.parseInt(teclado.nextLine());

        Double coste=valor_unitario*cantidad;

        Double decuento ;
        if (coste>=100){
            Double descuento=coste*0.1;
            coste= coste - descuento;
            System.out.println("Se le aplica un descuento del 10%, " + descuento + " €, por lo que queda en: " + coste + " €.");
        } 
        else {System.out.println("No se le aplica el descuento, por lo que queda en: " + coste + " €."); }

        System.out.printf("Aplicamos 21%% de IVA: %.2f€. El precio total es: %.2f€\n", (coste * 0.21), (coste * 1.21));
        


    }
}
     
