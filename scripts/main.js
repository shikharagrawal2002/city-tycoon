let balance = 0;

function updateBalance(amount) {
    balance += amount;

    document.getElementById("balance").textContent = `💰 Balance: ₹${balance}`;
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
    
    // ✅ Update Gather Buttons (Materials)
    // document.querySelectorAll(".gather-btn").forEach(button => {
    //     // const materialName = button.closest(".material").querySelector(".qty").textContent
    //     const materialName = button.closest(".resource").querySelector(".qty").id;
    //     const material = materials.find(m => m.name === materialName);
        
    //     if (material) {
    //         button.disabled = balance < material.cost;
    //     }
    // });

    updateHireButton(); // Check if the Hire button should be enabled/disabled
    updateUpgradeButtons();

    updatePurchasedButtons();
}