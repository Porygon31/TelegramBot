// Construit la page HTML du panneau d'administration premium.
export const renderAdminPanelHtml = (): string => `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Panel de gestion premium</title>
    <style>
      /* Définit la palette graphique du panel premium. */
      :root {
        --bg: #eef3f8;
        --surface: #ffffff;
        --surface-soft: #f7f9fc;
        --text: #17202d;
        --muted: #637287;
        --line: rgba(23, 32, 45, 0.1);
        --accent: #146c78;
        --accent-strong: #0f4f58;
        --accent-soft: rgba(20, 108, 120, 0.1);
        --orange: #ff9b58;
        --danger: #cf4d57;
        --success: #108a5a;
        --warning: #c97812;
        --shadow: 0 24px 50px rgba(26, 34, 47, 0.08);
        --radius: 24px;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        color: var(--text);
        background:
          radial-gradient(circle at top right, rgba(20, 108, 120, 0.08), transparent 22%),
          radial-gradient(circle at top left, rgba(255, 155, 88, 0.08), transparent 16%),
          linear-gradient(180deg, #f6f9fc 0%, var(--bg) 100%);
      }

      .shell {
        width: min(1220px, calc(100% - 32px));
        margin: 0 auto;
        padding: 24px 0 56px;
      }

      .hero {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 24px;
        padding: 26px;
        border-radius: 30px;
        background: linear-gradient(135deg, #ffffff, #edf6f7);
        box-shadow: var(--shadow);
      }

      .hero h1,
      .hero p,
      h2,
      h3,
      p {
        margin-top: 0;
      }

      .hero p {
        max-width: 760px;
        color: var(--muted);
        line-height: 1.7;
      }

      .hero-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }

      .button,
      button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 12px 16px;
        border: 0;
        border-radius: 14px;
        font-weight: 700;
        cursor: pointer;
        text-decoration: none;
      }

      .button,
      button.primary {
        color: #ffffff;
        background: linear-gradient(135deg, var(--accent), var(--accent-strong));
      }

      button.secondary,
      .button.secondary {
        color: var(--text);
        background: #edf2f7;
      }

      button.warning {
        color: #fff;
        background: linear-gradient(135deg, #e79d38, var(--warning));
      }

      button.danger {
        color: #fff;
        background: linear-gradient(135deg, #d86169, var(--danger));
      }

      .layout {
        display: grid;
        gap: 20px;
      }

      .stats-grid,
      .content-grid {
        display: grid;
        gap: 16px;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      }

      .panel {
        padding: 24px;
        border-radius: var(--radius);
        background: var(--surface);
        box-shadow: var(--shadow);
      }

      .panel p {
        color: var(--muted);
        line-height: 1.6;
      }

      .stat-card {
        padding: 18px;
        border: 1px solid var(--line);
        border-radius: 22px;
        background: linear-gradient(180deg, #ffffff, var(--surface-soft));
      }

      .stat-card strong {
        display: block;
        font-size: 2rem;
      }

      .stat-card span {
        color: var(--muted);
      }

      .two-columns {
        display: grid;
        gap: 20px;
        grid-template-columns: 1.15fr 1fr;
      }

      .stack {
        display: grid;
        gap: 14px;
      }

      form {
        display: grid;
        gap: 12px;
      }

      input,
      textarea,
      select {
        width: 100%;
        padding: 12px 14px;
        border: 1px solid rgba(23, 32, 45, 0.14);
        border-radius: 14px;
        font: inherit;
        background: #ffffff;
      }

      textarea {
        min-height: 110px;
        resize: vertical;
      }

      .checkbox-row {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
      }

      .checkbox {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: var(--text);
      }

      .checkbox input {
        width: auto;
        margin: 0;
      }

      .section-head {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 16px;
      }

      .card {
        padding: 18px;
        border: 1px solid var(--line);
        border-radius: 20px;
        background: linear-gradient(180deg, #ffffff, #fbfcfe);
      }

      .card img {
        width: 100%;
        height: 170px;
        border-radius: 16px;
        object-fit: cover;
        background: #dce6f0;
      }

      .badge-row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 12px;
      }

      .badge {
        display: inline-flex;
        align-items: center;
        padding: 7px 11px;
        border-radius: 999px;
        background: var(--accent-soft);
        color: var(--accent);
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
      }

      .badge.warning {
        background: rgba(255, 155, 88, 0.14);
        color: #d9732d;
      }

      .badge.muted {
        background: rgba(99, 114, 135, 0.1);
        color: var(--muted);
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 16px;
      }

      .status {
        min-height: 24px;
        color: var(--success);
      }

      .status.error {
        color: var(--danger);
      }

      .hidden {
        display: none;
      }

      @media (max-width: 980px) {
        .two-columns {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 640px) {
        .shell {
          width: min(100% - 20px, 1220px);
        }

        .hero,
        .panel {
          padding: 20px;
        }
      }
    </style>
  </head>
  <body>
    <main class="shell">
      <section class="hero">
        <div>
          <h1>Panel de gestion premium</h1>
          <p>
            Pilotez votre mini app Telegram comme un vrai produit: dashboard, contenus mis en avant,
            publication selective, tri manuel et upload direct de medias.
          </p>
        </div>
        <div class="hero-actions">
          <a class="button secondary" href="/app" target="_blank" rel="noreferrer">Voir la mini app</a>
          <form method="post" action="/admin/logout">
            <button class="primary" type="submit">Se deconnecter</button>
          </form>
        </div>
      </section>

      <section class="layout">
        <article class="panel">
          <div class="section-head">
            <div>
              <h2>Dashboard</h2>
              <p>Vue d'ensemble du catalogue public et de vos contenus premium.</p>
            </div>
          </div>
          <div class="stats-grid" id="statsGrid"></div>
        </article>

        <div class="two-columns">
          <article class="panel">
            <div class="section-head">
              <div>
                <h2>Parametres generaux</h2>
                <p>Personnalisez la proposition de valeur visible dans Telegram.</p>
              </div>
            </div>
            <form id="settingsForm">
              <input name="brandName" placeholder="Nom de la marque" required />
              <input name="heroTitle" placeholder="Titre principal" required />
              <textarea name="heroDescription" placeholder="Description hero" required></textarea>
              <input name="announcement" placeholder="Annonce premium" required />
              <input name="contactLabel" placeholder="Texte du bouton contact" required />
              <input name="contactUrl" placeholder="Lien de contact" required />
              <input name="supportLabel" placeholder="Texte du bouton support" required />
              <input name="supportUrl" placeholder="Lien de support" required />
              <button class="primary" type="submit">Enregistrer les parametres</button>
            </form>
            <div class="status" id="settingsStatus"></div>
          </article>

          <article class="panel">
            <div class="section-head">
              <div>
                <h2>Uploads medias</h2>
                <p>Envoyez une image ou une video puis reutilisez automatiquement l'URL generee.</p>
              </div>
            </div>
            <form id="uploadForm">
              <input id="uploadFile" name="file" type="file" accept="image/*,video/*" required />
              <button class="primary" type="submit">Uploader le fichier</button>
            </form>
            <div class="status" id="uploadStatus"></div>
            <p>
              Apres upload, le formulaire media se remplit automatiquement avec l'URL publique et la source locale.
            </p>
          </article>
        </div>

        <div class="two-columns">
          <article class="panel">
            <div class="section-head">
              <div>
                <h2>Menu disponible</h2>
                <p>Ajoutez, triez, publiez ou mettez en avant vos offres.</p>
              </div>
            </div>
            <form id="menuForm">
              <input name="title" placeholder="Titre" required />
              <input name="category" placeholder="Categorie" required />
              <input name="highlight" placeholder="Badge / mise en avant" required />
              <input name="availability" placeholder="Disponibilite" required />
              <input name="sortOrder" type="number" min="1" step="1" value="1" required />
              <textarea name="description" placeholder="Description" required></textarea>
              <div class="checkbox-row">
                <label class="checkbox"><input name="isFeatured" type="checkbox" /> Mettre en avant</label>
                <label class="checkbox"><input name="isPublished" type="checkbox" checked /> Publier</label>
              </div>
              <div class="actions">
                <button class="primary" type="submit" id="menuSubmitButton">Ajouter au menu</button>
                <button class="secondary hidden" type="button" id="menuCancelButton">Annuler la modification</button>
              </div>
            </form>
            <div class="status" id="menuStatus"></div>
          </article>

          <article class="panel">
            <div class="section-head">
              <div>
                <h2>Tarifs</h2>
                <p>Structurez vos formules avec badges, tri et publication selective.</p>
              </div>
            </div>
            <form id="pricingForm">
              <input name="title" placeholder="Titre" required />
              <input name="price" placeholder="Prix" required />
              <input name="tag" placeholder="Badge / tag" required />
              <input name="sortOrder" type="number" min="1" step="1" value="1" required />
              <textarea name="details" placeholder="Details" required></textarea>
              <div class="checkbox-row">
                <label class="checkbox"><input name="isFeatured" type="checkbox" /> Mettre en avant</label>
                <label class="checkbox"><input name="isPublished" type="checkbox" checked /> Publier</label>
              </div>
              <div class="actions">
                <button class="primary" type="submit" id="pricingSubmitButton">Ajouter le tarif</button>
                <button class="secondary hidden" type="button" id="pricingCancelButton">Annuler la modification</button>
              </div>
            </form>
            <div class="status" id="pricingStatus"></div>
          </article>
        </div>

        <article class="panel">
          <div class="section-head">
            <div>
              <h2>Videos / Photos</h2>
              <p>Editez vos medias avec support URL ou upload local.</p>
            </div>
          </div>
          <form id="mediaForm">
            <div class="content-grid">
              <input name="title" placeholder="Titre" required />
              <select name="type" required>
                <option value="photo">Photo</option>
                <option value="video">Video</option>
              </select>
              <input name="sortOrder" type="number" min="1" step="1" value="1" required />
              <input name="url" placeholder="URL du media" required />
              <input name="thumbnailUrl" placeholder="URL de la miniature (optionnel)" />
              <input name="sourceType" type="hidden" value="url" />
              <input name="storagePath" type="hidden" value="" />
            </div>
            <textarea name="description" placeholder="Description" required></textarea>
            <div class="checkbox-row">
              <label class="checkbox"><input name="isFeatured" type="checkbox" /> Mettre en avant</label>
              <label class="checkbox"><input name="isPublished" type="checkbox" checked /> Publier</label>
            </div>
            <div class="actions">
              <button class="primary" type="submit" id="mediaSubmitButton">Ajouter le media</button>
              <button class="secondary hidden" type="button" id="mediaCancelButton">Annuler la modification</button>
            </div>
          </form>
          <div class="status" id="mediaStatus"></div>
        </article>

        <article class="panel">
          <div class="section-head">
            <div>
              <h2>Catalogue actuel</h2>
              <p>Le dashboard ci-dessous permet d'editer ou supprimer vos contenus actuels.</p>
            </div>
          </div>
          <div class="stack">
            <div>
              <h3>Menu</h3>
              <div class="content-grid" id="menuList"></div>
            </div>
            <div>
              <h3>Medias</h3>
              <div class="content-grid" id="mediaList"></div>
            </div>
            <div>
              <h3>Tarifs</h3>
              <div class="content-grid" id="pricingList"></div>
            </div>
          </div>
        </article>
      </section>

      <script>
        // Conserve l'etat admin courant et les elements en cours d'edition.
        let currentContent = null;
        let editingMenuId = null;
        let editingMediaId = null;
        let editingPricingId = null;

        // Simplifie l'acces aux elements de l'interface.
        const byId = (id) => document.getElementById(id);

        // Echappe le HTML injecte afin de limiter les risques d'injection.
        const escapeHtml = (value) =>
          String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");

        // Construit un payload compatible a partir d'un formulaire HTML.
        const serializeForm = (form) => {
          const payload = Object.fromEntries(new FormData(form).entries());

          form.querySelectorAll("input[type='checkbox']").forEach((input) => {
            payload[input.name] = input.checked;
          });

          return payload;
        };

        // Met a jour un message de statut apres une action utilisateur.
        const setStatus = (id, message, isError = false) => {
          const target = byId(id);
          target.textContent = message;
          target.className = isError ? "status error" : "status";
        };

        // Renvoie l'objet menu correspondant a un identifiant.
        const findMenuItem = (id) => currentContent.menuItems.find((item) => item.id === id);

        // Renvoie l'objet media correspondant a un identifiant.
        const findMediaItem = (id) => currentContent.mediaItems.find((item) => item.id === id);

        // Renvoie l'objet tarif correspondant a un identifiant.
        const findPricingItem = (id) => currentContent.pricingItems.find((item) => item.id === id);

        // Met a jour l'etat global et rerend l'interface.
        const applyContent = (content) => {
          currentContent = content;
          renderStats();
          hydrateSettingsForm();
          renderMenuList();
          renderMediaList();
          renderPricingList();
        };

        // Effectue une requete JSON standard vers l'API d'administration.
        const sendJson = async (url, method, payload) => {
          const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });

          if (!response.ok) {
            const errorPayload = await response.json().catch(() => ({ message: "La requete a echoue." }));
            throw new Error(errorPayload.message || "La requete a echoue.");
          }

          const content = await response.json();
          applyContent(content);

          return content;
        };

        // Charge l'etat complet du dashboard.
        const fetchContent = async () => {
          const response = await fetch("/api/admin/content");

          if (!response.ok) {
            throw new Error("Impossible de charger le contenu admin.");
          }

          applyContent(await response.json());
        };

        // Alimente le formulaire des parametres generaux.
        const hydrateSettingsForm = () => {
          const form = byId("settingsForm");
          form.brandName.value = currentContent.settings.brandName;
          form.heroTitle.value = currentContent.settings.heroTitle;
          form.heroDescription.value = currentContent.settings.heroDescription;
          form.announcement.value = currentContent.settings.announcement;
          form.contactLabel.value = currentContent.settings.contactLabel;
          form.contactUrl.value = currentContent.settings.contactUrl;
          form.supportLabel.value = currentContent.settings.supportLabel;
          form.supportUrl.value = currentContent.settings.supportUrl;
        };

        // Affiche les cartes de statistiques dashboard.
        const renderStats = () => {
          const stats = currentContent.stats;
          byId("statsGrid").innerHTML = [
            { value: stats.menuCount, label: "Offres total" },
            { value: stats.mediaCount, label: "Medias total" },
            { value: stats.pricingCount, label: "Tarifs total" },
            { value: stats.featuredCount, label: "Contenus featured" },
            { value: stats.publishedMenuItems, label: "Offres publiees" },
            { value: stats.publishedMediaItems, label: "Medias publies" },
            { value: stats.publishedPricingItems, label: "Tarifs publies" },
            { value: stats.uploadedMediaItems, label: "Uploads locaux" }
          ]
            .map(
              (stat) =>
                "<article class='stat-card'><strong>" +
                escapeHtml(stat.value) +
                "</strong><span>" +
                escapeHtml(stat.label) +
                "</span></article>"
            )
            .join("");
        };

        // Rerender la liste des elements de menu.
        const renderMenuList = () => {
          const target = byId("menuList");

          if (!currentContent.menuItems.length) {
            target.innerHTML = "<p>Aucun element de menu.</p>";
            return;
          }

          target.innerHTML = currentContent.menuItems
            .map(
              (item) => \`
                <article class="card">
                  <div class="badge-row">
                    <span class="badge">\${escapeHtml(item.category)}</span>
                    <span class="badge warning">\${escapeHtml(item.highlight)}</span>
                    <span class="badge muted">\${item.isPublished ? "Publie" : "Masque"}</span>
                  </div>
                  <h3>\${escapeHtml(item.title)}</h3>
                  <p>\${escapeHtml(item.description)}</p>
                  <p><strong>Disponibilite :</strong> \${escapeHtml(item.availability)}</p>
                  <p><strong>Ordre :</strong> \${escapeHtml(item.sortOrder)}</p>
                  <div class="actions">
                    <button class="primary" type="button" onclick="editMenuItem('\${item.id}')">Editer</button>
                    <button class="secondary" type="button" onclick="toggleMenuPublished('\${item.id}')">\${item.isPublished ? "Masquer" : "Publier"}</button>
                    <button class="warning" type="button" onclick="toggleMenuFeatured('\${item.id}')">\${item.isFeatured ? "Retirer la une" : "Mettre a la une"}</button>
                    <button class="danger" type="button" onclick="deleteMenuItem('\${item.id}')">Supprimer</button>
                  </div>
                </article>
              \`
            )
            .join("");
        };

        // Rerender la liste des medias.
        const renderMediaList = () => {
          const target = byId("mediaList");

          if (!currentContent.mediaItems.length) {
            target.innerHTML = "<p>Aucun media.</p>";
            return;
          }

          target.innerHTML = currentContent.mediaItems
            .map(
              (item) => \`
                <article class="card">
                  <img src="\${escapeHtml(item.thumbnailUrl || item.url)}" alt="\${escapeHtml(item.title)}" />
                  <div class="badge-row" style="margin-top: 12px;">
                    <span class="badge">\${escapeHtml(item.type)}</span>
                    <span class="badge warning">\${escapeHtml(item.sourceType)}</span>
                    <span class="badge muted">\${item.isPublished ? "Publie" : "Masque"}</span>
                  </div>
                  <h3>\${escapeHtml(item.title)}</h3>
                  <p>\${escapeHtml(item.description)}</p>
                  <p><strong>Ordre :</strong> \${escapeHtml(item.sortOrder)}</p>
                  <div class="actions">
                    <button class="primary" type="button" onclick="editMediaItem('\${item.id}')">Editer</button>
                    <button class="secondary" type="button" onclick="toggleMediaPublished('\${item.id}')">\${item.isPublished ? "Masquer" : "Publier"}</button>
                    <button class="warning" type="button" onclick="toggleMediaFeatured('\${item.id}')">\${item.isFeatured ? "Retirer la une" : "Mettre a la une"}</button>
                    <button class="danger" type="button" onclick="deleteMediaItem('\${item.id}')">Supprimer</button>
                  </div>
                </article>
              \`
            )
            .join("");
        };

        // Rerender la liste des tarifs.
        const renderPricingList = () => {
          const target = byId("pricingList");

          if (!currentContent.pricingItems.length) {
            target.innerHTML = "<p>Aucun tarif.</p>";
            return;
          }

          target.innerHTML = currentContent.pricingItems
            .map(
              (item) => \`
                <article class="card">
                  <div class="badge-row">
                    <span class="badge warning">\${escapeHtml(item.tag)}</span>
                    <span class="badge muted">\${item.isPublished ? "Publie" : "Masque"}</span>
                  </div>
                  <h3>\${escapeHtml(item.title)}</h3>
                  <p><strong>Prix :</strong> \${escapeHtml(item.price)}</p>
                  <p>\${escapeHtml(item.details)}</p>
                  <p><strong>Ordre :</strong> \${escapeHtml(item.sortOrder)}</p>
                  <div class="actions">
                    <button class="primary" type="button" onclick="editPricingItem('\${item.id}')">Editer</button>
                    <button class="secondary" type="button" onclick="togglePricingPublished('\${item.id}')">\${item.isPublished ? "Masquer" : "Publier"}</button>
                    <button class="warning" type="button" onclick="togglePricingFeatured('\${item.id}')">\${item.isFeatured ? "Retirer la une" : "Mettre a la une"}</button>
                    <button class="danger" type="button" onclick="deletePricingItem('\${item.id}')">Supprimer</button>
                  </div>
                </article>
              \`
            )
            .join("");
        };

        // Reinitialise le formulaire de menu.
        const resetMenuForm = () => {
          const form = byId("menuForm");
          form.reset();
          form.sortOrder.value = 1;
          form.isPublished.checked = true;
          editingMenuId = null;
          byId("menuSubmitButton").textContent = "Ajouter au menu";
          byId("menuCancelButton").classList.add("hidden");
        };

        // Reinitialise le formulaire media.
        const resetMediaForm = () => {
          const form = byId("mediaForm");
          form.reset();
          form.sortOrder.value = 1;
          form.isPublished.checked = true;
          form.sourceType.value = "url";
          form.storagePath.value = "";
          editingMediaId = null;
          byId("mediaSubmitButton").textContent = "Ajouter le media";
          byId("mediaCancelButton").classList.add("hidden");
        };

        // Reinitialise le formulaire tarif.
        const resetPricingForm = () => {
          const form = byId("pricingForm");
          form.reset();
          form.sortOrder.value = 1;
          form.isPublished.checked = true;
          editingPricingId = null;
          byId("pricingSubmitButton").textContent = "Ajouter le tarif";
          byId("pricingCancelButton").classList.add("hidden");
        };

        // Place un element de menu dans le formulaire pour edition.
        const editMenuItem = (id) => {
          const item = findMenuItem(id);

          if (!item) {
            return;
          }

          const form = byId("menuForm");
          editingMenuId = id;
          form.title.value = item.title;
          form.category.value = item.category;
          form.highlight.value = item.highlight;
          form.availability.value = item.availability;
          form.sortOrder.value = item.sortOrder;
          form.description.value = item.description;
          form.isFeatured.checked = item.isFeatured;
          form.isPublished.checked = item.isPublished;
          byId("menuSubmitButton").textContent = "Enregistrer le menu";
          byId("menuCancelButton").classList.remove("hidden");
        };

        // Place un media dans le formulaire pour edition.
        const editMediaItem = (id) => {
          const item = findMediaItem(id);

          if (!item) {
            return;
          }

          const form = byId("mediaForm");
          editingMediaId = id;
          form.title.value = item.title;
          form.type.value = item.type;
          form.sortOrder.value = item.sortOrder;
          form.url.value = item.url;
          form.thumbnailUrl.value = item.thumbnailUrl || "";
          form.sourceType.value = item.sourceType;
          form.storagePath.value = item.storagePath || "";
          form.description.value = item.description;
          form.isFeatured.checked = item.isFeatured;
          form.isPublished.checked = item.isPublished;
          byId("mediaSubmitButton").textContent = "Enregistrer le media";
          byId("mediaCancelButton").classList.remove("hidden");
        };

        // Place un tarif dans le formulaire pour edition.
        const editPricingItem = (id) => {
          const item = findPricingItem(id);

          if (!item) {
            return;
          }

          const form = byId("pricingForm");
          editingPricingId = id;
          form.title.value = item.title;
          form.price.value = item.price;
          form.tag.value = item.tag;
          form.sortOrder.value = item.sortOrder;
          form.details.value = item.details;
          form.isFeatured.checked = item.isFeatured;
          form.isPublished.checked = item.isPublished;
          byId("pricingSubmitButton").textContent = "Enregistrer le tarif";
          byId("pricingCancelButton").classList.remove("hidden");
        };

        // Inverse la publication d'un element de menu.
        const toggleMenuPublished = async (id) => {
          const item = findMenuItem(id);

          if (!item) {
            return;
          }

          try {
            await sendJson("/api/admin/menu/" + id, "PUT", { ...item, isPublished: !item.isPublished });
            setStatus("menuStatus", "Publication du menu mise a jour.");
          } catch (error) {
            setStatus("menuStatus", error.message, true);
          }
        };

        // Inverse la mise en avant d'un element de menu.
        const toggleMenuFeatured = async (id) => {
          const item = findMenuItem(id);

          if (!item) {
            return;
          }

          try {
            await sendJson("/api/admin/menu/" + id, "PUT", { ...item, isFeatured: !item.isFeatured });
            setStatus("menuStatus", "Mise en avant du menu mise a jour.");
          } catch (error) {
            setStatus("menuStatus", error.message, true);
          }
        };

        // Supprime un element de menu.
        const deleteMenuItem = async (id) => {
          if (!confirm("Supprimer cet element de menu ?")) {
            return;
          }

          try {
            await sendJson("/api/admin/menu/" + id, "DELETE", {});
            setStatus("menuStatus", "Element de menu supprime.");
          } catch (error) {
            setStatus("menuStatus", error.message, true);
          }
        };

        // Inverse la publication d'un media.
        const toggleMediaPublished = async (id) => {
          const item = findMediaItem(id);

          if (!item) {
            return;
          }

          try {
            await sendJson("/api/admin/media/" + id, "PUT", { ...item, isPublished: !item.isPublished });
            setStatus("mediaStatus", "Publication du media mise a jour.");
          } catch (error) {
            setStatus("mediaStatus", error.message, true);
          }
        };

        // Inverse la mise en avant d'un media.
        const toggleMediaFeatured = async (id) => {
          const item = findMediaItem(id);

          if (!item) {
            return;
          }

          try {
            await sendJson("/api/admin/media/" + id, "PUT", { ...item, isFeatured: !item.isFeatured });
            setStatus("mediaStatus", "Mise en avant du media mise a jour.");
          } catch (error) {
            setStatus("mediaStatus", error.message, true);
          }
        };

        // Supprime un media.
        const deleteMediaItem = async (id) => {
          if (!confirm("Supprimer ce media ?")) {
            return;
          }

          try {
            await sendJson("/api/admin/media/" + id, "DELETE", {});
            setStatus("mediaStatus", "Media supprime.");
          } catch (error) {
            setStatus("mediaStatus", error.message, true);
          }
        };

        // Inverse la publication d'un tarif.
        const togglePricingPublished = async (id) => {
          const item = findPricingItem(id);

          if (!item) {
            return;
          }

          try {
            await sendJson("/api/admin/pricing/" + id, "PUT", { ...item, isPublished: !item.isPublished });
            setStatus("pricingStatus", "Publication du tarif mise a jour.");
          } catch (error) {
            setStatus("pricingStatus", error.message, true);
          }
        };

        // Inverse la mise en avant d'un tarif.
        const togglePricingFeatured = async (id) => {
          const item = findPricingItem(id);

          if (!item) {
            return;
          }

          try {
            await sendJson("/api/admin/pricing/" + id, "PUT", { ...item, isFeatured: !item.isFeatured });
            setStatus("pricingStatus", "Mise en avant du tarif mise a jour.");
          } catch (error) {
            setStatus("pricingStatus", error.message, true);
          }
        };

        // Supprime un tarif.
        const deletePricingItem = async (id) => {
          if (!confirm("Supprimer ce tarif ?")) {
            return;
          }

          try {
            await sendJson("/api/admin/pricing/" + id, "DELETE", {});
            setStatus("pricingStatus", "Tarif supprime.");
          } catch (error) {
            setStatus("pricingStatus", error.message, true);
          }
        };

        // Sauvegarde les parametres generaux.
        byId("settingsForm").addEventListener("submit", async (event) => {
          event.preventDefault();

          try {
            await sendJson("/api/admin/settings", "PUT", serializeForm(event.currentTarget));
            setStatus("settingsStatus", "Parametres enregistres.");
          } catch (error) {
            setStatus("settingsStatus", error.message, true);
          }
        });

        // Gere l'ajout ou l'edition d'un element de menu.
        byId("menuForm").addEventListener("submit", async (event) => {
          event.preventDefault();
          const isEditing = Boolean(editingMenuId);
          const payload = serializeForm(event.currentTarget);
          const method = isEditing ? "PUT" : "POST";
          const url = isEditing ? "/api/admin/menu/" + editingMenuId : "/api/admin/menu";

          try {
            await sendJson(url, method, payload);
            resetMenuForm();
            setStatus("menuStatus", isEditing ? "Element de menu modifie." : "Element de menu ajoute.");
          } catch (error) {
            setStatus("menuStatus", error.message, true);
          }
        });

        // Gere l'ajout ou l'edition d'un media.
        byId("mediaForm").addEventListener("submit", async (event) => {
          event.preventDefault();
          const isEditing = Boolean(editingMediaId);
          const payload = serializeForm(event.currentTarget);
          const method = isEditing ? "PUT" : "POST";
          const url = isEditing ? "/api/admin/media/" + editingMediaId : "/api/admin/media";

          try {
            await sendJson(url, method, payload);
            resetMediaForm();
            setStatus("mediaStatus", isEditing ? "Media modifie." : "Media ajoute.");
          } catch (error) {
            setStatus("mediaStatus", error.message, true);
          }
        });

        // Gere l'ajout ou l'edition d'un tarif.
        byId("pricingForm").addEventListener("submit", async (event) => {
          event.preventDefault();
          const isEditing = Boolean(editingPricingId);
          const payload = serializeForm(event.currentTarget);
          const method = isEditing ? "PUT" : "POST";
          const url = isEditing ? "/api/admin/pricing/" + editingPricingId : "/api/admin/pricing";

          try {
            await sendJson(url, method, payload);
            resetPricingForm();
            setStatus("pricingStatus", isEditing ? "Tarif modifie." : "Tarif ajoute.");
          } catch (error) {
            setStatus("pricingStatus", error.message, true);
          }
        });

        // Uploade un fichier et le reinjecte dans le formulaire media.
        byId("uploadForm").addEventListener("submit", async (event) => {
          event.preventDefault();
          const uploadFileInput = byId("uploadFile");

          if (!uploadFileInput.files.length) {
            setStatus("uploadStatus", "Selectionnez un fichier avant upload.", true);
            return;
          }

          const formData = new FormData();
          formData.append("file", uploadFileInput.files[0]);

          try {
            const response = await fetch("/api/admin/uploads", {
              method: "POST",
              body: formData
            });

            if (!response.ok) {
              const errorPayload = await response.json().catch(() => ({ message: "Upload impossible." }));
              throw new Error(errorPayload.message || "Upload impossible.");
            }

            const uploadResult = await response.json();
            const mediaForm = byId("mediaForm");
            mediaForm.url.value = uploadResult.url;
            mediaForm.thumbnailUrl.value = uploadResult.thumbnailUrl || "";
            mediaForm.type.value = uploadResult.mediaType;
            mediaForm.sourceType.value = uploadResult.sourceType;
            mediaForm.storagePath.value = uploadResult.storagePath;
            setStatus("uploadStatus", "Upload termine. Le formulaire media a ete pre-rempli.");
          } catch (error) {
            setStatus("uploadStatus", error.message, true);
          }
        });

        // Annule une edition en cours.
        byId("menuCancelButton").addEventListener("click", resetMenuForm);
        byId("mediaCancelButton").addEventListener("click", resetMediaForm);
        byId("pricingCancelButton").addEventListener("click", resetPricingForm);

        // Expose les actions globales utilisees par les boutons injectes.
        window.editMenuItem = editMenuItem;
        window.toggleMenuPublished = toggleMenuPublished;
        window.toggleMenuFeatured = toggleMenuFeatured;
        window.deleteMenuItem = deleteMenuItem;
        window.editMediaItem = editMediaItem;
        window.toggleMediaPublished = toggleMediaPublished;
        window.toggleMediaFeatured = toggleMediaFeatured;
        window.deleteMediaItem = deleteMediaItem;
        window.editPricingItem = editPricingItem;
        window.togglePricingPublished = togglePricingPublished;
        window.togglePricingFeatured = togglePricingFeatured;
        window.deletePricingItem = deletePricingItem;

        // Initialise les formulaires et charge l'etat actuel du panel.
        resetMenuForm();
        resetMediaForm();
        resetPricingForm();
        fetchContent().catch(() => {
          document.body.innerHTML =
            "<main class='shell'><section class='panel'><h1>Erreur</h1><p>Le contenu administrable n'a pas pu etre charge.</p></section></main>";
        });
      </script>
    </main>
  </body>
</html>`;
