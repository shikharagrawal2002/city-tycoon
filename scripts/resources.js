const materialsData = [
    { name: "food", icon: "🍞", cost: 200, gatherTime: 1500, qty:10, workersRequired:0 },
    { name: "wood", icon: "🪵", cost: 300, gatherTime: 4000, qty:10, workersRequired:1, collector: 0 },
    { name: "steel", icon: "🔩", cost: 500, gatherTime: 5000, qty:10, workersRequired:2, collector: 0 },
    { name: "cement", icon: "🏗️", cost: 1000, gatherTime: 6000, qty:10, workersRequired:2 },
    { name: "tools", icon: "🛠️", cost: 2000, gatherTime: 7000, qty:10, workersRequired:3 },
    { name: "energy", icon: "⚡", cost: 5000, gatherTime: 8000, qty:10, workersRequired:4 },
    { name: "plank", img: "images/woodplank.png", icon: "🪵🪚", cost: 1000, gatherTime: 4000, qty:0, workersRequired:1,
        requirements: { wood: 1, sawmill:1 }
    },
];

const resources = {};
materialsData.forEach(m => resources[m.name] = m);
const materialEmojis = Object.fromEntries(materialsData.map(m => [m.name, m.icon]));

function createMaterialGrid() {
    const grid = document.getElementById("materialGrid");
    grid.innerHTML = "";
    materialsData.forEach((material, index) => {
        const div = document.createElement("div");
        div.classList.add("resource");
            div.innerHTML = `
            <button class="gather-btn" onclick="startGathering(this, ${index})">
                <span class="badge" id="badge-${material.name}">${material.qty}</span>
                <span class="emoji">
                    ${material.img ? 
                        `<img src="${material.img}" style="width:50px; height:50px;">` :
                        material.icon}
                </span>
                <div class="progress-bar"></div>
                <span class="cost">₹${material.cost}</span>
            </button>
            <div class="below-info">👷: ${material.workersRequired}</div>
        `;
        grid.appendChild(div);
    });
}

function startGathering(button, materialIndex) {
    const material = materialsData[materialIndex];
    const foodQty = resources['food'].qty;

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
    updateWorkers(-material.workersRequired);

    button.disabled = true;
    let progressBar = button.querySelector(".progress-bar");
    
    progressBar.style.width = "0%";

    // Start progress effect
    setTimeout(() => {
        progressBar.style.transition = `width ${material.gatherTime}ms linear`;
        progressBar.style.width = "100%";
    }, 10);

    setTimeout(() => {
        updateMaterial(material.name, gatherQty);
    
        progressBar.style.width = "0%";
        progressBar.style.transition = "none";
    
        // Restore workers after collection
        updateWorkers(material.workersRequired);

        button.disabled = balance < material.cost;
        let text = button.querySelector(".cost");
        if (text) {
            text.textContent = `₹${material.cost}`;
        }
    
        scheduleUpdateAllButtons();

        if (material.collector) {
            console.log("Gathering Click"+material.name);
            button.dispatchEvent(new Event("click"));
        }
    }, material.gatherTime);    
}

function updateMaterial(materialName, qty) {
    const material = resources[materialName];
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
                    return false;
                }
            } else {
                // Check if it's a material requirement
                let reqMaterial = resources[req];
                if (!reqMaterial || reqMaterial.qty < requiredQty) {
                    return false;
                }
            }
        }
    }
    return true;
}

function updateResourceButtons() {
    const buttons = document.querySelectorAll(".gather-btn");
    buttons.forEach((button, index) => {
        const material = materialsData[index];
        const canAfford = balance >= material.cost;
        const hasWorkers = workers >= material.workersRequired;
        const meetsRequirements = checkRequirements(button, material);
        
        button.disabled = !(canAfford && hasWorkers && meetsRequirements);
    });
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
