import {menu, menuCategories, fetchMenuCategories} from "../data/menu.js";

let navigationHTML = '';
let categoriesHTML = '';
let menuItemsHTML = '';

//completes the promise and loads navigation bar

/*new Promise((resolve) => {
    loadMenuCategories(() => {
        resolve();
    });
}).then(() => {
    generateNavigationBar();
});*/

fetchMenuCategories()
    .then(() => {
        generateNavigationBar();
        generateMenuCategories();
        generateMenuItems();
    })
    .catch(error => {
        console.error(error);
    });


function generateNavigationBar() {
    menuCategories.forEach(element => {
        navigationHTML += 
        `
        <div class="category-flex"><a href="#${element.category}">${element.category}</a></div>
        `
    });

    document.querySelector('.navigation-bar').innerHTML = navigationHTML;
}

function generateMenuCategories() {
    menuCategories.forEach(element => {
        categoriesHTML += 
        `
        <div id="${element.category}" class="menu-section">
            <div class="section-title">${element.category}</div>
            <div class="section-grid" id="${element.category}-section">
                
            </div>
        </div>
        `
    });

    document.querySelector('.menu').innerHTML = categoriesHTML;
}

function generateMenuItems() {
    menu.forEach((element) => {
        element.forEach((menuItem) => {
            menuItemsHTML += 
            `
            <div class="menu-item">
                <div class="item-name">${menuItem.itemName}</div>
                <div class="item-price">$${(menuItem.itemPriceCents / 100).toFixed(2)}</div>
                <div class="item-description">${menuItem.itemDescription}</div>

                <div class="item-image"></div>
            </div>
            `
        });
        document.getElementById(`${element[0].itemCategory}-section`).innerHTML = menuItemsHTML;
        menuItemsHTML = '';
    });
}