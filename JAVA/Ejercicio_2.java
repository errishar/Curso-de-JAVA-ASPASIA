package JAVA;
/*Crea una variable para:
Nombre del alumno
Nota de examen
número de faltas
si has aprobado o suspendido
Muestra los valores por pantalla */


public class Ejercicio_2 {
    public static void main(String[] args) {
    
        String nombre ="Pedro";
        double nota = 1.6;
        int faltas = 10;
        boolean aprobado = false;
        System.out.println("El alumno se llama " + nombre + ", su nota es de: "+ nota + ", ha tenido " + faltas + " faltas, y por lo tanto está:  " + (aprobado? "Aprobado":"Suspenso"));
    }
}
