 async function loadSummary() {
  try{ 
    const res = await fetch('https://tooguildtogo.onrender.com/summary')
    const data = await res.json()

    document.getElementById('totalCo2').textContent = data.totalCo2
    document.getElementById('totalMoney').textContent = data.totalMoney
    document.getElementById('weeklyAverageCo2').textContent = data.weeklyAverageCo2
    document.getElementById('weeklyAverageMoney').textContent = data.weeklyAverageMoney
  }
  catch(error) {
    console.error("error loading summary", error);
  }
 }
  function loadGraphs() {
    document.getElementById('co2AndMoneyGraph').src = 'https://tooguildtogo.onrender.com/graph/bothMoneyAndCo2';
    document.getElementById('co2Graph').src = 'https://tooguildtogo.onrender.com/graph/co2';
    document.getElementById('moneyGraph').src = 'https://tooguildtogo.onrender.com/graph/money';
  }
  
  window.addEventListener('load', () => {
    loadSummary()
    loadGraphs()
  });
