const upgrades = [
    { name: "Tax Collector", emoji: "💰", cost: 1000, active: false },
    { name: "Food Collector", emoji: "🍖", cost: 2000, active: false },
    { name: "Upgrade Buildings", emoji: "🏗️", cost: 5000 },
    { name: "Weapon Smith", emoji: "⚔️", cost: 40 },
    { name: "Armor Smith", emoji: "🛡️", cost: 35 },
    { name: "Magic Tower", emoji: "🪄", cost: 60 },
    { name: "Farm Expansion", emoji: "🌾", cost: 25 },
    { name: "Trade Hub", emoji: "🛒", cost: 45 },
    { name: "Research Lab", emoji: "🔬", cost: 70 }
];


const grid = document.getElementById("upgradeGrid");

upgrades.forEach(upgrade => {
    const item = document.createElement("div");
    item.classList.add("upgrade-item");
    item.innerHTML = `
        <button class="upgrade-button" onclick="upgradeItem('${upgrade.name}')">
            ${upgrade.emoji}${upgrade.name} (₹${upgrade.cost})</button>
    `;
    grid.appendChild(item);
});

function upgradeItem(name) {
    const upgrade = upgrades.find(m => m.name === name);
    if (!upgrade) return;
    if (balance >= upgrade.cost) {
        balance -= upgrade.cost;
        if (name === "Food Collector") {
            startFoodCollection();
        }
        updateAllButtons();
    } else {
        alert("Not enough balance!");
    }
}

function updateUpgradeButtons() {
    document.querySelectorAll(".upgrade-button").forEach((button, index) => {
        button.disabled = balance < upgrades[index].cost;
    });
}

function startFoodCollection() {
    const upgrade = upgrades.find(m => m.name === "Food Collector");
    if (!upgrade) return;
    if (!upgrade.active) {
        upgrade.active = true;
        const button = document.querySelector("#materialGrid #food")
            .closest(".resource").querySelector(".gather-btn");
        if (button) {
            setInterval(() => {
                button.click();
            }, 3000);
        }    
    }
}