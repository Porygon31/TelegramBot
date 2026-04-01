// Construit la page HTML de connexion au panel d'administration.
export const renderAdminLoginHtml = (hasError: boolean): string => `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Connexion admin</title>
    <style>
      /* Définit le style général de la page de connexion. */
      :root {
        --bg: #13151a;
        --panel: rgba(20, 24, 31, 0.86);
        --line: rgba(255, 255, 255, 0.08);
        --text: #f3f4f6;
        --muted: #b5bcc7;
        --accent: #e3a84c;
        --danger: #ef6f6c;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 20px;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        color: var(--text);
        background:
          radial-gradient(circle at top left, rgba(227, 168, 76, 0.12), transparent 24%),
          linear-gradient(180deg, #0d1117 0%, var(--bg) 100%);
      }

      .card {
        width: min(100%, 420px);
        padding: 28px;
        border: 1px solid var(--line);
        border-radius: 28px;
        background: var(--panel);
        backdrop-filter: blur(12px);
      }

      h1 {
        margin: 0 0 10px;
      }

      p {
        margin: 0 0 22px;
        color: var(--muted);
        line-height: 1.6;
      }

      label {
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
      }

      input {
        width: 100%;
        margin-bottom: 16px;
        padding: 14px 16px;
        border: 1px solid var(--line);
        border-radius: 14px;
        color: var(--text);
        background: rgba(255, 255, 255, 0.05);
      }

      button {
        width: 100%;
        padding: 14px 16px;
        border: 0;
        border-radius: 14px;
        font-weight: 700;
        color: #111;
        background: linear-gradient(135deg, #f7bf65, var(--accent));
        cursor: pointer;
      }

      .error {
        margin-bottom: 14px;
        color: var(--danger);
        font-size: 14px;
      }
    </style>
  </head>
  <body>
    <section class="card">
      <h1>Connexion admin</h1>
      <p>Connectez-vous pour gérer le menu, les médias et les tarifs de votre mini app Telegram.</p>
      ${hasError ? '<div class="error">Identifiants invalides.</div>' : ""}
      <form method="post" action="/admin/login">
        <label for="username">Nom d'utilisateur</label>
        <input id="username" name="username" type="text" required />

        <label for="password">Mot de passe</label>
        <input id="password" name="password" type="password" required />

        <button type="submit">Se connecter</button>
      </form>
    </section>
  </body>
</html>`;
