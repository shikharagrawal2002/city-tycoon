const conversionData = [
    { ingredients: { 'wood': 1 }, product: { 'plank': 1 }}
]


function toggleConversionBox() {
    const box = document.getElementById("conversionBox");
    box.style.display = box.style.display === "none" || box.style.display === "" ? "flex" : "none";
}

function processConversion() {
    const inputSlot = document.getElementById("inputSlot");
    const outputSlot = document.getElementById("outputSlot");
    let result = "";

    if (inputSlot.textContent.includes("Wood")) {
        result = "🏠";
        outputSlot.innerHTML = result + "<span>House</span>";
    } else if (inputSlot.textContent.includes("Stone")) {
        result = "🏰";
        outputSlot.innerHTML = result + "<span>Castle</span>";
    } else if (inputSlot.textContent.includes("Metal")) {
        result = "⚔️";
        outputSlot.innerHTML = result + "<span>Sword</span>";
    } else if (inputSlot.textContent.includes("Gold")) {
        result = "👑";
        outputSlot.innerHTML = result + "<span>Crown</span>";
    } else {
        outputSlot.innerHTML = "❌<span>Invalid</span>";
    }
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function dropResource(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const resource = document.getElementById(data).textContent.split(" ")[0];
    
    // Clear the output slot when a new resource is dropped
    document.getElementById("outputSlot").innerHTML = "";
    
    event.target.innerHTML = resource + "<span>" + data.charAt(0).toUpperCase() + data.slice(1) + "</span>";
}
