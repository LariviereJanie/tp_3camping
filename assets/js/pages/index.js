import Application from "../composants/Application.js";
import page from "page";
import { animate } from "animejs";
import CampingService from "../composants/CampingService.js";

function mount(html) {
  const app = document.querySelector("[data-application]");
  app.innerHTML = html;
}

function renderAccueil() {
  // remet le HTML COMPLET 
  mount(`
    <h1 class="text-2xl">Liste des campings au Québec</h1>
    <p><small>Ce site regroupe des établissements d’hébergement touristique du Québec de catégorie générale.</small></p>

    <div class="input-group">
  <label for="search" class="sr-only">Rechercher un camping</label>
  <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>

  <input
    id="search"
    type="text"
    class="search"
    data-search
    placeholder="Rechercher un camping…"
  />
</div>

    

    <section class="campings" data-liste-campings></section>
    <div id="map" style="height: 400px; width: 100%"></div>
  `);

  new Application();
    setTimeout(() => {
    activerClickCartes();
    }, 0);

    function activerClickCartes() {
        const liste = document.querySelector("[data-liste-campings]");
        if (!liste) return;
      
        liste.addEventListener("click", async (e) => {
        const carte = e.target.closest(".carte");
          if (!carte) return;
      
        const id = carte.dataset.id;
      
        const camping = await CampingService.getCampingById(id);
      
        mount(`
          <h1>${camping?.SyndicObjectName}</h1>
          <p><b>Ville:</b> ${camping?.Ville || "N/A"}</p>
          <p><b>Type:</b> ${camping?.Type || "N/A"}</p>
      
          <button class="btn-retour">⬅ Retour</button>
          `);
        });
      }

    document.querySelectorAll(".nav a").forEach(link => {
    link.addEventListener("mouseenter", () => {
      animate(link.querySelector("i"), {
        translateY: [-4, 0],
        scale: [1.2, 1],
        duration: 300,
        easing: "easeOutElastic(1, .6)"
      });
    });
  });
  

    const attenteCartes = setInterval(() => {
    const cartes = document.querySelectorAll(".carte");
      if (cartes.length > 0) {
      clearInterval(attenteCartes);
  
      animate(".carte", {
        translateY: [30, 0],
        opacity: [0, 1],
        delay: (_, i) => i * 80,
        duration: 600,
        easing: "ease-out",
      });
    }
  }, 30);
}

function renderSources() {
    mount(`
      <h1>Sources & librairies</h1>
      <p><small>Cette page liste la source de données ouvertes et les bibliothèques JavaScript utilisées dans l'application.</small></p>
  
      <section class="sources">
        <h2>Source de données</h2>
        <ul>
          <li>
            <strong>Données ouvertes – Gouvernement du Québec</strong><br />
            Jeu de données : <em>Campings (hébergement touristique)</em><br />
            Format : JSON (via requête Fetch)
          </li>
        </ul>
  
        <h2>Librairies utilisées</h2>
        <ul>
          <li><strong>Vite</strong> : serveur de développement + build (bundle) pour déploiement.</li>
          <li><strong>PageJS</strong> : navigation SPA (routes / et /sources sans recharger la page).</li>
          <li><strong>Fetch API</strong> : récupérer les données de l’API (asynchrone).</li>
          <li><strong>Font Awesome</strong> : icônes (à intégrer).</li>
          <li><strong>TailwindCSS</strong> : CSS utilitaire (à intégrer).</li>
          <li><strong>Moment</strong> : formatage de dates (à intégrer).</li>
          <li><strong>AnimeJS</strong> : animations à l’affichage (à intégrer).</li>
        </ul>
  
        <h2>Déploiement</h2>
        <ul>
          <li><strong>Vercel</strong> : hébergement et déploiement automatisé.</li>
        </ul>
      </section>
    `);
  }

  function renderCarte() {
    // 
    mount(`
      <h1>Carte géographique</h1>
      <p></p>
  
      <div class="input-group">
      
        <input type="text" placeholder="Rechercher un camping..." class="search" data-search />
      </div>
  
      <section class="campings" data-liste-campings></section>
      <div id="map" style="height: 400px; width: 100%"></div>
    `);
  
    new Application();
  }

page("/", renderAccueil);
page("/sources", renderSources);

document.addEventListener("click", (e) => {
  const link = e.target.closest("a[data-link]");
  if (!link) return;
  e.preventDefault();
  page.show(link.getAttribute("href"));
});

async function renderDetailCamping(ctx) {
  const id = ctx.params.id;

  const camping = await CampingService.getCampingById(id);

  const adresses = camping?.Adresses ?? [];
  const a = Array.isArray(adresses) ? adresses[0] : null;

// Ville 
  const ville =
  a?.Municipalite ??
  a?.City ??
  a?.Ville ??
  a?.Localite ??
  "N/A";

// Adresse 
  const rue =
  a?.Address1 ??
  a?.Adresse ??
  a?.AdresseComplete ??
  a?.Numerovoie ??
  "N/A";

  const codePostal = a?.Postcode ?? a?.CodePostal ?? "";
  const nom = camping?.SyndicObjectName || "Sans nom";

  const telephone =
  camping?.Telephone ??
  camping?.Phone ??
  camping?.Telephone1 ??
  "N/A";

  const type =
  camping?.ObjectTypeName ??
  camping?.Type ??
  "N/A";

  
mount(`
  <section class="detail">
    
    <img class="detail-img" src="/assets/img/camp1.webp">

    <div class="detail-info">
      <h1>${nom}</h1>
      <p><strong>Ville:</strong> ${ville}</p>
      <p><strong>Adresse:</strong> ${rue} ${codePostal}</p>
      <p><strong>Téléphone:</strong> ${telephone}</p>
      <p><strong>Type:</strong> ${type}</p>

    <div class="map">
        <a target="_blank"
        href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(rue + ' ' + ville)}"></a>
 
        <iframe
        src="https://www.google.com/maps?q=${encodeURIComponent(rue + ' ' + ville)}&output=embed"
        width="100%"
        height="250"
        style="border:0;"
        loading="lazy">
        </iframe>
    </div>
    <button data-retour>Retour</button>
    </div>    
  </section>
    `);
  }

  page("/", renderAccueil);
  page("/camping/:id", renderDetailCamping);
  page();