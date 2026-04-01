// Construit la page HTML de la mini app publique premium.
export const renderPublicAppHtml = (): string => `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mini App Telegram Premium</title>
    <style>
      /* Définit l'identité visuelle premium de la mini app. */
      :root {
        --bg: #0f1724;
        --bg-soft: #152133;
        --panel: rgba(12, 19, 31, 0.78);
        --panel-soft: rgba(255, 255, 255, 0.06);
        --text: #f6f7fb;
        --muted: #b8c3d9;
        --line: rgba(255, 255, 255, 0.08);
        --accent: #ff9b58;
        --accent-strong: #ff7047;
        --accent-soft: rgba(255, 155, 88, 0.14);
        --success: #4dd4ac;
        --radius: 28px;
        --shadow: 0 26px 60px rgba(5, 10, 20, 0.38);
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        color: var(--text);
        background:
          radial-gradient(circle at top left, rgba(255, 112, 71, 0.22), transparent 24%),
          radial-gradient(circle at top right, rgba(77, 212, 172, 0.14), transparent 18%),
          linear-gradient(180deg, #101726 0%, var(--bg) 100%);
      }

      .shell {
        width: min(1160px, calc(100% - 32px));
        margin: 0 auto;
        padding: 20px 0 56px;
      }

      .announcement {
        display: none;
        margin-bottom: 18px;
        padding: 12px 16px;
        border: 1px solid rgba(255, 155, 88, 0.2);
        border-radius: 999px;
        color: #fff0e7;
        background: linear-gradient(135deg, rgba(255, 155, 88, 0.18), rgba(255, 112, 71, 0.12));
      }

      .hero {
        position: relative;
        overflow: hidden;
        padding: 30px;
        border: 1px solid var(--line);
        border-radius: 36px;
        background:
          linear-gradient(135deg, rgba(20, 31, 48, 0.96), rgba(13, 21, 34, 0.9)),
          linear-gradient(180deg, rgba(255, 255, 255, 0.05), transparent);
        box-shadow: var(--shadow);
      }

      .hero::after {
        content: "";
        position: absolute;
        right: -90px;
        bottom: -90px;
        width: 260px;
        height: 260px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255, 155, 88, 0.35), transparent 68%);
        pointer-events: none;
      }

      .eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 8px 12px;
        border-radius: 999px;
        color: var(--muted);
        background: rgba(255, 255, 255, 0.06);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-size: 12px;
      }

      .hero h1,
      .hero p,
      h2,
      h3,
      p {
        margin: 0;
      }

      .hero h1 {
        max-width: 760px;
        margin-top: 18px;
        font-size: clamp(2.1rem, 4vw, 4.1rem);
        line-height: 0.97;
      }

      .hero p {
        max-width: 720px;
        margin-top: 18px;
        color: var(--muted);
        line-height: 1.75;
        font-size: 1rem;
      }

      .hero-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 22px;
      }

      .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 13px 18px;
        border-radius: 16px;
        text-decoration: none;
        font-weight: 700;
      }

      .button.primary {
        color: #181818;
        background: linear-gradient(135deg, #ffc076, var(--accent));
      }

      .button.secondary {
        color: var(--text);
        border: 1px solid var(--line);
        background: rgba(255, 255, 255, 0.04);
      }

      .stats {
        display: grid;
        gap: 12px;
        margin-top: 24px;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      }

      .stat {
        padding: 16px;
        border: 1px solid var(--line);
        border-radius: 20px;
        background: rgba(255, 255, 255, 0.05);
      }

      .stat strong {
        display: block;
        font-size: 1.8rem;
      }

      .stat span {
        color: var(--muted);
        font-size: 0.92rem;
      }

      .sections {
        display: grid;
        gap: 20px;
        margin-top: 24px;
      }

      .panel {
        padding: 24px;
        border: 1px solid var(--line);
        border-radius: var(--radius);
        background: var(--panel);
        backdrop-filter: blur(14px);
        box-shadow: var(--shadow);
      }

      .section-header {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 14px;
        margin-bottom: 18px;
      }

      .section-header p {
        color: var(--muted);
        line-height: 1.6;
      }

      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }

      .chip {
        display: inline-flex;
        align-items: center;
        padding: 8px 12px;
        border-radius: 999px;
        color: var(--muted);
        background: rgba(255, 255, 255, 0.06);
      }

      .grid {
        display: grid;
        gap: 16px;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      }

      .card {
        position: relative;
        overflow: hidden;
        padding: 18px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 24px;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.03));
      }

      .card.featured {
        border-color: rgba(255, 155, 88, 0.26);
        box-shadow: inset 0 0 0 1px rgba(255, 155, 88, 0.14);
      }

      .pill {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        padding: 7px 11px;
        border-radius: 999px;
        color: #ffd8b5;
        background: var(--accent-soft);
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
      }

      .card h3 {
        font-size: 1.18rem;
      }

      .card p {
        margin-top: 10px;
        color: var(--muted);
        line-height: 1.65;
      }

      .meta {
        margin-top: 14px;
        color: #fff6ee;
        font-weight: 700;
      }

      .price {
        margin-top: 14px;
        font-size: 1.7rem;
        font-weight: 700;
        color: #fff1e3;
      }

      .media-card img,
      .media-card video {
        width: 100%;
        height: 220px;
        border-radius: 18px;
        object-fit: cover;
        background: var(--bg-soft);
      }

      .empty {
        color: var(--muted);
      }

      .footer-note {
        margin-top: 18px;
        color: var(--success);
        font-size: 0.95rem;
      }

      @media (max-width: 700px) {
        .shell {
          width: min(100% - 20px, 1160px);
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
      <div class="announcement" id="announcement"></div>

      <section class="hero">
        <span class="eyebrow" id="brandName">Chargement</span>
        <h1 id="heroTitle">Preparation de la mini app premium</h1>
        <p id="heroDescription">Le catalogue public est en cours de chargement.</p>
        <div class="hero-actions">
          <a class="button primary" id="contactLink" href="#" target="_blank" rel="noreferrer">Contacter</a>
          <a class="button secondary" id="supportLink" href="#" target="_blank" rel="noreferrer">Support</a>
        </div>
        <div class="stats" id="statsGrid"></div>
      </section>

      <section class="sections">
        <article class="panel">
          <div class="section-header">
            <div>
              <h2>Menu disponible</h2>
              <p>Des offres mieux structurees, triables et mises en avant selon vos priorites.</p>
            </div>
            <div class="chips" id="menuChips"></div>
          </div>
          <div class="grid" id="menuGrid"></div>
        </article>

        <article class="panel">
          <div class="section-header">
            <div>
              <h2>Videos / Photos</h2>
              <p>Votre galerie premium avec uploads locaux ou medias externes.</p>
            </div>
          </div>
          <div class="grid" id="mediaGrid"></div>
        </article>

        <article class="panel">
          <div class="section-header">
            <div>
              <h2>Tarifs</h2>
              <p>Des formules claires, ordonnees et mises en avant selon votre strategie.</p>
            </div>
          </div>
          <div class="grid" id="pricingGrid"></div>
          <div class="footer-note" id="footerNote"></div>
        </article>
      </section>
    </main>

    <script src="https://telegram.org/js/telegram-web-app.js"></script>
    <script>
      // Informe Telegram que la mini app est prete a etre affichee.
      window.Telegram?.WebApp?.ready?.();
      window.Telegram?.WebApp?.expand?.();

      // Echappe le HTML injecte afin de limiter les risques d'injection.
      const escapeHtml = (value) =>
        String(value ?? "")
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#39;");

      // Rend une liste d'etats vide lisible.
      const renderEmptyState = (target, message) => {
        target.innerHTML = "<p class='empty'>" + escapeHtml(message) + "</p>";
      };

      // Construit une carte de statistique simple.
      const createStatCard = (value, label) => {
        return "<article class='stat'><strong>" + escapeHtml(value) + "</strong><span>" + escapeHtml(label) + "</span></article>";
      };

      // Construit une carte HTML pour le menu.
      const createMenuCard = (item) => {
        const cardClass = item.isFeatured ? "card featured" : "card";

        return \`
          <article class="\${cardClass}">
            <span class="pill">\${escapeHtml(item.highlight || item.category)}</span>
            <h3>\${escapeHtml(item.title)}</h3>
            <p>\${escapeHtml(item.description)}</p>
            <p class="meta">Disponibilite : \${escapeHtml(item.availability)}</p>
          </article>
        \`;
      };

      // Construit une carte HTML pour un media.
      const createMediaCard = (item) => {
        const cardClass = item.isFeatured ? "card media-card featured" : "card media-card";
        const posterAttribute = item.thumbnailUrl ? " poster='" + escapeHtml(item.thumbnailUrl) + "'" : "";
        const mediaContent =
          item.type === "video"
            ? "<video controls preload='metadata'" + posterAttribute + "><source src='" + escapeHtml(item.url) + "' /></video>"
            : "<img src='" + escapeHtml(item.url) + "' alt='" + escapeHtml(item.title) + "' />";

        return \`
          <article class="\${cardClass}">
            \${mediaContent}
            <span class="pill" style="margin-top: 14px;">\${escapeHtml(item.type)}</span>
            <h3>\${escapeHtml(item.title)}</h3>
            <p>\${escapeHtml(item.description)}</p>
          </article>
        \`;
      };

      // Construit une carte HTML pour la partie tarifaire.
      const createPricingCard = (item) => {
        const cardClass = item.isFeatured ? "card featured" : "card";

        return \`
          <article class="\${cardClass}">
            <span class="pill">\${escapeHtml(item.tag)}</span>
            <h3>\${escapeHtml(item.title)}</h3>
            <div class="price">\${escapeHtml(item.price)}</div>
            <p>\${escapeHtml(item.details)}</p>
          </article>
        \`;
      };

      // Charge le contenu public et l'injecte dans l'interface.
      const loadContent = async () => {
        const response = await fetch("/api/public/content");

        if (!response.ok) {
          throw new Error("Impossible de charger le catalogue.");
        }

        const data = await response.json();
        const announcement = document.getElementById("announcement");

        document.getElementById("brandName").textContent = data.settings.brandName;
        document.getElementById("heroTitle").textContent = data.settings.heroTitle;
        document.getElementById("heroDescription").textContent = data.settings.heroDescription;

        if (data.settings.announcement) {
          announcement.style.display = "block";
          announcement.textContent = data.settings.announcement;
        }

        const contactLink = document.getElementById("contactLink");
        contactLink.textContent = data.settings.contactLabel;
        contactLink.href = data.settings.contactUrl;

        const supportLink = document.getElementById("supportLink");
        supportLink.textContent = data.settings.supportLabel;
        supportLink.href = data.settings.supportUrl;

        document.getElementById("statsGrid").innerHTML = [
          createStatCard(data.stats.menuCount, "offres visibles"),
          createStatCard(data.stats.mediaCount, "medias visibles"),
          createStatCard(data.stats.pricingCount, "formules visibles"),
          createStatCard(data.stats.featuredCount, "contenus a la une")
        ].join("");

        const categories = [...new Set(data.menuItems.map((item) => item.category))];
        document.getElementById("menuChips").innerHTML = categories
          .map((category) => "<span class='chip'>" + escapeHtml(category) + "</span>")
          .join("");

        const menuGrid = document.getElementById("menuGrid");
        const mediaGrid = document.getElementById("mediaGrid");
        const pricingGrid = document.getElementById("pricingGrid");

        if (!data.menuItems.length) {
          renderEmptyState(menuGrid, "Aucun element de menu n'est disponible pour le moment.");
        } else {
          menuGrid.innerHTML = data.menuItems.map(createMenuCard).join("");
        }

        if (!data.mediaItems.length) {
          renderEmptyState(mediaGrid, "Aucun media n'est disponible pour le moment.");
        } else {
          mediaGrid.innerHTML = data.mediaItems.map(createMediaCard).join("");
        }

        if (!data.pricingItems.length) {
          renderEmptyState(pricingGrid, "Aucun tarif n'est disponible pour le moment.");
        } else {
          pricingGrid.innerHTML = data.pricingItems.map(createPricingCard).join("");
        }

        document.getElementById("footerNote").textContent =
          "Support premium : " + data.settings.supportLabel + " via " + data.settings.supportUrl;
      };

      // Affiche une erreur visible si l'API publique echoue.
      loadContent().catch(() => {
        document.getElementById("heroTitle").textContent = "Impossible de charger la mini app";
        document.getElementById("heroDescription").textContent =
          "Le serveur n'a pas pu renvoyer le contenu attendu.";
      });
    </script>
  </body>
</html>`;
