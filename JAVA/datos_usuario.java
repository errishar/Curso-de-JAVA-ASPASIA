package JAVA;

import java.util.Scanner;

public class datos_usuario {
    public static void main(String[] args) {
        /*Creamos scanner */
        Scanner teclado = new Scanner(System.in);

        /*Pedimos el nombre */
        System.out.println("Introduce el nombre:");
        String nombre= teclado.nextLine();

        /*Pedimos la edad */
        System.out.println("Introduce la edad:");
        int edad = Integer.parseInt(teclado.nextLine());

        /*Pedimos la altura */
        System.out.println("Introduce la estatura:");
        double altura = Double.parseDouble(teclado.nextLine());

        /*Mostramos los datos */
        System.out.println("Se llama " + nombre + ", tiene "+ edad + " años y mide "+ altura + "m.");
    }
    
}
