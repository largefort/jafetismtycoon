let followers = 0;
let faith = 10;  // Start with 10 faith

const buildings = [
    { name: "Shrine", cost: 10, faithPerSecond: 1, count: 0 },
    { name: "Temple", cost: 100, faithPerSecond: 5, count: 0 },
    { name: "Monastery", cost: 500, faithPerSecond: 20, count: 0 },
    { name: "Cathedral", cost: 2000, faithPerSecond: 75, count: 0 },
    { name: "Basilica", cost: 8000, faithPerSecond: 250, count: 0 },
    { name: "Sanctuary", cost: 20000, faithPerSecond: 750, count: 0 },
    { name: "Citadel", cost: 50000, faithPerSecond: 2000, count: 0 },
    { name: "Pantheon", cost: 150000, faithPerSecond: 6000, count: 0 },
    { name: "Divine Palace", cost: 500000, faithPerSecond: 20000, count: 0 },
    { name: "Celestial Monument", cost: 1500000, faithPerSecond: 75000, count: 0 }
];

// Function to update the displayed stats
function updateStats() {
    document.getElementById('followers').innerText = followers;
    document.getElementById('faith').innerText = faith.toFixed(2);
}

// Function to generate faith manually
function generateFaith() {
    faith += 1;  // Flat rate or adjusted by upgrades.
    updateStats();
    saveGame();  // Auto-save after each manual generation
}

// Function to add a building to the game interface
function addBuilding(building) {
    const buildingDiv = document.createElement('div');
    buildingDiv.classList.add('building');
    buildingDiv.innerHTML = `<h3>${building.name}</h3>
                             <p>Cost: ${building.cost.toFixed(2)} Faith</p>
                             <p>Generates: ${building.faithPerSecond} Faith/s</p>
                             <button onclick="buyBuilding('${building.name}')">Buy</button>`;
    document.getElementById('buildings').appendChild(buildingDiv);
}

// Function to buy a building and start generating faith automatically
function buyBuilding(name) {
    const building = buildings.find(b => b.name === name);
    if (faith >= building.cost) {
        faith -= building.cost;
        building.count++;
        building.cost *= 1.15;  // Increase cost after each purchase
        updateStats();
        saveGame();  // Auto-save after purchasing a building
        
        // Start generating faith automatically
        setInterval(() => {
            faith += building.faithPerSecond * building.count;
            updateStats();
        }, 1000);
    }
}

// Function to save the game state to localStorage
function saveGame() {
    const gameState = {
        followers: followers,
        faith: faith,
        buildings: buildings.map(b => ({ ...b }))  // Deep copy to avoid reference issues
    };
    localStorage.setItem('jafetismTycoonSave', JSON.stringify(gameState));
}

// Function to load the game state from localStorage
function loadGame() {
    const savedGame = JSON.parse(localStorage.getItem('jafetismTycoonSave'));
    if (savedGame) {
        followers = savedGame.followers;
        faith = savedGame.faith;
        savedGame.buildings.forEach((savedBuilding, index) => {
            buildings[index].count = savedBuilding.count;
            buildings[index].cost = savedBuilding.cost;
        });
    }
    updateStats();
}

// Function to initialize the game by adding all buildings and setting up event listeners
function initGame() {
    loadGame();  // Load game state on startup
    buildings.forEach(addBuilding);
    updateStats();
    document.getElementById('generateFaith').addEventListener('click', generateFaith);
    
    // Auto-save game state every 10 seconds
    setInterval(saveGame, 10000);
}

// Start the game
initGame();
