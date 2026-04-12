async function loadReservations() {
    const user_id = localStorage.getItem('user_id');
    const container = document.getElementById("bags-container");


    const res = await fetch(`http://127.0.0.1:8000/customer/reservations/${user_id}`);
    const reservations = await res.json();
    if (!Array.isArray(reservations) || reservations.length === 0) {
        container.innerHTML = "<p>No upcoming reservations.</p>";
        return;
    }
    

    reservations.sort((a, b) => a.pickup_window_start.localeCompare(b.pickup_window_start));
    const filtered = reservations.filter(r => r.reservation_status !== "collected");

    filtered.forEach((reservation) => {
        const card = document.createElement('div');
        card.className = 'bag-card';

        card.innerHTML = `
            <h3>${reservation.product_name}</h3>
            <p> ${reservation.category}</p>
            <p>Collection Window: ${formatDateTime(reservation.pickup_window_start) || "TBD"} - ${formatDateTime(reservation.pickup_window_end) || "TBD"}</p>
            <p><span style="font-style: italic;">${reservation.reservation_status}</span></p>
            
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