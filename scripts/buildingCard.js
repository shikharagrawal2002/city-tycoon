function openCard(building, cell) {
    if (!building || (!cell && building instanceof PurchasedBuilding)) {
        console.error("Invalid building or cell.");
        return false;
    }

    setCardDetails(building);

    let canBuild = balance >= building.cost;

    const costElement = document.getElementById("buildingCardCost");
    costElement.classList.toggle("insufficient", !canBuild);

    const container = document.getElementById("buildingResources");
    container.innerHTML = "";

    const fragment = document.createDocumentFragment();
    Object.entries(building.requirements || {}).forEach(([key, requiredQty]) => {
        const resource = materialsData.find((b) => b.name === key);

        if (!resource) {
            console.warn(`Resource '${key}' not found.`);
            return;
        }

        const resourceItem = document.createElement("div");
        resourceItem.classList.add("building-card-resource-item");

        if (resource.qty < requiredQty) {
            resourceItem.classList.add("insufficient");
            canBuild = false;
        }

        if (resource.tooltip) {
            resourceItem.setAttribute("data-tooltip", resource.tooltip);
        }

        resourceItem.innerHTML = `
            <span class="building-card-resource-name">${resource.icon} ${capitalize(resource.name)}:</span>
            <span class="${resource.qty < requiredQty ? 'building-card-insufficient' : ''}">${requiredQty}</span>
        `;

        fragment.appendChild(resourceItem);
    });
    container.appendChild(fragment);


    const buildButton = document.getElementById("buildingCardButton");
    setupBuildButton(buildButton, building, cell, canBuild);

    return canBuild;
}

function setCardDetails(building) {
    document.getElementById("buildingCardImage").src = building.img;
    document.getElementById("buildingCardTitle").textContent = capitalize(building.name);
    document.getElementById("buildingCardCost").textContent = "₹" + building.getCost();
    document.getElementById("buildingCardLevel").textContent = building.level || 1;
    document.getElementById("buildingCardProduce").textContent = "₹" + (building.tax || 0);
    document.getElementById("buildingCardTime").textContent = (building.upgradeTime || 0 ) + "s";

    // Show Produces (if available)
    const produceElement = document.getElementById("buildingCardProduce");
    if (building.produces) {
        const [resource, qty] = Object.entries(building.produces)[0]; // Get first key-value pair
        const interval = building.produces.interval || 0;
        if (interval === 0) {
            produceElement.textContent = `${capitalize(resource)}: +${qty}`;
        } else {
            produceElement.textContent = `${capitalize(resource)}: +${qty} every ${interval}s`;
        }
    } else {
        produceElement.textContent = "None";
    }

    document.getElementById("buildingCard").style.display = "block";
}

function setupBuildButton(buildButton, building, cell, canBuild) {
    const isPurchased = building instanceof PurchasedBuilding;
    const isUpgrading = isPurchased && building.isUpgrading();

    buildButton.textContent = isPurchased ? (isUpgrading ? "Upgrading..." : "Upgrade ⏫") : "Build 🔨";
    buildButton.disabled = !canBuild || isUpgrading;
    buildButton.classList.toggle("disabled", !canBuild || isUpgrading);

    buildButton.onclick = () => {
        closeCard();
        if (isPurchased) {
            if (!isUpgrading) {
                building.upgrade(cell);
            }
        } else {
            const newBuilding = purchased(building);
            newBuilding.startProduction();
        }
    };
}

function closeCard() {
    document.getElementById("buildingCard").style.display = "none";
}
