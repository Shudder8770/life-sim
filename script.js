const STARTS = {
  hard: { cash: 0, stress: 40, note: 'Street Survivor: no support, high resilience.' },
  medium: { cash: 3500, stress: 20, note: 'Middle Class: essentials mostly covered.' },
  easy: { cash: 50000, stress: 30, note: 'Rich Kid: trust fund but family pressure.' },
};

const CAREERS = {
  corporate: { label: 'Corporate Ladder', baseMonthly: 3200, stressMod: 6 },
  government: { label: 'Government Job', baseMonthly: 2500, stressMod: 1 },
  freelancer: { label: 'Freelancer', baseMonthly: 0, stressMod: 5 },
  business: { label: 'Business Owner', baseMonthly: 0, stressMod: 8 },
};

const state = {
  name: 'Player',
  difficulty: 'medium',
  ageDays: 18 * 365,
  cash: 0,
  savings: 0,
  debt: 0,
  credit: 670,
  career: 'corporate',
  performance: 0,
  examPrep: 0,
  businesses: 0,
  opsManager: false,
  autopay: false,
  offshore: false,
  offshoreRisk: 0,
  stocks: { tech: 0, pharma: 0 },
  stockPrices: { tech: 100, pharma: 100 },
  realEstate: 0,
  monthlyCosts: { rent: 1200, food: 350, maid: 0, delivery: 0, ops: 0 },
  utilities: 300,
  hasCar: false,
  stress: 0,
  happiness: 55,
  health: 85,
  energy: 100,
  burnoutDays: 0,
  weekday: { chores: 4, sleep: 8, core: 8, growth: 2, leisure: 2 },
  weekend: { chores: 4, sleep: 8, core: 2, growth: 4, leisure: 6 },
  history: [],
};

const categories = ['chores', 'sleep', 'core', 'growth', 'leisure'];
const catLabels = {
  chores: 'Fixed Chores & Commute',
  sleep: 'Sleep',
  core: 'Core Responsibility',
  growth: 'Self-Improvement',
  leisure: 'Leisure & Social',
};

let currentRoutine = 'weekday';

const el = (id) => document.getElementById(id);

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function init() {
  const choice = prompt('Choose difficulty: hard, medium, easy', 'medium')?.toLowerCase();
  state.difficulty = STARTS[choice] ? choice : 'medium';
  state.cash = STARTS[state.difficulty].cash;
  state.stress = STARTS[state.difficulty].stress;
  log(`Started ${state.difficulty.toUpperCase()} mode. ${STARTS[state.difficulty].note}`, true);

  const careerSelect = el('careerSelect');
  Object.entries(CAREERS).forEach(([key, value]) => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = value.label;
    careerSelect.append(option);
  });
  careerSelect.value = state.career;

  bindEvents();
  drawRoutine();
  render();
}

