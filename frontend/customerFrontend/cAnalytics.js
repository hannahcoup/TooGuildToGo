async function loadSummary() {
  try{ 
    const res = await fetch('http://127.0.0.1:8000/summary')
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
   document.getElementById('co2Graph').src = 'http://127.0.0.1:8000/graph/co2';
    document.getElementById('moneyGraph').src = 'http://127.0.0.1:8000/graph/money';
  }
  
  window.addEventListener('load', () => {
    loadSummary()
    loadGraphs()
  });