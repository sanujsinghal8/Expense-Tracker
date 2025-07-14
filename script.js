const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expense = document.getElementById('expense');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const type = document.getElementById('type');
const category = document.getElementById('category');
const date = document.getElementById('date');
const chartCanvas = document.getElementById('chart');
const toggle = document.getElementById('themeToggle');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let chart;

function addTransaction(e) {
  e.preventDefault();

  let amt = +amount.value;
  amt = type.value === 'expense' ? -Math.abs(amt) : Math.abs(amt);

  const transaction = {
    id: Date.now(),
    text: text.value,
    amount: amt,
    category: category.value,
    date: date.value,
  };

  transactions.push(transaction);
  updateUI();
  saveData();
  form.reset();
}

function removeTransaction(id) {
  transactions = transactions.filter(tr => tr.id !== id);
  updateUI();
  saveData();
}

function updateUI() {
  list.innerHTML = '';
  transactions.forEach(addToList);

  const amounts = transactions.map(t => t.amount);
  const total = amounts.reduce((a, b) => a + b, 0);
  const incomeAmt = amounts.filter(x => x > 0).reduce((a, b) => a + b, 0);
  const expenseAmt = amounts.filter(x => x < 0).reduce((a, b) => a + b, 0);

  balance.textContent = `₹${total.toFixed(2)}`;
  income.textContent = `₹${incomeAmt.toFixed(2)}`;
  expense.textContent = `₹${Math.abs(expenseAmt).toFixed(2)}`;

  updateChart();
}

function addToList(tr) {
  const sign = tr.amount > 0 ? 'plus' : 'minus';
  const item = document.createElement('li');
  item.classList.add(sign);
  item.innerHTML = `
    ${tr.text} - ${tr.category} (${tr.date})
    <span>${tr.amount > 0 ? '+' : '-'}₹${Math.abs(tr.amount)}</span>
    <button onclick="removeTransaction(${tr.id})">x</button>
  `;
  list.appendChild(item);
}

function saveData() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function updateChart() {
  const categorySums = {};

  transactions.forEach(t => {
    categorySums[t.category] = (categorySums[t.category] || 0) + t.amount;
  });

  const labels = Object.keys(categorySums);
  const data = Object.values(categorySums);

  if (chart) chart.destroy();

  chart = new Chart(chartCanvas, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: ['#2ecc71', '#e74c3c', '#3498db', '#f39c12', '#9b59b6']
      }]
    },
    options: {
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
}

// Theme toggle
toggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  toggle.textContent = document.body.classList.contains('light') ? '☀️' : '🌙';
});

form.addEventListener('submit', addTransaction);
updateUI();
