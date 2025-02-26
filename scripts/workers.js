let workers = 0; // Starting number of workers


function hireWorker() {
    const foodQty = materials.find(m => m.name === "food").qty;

    if (balance < 1000) {
        alert("Not enough money to hire a worker!");
        return;
    }
    if (foodQty < foodConsumptionRate) {
        alert("Not enough food to hire a worker!");
        return;
    }
    updateBalance(-1000);
    workers += 1;
    updateWorkerDisplay();
    updateHireButton();
}

function updateWorkerDisplay() {
    document.getElementById("workerCount").textContent = `${workers}`;
}

function updateHireButton() {
    const hireBtn = document.getElementById("hireWorkerBtn");
    if (!hireBtn) return;
    hireBtn.disabled = balance < 1000;
}

document.addEventListener('DOMContentLoaded', () => {
    updateHireButton(); // Ensure button state is correct on load
});
