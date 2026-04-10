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
  "Lunch": "images/lunch.png"
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

    const res = await fetch(`http://127.0.0.1:8000/bags?search=${searchTerm}`);
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
  const res = await fetch(`http://127.0.0.1:8000/bags`);
  const data = await res.json();
  container.innerHTML = "";
  bags = data;
  bags.forEach((bag, index) => addBagCard(bag, index));
}
let favouriteBagIds = new Set();

async function loadUserFavourites() {
  const userId = localStorage.getItem("user_id");
  if (!userId) return;

  const res = await fetch(`http://127.0.0.1:8000/customer/favourites/${userId}`);
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
<<<<<<< HEAD
    const card = document.createElement("a");
    card.href = `details.html?bag_id=${bag.bag_id}`; // links to details page
    card.className = "card-link";
    const imageSrc = categoryImages[bag.category];
    card.innerHTML = `
        <div class="food-items">
            <img src="${imageSrc}" alt="${bag.category}">

            <div class="food-items-info">

                <div class="top-row">
                
                    <span class="food-items-category">${bag.category}</span>

                    <div class="favourite-wrapper">
                        <div class="favourite-toggle">
                            <input type="checkbox" id="fav-${bag.id}">
                            
                        </div>
                    </div>
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
        </div>
    `;
=======
  const card = document.createElement("div");
  card.className = "card-link";

  const isChecked = favouriteBagIds.has(bag.bag_id);

  card.innerHTML = `
    <div class="food-items">
        <a href="details.html?bag_id=${bag.bag_id}" class="bag-details-link">
            <img src="images/chocCroissant.png" alt="Food item">

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
>>>>>>> ea0fa473eb21936ec01f0261da3e8fa66ff7d4c8

  container.appendChild(card);
}


function formatTime(datetime) {
  if (!datetime) return "";
  const date = new Date(datetime);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
 

async function filterByCategory(tag) {
   const res = await fetch(`http://127.0.0.1:8000/bags?dietary_tag=${tag}`);
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
    const res = await fetch("http://127.0.0.1:8000/customer/favourites", {
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



/*

MESSY



// dont have db, this is for when we want to disply a buncb of food items when yoiu search for something NOT when you click on the card
// displayFoodItemDetails(foodItem) {
// video loops through food items and creates a card for each so you dont manually make new cards in html like you did before
// ABOVE IS SEPERATE TO BELOW!!!

// COPILOT HELPED BELOW 
function handleFoodItemCardClick(event) {
    const card = event.target.closest('.food-item');
    const foodItemId = card.getAttribute('data-id');

    // fetch food item details from the database using the foodItemId
    // for now we will just use mock data
    const foodItemDetails = {
        name: "Chocolate Croissant",
        description: "A delicious chocolate croissant made with flaky pastry and rich chocolate filling.",
        price: "$3.50",
        imageUrl: "images/chocCroissant.png"
    };
    displayFoodItemDetails(foodItemDetails);

}

/* ADD TO CODE ONCE DATABASE CONNECTED, THIS WILL BE HOW DYNAMIC CARDS APPEAR ON THE CONSUMER SIDE! ALSO USEFUL FOR WHEN YOU ALTER FAVOURTIES AND OTHER PAGES:
function createFoodCard(item) {
    return `
        <div class="food-items">
            <img src="${item.image}" alt="Food item">

            <div class="food-items-info">

                <div class="top-row">
                    <span class="food-items-category">${item.category}</span>

                    <div class="favourite-wrapper">
                        <div class="favourite-toggle">
                            <input type="checkbox" id="fav-${item.id}" name="favourite-checkbox">
                            <label for="fav-${item.id}" class="favourite-container">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                    class="feather feather-heart">
                                    <path d="M20.8 4.6c-1.5-1.4-3.6-1.4-5.1 0L12 8.3l-3.7-3.7c-1.5-1.4-3.6-1.4-5.1 0s-1.5 3.6 0 5l8.8 8.9 8.8-8.9c1.5-1.4 1.5-3.6 0-5z"></path>
                                </svg>

                                <div class="action">
                                    <span class="option-1">Add to Favourites</span>
                                    <span class="option-2">Added to Favourites</span>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <h3 class="food-items-company">${item.company}</h3>
                    <h3 class="food-items-collect-time">Collection Time: ${item.collectionTime}</h3>
                </div>

            </div>
        </div>
    `;
}
*/




