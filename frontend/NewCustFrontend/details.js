const params = new URLSearchParams(window.location.search);
const bagId = params.get("bag_id");
console.log("URL ID:", bagId);
async function loadBagDetails() {
  const res = await fetch(`http://127.0.0.1:8000/bags/${bagId}`);
  const bag = await res.json();
  const allergenbag = await fetch(`http://127.0.0.1:8000/bags/${bag.bag_id}/allergens`);
  const allergens = await allergenbag.json();
  const filtered = allergens.filter(a => a.contains || a.may_contain);
  
    
  document.getElementById("title").textContent = bag.product_name;
 
  document.getElementById("price").textContent = `£${bag.discounted_price}`;
  document.getElementById("description").textContent = bag.description;
  document.getElementById("pickup-window").textContent = `Collection Time: ${formatTime(bag.pickup_window_start)} - ${formatTime(bag.pickup_window_end)}`;
  document.getElementById("allergens").innerHTML=` Allergens: ${filtered.length > 0 ? filtered.map(a =>a.contains ? `${a.allergen_name}`    
    : `${a.allergen_name} (may contain)`).join(', '): 'None'} `;
}

loadBagDetails();

async function reserveBag() {
  const userId = localStorage.getItem("user_id");
    console.log(userId, bagId);
    
  const res = await fetch("http://127.0.0.1:8000/customer/reserve-bag", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user_id: parseInt(userId),
      bag_id: bagId
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
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
