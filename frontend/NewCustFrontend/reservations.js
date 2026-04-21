async function loadReservations() {
    const user_id = localStorage.getItem('user_id');
    const container = document.getElementById("bags-container");


    const res = await fetch(`https://tooguildtogo.onrender.com/customer/reservations/${user_id}`);
    const reservations = await res.json();
    if (!Array.isArray(reservations) || reservations.length === 0) {
        container.innerHTML = "<p>No upcoming reservations.</p>";
        return;
    }
    

    reservations.sort((a, b) => a.pickup_window_start.localeCompare(b.pickup_window_start));
    const filtered = reservations.filter(r => r.reservation_status === "reserved");

    filtered.forEach((reservation) => {
        const card = document.createElement('div');
        card.className = 'bag-card';

        card.innerHTML = `
            <h3>${reservation.product_name}</h3>
            <p> ${reservation.category}</p>
            <p>Collection Window: ${formatDateTime(reservation.pickup_window_start) || "TBD"} - ${formatDateTime(reservation.pickup_window_end) || "TBD"}</p>
            <p><span style="font-style: italic;">${reservation.reservation_status}</span></p>
            <button onclick="cancelRes(${reservation.reservation_id}, this)"> Cancel Reservation </button>
            
        `;

        container.appendChild(card);
    });
}

loadReservations();


function formatDateTime(datetimeStr) {
    if (!datetimeStr) return "TBD";

    const date = new Date(datetimeStr);

    return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}
async function cancelRes(reservation_id, button) {
  const userId = localStorage.getItem("user_id");

  try {
    const res = await fetch("https://tooguildtogo.onrender.com/customer/cancel-reservation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: parseInt(userId),
        reservation_id: parseInt(reservation_id)
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Something went wrong");
      return;
    }

    
    const card = button.closest(".bag-card");
    card.remove();

  } catch (err) {
    console.error("Remove reservation failed:", err);
    alert("Could not remove reservation");
  }
}