function bindEvents() {
  document.querySelectorAll('.tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentRoutine = btn.dataset.routine;
      drawRoutine();
    });
  });

  el('careerSelect').addEventListener('change', (e) => {
    state.career = e.target.value;
    log(`Switched track to ${CAREERS[state.career].label}.`);
    render();
  });

  el('advanceDay').addEventListener('click', () => advanceDays(1));
  el('advanceWeek').addEventListener('click', () => advanceDays(7));
  el('resetGame').addEventListener('click', () => window.location.reload());

  el('studyExam').addEventListener('click', () => {
    if (state.energy < 10) return log('Too tired to study for the exam.');
    state.examPrep += 2;
    state.energy -= 10;
    log('Studied public service exam (+2 prep).');
    if (state.examPrep >= 10) {
      state.career = 'government';
      el('careerSelect').value = 'government';
      log('Passed the exam and entered government role!', true);
    }
    render();
  });

  el('completeGig').addEventListener('click', () => {
    if (state.career !== 'freelancer') return log('You must be a freelancer to run gigs.');
    if (state.energy < 15) return log('Not enough focus for a gig.');
    state.cash += 350;
    state.energy -= 15;
    log('Completed gig: +$350.');
    render();
  });

  el('pushPerformance').addEventListener('click', () => {
    if (state.career !== 'corporate') return log('Only corporate workers can push performance.');
    if (state.energy < 10) return log('Too tired to grind office politics.');
    state.performance += 12;
    state.stress += 4;
    state.energy -= 10;
    log('Overperformed this week (+12 performance, +4 stress).');
    if (state.performance >= 100) {
      state.performance = 0;
      state.cash += 1800;
      log('Promotion bonus received: +$1,800!', true);
    }
    render();
  });

  el('startBusiness').addEventListener('click', () => buyOnce(100000, () => {
    state.businesses += 1;
    state.career = 'business';
    el('careerSelect').value = 'business';
    log('Launched your first business. Macro phase unlocked!', true);
  }));

  el('hireOps').addEventListener('click', () => buyOnce(5000, () => {
    state.opsManager = true;
    state.monthlyCosts.ops = 5000;
    state.weekday.core = Math.min(state.weekday.core, 2);
    log('Hired HR & Ops Manager. Core responsibility now highly automated.', true);
    drawRoutine();
  }));

  el('toggleAutopay').addEventListener('click', () => {
    state.autopay = !state.autopay;
    log(`Bill autopay ${state.autopay ? 'enabled' : 'disabled'}.`);
  });

  el('buyTech').addEventListener('click', () => buyStock('tech'));
  el('buyPharma').addEventListener('click', () => buyStock('pharma'));

  el('buySavings').addEventListener('click', () => {
    if (state.cash < 1000) return log('Not enough liquid cash.');
    state.cash -= 1000;
    state.savings += 1000;
    log('Moved $1,000 into savings account (safe yield).');
    render();
  });

  el('buyProperty').addEventListener('click', () => buyOnce(80000, () => {
    state.realEstate += 1;
    log('Purchased rental unit. Monthly passive rent increased.', true);
  }));

  el('offshore').addEventListener('click', () => {
    state.offshore = !state.offshore;
    log(`Offshore account strategy ${state.offshore ? 'enabled' : 'disabled'}.`);
  });

  el('buyCar').addEventListener('click', () => buyOnce(12000, () => {
    state.hasCar = true;
    state.weekday.chores = Math.max(1, state.weekday.chores - 1);
    state.weekend.chores = Math.max(1, state.weekend.chores - 1);
    log('Bought car. Daily commute burden reduced.', true);
    drawRoutine();
  }));

  el('hireMaid').addEventListener('click', () => {
    if (state.monthlyCosts.maid > 0) return log('Maid already hired.');
    state.monthlyCosts.maid = 600;
    state.weekday.chores = Math.max(1, state.weekday.chores - 1);
    state.weekend.chores = Math.max(1, state.weekend.chores - 1);
    log('Hired maid (+$600/month, less chores).');
    drawRoutine();
    render();
  });

  el('orderFood').addEventListener('click', () => {
    if (state.monthlyCosts.delivery > 0) return log('Meal delivery already active.');
    state.monthlyCosts.delivery = 300;
    state.weekday.chores = Math.max(1, state.weekday.chores - 1);
    state.weekend.chores = Math.max(1, state.weekend.chores - 1);
    log('Meal delivery enabled (+$300/month, more time).');
    drawRoutine();
    render();
  });
}

function drawRoutine() {
  const routine = state[currentRoutine];
  const container = el('routineControls');
  container.innerHTML = '';

  categories.forEach((key) => {
    const row = document.createElement('div');
    row.className = 'row';
    const label = document.createElement('label');
    label.textContent = `${catLabels[key]}: ${routine[key]}h`;

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 0;
    slider.max = 16;
    slider.step = 1;
    slider.value = routine[key];

    slider.addEventListener('input', () => {
      routine[key] = Number(slider.value);
      label.textContent = `${catLabels[key]}: ${routine[key]}h`;
      validateRoutine();
    });

    row.append(label, slider);
    container.append(row);
  });

  validateRoutine();
}

function validateRoutine() {
  const total = categories.reduce((sum, key) => sum + state[currentRoutine][key], 0);
  const msg = el('timeValidation');
  if (total === 24) {
    msg.textContent = '✅ Total time exactly 24h.';
    msg.style.color = '#8fff9f';
    return true;
  }
  msg.textContent = `Time allocation must equal 24h. Current: ${total}h`;
  msg.style.color = '#ff7b8f';
  return false;
}

