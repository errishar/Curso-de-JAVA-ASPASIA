package JAVA;
// contrôl du parking:
// Un contrôl du parking a besoin calculer le montant que on doit paier chaque voiture
//le program doit:
// demandeer le nombre de voitures
// demander le nombre d'heures du chaque voiture
// calculer le prix du parking:
//      La première heure côute 2€.
//      Chaque heure additionnel côute 1.5€
//      appliquer une remise du 10% si le voiture a restée plus de 5 heures
//      afficher le résultant chaque voiture
//      calculer la recette  total
//      compter les voitures ayant bénéficié de la remise

import java.util.Scanner;

public class control_du_parking {
    public static void main(String[] args) {
        Scanner teclado =new Scanner(System.in)
        
        System.out.println("Comme bien de voitures y a-t-il dans le parking");
        int nombreVoitures = Integer.parseInt(teclado.nextLine());
        Double heuresChaqueVoiture[];
        double prix=0;

        for (int i=0; i<nombreVoitures; i++){
            System.out.println("Ecri le nombre d'heures que le voiture a restée");
            double heures = Double.parseDouble(teclado.nextLine())
            if (heures<=1 ){
                prix= 2;
            } else{
                prix=2+(Math.ceil(heures-1));
            }
        }

    }
}
