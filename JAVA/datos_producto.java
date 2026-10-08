package JAVA;
/*Crea variables para guardar
Nombre del producto
Precio
Unidades disponibles
Si está de oferta
Muestra toda la información en System.out println()*/
public class datos_producto {
    public static void main(String[] args) {
    String nombre_producto = "lapiceros";
    double precio = 1.5;
    int unidades_disponibles = 12;
    boolean oferta = false;

    System.out.println(" El producto " + nombre_producto + " y cuesta " + precio + "€ y hay de existencias " + unidades_disponibles + " y " + (oferta ? " está de oferta": " No, no está de oferta"));
    


    }
}
