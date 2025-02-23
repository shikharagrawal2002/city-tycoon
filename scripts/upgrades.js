const upgrades = [
    { name: "Tax Collector", emoji: "💰", cost: 10000, submenu: buildingsData },
    { name: "Food Collector", emoji: "🍖", cost: 2000, badge: 2000, count: 0 },
    { name: "Upgrade Buildings", emoji: "🏗️", cost: 50000 },
    { name: "Weapon Smith", emoji: "⚔️", cost: 40 },
    { name: "Armor Smith", emoji: "🛡️", cost: 35 },
    { name: "Magic Tower", emoji: "🪄", cost: 60 },
    { name: "Farm Expansion", emoji: "🌾", cost: 25 },
    { name: "Trade Hub", emoji: "🛒", cost: 45 },
    { name: "Research Lab", emoji: "🔬", cost: 70 }
];


const grid = document.getElementById("upgradeGrid");

function taxCollector(building, btn) {
    if (balance < building.cost || building.collector) return;

    updateBalance(-building.cost);
    building.collector = 1;
    btn.disabled = true;
    const menu = document.getElementById('taxMenu');
}

function upgradeItem(name) {
    const upgrade = upgrades.find(m => m.name === name);
    if (!upgrade || balance < upgrade.cost) {
        return alert("Not enough balance!");
    }
    updateBalance(-upgrade.cost);
    if (name === "Food Collector" && upgrade.count === 0) {
        startFoodCollection();
    }
    if (upgrade.count !== undefined) {
        upgrade.count += 1;
    }
    updateAllButtons();
}

function updateUpgradeButtons() {
    document.querySelectorAll(".upgrade-button").forEach((button, index) => {
        button.disabled = balance < upgrades[index].cost;
    });
}

function startFoodCollection() {
    const upgrade = upgrades.find(m => m.name === "Food Collector");
    if (!upgrade) return;
    const button = document.querySelector("#materialGrid #badge-food")
        .closest(".resource").querySelector(".gather-btn");
    if (button) {
        setInterval(() => {
           button.click();
        }, 3000);
    }
}

const floatBtn = document.getElementById('floatBtn');
const menu = document.getElementById('menu');

function createMenu() {
    const mainMenu = document.createElement("ul");
    upgrades.forEach(item => {
        const mainMenuItem = document.createElement("li");
        if (item.submenu) {
            mainMenuItem.innerHTML = `${item.emoji}${item.name}`;
            mainMenuItem.onclick = (event) => toggleSubmenu(event, mainMenuItem);
            const subMenu = document.createElement("ul");
            subMenu.classList.add("submenu");
            buildingsData.forEach(item => {
                const subMenuItem = document.createElement("li");
                subMenuItem.innerText = `${item.icon}${capitalize(item.name)}`;
                addBadge(subMenuItem, item.cost);
                subMenuItem.onclick = () => {
                    closeMenu();
                    taxCollector(item, subMenuItem);
                }
                subMenu.appendChild(subMenuItem);
            });
            mainMenuItem.appendChild(subMenu);
        } else {
            mainMenuItem.innerHTML = `${item.emoji}${item.name}`;
            addBadge(mainMenuItem, item.cost);
            mainMenuItem.onclick = () => {
                closeMenu();
                upgradeItem(item.name);
            }
        }
        mainMenu.appendChild(mainMenuItem);
    });
    menu.appendChild(mainMenu);
}

createMenu();

function toggleMenu() {
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    const submenus = menu.querySelectorAll('.submenu');
    submenus.forEach(submenu => {
        submenu.style.display = 'none';
    });
}

function toggleSubmenu(event, mainMenuItem) {
    event.stopPropagation();
    const submenu = mainMenuItem.querySelector('.submenu');
    if (submenu) {
        submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
    }
}

function closeMenu() {
    menu.style.display = 'none';
    const submenus = menu.querySelectorAll('.submenu');
    submenus.forEach(submenu => {
        submenu.style.display = 'none';
    });
}

floatBtn.addEventListener('click', toggleMenu);

function addBadge(elem, cost) {
    const costBadge = document.createElement("span");
    costBadge.classList.add("item-badge");
    costBadge.innerText = `${cost}`;
    elem.appendChild(costBadge);
}
