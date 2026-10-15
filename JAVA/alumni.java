package JAVA;

import java.util.Scanner;

//          MONITORAGGIO DI VOTI DI CLASSE

//          Fa un programa que chiedi il nome e il voto della clase
//          il programa debi:
//          chiedere dati delgli studante utilizzando il bucle FOR
//          mostra si ogni studenti approva o sospende
//          contare gli approvati e le suspense
//          fa un promedio del voo de la clase
//          Mostra il voto piu alto e lo studente
//
class Studente{ // Definimos la clase Studente FUERA del método main
        String nome;
        double voto;

        Studente(String nome, double voto){  // Constructor (El nombre debe coincidir exactamente con la clase)
            this.nome = nome;
            this.voto = voto;
        }
    }
    
    public class alumni {
    public static void main(String[] args) {
         
    Scanner teclado =new Scanner(System.in); /* */
    
    
    Studente[] classe = new Studente[5];
    int approvati= 0;    
    int sospesi= 0;
    double voti=0;
    double votoMegliore=0;
    String nomeMegliore="";

    for (int i=0; i<5; i++){
        System.out.println("Nome dello studente numero "+(i+1)+": ");
        String nome = teclado.nextLine();
        System.out.println("Voto dello studente: ");
        double voto = Double.parseDouble(teclado.nextLine());
        
        classe[i]=new Studente(nome, voto);
        voti=voti+voto;
        
        if (classe[i].voto > votoMegliore){
            votoMegliore = classe[i].voto;
            nomeMegliore = classe[i].nome;
        }   

     
    
    }
    Double promedioVoti=voti/5;

    for (int i=0; i<classe.length; i++){
            if (classe[i].voto>=5){
                System.out.println(classe[i]. nome + " ha aprovato/a, con il voto: "+ classe[i].voto);
                approvati++;
            }
            if (classe[i].voto<5){
                System.out.println(classe[i]. nome + " ha sospesso/a, con il voto: "+ classe[i].voto);
                sospesi++;
            }
    }
    System.out.println();
    System.out.println();
    System.out.println();
    System.out.println("Il computo degli studenti qui ha approvato sono: "+ approvati);
    System.out.println("Il Megiore o la megiore estudente è "+ nomeMegliore + ", con il voto: "+ votoMegliore);
    System.out.println("Il computo degli studenti qui ha sospesso sono: "+ sospesi);
    System.out.printf("Il promedio dei voti de la classe è: %.2f\n", promedioVoti);


    }
    
}
