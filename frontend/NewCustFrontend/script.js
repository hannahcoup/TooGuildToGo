// getting the below elements from the DOM to use in our js code
// DOM is the document object model, which is a way for us to interact with the HTML elements on our page using js. 
// We can use methods like getElementById and querySelector to get specific elements from the DOM and then manipulate them in our js code.
const searchInput = document.getElementById('search-input'); 
const searchButton = document.getElementById('search-btn');
const foodItemsContainer = document.querySelector('.food-items-container');     
const resultsHeading = document.getElementById("results-heading");
const errorContainer = document.getElementById("error-container");
const foodItemsDetails = document.getElementById("food-items-details");
const FoodItemsDetailsContent = document.querySelector(".food-items-details-content");
const backBtn = document.getElementById("back-btn");

// array of images based on category
const categoryImages = {
  "Hot Food": "images/hotfood.png",
  "Vegetarian": "images/vegetarian.png",
  "Vegan": "images/vegan.png",
  "Bakery/Lunch": "images/bakery.png",
  "Lunch": "images/lunch.png",
  "Snack": "images/snack.jpg",
  "Snack/Hot Food": "images/snackHotfood.jpg"
};



searchButton.addEventListener('click', searchFoodItems);
//foodItemsContainer.addEventListener('click', handleFoodItemCardClick);
/*backBtn.addEventListener('click', () => {
    foodItemsDetails.classList.add("hidden");
});*/

// useful for clicking functionality 
searchInput.addEventListener('keypress', event => {
    if (event.key === 'Enter') searchFoodItems();
    })


    
async function searchFoodItems() {
    const searchTerm = searchInput.value.trim();

    const res = await fetch(`https://tooguildtogo.onrender.com/bags?search=${searchTerm}`);
    const data = await res.json();

    container.innerHTML = "";

    if (data.length === 0) {
    errorContainer.textContent = "No results found.";
    errorContainer.classList.remove("hidden");
    return;
    }

    data.forEach(bag => addBagCard(bag));

    
}




//Loading bags from db
let bags = [];
const container = document.getElementById("bags-container");
async function loadBags() {
  const res = await fetch(`https://tooguildtogo.onrender.com/bags`);
  const data = await res.json();
  container.innerHTML = "";
  bags = data;
  bags.forEach((bag, index) => addBagCard(bag, index));
}
let favouriteBagIds = new Set();

async function loadUserFavourites() {
  const userId = localStorage.getItem("user_id");
  if (!userId) return;

  const res = await fetch(`https://tooguildtogo.onrender.com/customer/favourites/${userId}`);
  const data = await res.json();

  if (Array.isArray(data)) {
    favouriteBagIds = new Set(data.map(b => b.bag_id));
  }
}
//to make sure pages load in right order
async function initPage() {
  await loadUserFavourites();
  await loadBags();
}

initPage();

let editIndex = null;


function addBagCard(bag) {
  const card = document.createElement("div");
  card.className = "card-link";

  const isChecked = favouriteBagIds.has(bag.bag_id);

  const imageSrc = categoryImages[bag.category];

  card.innerHTML = `
    <div class="food-items">
        <a href="details.html?bag_id=${bag.bag_id}" class="bag-details-link">
            <img src=${imageSrc} alt="Food item">

            <div class="food-items-info">
                <div class="top-row">
                    <span class="food-items-category">${bag.category}</span>
                </div>

                <div class="row">
                    <h3 class="food-items-company">${bag.product_name || "Vendor"}</h3>
                    <h3 class="food-items-collect-time">
                        ${formatTime(bag.pickup_window_start)} - ${formatTime(bag.pickup_window_end)}
                    </h3>
                </div>

                <div class="row price-row">
                    <span class="food-items-price">£${bag.discounted_price}</span>
                </div>
            </div>
        </a>

        <button
            type="button"
            class="favourite-container"
            onclick="toggleFavourite(${bag.bag_id}, this)"
        >
            ${isChecked ? "❤️" : "🤍"}
        </button>
    </div>
  `;

  container.appendChild(card);
}


function formatTime(datetime) {
  if (!datetime) return "";
  const date = new Date(datetime);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
 

async function filterByCategory(tag) {
   const res = await fetch(`https://tooguildtogo.onrender.com/bags?dietary_tag=${tag}`);
   const data = await res.json();
    
  container.innerHTML = "";
  data.forEach(addBagCard);
  
}


async function toggleFavourite(bagId, button) {
  const userId = localStorage.getItem("user_id");

  if (!userId) {
    alert("Please log in first.");
    return;
  }

  const isCurrentlyFavourite = favouriteBagIds.has(bagId);
  const method = isCurrentlyFavourite ? "DELETE" : "POST";

  try {
    const res = await fetch("https://tooguildtogo.onrender.com/customer/favourites", {
      method: method,
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

    if (isCurrentlyFavourite) {
      favouriteBagIds.delete(bagId);
      button.textContent = "🤍";
    } else {
      favouriteBagIds.add(bagId);
      button.textContent = "❤️";
    }

  } catch (err) {
    console.error("Favourite toggle failed:", err);
    alert("Could not update favourite");
  }
}