function advanceDays(days) {
  if (!validateRoutine()) return log('Fix weekday/weekend sliders before advancing time.');
  currentRoutine = 'weekend';
  const weekendOk = validateRoutine();
  currentRoutine = document.querySelector('.tab.active').dataset.routine;
  if (!weekendOk) return log('Weekend routine must also equal 24h.');

  for (let i = 0; i < days; i += 1) {
    const isWeekend = [5, 6].includes((state.ageDays + i) % 7);
    simulateDay(isWeekend ? state.weekend : state.weekday, isWeekend);
    maybeEvent();
  }
  render();
}

function simulateDay(routine, isWeekend) {
  state.ageDays += 1;
  const workHours = routine.core;
  const sleep = routine.sleep;
  const leisure = routine.leisure;
  const growth = routine.growth;

  state.energy = clamp(state.energy + sleep * 4 - workHours * 2 - growth * 2, 0, 100);
  state.stress = clamp(state.stress + workHours - leisure * 1.5 - sleep * 0.5 + CAREERS[state.career].stressMod, 0, 100);
  state.happiness = clamp(state.happiness + leisure * 1.1 - workHours * 0.7, 0, 100);

  if (sleep < 6 || state.stress > 80) state.health = clamp(state.health - 2.4, 0, 100);
  else state.health = clamp(state.health + 0.8, 0, 100);

  if (sleep <= 4 && workHours >= 10 && leisure === 0) state.burnoutDays += 1;
  else state.burnoutDays = Math.max(0, state.burnoutDays - 1);

  if (state.burnoutDays >= 21) triggerBurnout();

  if (!isWeekend) applyIncomeAndBills();

  if (growth >= 3 && state.career === 'corporate') state.performance += 1;

  if (state.career === 'business' && state.businesses > 0) {
    state.cash += state.businesses * 420;
  }

  if (state.realEstate > 0) state.cash += state.realEstate * 90;

  state.savings *= 1 + 0.00005;
}

function applyIncomeAndBills() {
  state.cash += CAREERS[state.career].baseMonthly / 20;
  const taxRate = state.cash > 200000 ? 0.35 : state.cash > 50000 ? 0.25 : 0.15;
  const taxCut = state.offshore ? taxRate * 0.4 : taxRate;
  state.cash -= (CAREERS[state.career].baseMonthly / 20) * taxCut;
  if (state.offshore) state.offshoreRisk += 1.2;

  const dailyBills = (state.monthlyCosts.rent + state.monthlyCosts.food + state.monthlyCosts.maid + state.monthlyCosts.delivery + state.monthlyCosts.ops + state.utilities) / 30;

  if (state.autopay) state.cash -= dailyBills;
  else if (Math.random() < 0.04) {
    state.debt += dailyBills;
    state.credit = clamp(state.credit - 8, 300, 850);
    log('Missed manual bill payment: debt up, credit score down.');
  } else {
    state.cash -= dailyBills;
  }

  if (state.debt > 0) {
    const rate = state.credit < 580 ? 0.0012 : 0.0006;
    state.debt *= 1 + rate;
  }
}

function maybeEvent() {
  if (Math.random() > 0.08) return;

  const roll = Math.random();
  if (roll < 0.33) {
    openEvent(
      'Economic Crisis',
      'Markets tumble and layoffs spread across corporations.',
      [
        {
          label: 'Buy the dip ($2,000)',
          run: () => buyOnce(2000, () => {
            state.stocks.tech += 30;
            state.stocks.pharma += 10;
            log('You bought discounted stocks during the crash.', true);
          }),
        },
        {
          label: 'Play safe',
          run: () => {
            state.happiness -= 2;
            log('You stayed liquid and waited out the volatility.');
          },
        },
      ],
    );
  } else if (roll < 0.66) {
    openEvent(
      'Networking Invite',
      'Your boss invites you to a high-profile golf weekend.',
      [
        {
          label: 'Go (-$500, +promotion odds)',
          run: () => buyOnce(500, () => {
            state.performance += 20;
            state.happiness += 4;
            log('Networking paid off. Promotion bar boosted.', true);
          }),
        },
        {
          label: 'Decline',
          run: () => {
            state.performance = Math.max(0, state.performance - 5);
            log('You saved cash but lost some influence.');
          },
        },
      ],
    );
  } else {
    openEvent(
      'Audit Notice',
      'Tax office started an audit after suspicious offshore signals.',
      [
        {
          label: 'Settle penalties',
          run: () => {
            const penalty = Math.min(state.cash * 0.55, 60000);
            state.cash -= penalty;
            state.credit = clamp(state.credit - 120, 300, 850);
            state.offshoreRisk = 0;
            log(`Audit settlement cost $${penalty.toFixed(0)} and wrecked your credit.`, true);
          },
        },
        {
          label: 'Contest (risky)',
          run: () => {
            if (Math.random() < 0.35) {
              state.cash -= 8000;
              log('You won partial appeal. Legal costs only.');
            } else {
              state.cash -= 30000;
              state.credit = clamp(state.credit - 160, 300, 850);
              log('Appeal failed. Massive back-taxes applied.', true);
            }
            state.offshoreRisk = 0;
          },
        },
      ],
    );
  }

  marketMove();
}

