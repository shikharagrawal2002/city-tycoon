const purchasedData = [];

class PurchasedBuilding extends Building {
    constructor(building, { level = 1, upgradeTime = 10, state = null } = {}) {
        super(building);
        this.level = level;
        this.upgradeTime = upgradeTime;
        this.state = state;
    }

    isUpgrading() {
        return this.state === "upgrading";
    }
    
    upgrade(cell) {
        if (!this.isUpgrading()) {
            this.state = "upgrading";
            updateBalance(-this.cost);
            for (const [material, requiredQty] of Object.entries(this.requirements)) {
                const resource = materialsData.find(m => m.name === material);
                updateMaterial(material, -requiredQty);
            }
            showProgress(cell, this.upgradeTime, () => {
                this.level++;
                this.state = "idle";
            });
        }
    }

    /**
    * Starts material production for this building.
    */
    startProduction() {
        if (!this.produces || this.isProducing || this.productionInterval) return;
        this.isProducing = true;

        const { interval, population, ...materials } = this.produces;

        const produceMaterials = () => {
            Object.keys(materials).forEach(material => {
                updateMaterial(material, materials[material]);
            });
    
            console.log(`Produced ${JSON.stringify(materials)} from ${this.name}`);
        };
    
        // One-time production if interval is missing or 0
        if (interval === undefined || interval <= 0) {
            produceMaterials();
            return;
        }
    
        // Continuous production if interval > 0
        this.productionInterval = setInterval(produceMaterials, interval * 1000);        
    }

    /**
     * Stops material production, if needed.
     */
    stopProduction() {
        if (this.productionInterval) {
            clearInterval(this.productionInterval);
            this.productionInterval = null;
            this.isProducing = false;
        }
    }
}

function purchased(building) {
    updateBalance(-building.cost);
    for (const [material, qty] of Object.entries(building.requirements || {})) {
        updateMaterial(material, -qty);
    }

    const newPurchase = new PurchasedBuilding(building);
    purchasedData.push(newPurchase);
    addNewBuilding(newPurchase);

    return newPurchase;
}

const landGrid = document.getElementById('land-grid');

function addNewBuilding(building) {
    const cell = document.createElement('div');
    cell.classList.add("land-grid-cell");
    if (building.img) {
        let img = document.createElement("img");
        img.src = building.img;
        img.classList.add("land-grid-cell");
        cell.appendChild(img);
    } else {
        cell.innerText = building.icon;
    }
    cell.addEventListener('click', () => showUpgradePanel(building, cell));

    // Progress bar
    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");
    const progressFill = document.createElement("div");
    progressFill.classList.add("progress-fill");

    const progressText = document.createElement("span");
    progressText.classList.add("progress-text");
    progressText.textContent = "Upgrading...";

    progressFill.appendChild(progressText);
    progressBar.appendChild(progressFill);

    cell.appendChild(progressBar);

    if (building.taxInterval > 0) {
        const taxDiv = document.createElement("div");
        const taxButton = document.createElement("button");
        taxButton.classList.add("tax-button");
        taxButton.innerHTML = "💰";
        taxButton.addEventListener("click", (event) => {
            event.stopPropagation();
            collectTax(building, taxButton);
        });    
        cell.appendChild(taxButton);
    }

    landGrid.appendChild(cell);
}

function showProgress(container, duration, cb) {
    const progressBar = container.querySelector(".progress-bar");
    const progressFill = container.querySelector(".progress-fill");

    if (!progressBar || !progressFill) return;

    progressBar.style.display = "flex";

    let start = null;
    function animate(timestamp) {
        if (!start) start = timestamp;
        let progress = (timestamp - start) / (duration * 1000);
        progressFill.style.width = Math.min(progress * 100, 100) + "%";

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            progressBar.style.display = "none";
            triggerStarAnimation(container);
            if (cb) cb();
        }
    }

    requestAnimationFrame(animate);
}

function triggerStarAnimation(cell) {
    const numStars = 8; // Number of stars in the explosion
    for (let i = 0; i < numStars; i++) {
        const star = document.createElement("div");
        star.classList.add("star-animation");
        star.innerHTML = "⭐"; // Emoji instead of image

        // Random position near the center of the cell
        const angle = (i / numStars) * 360; // Distribute stars evenly
        const distance = Math.random() * 30 + 10; // Random explosion radius (10-40px)
        const x = Math.cos(angle * (Math.PI / 180)) * distance;
        const y = Math.sin(angle * (Math.PI / 180)) * distance;

        star.style.setProperty("--star-x", `${x}px`);
        star.style.setProperty("--star-y", `${y}px`);

        cell.appendChild(star);

        // Remove after animation completes (1s)
        setTimeout(() => {
            star.remove();
        }, 1000);
    }
}

function showUpgradePanel(building, container) {
    openCard(building, container);
}


// Function to simulate tax collection progress
function collectTax(building, button) {
    if (button.disabled) return;

    button.disabled = true;
    button.style.background = "conic-gradient(gold 0%, gray 0%)";

    let progress = 0;
    const interval = setInterval(() => {
        progress += 100*100/building.taxInterval;
        button.style.background = `conic-gradient(gold ${progress}%, gray ${progress}%)`;
        
        if (progress >= 100) {
            clearInterval(interval);
            button.disabled = false;
            button.style.background = "";
            updateBalance(building.tax * building.level);

            if (building.collector && !button.disabled) {
                button.dispatchEvent(new Event("click"));
            }
        }
    }, 100);
}

function getMaterialQty(materialName) {
    const material = resources[materialName];
    return material ? material.qty : 0;
}
