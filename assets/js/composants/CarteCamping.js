class CarteCamping {

    #camping;

    constructor(camping) {
      this.#camping = camping;
    }

    formatDateFR(dateISO) {
        if (!dateISO) return "";
      
        return new Date(dateISO).toLocaleDateString("fr-CA", {
          day: "numeric",
          month: "long",
          year: "numeric"
        });
      }
  
      render() {
        const article = document.createElement("article");
        article.className = "carte";
        article.dataset.id = this.#camping.SyndicObjectID;
      
        const images = [
            "/assets/img/camp1.webp",
            "/assets/img/camp2.webp",
            "/assets/img/camp3.webp"
          ];
          
          const index =
            this.#camping.SyndicObjectID
              .split("")
              .reduce((a, c) => a + c.charCodeAt(0), 0)
              % images.length;
          
          const img = images[index];
            
        article.innerHTML = `
          <img class="carte__img" src="${img}" alt="Camping" loading="lazy" width="300" height="200" />
      
          <h2>${this.#camping.SyndicObjectName || "Sans nom"}</h2>
      
          <p class="date">Dernière mise à jour : ${this.formatDateFR(this.#camping.Updated)}</p>
      
          <p>${this.#camping.Ville || this.#camping.City || this.#camping.Municipalite || "N/A"}</p>
      
          <small>${this.#camping.ObjectTypeName || this.#camping.Type || ""}</small>
      
          <a class="btn-details" href="/camping/${this.#camping.SyndicObjectID}">
          Voir détails
          </a>
        `;
      
        return article;
      }
  }
  
  export default CarteCamping;
  