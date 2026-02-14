import CarteCamping from "./CarteCamping.js";
import CampingService from "./CampingService.js";
import moment from "moment";
import "moment/locale/fr";

class Application {
    #conteneurHTML = null;
    #conteneurListeCampingsHTML = null;
    #listeCampings = [];
    #formulaire = null;

constructor() {
    this.#conteneurHTML = document.querySelector("[data-application]");
    this.#conteneurListeCampingsHTML = this.#conteneurHTML.querySelector("[data-liste-campings]");
    this.#conteneurHTML.querySelector("[data-search]").addEventListener("input", e => this.#filtrer(e.target.value));

    this.#recupererDonnees();
}

async #recupererDonnees() {
    this.#listeCampings = await CampingService.chargerCampings();
    
    this.#afficherCampings();
  }

    #afficherCampings() {
    this.#conteneurListeCampingsHTML.innerHTML = "";
  
    this.#listeCampings.slice(0,30).forEach(camping => {
    const date = moment(camping.Updated).locale("fr").format("D MMMM YYYY");

    const carte = new CarteCamping({
    ...camping,
    dateFormatee: date
  });

    this.#conteneurListeCampingsHTML.append(carte.render());
    });
  }

    #filtrer(valeur) {
    const filtre = valeur.toLowerCase();
  
    this.#conteneurListeCampingsHTML.innerHTML = "";
  
    this.#listeCampings
      .filter(c =>
        (c.SyndicObjectName || "").toLowerCase().includes(filtre)
      )
      .slice(0, 30)
      .forEach(camping => {
      const carte = new CarteCamping(camping);
      this.#conteneurListeCampingsHTML.append(carte.render());
      });
  }
}

export default Application;


/*appelle CampingService
affichercampings
gere la liste
cree cartes
moment, pages, vite, anime, tailwing, awesome
vercelle 
 */