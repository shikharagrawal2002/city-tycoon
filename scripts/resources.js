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
            <button class="gather-btn" onclick="startGathering(this, ${index})">
                <span class="badge" id="badge-${material.name}">${material.qty}</span>
                <span class="emoji">${material.emoji}</span>
                <div class="progress-bar"></div>
                <span class="cost">₹${material.cost}</span>
            </button>
            <div class="below-info">👷: ${material.workersRequired}</div>
        `;
        grid.appendChild(div);
    });
}

function startGathering(button, materialIndex) {
    const material = materials[materialIndex];
    const foodQty = materials.find(m => m.name === "food").qty;

    if (!checkRequirements(button, material)) { return;}

    // Check if enough workers are available
    if (workers < material.workersRequired) {
        alert("Not enough workers to gather this material!");
        return;
    }

    if (foodQty < material.workersRequired * foodConsumptionRate) {
       alert("⚠️ Not enough food! Workers cannot gather.");
      return;
    }

    let upgrade = upgrades.find(u => u.name === `${capitalize(material.name)} Collector`);
    let maxGatherQty = upgrade && upgrade.count ? upgrade.count : 1;

    let affordableQty = Math.floor(balance / material.cost);
    let gatherQty = Math.min(maxGatherQty, affordableQty);

    if (gatherQty <= 0) {
        alert("Not enough balance to gather any materials!");
        return;
    }

    // Deduct balance upfront based on how much can be gathered
    updateBalance(-material.cost * gatherQty);

    // Reduce available workers
    workers -= material.workersRequired;
    updateWorkerDisplay();

    button.disabled = true;
    let progressBar = button.querySelector(".progress-bar");
    
    progressBar.style.width = "0%";

    // Start progress effect
    setTimeout(() => {
        progressBar.style.transition = `width ${material.gatherTime}ms linear`;
        progressBar.style.width = "100%";
    }, 10);

    setTimeout(() => {
        material.qty += gatherQty;
    
        // Update the quantity badge inside the button
        let qtyElement = button.querySelector(".badge");
        if (qtyElement) {
            qtyElement.textContent = material.qty;
        }
    
        progressBar.style.width = "0%";
        progressBar.style.transition = "none";
    
        // Restore workers after collection
        workers += material.workersRequired;
        updateWorkerDisplay();
    
        button.disabled = balance < material.cost;
        let text = button.querySelector(".cost");
        if (text) {
            text.textContent = `₹${material.cost}`;
        }
    
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
    document.getElementById(`badge-${materialName}`).textContent = material.qty;
}

function checkRequirements(button, material) {
    // Check if material has requirements
    if (material.requirements) {
        for (const req in material.requirements) {
            let requiredQty = material.requirements[req];

            // Check if it's a building requirement
            if (buildingsData.some(b => b.name === req)) {
                const purchasedGrid = document.getElementById("purchasedGrid");
                let buildingCount = purchasedData.filter(m => m.name === req).length || 0;

                if (buildingCount < requiredQty) {
                    alert(`⚠️ Not enough ${req}! You need ${requiredQty} to gather ${material.name}.`);
                    return false;
                }
            } else {
                // Check if it's a material requirement
                let reqMaterial = materials.find(m => m.name === req);
                if (!reqMaterial || reqMaterial.qty < requiredQty) {
                    alert(`⚠️ Not enough ${req}! You need ${requiredQty} to gather ${material.name}.`);
                    return false;
                }
            }
        }
    }
    return true;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}