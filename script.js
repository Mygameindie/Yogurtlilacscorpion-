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
                // Ensure ID ends with .png for consistency
                const itemId = item.id.endsWith('.png') ? item.id : `${item.id}.png`;
                console.log(`Creating image with ID: ${itemId}`); // Debugging line

                // Create item image
                const img = document.createElement('img');
                img.id = itemId;
                img.src = item.src;
                img.alt = item.alt;
                img.classList.add(categoryName);
                img.setAttribute('data-file', file); // Attach file name for easy access
                
                // Set initial visibility based on the item's visibility property
                img.style.visibility = item.visibility === "visible" ? "visible" : "hidden";
                baseContainer.appendChild(img);

                // Create corresponding button with "b" in the filename
                const button = document.createElement('img');
                const buttonFile = item.src.replace('.png', 'b.png'); // Append 'b' for button filename
                button.src = buttonFile;
                button.alt = item.alt + ' Button';
                button.classList.add('item-button');
                button.onclick = () => toggleVisibility(itemId, categoryName);
                categoryContainer.appendChild(button);
            });

            // Append category container to controls in the desired order
            controlsContainer.appendChild(categoryContainer);
        }));

        // Wait briefly before loading the next batch to keep UI responsive
        await new Promise(resolve => setTimeout(resolve, 50));
    }
}

// Function to toggle visibility of item images, ensuring mutually exclusive display with dress items
function toggleVisibility(itemId, categoryName) {
    console.log(`Toggling visibility for: ${itemId} in category ${categoryName}`); // Debugging line

    // Hide all other items in the same category to prevent stacking
    const categoryItems = document.querySelectorAll(`.${categoryName}`);
    categoryItems.forEach(item => {
        if (item.id !== itemId) {
            item.style.visibility = 'hidden';
        }
    });

    // Get the selected item and toggle its visibility
    const selectedItem = document.getElementById(itemId);
    const isCurrentlyVisible = selectedItem.style.visibility === 'visible';
    selectedItem.style.visibility = isCurrentlyVisible ? 'hidden' : 'visible';

    // If the category is top, pants, skirt, or sweatshirt, hide all dress items
    if (!isCurrentlyVisible && (categoryName.startsWith('top') || categoryName.startsWith('pants') || categoryName.startsWith('skirt') || categoryName.startsWith('sweatshirt'))) {
        console.log(`Hiding all dress items because ${categoryName} item was made visible`);
        hideCategoryItems('dress');
    }
    // If the category is dress, hide all top, pants, skirt, and sweatshirt items
    else if (!isCurrentlyVisible && categoryName.startsWith('dress')) {
        console.log(`Hiding all top, pants, skirt, and sweatshirt items because a dress item was made visible`);
        hideCategoryItems('top');
        hideCategoryItems('pants');
        hideCategoryItems('skirt');
        hideCategoryItems('sweatshirt');
    }
}

// Helper function to hide all items in a given category
function hideCategoryItems(categoryPrefix) {
    console.log(`Hiding all items in category: ${categoryPrefix}`); // Debugging line
    const items = document.querySelectorAll(`[class^="${categoryPrefix}"]`); // Selects all items whose class starts with the category prefix
    items.forEach(item => {
        console.log(`Hiding item with ID: ${item.id}`); // Debugging line
        item.style.visibility = 'hidden';
    });
}

// Function to enter game mode
function enterGame() {
    document.querySelector('.main-menu').style.display = 'none';
    document.querySelector('.game-container').style.display = 'block';
}

// Call the function to load items in batches when the page loads
window.onload = () => loadItemsInBatches();