package JAVA;
/*Crea una variable para guarda el precion de un producto
Crea otra variable para caurdar la cantidad de producto
Calcula el precio total multiplicando
Guarda el resultado en una nueva variable llamada total
después muestra todo el resultado */
public class PrecioTotal {
    public static void main(String[] args) {
        double precio_unidad = 20.5;
        int cantidad = 3;
        double SubTotal=  precio_unidad * cantidad;
        System.out.println("El precio del producto es: "+ precio_unidad+ ", la cantidad elegida es :"+ cantidad+ ", el coste es de: "+ SubTotal);
    }
    
}
