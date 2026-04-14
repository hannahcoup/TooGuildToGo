async function loadFavourites() {
  const userId = localStorage.getItem("user_id");
  const container = document.getElementById("bags-container");


  const res = await fetch(`http://127.0.0.1:8000/customer/favourites/${userId}`);
  const favourites = await res.json();

  container.innerHTML = "";

  if (!Array.isArray(favourites) || favourites.length === 0) {
    container.innerHTML = "<p>No favourites yet.</p>";
    return;
  }

  favourites.forEach((bag) => {
    const card = document.createElement("div");
    card.className = "bag-card";

    card.innerHTML = `
      <h3>${bag.product_name}</h3>
      <p>${bag.description || "No description"}</p>
      <p>Vendor: ${bag.vendor_name}</p>
      <p>Price: £${bag.discounted_price}</p>
      <p>Pickup: ${formatDateTime(bag.pickup_window_start)} - ${formatDateTime(bag.pickup_window_end)}</p>
      <button onclick="removeFavourite(${bag.bag_id}, this)"> Remove </button>
    `;

    container.appendChild(card);
  });
}

loadFavourites();

async function removeFavourite(bagId, button) {
  const userId = localStorage.getItem("user_id");

  

  try {
    const res = await fetch("http://127.0.0.1:8000/customer/favourites", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: parseInt(userId),
        bag_id: parseInt(bagId)
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Something went wrong");
      return;
    }

    // remove card from UI instantly
    const card = button.closest(".bag-card");
    card.remove();

  } catch (err) {
    console.error("Remove favourite failed:", err);
    alert("Could not remove favourite");
  }
}

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