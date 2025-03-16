const buildingsData = [
    { name: "hut", icon: "🏢", img: 'images/hut.png', cost: 1000, tax: 100, taxInterval: 5000, requirements: { wood: 1 },
      collector: 0, produces: { population: 5 } },
    { name: "farm", icon: "🌾", img: 'images/farm.png', cost: 5000, tax: 0, taxInterval: 0, requirements: { /*water: 2,*/ energy: 1 },
      collector: 1, produces: { food: 5, interval: 15 } },
    { name: "forest", icon: "🌲", img: 'images/forest.png', cost: 3000, tax: 0, taxInterval: 0, requirements: {},
      collector: 1, produces: { wood: 2, interval: 20 } },
    { name: "house", icon: "🏢", img: 'images/house4.png', cost: 3000, tax: 200, taxInterval: 5000, requirements: { wood: 1, cement: 1 }, collector: 0 },
    { name: "house1", icon: "🏠", img: 'images/house.png', cost: 1000, tax: 100, taxInterval: 3000, requirements: { wood: 1, steel: 1 }, collector: 0 },
    { name: "house2", icon: "🏨", img: 'images/house2.png', cost: 2000, tax: 100, taxInterval: 3000, requirements: { wood: 1, steel: 1 }, collector: 0 },
    { name: "house3", icon: "🏨", img: 'images/house3.png', cost: 2000, tax: 100, taxInterval: 3000, requirements: { wood: 1, steel: 1 }, collector: 0 },
    { name: "market2", icon: "🏨", img: 'images/market2.png', cost: 2000, tax: 100, taxInterval: 3000, requirements: { wood: 1, steel: 1 }, collector: 0 },
    { name: "market3", icon: "🏨", img: 'images/market3.png', cost: 2000, tax: 100, taxInterval: 3000, requirements: { wood: 1, steel: 1 }, collector: 0 },
    { name: "market4", icon: "🏨", img: 'images/market4.png', cost: 2000, tax: 100, taxInterval: 3000, requirements: { wood: 1, steel: 1 }, collector: 0 },
    { name: "market5", icon: "🏨", img: 'images/market5.png', cost: 2000, tax: 100, taxInterval: 3000, requirements: { wood: 1, steel: 1 }, collector: 0 },
    { name: "university", icon: "🏨", img: 'images/university.png', cost: 2000, tax: 100, taxInterval: 3000, requirements: { wood: 1, steel: 1 }, collector: 0 },
    { name: "university2", icon: "🏨", img: 'images/university2.png', cost: 2000, tax: 100, taxInterval: 3000, requirements: { wood: 1, steel: 1 }, collector: 0 },
    { name: "hotel", icon: "🏨", img: 'images/hotel.png', cost: 2000, tax: 100, taxInterval: 3000, requirements: { wood: 1, steel: 1 }, collector: 0 },
    { name: "hotel2", icon: "🏨", img: 'images/hotel3.png', cost: 2000, tax: 100, taxInterval: 3000, requirements: { wood: 1, steel: 1 }, collector: 0 },
    { name: "oldschool", icon: "🏬", img: 'images/school2.png', cost: 5000, tax: 400, taxInterval: 10000, requirements: { cement: 1, tools: 1 }, collector: 0 },
    { name: "school", icon: "🏭", img: 'images/school.png', cost: 8000, tax: 800, taxInterval: 18000, requirements: { steel: 2, energy: 2 }, collector: 0 },
    { name: "college", icon: "🏭", img: 'images/college.png', cost: 8000, tax: 800, taxInterval: 18000, requirements: { steel: 2, energy: 2 }, collector: 0 },
    { name: "sawmill", icon: "🪵🪚", img: 'images/sawmill.png', cost: 12000, tax: 1000, taxInterval: 30000, requirements: { cement: 2, tools: 2, energy: 2 },
      collector: 0, produces: {plank:1, interval: 10} },
    { name: "wind Mill", icon: "🪵🪚", img: 'images/windmill.png', cost: 1000, tax: 1000, taxInterval: 30000, requirements: { cement: 2, tools: 2, energy: 2 }, 
      collector: 0, produces: {energy: 1, interval: 20} },
    { name: "textile Mill", icon: "🪵🪚", img: 'images/textilemill.png', cost: 1000, tax: 1000, taxInterval: 30000, requirements: { cement: 2, tools: 2, energy: 2 }, collector: 0 },
    { name: "market", icon: "🛒", img: 'images/market.png', cost: 15000, tax: 2000, taxInterval: 30000, requirements: { steel: 2, cement: 2, tools: 2, energy: 3 }, collector: 0 }
];

class Building {
  constructor({ name, icon, img, cost, tax, taxInterval, requirements, collector, produces }) {
      this.name = name;
      this.icon = icon;
      this.img = img;
      this.cost = cost;
      this.tax = tax;
      this.taxInterval = taxInterval;
      this.requirements = requirements;
      this.collector = collector;
      this.produces = produces;
  }

  getCost() {
      return this.cost * (this.level || 1);
  }

  canAfford(balance, materialsData) {
      if (balance < this.cost) return false;

      return Object.entries(this.requirements).every(([material, qty]) => {
          const resource = materialsData.find((b) => b.name === material);
          return resource && resource.qty >= qty;
      });
  }
}

const newBuildings = buildingsData.map(data => new Building(data));

function purchase(buildingName) {
    const building = newBuildings.find(b => b.name === buildingName);
    if (!building) {
        console.error(`Building "${buildingName}" not found`);
        return;
    }
    
    if (!building.canAfford(balance, materialsData)) {
        console.warn("Not enough resources to purchase");
        return;
    }
    
    for (const [material, qty] of Object.entries(building.requirements)) {
        updateMaterial(material, -qty);
    }
    updateBalance(-building.cost);
    purchased(building);
}

function enableBuilding(buildingName) {
    const btn = document.getElementById(`buy${capitalize(buildingName)}`);
    if (btn) {
        btn.closest(".building-item").style.display = "block";
    }
}

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

newBuildings.forEach(building => {
    const btn = document.createElement('div');
    btn.className = 'building-btn';

    if (building.img) {
        btn.innerHTML = `<img src="${building.img}" alt="${building.name}" class="draggable">`;
    } else {
        btn.textContent = building.icon;
    }

    btn.onclick = () => openCard(building);
    gridContainer.appendChild(btn);
});


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
