const purchasedData = [];

function purchased(building) {
    purchasedData.push({name: building.name});
    addBuildingToGrid(building);
}

// Function to add a building to the purchased grid
function addBuildingToGrid(building) {
    const purchasedGrid = document.getElementById("purchasedGrid");
    const buildingElement = document.createElement("div");
    buildingElement.classList.add("purchased-building");
    buildingElement.innerHTML = building.icon;
    purchasedGrid.appendChild(buildingElement);
}
