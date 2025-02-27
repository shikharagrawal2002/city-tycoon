const purchasedData = [];

function purchased(building) {
    const newPurchase = {level: 1, ref: building}; 
    purchasedData.push(newPurchase);
    addBuildingToGrid(newPurchase, purchasedData.length - 1);
}

// Function to add a building to the purchased grid
function addBuildingToGrid(building, index) {
    const purchasedGrid = document.getElementById("purchasedGrid");
    const buildingElement = document.createElement("div");
    buildingElement.classList.add("purchased-building");
    buildingElement.dataset.id = index;

    // Use Document Fragment to avoid multiple reflows
    const fragment = document.createDocumentFragment();

    // Wrapper for icon and level info
    const iconWrapper = document.createElement("div");
    iconWrapper.classList.add("icon-wrapper");

    // Building icon
    const iconElement = document.createElement("div");
    iconElement.innerHTML = building.ref.img 
        ? `<img src=${building.ref.img} style="width:40px; height:40px;">`
        : building.ref.icon;
    iconElement.classList.add("grid-item", "building");

    const levelInfo = document.createElement("span");
    levelInfo.classList.add("building-level", "level-info");
    levelInfo.innerText = `Level: ${building.level}`;

    // Tax Collect Button + Tax Value
    const taxDiv = document.createElement("div");
    const taxButton = document.createElement("button");
    taxButton.classList.add("tax-button");
    taxButton.innerHTML = "💰";
    taxButton.addEventListener("click", () => collectTax(building, taxButton));

    const taxInfo = document.createElement("span");
    taxInfo.classList.add("tax-info", "below-info");
    taxInfo.innerText = `₹${building.ref.tax}`;

    taxDiv.appendChild(taxButton);
    taxDiv.appendChild(taxInfo);

    // Append icon and tax button next to each other
    iconWrapper.appendChild(iconElement);

    // Upgrade button
    const upgradeDiv = document.createElement("div");
    const upgradeButton = document.createElement("button");
    upgradeButton.classList.add("purchased-upgrade-button");
    upgradeButton.innerText = `⬆ Upgrade ₹${building.ref.cost * building.level}`;
    upgradeButton.addEventListener("click", () => upgradeBuilding(building, upgradeButton));

    const requirementDiv = document.createElement('div');
    requirementDiv.className = 'required-qty';
    requirementDiv.textContent = Object.entries(building.ref.requirements)
        .map(([key, val]) => `${materialEmojis[key]} x${val}`).join(', ');

    upgradeDiv.appendChild(requirementDiv);
    upgradeDiv.appendChild(upgradeButton);
    iconWrapper.appendChild(levelInfo);

    // Append elements
    fragment.appendChild(iconWrapper);
    fragment.appendChild(taxDiv);
    fragment.appendChild(upgradeDiv);
    buildingElement.appendChild(fragment);

    purchasedGrid.appendChild(buildingElement);
}

// Function to simulate tax collection progress
function collectTax(building, button) {
    button.disabled = true;
    button.style.background = "conic-gradient(gold 0%, gray 0%)";

    let progress = 0;
    const interval = setInterval(() => {
        progress += 100*100/building.ref.taxInterval;
        button.style.background = `conic-gradient(gold ${progress}%, gray ${progress}%)`;
        
        if (progress >= 100) {
            clearInterval(interval);
            button.disabled = false;
            button.style.background = "";
            updateBalance(building.ref.tax * building.level);

            if (building.ref.collector) {
                console.log("event dispatch");
                button.dispatchEvent(new Event("click"));
            }
        }
    }, 100);
}

function getMaterialQty(materialName) {
    const material = materials.find(m => m.name === materialName);
    return material ? material.qty : 0;
}

function requirementDiv() {

}

// Function to simulate upgrade progress
function upgradeBuilding(building, button) {
    const upgradeCost = building.ref.cost * building.level;
    const requiredMaterials = Object.entries(building.ref.requirements).reduce((acc, [key, val]) => {
        acc[key] = val * building.level;
        return acc;
    }, {});

    if (balance < upgradeCost) return;

    for (const [material, qty] of Object.entries(requiredMaterials)) {
        if (getMaterialQty(material) < qty) {
            alert(`Not enough ${materialEmojis[material]} to upgrade! Need ${qty}.`);
            return;
        }
    }

    for (const [material, qty] of Object.entries(requiredMaterials)) {
        updateMaterial(material, -qty);
    }

    updateBalance(-upgradeCost);

    button.disabled = true;
    button.innerText = "Upgrading...";

    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        button.style.opacity = 1 - progress / 100;

        if (progress >= 100) {
            clearInterval(interval);
            button.disabled = false;
            button.style.opacity = 1;
            building.level++;
            button.innerText = `⬆ Upgrade ₹${
                convertToINRFormat(Math.ceil(building.ref.cost * Math.pow(1.5, building.level)))}`;
            const buildingDiv = button.closest(".purchased-building");
            const levelDiv = buildingDiv.querySelector(".building-level");
            levelDiv.innerText = `Level: ${building.level}`;
            const taxSpan = buildingDiv.querySelector(".tax-info");
            taxSpan.innerText = `₹${building.ref.tax * building.level}`;

            const requirementDiv = buildingDiv.querySelector(".required-qty");
            requirementDiv.textContent = Object.entries(building.ref.requirements)
                .map(([key, val]) => `${materialEmojis[key]} x${val * building.level}`)
                .join(', ');
        }
    }, 300);
}

function updatePurchasedButtons() {
    const btns = document.querySelectorAll(".purchased-upgrade-button");
    btns.forEach(btn => {
        const buildingId = btn.closest('.purchased-building').dataset.id;
        const building = purchasedData[buildingId];
        const totalCost = building.ref.cost * building.level;
        
        if (balance >= totalCost) {
            btn.disabled = false;
            // btn.innerText = `⬆ Upgrade ₹${totalCost}`;
        } else {
            btn.disabled = true;
            // btn.innerText = `⬆ Upgrade ₹${totalCost} (Insufficient balance)`;
        }
    });
}