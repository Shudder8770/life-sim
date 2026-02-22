# LifeFlow - From Micro to Macro

A browser-based life + resource management simulator inspired by the provided GDD.

## Run locally

Open `index.html` directly, or serve with:

```bash
python3 -m http.server 4173
```

Then visit `http://localhost:4173`.

## GitHub Pages hosting

This repo includes a GitHub Actions workflow that deploys the site to GitHub Pages whenever you push to `main`.

1. Push your changes to the `main` branch.
2. In GitHub, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Wait for the **Deploy static site to GitHub Pages** workflow to finish.

Your game will be available at:

```text
https://<your-github-username>.github.io/<your-repo-name>/
```

## Implemented systems

- Difficulty starts (hard / medium / easy) with distinct opening conditions.
- 24-hour routine sliders for weekday and weekend (must total exactly 24).
- Time advancement for 1 day or 1 week with interrupting random events.
- Core stats: health, happiness, stress, energy.
- Burnout crisis logic from prolonged extreme schedule.
- Career tracks: corporate, government (exam unlock), freelancer, business owner.
- Economy: taxes, debt, credit score, autopay, offshore risk/audits.
- Investments: savings, sector stocks with volatility/dividends, real estate rent.
- Automation lifestyle options (car, maid, meal delivery, ops manager).
