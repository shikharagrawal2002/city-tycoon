let foodConsumptionRate = 1; // Food consumed per worker per cycle

function consumeFood() {
    const food = resources['food'];
    if (food && food.qty >= workers * foodConsumptionRate) {
        // Deduct food based on workers
        updateMaterial('food', -(workers * foodConsumptionRate));
    } else {
        alert("⚠️ Not enough food! Workers stopped working.");
        workers = 0;
        updateWorkerDisplay();
    }
    scheduleUpdateAllButtons();
}

// Start the food consumption cycle every 10 seconds
setInterval(consumeFood, 10000);
