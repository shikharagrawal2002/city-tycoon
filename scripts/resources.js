const materials = [
    { name: "food", emoji: "🍞", cost: 200, gatherTime: 1500, qty:10, workersRequired:0},
    { name: "wood", emoji: "🪵", cost: 300, gatherTime: 4000, qty:1, workersRequired:1 },
    { name: "steel", emoji: "🔩", cost: 500, gatherTime: 5000, qty:1, workersRequired:2 },
    { name: "cement", emoji: "🏗️", cost: 1000, gatherTime: 6000, qty:0, workersRequired:2 },
    { name: "tools", emoji: "🛠️", cost: 2000, gatherTime: 7000, qty:0, workersRequired:3 },
    { name: "energy", emoji: "⚡", cost: 5000, gatherTime: 8000, qty:0, workersRequired:4 },
    { name: "plank", emoji: "🪵🪚", cost: 1000, gatherTime: 4000, qty:0, workersRequired:1,
        requirements: { wood: 1, sawmill:1 }
    },
];

function createMaterialGrid() {
    const grid = document.getElementById("materialGrid");
    grid.innerHTML = "";
    materials.forEach((material, index) => {
        const div = document.createElement("div");
        div.classList.add("resource");
        div.innerHTML = `
            <div class="emoji material">${material.emoji}
                <span class="qty" id="${material.name}">${material.qty}</span></div>
            <div>
                <button class="gather-btn" onclick="startGathering(this, ${index})" disabled>
                    <span class="btn-text">Gather (₹${material.cost})</span>
                    <div class="progress-bar"></div>
                </button>
                <div class="needs">Workers: ${material.workersRequired}</div>
            </div>
        `;
        grid.appendChild(div);
    });
}

function startGathering(button, materialIndex) {
    const material = materials[materialIndex];
    const foodQty = materials.find(m => m.name === "food").qty;

    // Check if enough workers are available
    if (workers < material.workersRequired) {
        alert("Not enough workers to gather this material!");
        return;
    }

    if (foodQty < material.workersRequired * foodConsumptionRate) {
       alert("⚠️ Not enough food! Workers cannot gather.");
      return;
    }

    if (balance < material.cost) return; // Prevent action if not enough balance
    updateBalance(-material.cost);

    // Reduce available workers
    workers -= material.workersRequired;
    updateWorkerDisplay();

    button.disabled = true;
    let text = button.querySelector(".btn-text");
    let progressBar = button.querySelector(".progress-bar");
    
    text.textContent = "Collecting...";
    progressBar.style.width = "0%";

    // Start progress effect
    setTimeout(() => {
        progressBar.style.transition = `width ${material.gatherTime}ms linear`;
        progressBar.style.width = "100%";
    }, 10);

    setTimeout(() => {
        material.qty += 1;

        let qtyElement = document.getElementById(material.name);
        qtyElement.textContent = material.qty;

        progressBar.style.width = "0%";
        progressBar.style.transition = "none";

        // Restore workers after collection
        workers += material.workersRequired;
        updateWorkerDisplay();

        button.disabled = balance < material.cost;
        text.textContent = "Gather (₹" + material.cost + ")";

        updateAllButtons();
    }, material.gatherTime);
}

function updateMaterial(materialName, qty) {
    const material = materials.find(m => m.name === materialName);
    if (!material) {
        alert("Error: Material "+ materialName + " Not Found");
        return;
    }
    material.qty += qty;
    document.getElementById(materialName).textContent = material.qty;
}
