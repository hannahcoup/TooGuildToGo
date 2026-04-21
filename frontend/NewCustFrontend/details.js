const params = new URLSearchParams(window.location.search);
const bagId = params.get("bag_id");
console.log("URL ID:", bagId);

const categoryImages = {
  "Hot Food": "./images/hotfood.png",
  "Vegetarian": "./images/vegetarian.png",
  "Vegan": "./images/vegan.png",
  "Bakery/Lunch": "./images/bakery.png",
  "Lunch": "./images/lunch.png"
};

async function loadBagDetails() {
  try {
    
    const res = await fetch(`https://tooguildtogo.onrender.com/bags/${bagId}`);
    const bag = await res.json();
    console.log("Bag:", bag);

    
    const imageSrc = categoryImages[bag.category] || "./images/logo.png";
    document.getElementById("details-image").src = imageSrc;
    document.getElementById("title").textContent = bag.product_name || "No title";
    document.getElementById("price").textContent = `£${bag.discounted_price}`;
    document.getElementById("pickup-window").textContent =
      `Collection Time: ${formatTime(bag.pickup_window_start)} - ${formatTime(bag.pickup_window_end)}`;

   
    const foodRes = await fetch(`https://tooguildtogo.onrender.com/bags/${bagId}/food_items`);
    const foodItems = await foodRes.json();
    console.log("Food items:", foodItems);

    if (Array.isArray(foodItems) && foodItems.length > 0) {
      document.getElementById("contents").textContent =
        foodItems.map(item => item.name).join(", ");
    } else {
      document.getElementById("contents").textContent = bag.description || "No contents available";
    }

   
    try {
      const allergenRes = await fetch(`https://tooguildtogo.onrender.com/bags/${bagId}/allergens`);

      if (!allergenRes.ok) {
        throw new Error("Allergen endpoint failed");
      }

      const allergens = await allergenRes.json();
      console.log("Allergens:", allergens);

      const filtered = Array.isArray(allergens)
        ? allergens.filter(a => a.contains || a.may_contain || a.allergen_name)
        : [];

      document.getElementById("allergens").textContent =
        filtered.length > 0
          ? filtered.map(a =>
              a.contains
                ? `${a.allergen_name}`
                : a.may_contain
                  ? `${a.allergen_name} (may contain)`
                  : `${a.allergen_name}`
            ).join(", ")
          : "None";
    } catch (err) {
      console.error("Allergen fetch failed:", err);
      document.getElementById("allergens").textContent = "Unavailable";
    }

  } catch (err) {
    console.error("Failed to load bag details:", err);
  }
}

loadBagDetails();

async function reserveBag() {
  const userId = localStorage.getItem("user_id");
  console.log(userId, bagId);

  const res = await fetch("https://tooguildtogo.onrender.com/customer/reserve-bag", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user_id: parseInt(userId),
      bag_id: parseInt(bagId)
    })
  });

  const data = await res.json();

  if (data.message === "bag reserved successfully") {
    alert("Bag reserved successfully");
    window.location.href = "res.html";
  } else {
    alert(data.error || "Something went wrong");
  }
}

function formatTime(datetime) {
  if (!datetime) return "";
  const date = new Date(datetime);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
