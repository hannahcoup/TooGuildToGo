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






searchButton.addEventListener('click', searchFoodItems);
foodItemsContainer.addEventListener('click', handleFoodItemCardClick);
backBtn.addEventListener('click', () => {
    foodItemsDetails.classList.add("hidden");
});

// useful for clicking functionality 
searchInput.addEventListener('keypress', event => {
    if (event.key === 'Enter') searchFoodItems();
    })


    // useful for clicking functionality 
async function searchFoodItems() {
    const searchTerm = searchInput.value.trim();

    // error handling for when user puts in an empty search term
    if (!searchTerm) {
        errorContainer.textContent = "Please enter a search term.";
        errorContainer.classList.remove("hidden"); // show error message
        return;
    }

    // DOESNT WORK BECUASE HTML HAS MOCK DATA THERE NEED TO CONNECT TO DATABASE CONTENTS

    try { 
        resultsHeading.textContent = `Search results for "${searchTerm}"...`;
        foodItemsContainer.innerHTML = ""; // clear old results
        errorContainer.classList.add("hidden"); // hide error message
        // add this when there is databse data
        // if(data.foodItems === null) {
        //     resultsHeading.textContent = "";
        //     foodItemsContainer.innerHTML = ""; // clear old results
        //     errorContainer.textContent = "No food items found for '${searchTerm}'. Please try a different search term.";
        //     errorContainer.classList.remove("hidden"); // show error message
        //     GO TO 8:07:00 OF THE VIDEO TO SEE HOW TO DO THIS
        // }

    } catch (error) {
        console.error("Error fetching food items:", error);
        errorContainer.textContent = "An error occurred while fetching food items. Please try again later.";
        errorContainer.classList.remove("hidden"); // show error message
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




