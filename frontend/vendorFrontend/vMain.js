//JS for Dashboard
async function loadReservations() {
  const upcoming = document.getElementById('upcoming');
  const past = document.getElementById('past');
 
  const vendor_id = localStorage.getItem('vendor_id');
  const res = await fetch(`https://tooguildtogo.onrender.com/reservations?vendor_id=${vendor_id}`);
  const reservations = await res.json();
 
  let selectedReservation = null;
 
  reservations.sort((a, b) => a.pickup_window_start.localeCompare(b.pickup_window_start));
 
  reservations.forEach((reservation) => {
    const card = document.createElement('div');
    const shortDesc =
      reservation.description && reservation.description.length > 30
        ? reservation.description.substring(0, 30) + '...'
        : reservation.description;
 
    card.className = 'bag-card';
    card.innerHTML = `
      <h3>${reservation.user_name}</h3>
      <p>${shortDesc || "No Description"}</p>
      <p>Discounted Price: £${reservation.discounted_price}</p>
      <p>Collection Window: ${formatDateTime(reservation.pickup_window_start) || "TBD"} - ${formatDateTime(reservation.pickup_window_end) || "TBD"}</p>
    `;
 
    if (reservation.reservation_status === 'collected') {
      past.appendChild(card);
    } else {
      upcoming.appendChild(card);
    }
 
    // Open detail modal on card click
    card.addEventListener('click', async () => {
      selectedReservation = reservation;
 
      const modal = document.getElementById('myModal');
      document.getElementById('modal-name').textContent = reservation.product_name;
      document.getElementById('modal-desc').textContent = reservation.description || "No Description";
      document.getElementById('modal-discounted_price').textContent = 'Price : £' + reservation.discounted_price;
      document.getElementById('modal-pickup_window_start').textContent =
        "Pickup Window start time: " + formatDateTime(reservation.pickup_window_start);
      document.getElementById('modal-pickup_window_end').textContent =
        "Pickup Window end time: " + formatDateTime(reservation.pickup_window_end);
 
      // Fetch allergens
      let allergensText = "Unavailable";
      try {
        const allergenbag = await fetch(`https://tooguildtogo.onrender.com/bags/${reservation.bag_id}/allergens`);
        if (allergenbag.ok) {
          const allergens = await allergenbag.json();
          if (Array.isArray(allergens) && allergens.length > 0) {
            allergensText = allergens
              .map(a => a.may_contain ? `${a.allergen_name} (may contain)` : `${a.allergen_name}`)
              .join(", ");
          } else {
            allergensText = "None";
          }
        }
      } catch (e) {
        // CORS/network error — show Unavailable
      }
      document.getElementById('modal-allergens').textContent = allergensText;
 
      // Fetch dietary tags
      try {
        const dietaryRes = await fetch(`https://tooguildtogo.onrender.com/bags/${reservation.bag_id}/dietary_tags`);
        const dietaryTags = await dietaryRes.json();
        document.getElementById('modal-dietary').textContent =
          dietaryTags.length > 0 ? dietaryTags.map(d => d.name).join(', ') : 'None';
      } catch (e) {
        document.getElementById('modal-dietary').textContent = 'Unavailable';
      }
 
      // Show/hide Confirm Collection button based on status
      const confirmBtn = document.getElementById('modal-confirm');
      if (reservation.reservation_status === 'collected') {
        confirmBtn.style.display = 'none';
      } else {
        confirmBtn.style.display = 'inline-block';
      }
 
      modal.style.display = 'block';
    });
  });
 
  // "Confirm Collection" in the detail modal → open the confirmation modal
  document.getElementById('modal-confirm').addEventListener('click', () => {
    if (!selectedReservation) return;
    document.getElementById('myModal').style.display = 'none';
    document.getElementById('confirm-student').textContent = 'Customer: ' + selectedReservation.user_name;
    document.getElementById('confirm-bag').textContent = 'Bag: ' + selectedReservation.product_name;
    document.getElementById('confirm-price').textContent = 'Price: £' + selectedReservation.discounted_price;
    document.getElementById('confirmModal').style.display = 'block';
  });
 
  // Final confirm button — mark payment then collected
  document.getElementById('confirm-yes').addEventListener('click', async () => {
    if (!selectedReservation) return;
 
    const payRes = await fetch("https://tooguildtogo.onrender.com/vendor/mark-payment-collected", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vendor_id: parseInt(vendor_id),
        reservation_id: selectedReservation.reservation_id
      })
    });
    const payData = await payRes.json();
    if (payData.error) {
      alert(payData.error);
      return;
    }
 
    const colRes = await fetch("https://tooguildtogo.onrender.com/vendor/mark-collected", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vendor_id: parseInt(vendor_id),
        reservation_id: selectedReservation.reservation_id
      })
    });
    const colData = await colRes.json();
    if (colData.error) {
      alert(colData.error);
      return;
    }
 
    document.getElementById('confirmModal').style.display = 'none';
    location.reload();
  });
 
  // Close buttons for both modals
  document.querySelectorAll('.close').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('myModal').style.display = 'none';
      document.getElementById('confirmModal').style.display = 'none';
    });
  });
}
 
loadReservations();
 
function formatDateTime(datetime) {
  if (!datetime) return "";
  const date = new Date(datetime);
  return date.toLocaleString([], {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}
