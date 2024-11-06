// Array of JSON file paths
const jsonFiles = [
    'bottomunderwear1.json', 'bottomunderwear2.json', 'bottomunderwear3.json', 
    'topunderwear1.json', 'topunderwear2.json', 'topunderwear3.json', 
    'boxers1.json', 'boxers2.json', 'boxers3.json',
    'socks1.json', 'socks2.json', 'socks3.json', 
    'shoes1.json', 'shoes2.json', 'shoes3.json', 
    'top1.json', 'top2.json', 'top3.json', 
    'dress1.json', 'dress2.json', 'dress3.json', 
    'pants1.json', 'pants2.json', 'pants3.json', 
    'skirt1.json', 'skirt2.json', 'skirt3.json', 
    'jacket1.json', 'jacket2.json', 'jacket3.json', 
    'accessories1.json', 'accessories2.json', 'accessories3.json',
    'sweatshirt1.json', 'sweatshirt2.json', 'sweatshirt3.json',
    'hat1.json', 'hat2.json', 'hat3.json' // New hat categories
];

// Load each JSON file
async function loadItemFile(file) {
    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`Error loading file: ${file}`);
        return await response.json();
    } catch (error) {
        console.error(`Failed to load ${file}:`, error);
        return [];
    }
}

// Load items in batches to reduce load time and improve responsiveness
async function loadItemsInBatches(batchSize = 5) {
    const baseContainer = document.querySelector('.base-container');
    const controlsContainer = document.querySelector('.controls');
    
    for (let i = 0; i < jsonFiles.length; i += batchSize) {
        const batch = jsonFiles.slice(i, i + batchSize);

        await Promise.all(batch.map(async file => {
            const data = await loadItemFile(file);
            const categoryName = file.replace('.json', '');
            const categoryContainer = document.createElement('div');
            categoryContainer.classList.add('category');

            const categoryHeading = document.createElement('h3');
            categoryHeading.textContent = categoryName;
            categoryContainer.appendChild(categoryHeading);

            data.forEach(item => {
                const itemId = item.id.endsWith('.png') ? item.id : `${item.id}.png`;

                const img = document.createElement('img');
                img.id = itemId;
                img.src = item.src;
                img.alt = item.alt;
                img.classList.add(categoryName);
                img.setAttribute('data-file', file);
                img.style.visibility = item.visibility === "visible" ? "visible" : "hidden";
                baseContainer.appendChild(img);

                const button = document.createElement('img');
                const buttonFile = item.src.replace('.png', 'b.png');
                button.src = buttonFile;
                button.alt = item.alt + ' Button';
                button.classList.add('item-button');
                button.onclick = () => toggleVisibility(itemId, categoryName);
                categoryContainer.appendChild(button);
            });

            controlsContainer.appendChild(categoryContainer);
        }));

        await new Promise(resolve => setTimeout(resolve, 50));
    }
}

// Toggle visibility of item images, ensuring mutually exclusive display with dress items
function toggleVisibility(itemId, categoryName) {
    const categoryItems = document.querySelectorAll(`.${categoryName}`);
    categoryItems.forEach(item => {
        if (item.id !== itemId) {
            item.style.visibility = 'hidden';
        }
    });

    const selectedItem = document.getElementById(itemId);
    selectedItem.style.visibility = selectedItem.style.visibility === 'visible' ? 'hidden' : 'visible';

    if (selectedItem.style.visibility === 'visible' && (categoryName.startsWith('top') || categoryName.startsWith('pants') || categoryName.startsWith('skirt') || categoryName.startsWith('sweatshirt'))) {
        hideCategoryItems('dress');
    } else if (selectedItem.style.visibility === 'visible' && categoryName.startsWith('dress')) {
        hideCategoryItems('top');
        hideCategoryItems('pants');
        hideCategoryItems('skirt');
        hideCategoryItems('sweatshirt');
    }
}

// Helper function to hide all items in a given category
function hideCategoryItems(categoryPrefix) {
    const items = document.querySelectorAll(`[class^="${categoryPrefix}"]`);
    items.forEach(item => {
        item.style.visibility = 'hidden';
    });
}

// Function to enter game mode
function enterGame() {
    document.querySelector('.main-menu').style.display = 'none';
    document.querySelector('.game-container').style.display = 'block';
}
// Initialize items on page load
window.onload = () => {
    loadItemsInBatches();
};

// Adjust canvas size dynamically on window resize for responsive design
window.addEventListener('resize', adjustCanvasLayout);

function adjustCanvasLayout() {
    const baseContainer = document.querySelector('.base-container');
    const controlsContainer = document.querySelector('.controls');

    if (window.innerWidth < 600) {
        baseContainer.style.width = '90vw';
    } else if (window.innerWidth < 1024) {
        baseContainer.style.width = '70vw';
    } else {
        baseContainer.style.width = '50vw';
    }

    // Ensure controls stay below the canvas
    controlsContainer.style.marginTop = '20px';
}

// Initialize items on page load
window.onload = () => {
    loadItemsInBatches();
};

// Adjust canvas size dynamically on window resize for responsive design
window.addEventListener('resize', adjustCanvasLayout);

function adjustCanvasLayout() {
    const baseContainer = document.querySelector('.base-container');
    const controlsContainer = document.querySelector('.controls');

    if (window.innerWidth < 600) {
        baseContainer.style.width = '90vw';
    } else if (window.innerWidth < 1024) {
        baseContainer.style.width = '70vw';
    } else {
        baseContainer.style.width = '50vw';
    }

    // Ensure controls stay below the canvas
    controlsContainer.style.marginTop = '20px';
}

// Initial adjustment on page load
window.onload = () => {
    loadItemsInBatches();
    adjustCanvasLayout(); // Apply layout adjustment on load
};
