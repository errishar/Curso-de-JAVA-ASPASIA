package JAVA;
/*Crea un programa que pida al usuario la base y la altura de un triángulo
clacula el area utilizando la fórmula area=base*altura/2
muestra la base, la altura y el area */
import java.util.Scanner;

public class triangulo {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);

        /*Pedimos la base */
        System.out.print("Dame la base:");
        double altura = Double.parseDouble(teclado.nextLine());

        /*pedimos la altura*/
        System.out.print(("Dame la altura: "));
        double base = Double.parseDouble(teclado.nextLine());

        double area= base*altura/2;
        System.err.println("El triángulo tiene de base: "+ base + ", y de altura: " + altura + ", el area es: " + area);
    }
    
}
