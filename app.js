const defaultPlatforms = [
  { name: 'Google Ads', roas: 3.1, confidence: 0.8, minSpend: 1000 },
  { name: 'Meta Ads', roas: 2.6, confidence: 0.75, minSpend: 800 },
  { name: 'TikTok Ads', roas: 2.1, confidence: 0.55, minSpend: 400 },
  { name: 'LinkedIn Ads', roas: 1.7, confidence: 0.5, minSpend: 300 }
];

const rows = document.getElementById('platformRows');
const addPlatformBtn = document.getElementById('addPlatform');
const calculateBtn = document.getElementById('calculate');

function createRow(platform = { name: '', roas: 1, confidence: 0.5, minSpend: 0 }) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input type="text" value="${platform.name}" placeholder="Platform name" /></td>
    <td><input type="number" min="0" step="0.1" value="${platform.roas}" /></td>
    <td><input type="number" min="0" max="1" step="0.05" value="${platform.confidence}" /></td>
    <td><input type="number" min="0" step="50" value="${platform.minSpend}" /></td>
  `;
  rows.appendChild(tr);
}

function getPlatformData() {
  return [...rows.querySelectorAll('tr')].map((tr) => {
    const [name, roas, confidence, minSpend] = [...tr.querySelectorAll('input')].map(
      (input) => input.value
    );
    return {
      name: name || 'Unnamed Platform',
      roas: Number(roas),
      confidence: Number(confidence),
      minSpend: Number(minSpend)
    };
  });
}

function allocateBudget(totalBudget, platforms) {
  const validation = [];
  const minTotal = platforms.reduce((sum, p) => sum + p.minSpend, 0);

  if (minTotal > totalBudget) {
    validation.push(
      `Minimum spend requirements exceed total budget by $${(minTotal - totalBudget).toFixed(2)}.`
    );
  }

  const floorBudget = Math.min(minTotal, totalBudget);
  let remainder = totalBudget - floorBudget;

  const qualityScores = platforms.map((p) => ({
    ...p,
    score: Math.max(0, p.roas) * Math.min(Math.max(p.confidence, 0), 1)
  }));

  const totalScore = qualityScores.reduce((sum, p) => sum + p.score, 0);

  const allocations = qualityScores.map((p) => {
    const base = minTotal > totalBudget ? (p.minSpend / minTotal) * totalBudget : p.minSpend;
    const bonus = totalScore > 0 ? (p.score / totalScore) * remainder : 0;
    const spend = base + bonus;
    return {
      name: p.name,
      spend,
      pct: totalBudget > 0 ? (spend / totalBudget) * 100 : 0,
      weightedRoas: p.roas * p.confidence
    };
  });

  allocations.sort((a, b) => b.spend - a.spend);

  return { allocations, validation };
}

function renderResults(result) {
  const resultsCard = document.getElementById('resultsCard');
  const results = document.getElementById('results');
  const validation = document.getElementById('validation');

  validation.textContent = result.validation.join(' ');
  results.innerHTML = '';

  result.allocations.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'result-row';
    row.innerHTML = `
      <strong>${item.name}</strong>
      <span>$${item.spend.toFixed(2)}</span>
      <span>${item.pct.toFixed(1)}%</span>
    `;
    results.appendChild(row);
  });

  resultsCard.hidden = false;
}

addPlatformBtn.addEventListener('click', () => createRow());

calculateBtn.addEventListener('click', () => {
  const totalBudget = Number(document.getElementById('totalBudget').value);
  const platforms = getPlatformData();
  const result = allocateBudget(totalBudget, platforms);
  renderResults(result);
});

defaultPlatforms.forEach((platform) => createRow(platform));
