let foodConsumptionRate = 1; // Food consumed per worker per cycle

function consumeFood() {
    const food = materials.find(m => m.name === "food");
    if (food && food.qty >= workers * foodConsumptionRate) {
        // Deduct food based on workers
        food.qty -= workers * foodConsumptionRate;
        updateFoodDisplay();
    } else {
        alert("⚠️ Not enough food! Workers stopped working.");
        workers = 0; // Workers stop until food is available
        updateWorkerDisplay();
    }
    updateAllButtons();
}

// Start the food consumption cycle every 10 seconds
setInterval(consumeFood, 10000);
function updateFoodDisplay() {
    document.getElementById("food").textContent = materials.find(m => m.name === "food").qty;
}
