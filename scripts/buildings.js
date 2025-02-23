const buildingsData = [
    { name: "house", icon: "🏠", cost: 1000, tax: 100, taxInterval: 3000, requirements: { steel: 1, wood: 1 }, collector: 0 },
    { name: "office", icon: "🏢", cost: 3000, tax: 200, taxInterval: 5000, requirements: { cement: 1, energy: 1 }, collector: 0 },
    { name: "mall", icon: "🏬", cost: 5000, tax: 400, taxInterval: 10000, requirements: { tools: 1, cement: 1 }, collector: 0 },
    { name: "factory", icon: "🏭", cost: 8000, tax: 800, taxInterval: 18000, requirements: { wood: 2, steel: 2 }, collector: 0 },
    { name: "sawmill", icon: "🪵🪚", img: 'sawmill.png' || '🪵🪚', cost: 12000, tax: 1000, taxInterval: 30000, requirements: { cement: 2, tools: 2, energy: 2 }, collector: 0 },
    { name: "market", icon: "🛒", cost: 15000, tax: 2000, taxInterval: 30000, requirements: { steel: 2, cement: 2, tools: 2, energy: 3 }, collector: 0 }
];


const materialEmojis = Object.fromEntries(materials.map(m => [m.name, m.emoji]));

function generateGrid() {
    const gridContainer = document.querySelector('.building-grid');
    gridContainer.innerHTML = '';

    buildingsData.forEach((building, index) => {
        const div = document.createElement("div");
        div.dataset.name = building.name;
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
            `;
        } else {
            buildingDiv.innerHTML = `
                ${building.icon}
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
            <span class="below-info">Tax: ${building.tax}</span>
        `;
        div.appendChild(costDiv);

        gridContainer.appendChild(div);

        // Simulate progress bar filling
        setTimeout(() => {
            div.querySelector(".progress-fill").style.width = "100%";
        }, 500);
    });

    updateBalance(10000);
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