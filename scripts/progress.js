let currentStage = 1;

const progressionStages = [
    { id: 1, condition: () => balance >= 20000, goal: "Earn ₹20,000", unlocks: ['factory'] },
    { id: 2, condition: () => balance >= 30000, goal: "Earn ₹40,000", unlocks: ['sawmill'] },
    { id: 3, condition: () => balance >= 40000, goal: "Earn ₹40,000", unlocks: ['market'] },
];


function checkProgression() {
    progressionStages.forEach(stage => {
        if (!stage.completed && stage.condition()) {
            stage.completed = true;
            currentStage = stage.id;
            applyUnlocks(stage.unlocks);
            // alert(`🎉 Stage ${stage.id} unlocked!`);
            updateProgressTab();
        }
    });
}

function updateProgressTab() {
    document.getElementById("currentStage").textContent = currentStage;

    const nextStage = progressionStages.find(stage => !stage.completed);
    if (nextStage) {
        document.getElementById("nextGoal").textContent = getStageGoalText(nextStage);
        document.getElementById("nextUnlocks").textContent = nextStage.unlocks.join(', ');
    } else {
        document.getElementById("nextGoal").textContent = "All stages complete!";
        document.getElementById("nextUnlocks").textContent = "🎉 Enjoy the game!";
    }
}

function getStageGoalText(stage) {
    return stage.goal || "Unknown Goal";
}


function applyUnlocks(unlocks) {
    unlocks.forEach(item => {
        if (item === 'factory') enableBuilding('factory');
        if (item === 'sawmill') enableBuilding('sawmill');
        if (item === 'market') enableBuilding('market');
        if (item === 'energy') enableResource('energy');
        // if (item.startsWith('workerCap')) workersCap += parseInt(item.split('+')[1]);
    });
}