function marketMove() {
  state.stockPrices.tech = clamp(state.stockPrices.tech * (0.95 + Math.random() * 0.12), 40, 250);
  state.stockPrices.pharma = clamp(state.stockPrices.pharma * (0.96 + Math.random() * 0.1), 50, 240);
  const dividends = (state.stocks.tech * state.stockPrices.tech + state.stocks.pharma * state.stockPrices.pharma) * 0.0005;
  state.cash += dividends;
}

function triggerBurnout() {
  state.burnoutDays = 0;
  state.health = clamp(state.health - 20, 0, 100);
  state.energy = clamp(state.energy - 50, 0, 100);
  state.cash -= 6000;
  log('HEALTH CRISIS! Burnout caused medical bills and severe fatigue.', true);
}

function buyOnce(cost, onSuccess) {
  if (state.cash < cost) {
    log(`Need $${cost.toLocaleString()} (current $${Math.floor(state.cash).toLocaleString()}).`);
    return false;
  }
  state.cash -= cost;
  onSuccess();
  render();
  return true;
}

function buyStock(type) {
  if (!buyOnce(500, () => {
    state.stocks[type] += 5;
    log(`Bought ${type} stocks. Holdings: ${state.stocks[type]} shares.`);
  })) return;
}

function openEvent(title, text, choices) {
  const modal = el('eventModal');
  el('modalTitle').textContent = title;
  el('modalText').textContent = text;

  const choicesEl = el('modalChoices');
  choicesEl.innerHTML = '';

  choices.forEach((choice) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = choice.label;
    btn.addEventListener('click', () => {
      choice.run();
      modal.close();
      render();
    });
    choicesEl.append(btn);
  });

  modal.showModal();
}

function netWorth() {
  const stockValue = state.stocks.tech * state.stockPrices.tech + state.stocks.pharma * state.stockPrices.pharma;
  const realEstateValue = state.realEstate * 80000;
  return state.cash + state.savings + stockValue + realEstateValue - state.debt;
}

function render() {
  const ageYears = Math.floor(state.ageDays / 365);
  const remDays = state.ageDays % 365;
  const weeks = Math.floor(remDays / 7);
  const days = remDays % 7;

  el('identity').textContent = `${state.name} | Age ${ageYears}y ${weeks}w ${days}d | $${Math.floor(state.cash).toLocaleString()} | Credit ${Math.floor(state.credit)} | ${CAREERS[state.career].label}`;

  const status = [
    ['Health', state.health],
    ['Happiness', state.happiness],
    ['Stress', state.stress],
    ['Energy', state.energy],
    ['Net Worth', clamp((netWorth() / 500000) * 100, 0, 100)],
  ];

  el('statusBars').innerHTML = status
    .map(([label, value]) => `<div class="stat">${label}<span class="bar"><span class="fill" style="width:${value}%"></span></span>${Math.floor(value)}%</div>`)
    .join('');
}

function log(message, important = false) {
  state.history.unshift(message);
  const p = document.createElement('p');
  p.textContent = `[Day ${state.ageDays}] ${message}`;
  if (important) p.classList.add('important');
  el('eventLog').prepend(p);
}

init();
