class CampingService {

    static #cache = [];
  
    static URL =
      "https://api-v3.tourinsoft.com/api/syndications/mto.tourinsoft.com/81ef2c59-bd09-41bd-b2d6-fa63bcbd9765?format=json";
  
    // Normalise chaque camping 
    static normalize(item) {
  
      const a = Array.isArray(item?.Adresses) ? item.Adresses[0] : null;
  
      return {
        ...item,
  
        Ville:
          a?.City ||
          a?.Municipalite ||
          a?.Ville ||
          a?.Localite ||
          item?.City ||
  
          "",
  
        Type: item?.ObjectTypeName || "",
  
        Adresse1: a?.Address1 || a?.Adresse1 || "",
  
        CodePostal: a?.Postcode || a?.CodePostal || "",
      };
    }
  
    // Charge TOUS les campings
  
    static async chargerCampings() {
      try {
        const res = await fetch(this.URL);
        const data = await res.json();
        const items = data.Items || data.items || data.value || [];
  
        this.#cache = items.map(CampingService.normalize);  
        console.log("Campings chargés :", this.#cache.length);
  
        return this.#cache;
  
      } catch (e) {
  
        console.error("Erreur API", e);
  
        this.#cache = [];
  
        return [];
      }
  
    }
  
    // Retourne UN camping par son ID
  
    static getCampingById(id) {
  
      return this.#cache.find((c) => c.SyndicObjectID === id) || null;
  
    }
  
  }
    
  export default CampingService;
  
  
  
  