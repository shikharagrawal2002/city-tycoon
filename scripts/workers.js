let workers = 0; // Starting number of workers


function hireWorker() {
    const foodQty = resources['food'].qty;

    if (balance < 1000) {
        alert("Not enough money to hire a worker!");
        return;
    }
    if (foodQty < foodConsumptionRate) {
        alert("Not enough food to hire a worker!");
        return;
    }
    updateBalance(-1000);
    updateWorkers(1);
    updateHireButton();
}

function updateWorkerDisplay() {
    document.getElementById("workerCount").textContent = `${workers}`;
    scheduleUpdateAllButtons();
}

function updateWorkers(count) {
    workers += count;
    updateWorkerDisplay();
}

function updateHireButton() {
    const hireBtn = document.getElementById("hireWorkerBtn");
    if (!hireBtn) return;
    hireBtn.disabled = balance < 1000;
}

document.addEventListener('DOMContentLoaded', () => {
    updateHireButton(); // Ensure button state is correct on load
});
