const buildingsData = [
    { name: "house", icon: "🏠", cost: 1000, tax: 100, taxInterval: 3000, requirements: { steel: 1, wood: 1 } },
    { name: "office", icon: "🏢", cost: 3000, tax: 200, taxInterval: 5000, requirements: { cement: 1, energy: 1 } },
    { name: "mall", icon: "🏬", cost: 5000, tax: 400, taxInterval: 10000, requirements: { tools: 1, cement: 1 } },
    { name: "factory", icon: "🏭", cost: 8000, tax: 800, taxInterval: 18000, requirements: { wood: 2, steel: 2 } },
    { name: "sawmill", icon: "🪵🪚", img: 'sawmill.png' || '🪵🪚', cost: 12000, tax: 1000, taxInterval: 30000, requirements: { cement: 2, tools: 2, energy: 2 } },
    { name: "market", icon: "🛒", cost: 15000, tax: 2000, taxInterval: 30000, requirements: { steel: 2, cement: 2, tools: 2, energy: 3 } }
];


const materialEmojis = Object.fromEntries(materials.map(m => [m.name, m.emoji]));

function generateGrid() {
    const gridContainer = document.querySelector('.building-grid');
    gridContainer.innerHTML = '';

    buildingsData.forEach((building, index) => {
        const div = document.createElement("div");
        div.classList.add("building-item");

        const requirementDiv = document.createElement('div');
        requirementDiv.className = 'required-qty';
        requirementDiv.textContent = Object.entries(building.requirements)
            .map(([key, val]) => `${materialEmojis[key]} x${val}`).join(', ');
        div.appendChild(requirementDiv);

        const buildingDiv = document.createElement('div');
        buildingDiv.className = 'grid-item building';
        if (building.img) {
            buildingDiv.innerHTML = `<img src=${building.img} style="width:40px; height:40px;">
                <div class="progress-container">
                    <span class="money-badge" onclick="collectMoney(${index}, this)">💰</span>
                </div>
                `;
        } else {
            buildingDiv.innerHTML = `
                ${building.icon}
                <div class="progress-container">
                    <span class="money-badge" onclick="collectMoney(${index}, this)">💰</span>
                </div>
                `;
        }
        div.appendChild(buildingDiv);

        const costDiv = document.createElement('div');
        costDiv.className = 'grid-item cost';
        costDiv.innerHTML = `
            <button class="buy-btn" id="buy${capitalize(building.name)}" 
                onclick="purchase('${building.name}')" disabled>
                Buy ₹${building.cost}
            </button>
            <div class="progress-bar"><div class="progress-fill"></div></div>
            <span class="needs">Tax: ${building.tax}</span>
        `;
        div.appendChild(costDiv);

        gridContainer.appendChild(div);

        startTaxCollection(building, buildingDiv.querySelector('.money-badge'));
        // Simulate progress bar filling
        setTimeout(() => {
            div.querySelector(".progress-fill").style.width = "100%";
        }, 500);
    });

    updateBalance(1000);
}

function purchase(building) {
    const nBuilding = buildingsData.find(m => m.name === building);
    const needed = nBuilding.requirements;

    for (const item in needed) {
        updateMaterial(item, -needed[item]);
    }

    updateBalance(-nBuilding.cost);
    purchased(nBuilding);
}


function collectMoney(index, btn) {
    if (!btn.classList.contains("enabled")) return;

    const building = buildingsData[index];
    updateBalance(building.tax);

    btn.classList.remove("enabled");
    startTaxCollection(building, btn);
    // updateResourceButtons();

    document.querySelectorAll(".gather-btn").forEach(button => {
        let costElement = button.closest(".resource").querySelector(".cost");
        if (costElement) {
            let cost = parseInt(costElement.textContent.replace("Cost: ₹", ""));
            button.disabled = balance < cost;
        }
    });

}

function startTaxCollection(building, btn) {
    let progress = 0;
    btn.parentElement.style.background = `conic-gradient(yellow 0% ${progress}%,
            transparent ${progress}% 100%)`;
    let interval = setInterval(() => {
        progress += 10;
        btn.parentElement.style.background = `conic-gradient(yellow 0% ${progress}%,
            transparent ${progress}% 100%)`;
        if (progress >= 100) {
            clearInterval(interval);
            btn.classList.add('enabled');
        }
    }, building.taxInterval/10);

    /*
    setTimeout(() => {
        btn.classList.add('enabled');
    }, building.taxInterval); // Generates income every 5 seconds
    */
}
