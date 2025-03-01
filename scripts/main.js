let balance = 0;

function updateBalance(amount) {
    balance += amount;

    document.getElementById("balance").textContent = `💰 Balance: ₹${convertToINRFormat(balance)}`;
    updateAllButtons();
}

function updateAllButtons() {
    // ✅ Update Buy Buttons (Buildings)
    for (const buildingObj of buildingsData) {
        const building = buildingObj.name;
        const btn = document.getElementById(`buy${capitalize(building)}`);
        const needed = buildingObj.requirements;
        let canBuild = true;

        for (const item in needed) {
            const material = materials.find(m => m.name === item);
            if (!material || material.qty < needed[item]) {
                canBuild = false;
                break;
            }
        }

        if (balance < buildingsData.find(m => m.name === building).cost) {
            canBuild = false;
        }
        btn.disabled = !canBuild;
    }

    document.querySelectorAll(".gather-btn").forEach(button => {
        const materialName = button.querySelector(".badge").id.replace("badge-", "");
        const material = materials.find(m => m.name === materialName);
    
        if (material) {
            button.disabled = balance < material.cost;
        }
    });
    
    updateHireButton(); // Check if the Hire button should be enabled/disabled
    updateUpgradeButtons();
    updateResourceButtons();
    updatePurchasedButtons();
}

function convertToINRFormat(num) {
    if (num >= 10000000) {
        return (num / 10000000).toFixed(2).replace(/\.00$/, '') + 'C'; // Crore
    } else if (num >= 100000) {
        return (num / 100000).toFixed(2).replace(/\.00$/, '') + 'L'; // Lakh
    } else if (num >= 1000) {
        return (num / 1000).toFixed(2).replace(/\.00$/, '') + 'K'; // Thousand
    } else {
        return num.toString(); // Less than 1000, return as is
    }
}

function makeMenuDraggable() {
    const menu = document.getElementById("floatBtn");
    let offsetX, offsetY, isDragging = false;

    menu.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - menu.getBoundingClientRect().left;
        offsetY = e.clientY - menu.getBoundingClientRect().top;
        menu.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        menu.style.left = `${e.clientX - offsetX}px`;
        menu.style.top = `${e.clientY - offsetY}px`;
        menu.style.bottom = "auto"; // Reset bottom so it doesn't interfere
        menu.style.right = "auto";
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        menu.style.cursor = "grab";
    });

    menu.addEventListener("touchstart", (e) => {
        isDragging = true;
        offsetX = e.touches[0].clientX - menu.getBoundingClientRect().left;
        offsetY = e.touches[0].clientY - menu.getBoundingClientRect().top;
    });
    
    document.addEventListener("touchmove", (e) => {
        if (!isDragging) return;
        menu.style.left = `${e.touches[0].clientX - offsetX}px`;
        menu.style.top = `${e.touches[0].clientY - offsetY}px`;
    });
    
    document.addEventListener("touchend", () => {
        isDragging = false;
    });
    
}

// Call function when the page loads
document.addEventListener("DOMContentLoaded", makeMenuDraggable);
