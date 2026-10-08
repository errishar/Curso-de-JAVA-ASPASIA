package JAVA;
/*Precio con descuento e IVA
Crea un programa en java que calcule el precio fina de una compra aplicando un descuento y después el IVA
Para ell debes:
Crear la variable para la cantidad y el precio
calcular el importe total
calcular el importe total
calcular un descuento del 10%
Calcular cuanto dinero se descuenta en total
restar el descuento al importe total
Clcular el IVA del 21% sobre el precio después de aplicar el descuento
obtener el precio final
mostrar en pantalla
precio producto, cantidad de producto, importe innicial de la compra, impor descuento, precio después del descuento, importe del IVA y precio final de la compra */

import java.math.RoundingMode;
import java.text.DecimalFormat;
public class DescuentoIVA {
    
    public static void main(String[] args) {
        DecimalFormat df= new DecimalFormat("#.00");    
        df.setRoundingMode(RoundingMode.DOWN);
        
        int cantidad=15;
        double precio= 10.5;        
        double Subtotal= cantidad*precio;
        double DineroDescontado= Subtotal*10/100;
        double Pago=Subtotal-DineroDescontado;
        double MasIVA=21*Pago/100;
        double Total =Pago+MasIVA;

        System.out.println("El precio unitario es de "+ precio + ", la cantidad es: " + cantidad + ", te sale por " + Subtotal + "€, con un descuento del 10% te rebajamos "  + DineroDescontado + "€, por lo que te queda, sin IVA " + Pago + "€, si añadimos el 21% de IVA " + df.format(MasIVA) + "€, el precio total con IVA es " + df.format(Total) + "€");
    }
    
}
