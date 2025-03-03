const buildingsData = [
    { name: "house", icon: "🏠", cost: 1000, tax: 100, taxInterval: 3000, requirements: { wood: 1, steel: 1 }, collector: 0 },
    { name: "hotel", icon: "🏨", cost: 2000, tax: 100, taxInterval: 3000, requirements: { wood: 1, steel: 1 }, collector: 0 },
    { name: "office", icon: "🏢", cost: 3000, tax: 200, taxInterval: 5000, requirements: { wood: 1, cement: 1 }, collector: 0 },
    { name: "mall", icon: "🏬", cost: 5000, tax: 400, taxInterval: 10000, requirements: { cement: 1, tools: 1 }, collector: 0 },
    { name: "factory", icon: "🏭", cost: 8000, tax: 800, taxInterval: 18000, requirements: { steel: 2, energy: 2 }, collector: 0 },
    { name: "sawmill", icon: "🪵🪚", img: 'sawmill.png', cost: 12000, tax: 1000, taxInterval: 30000, requirements: { cement: 2, tools: 2, energy: 2 }, collector: 0 },
    { name: "market", icon: "🛒", cost: 15000, tax: 2000, taxInterval: 30000, requirements: { steel: 2, cement: 2, tools: 2, energy: 3 }, collector: 0 }
];


const materialEmojis = Object.fromEntries(materialsData.map(m => [m.name, m.icon]));

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
            <span class="below-info">💰 ${building.tax}</span>`;
        } else {
            buildingDiv.innerHTML = `
                ${building.icon}<span class="below-info">💰 ${building.tax}</span>
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

function updateBuildingButtons() {
    for (const buildingObj of buildingsData) {
        const building = buildingObj.name;
        const btn = document.getElementById(`buy${capitalize(building)}`);
        const needed = buildingObj.requirements;
        let canBuild = true;

        for (const item in needed) {
            const material = resources[item];
            if (!material || material.qty < needed[item]) {
                canBuild = false;
                break;
            }
        }

        if (balance < buildingObj.cost) {
            canBuild = false;
        }
        btn.disabled = !canBuild;
    }
}

function enableBuilding(buildingName) {
    const btn = document.getElementById(`buy${capitalize(buildingName)}`);
    if (btn) {
        btn.closest(".building-item").style.display = "block";
    }
}

function hideLockedBuildings() {
    ["factory", "market", "sawmill"].forEach(name => {
        const element = document.getElementById(`buy${capitalize(name)}`);
        if (element) {
            element.closest(".building-item").style.display = "none";
        }
    });
}

// New FAB for Building Menus

const getMaterialIcon = name => materialsData.find(m => m.name === name)?.icon || '❓';

const fab = document.querySelector('.fab-build');
const gridMenu = document.querySelector('.grid-menu');
const gridContainer = document.getElementById('gridContainer');
const detailsPopup = document.getElementById('detailsPopup');
const overlay = document.getElementById('overlay');

fab.onclick = () => {
  gridMenu.style.display = gridMenu.style.display === 'none' ? 'block' : 'none';
  updateScrollIndicators();
};

buildingsData.forEach(building => {
  const btn = document.createElement('div');
  btn.className = 'building-btn';
  btn.textContent = building.icon;
  btn.onclick = () => showDetails(building);
  gridContainer.appendChild(btn);
});

function showDetails(building) {
  document.getElementById('buildingName').innerText = `${building.icon} ${building.name}`;
  document.getElementById('buildingCost').innerText = `Cost: ${building.cost}`;
  document.getElementById('buildingTax').innerText = `Tax: ${building.tax} every ${building.taxInterval / 1000}s`;
  
  const reqList = document.getElementById('buildingRequirements');
  reqList.innerHTML = '';
  for (const [material, amount] of Object.entries(building.requirements)) {
    reqList.innerHTML += `<li>${getMaterialIcon(material)} ${material}: ${amount}</li>`;
  }

  document.getElementById('buildButton').onclick = () => alert(`Building ${building.name}...`);
  detailsPopup.style.display = overlay.style.display = 'block';
  gridMenu.style.display = 'none';
}

// Scroll indicator and swipe handling (continues below in next message...)
const scrollLeftBtn = document.getElementById('scrollLeft');
const scrollRightBtn = document.getElementById('scrollRight');

// Update scroll indicator visibility
function updateScrollIndicators() {
  const maxScrollLeft = gridContainer.scrollWidth - gridContainer.clientWidth;
  scrollLeftBtn.style.display = gridContainer.scrollLeft > 10 ? 'block' : 'none';
  scrollRightBtn.style.display = gridContainer.scrollLeft < maxScrollLeft - 10 ? 'block' : 'none';
}

// Scroll buttons
scrollLeftBtn.onclick = () => {
  gridContainer.scrollBy({ left: -170, behavior: 'smooth' });
};
scrollRightBtn.onclick = () => {
  gridContainer.scrollBy({ left: 170, behavior: 'smooth' });
};

// Show/hide indicators on scroll
gridContainer.addEventListener('scroll', updateScrollIndicators);

// Touch swipe support
let startX = 0;

gridContainer.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
});

gridContainer.addEventListener('touchmove', (e) => {
  const deltaX = startX - e.touches[0].clientX;
  gridContainer.scrollLeft += deltaX;
  startX = e.touches[0].clientX;
});

// Close details popup when clicking outside
overlay.onclick = () => {
  detailsPopup.style.display = overlay.style.display = 'none';
};

// Update scroll indicators after menu opens
fab.onclick = () => {
  const isOpen = gridMenu.style.display === 'none';
  gridMenu.style.display = isOpen ? 'block' : 'none';
  if (isOpen) {
    setTimeout(updateScrollIndicators, 100); // Wait for rendering
  }
};
