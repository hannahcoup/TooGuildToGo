const bags = JSON.parse(localStorage.getItem('bags') || '[]'); 
const reservations = JSON.parse(localStorage.getItem('reservations') || '[]'); 

//getting numbers for each status 
const bagsSold = bags.filter(b => b.status === 'collected').length;
const bagsReserved = bags.filter(b => b.status === 'reserved').length;
const bagsAvailable = bags.filter(b => b.status === 'available').length;

const upcomingRes = reservations.filter(r => r.status === 'reserved').length;
info.innerHTML = `
  <p>Bags sold: ${bagsSold}</p>
  <p>Bags reserved: ${bagsReserved}</p>
  <p>Bags available: ${bagsAvailable}</p>
  <p>Number of upcoming collections: ${upcomingRes}</p>
`;