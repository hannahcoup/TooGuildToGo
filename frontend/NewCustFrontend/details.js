const params = new URLSearchParams(window.location.search);
const bagId = params.get("bag_id");
console.log("URL ID:", bagId);
async function loadBagDetails() {
  const res = await fetch(`http://127.0.0.1:8000/bags/${bagId}`);
  const bag = await res.json();
    console.log("FULL BAG:", bag);
  document.getElementById("title").textContent = bag.product_name;
  document.getElementById("price").textContent = `£${bag.discounted_price}`;
  document.getElementById("description").textContent = bag.description;
}

loadBagDetails();