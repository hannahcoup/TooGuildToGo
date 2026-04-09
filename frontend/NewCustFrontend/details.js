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
