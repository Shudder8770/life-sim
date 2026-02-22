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

## Full game mechanics reference

### 1) Start state and progression loop
- You begin at age 18 with a chosen difficulty (`hard`, `medium`, `easy`) that sets starting cash and stress.
- A day simulation updates your stats from your routine allocation, then applies workday economy rules, passive income, and random events.
- You can advance time by 1 day or 7 days at a time.

### 2) Time allocation system (micro loop)
- You configure two routines: weekday and weekend.
- Each routine must allocate exactly 24 total hours across:
  - Fixed chores & commute
  - Sleep
  - Core responsibility (work/business)
  - Self-improvement
  - Leisure & social
- Time cannot advance unless both weekday and weekend totals are valid (24h each).

### 3) Core life stats
- **Health**: worsens with low sleep/high stress, improves with adequate recovery.
- **Happiness**: rises with leisure and falls with excessive core work.
- **Stress**: rises with long core hours and career pressure, reduced by sleep/leisure.
- **Energy**: regained via sleep, consumed by core work and growth effort.
- **Net Worth**: shown in **dollars** (`$`), calculated as:
  - `cash + savings + stock value + real estate value - debt`

### 4) Burnout and crisis
- Burnout builds when your schedule is extreme (very low sleep + long core work + zero leisure).
- At sustained burnout threshold, a health crisis triggers:
  - Large health and energy penalties
  - Immediate cash loss (medical cost)

### 5) Career systems
- **Corporate Ladder**
  - Steady base salary.
  - "Push Corporate Performance" consumes energy, increases stress, and fills promotion progress.
  - Promotion progress grants a bonus payout when full.
- **Government Job**
  - Unlocked by studying for and passing the exam.
  - Lower stress profile and stable salary.
- **Freelancer**
  - No fixed base salary from track itself.
  - "Complete Freelancer Gig" converts energy into direct cash.
- **Business Owner (macro phase)**
  - Unlocked by launching a business (large capital requirement).
  - Businesses generate recurring income.
  - Hiring Ops Manager automates core load and adds major monthly operating cost.

### 6) Income, taxes, bills, and debt
- Workday income is added from your current track (where applicable).
- Income is taxed; effective tax rate scales with wealth.
- Offshore strategy reduces taxes but accumulates audit risk.
- Daily bills include rent, food, utilities, and optional automation services.
- With autopay off, missed payments can create debt and lower credit score.
- Outstanding debt accrues interest; worse credit increases debt growth.

### 7) Banking and investments
- **Savings**: transfer cash into savings; savings grow slowly over time.
- **Stocks**: buy tech/pharma shares; prices move with market volatility and generate dividends.
- **Real Estate**: buy rental properties for recurring passive rent.
- Total net worth includes all of the above assets minus debt.

### 8) Lifestyle and automation purchases
- **Car**: one-time purchase that increases recurring utility cost.
- **Maid service**: monthly cost, reduces weekday chore load and improves stress/happiness profile.
- **Meal delivery**: monthly cost, reduces weekday chore load.
- **Ops Manager**: high monthly cost, significantly reduces business core workload.

### 9) Random events and risk-reward choices
- Random events can interrupt simulation, including:
  - Economic crises (discounted buying opportunities)
  - Networking invites (cash-for-performance tradeoff)
  - Tax audits (especially risky with offshore strategy)
- Events present choice-based outcomes with varying upside/downside.

### 10) UI and feedback surfaces
- Top bar shows identity snapshot: age, cash, credit score, current career.
- Status bars show life stats and net worth value in dollars.
- Event log records key outcomes chronologically.
- Modal dialogs are used for branching event decisions.
