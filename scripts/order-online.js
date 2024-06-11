import {menu, menuCategories, fetchMenuCategories} from "../data/menu.js";

let navigationHTML = '';
let categoriesHTML = '';
let menuItemsHTML = '';
let menuItemPopupHTML = '';

//completes the promise and loads navigation bar
fetchMenuCategories()
    .then(() => {
        //generateNavigationBar();
        generateMenuCategories();
        generateMenuItems();
    })
    .catch(error => {
        console.error(error);
    }).finally(() => {
        document.querySelectorAll('.menu-item').forEach((element) => {
            //const itemCategory = element.dataset.itemCategory;
            //console.log(itemCategory);
            element.addEventListener('click', () => {
                menuItemPopupHTML = 
                `
                <div class="menu-item-popup">

                </div>
                `

                document.querySelector('.popup').innerHTML = menuItemPopupHTML;
                toggleFixedContent();
            });
        });
    }).catch(error => {
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
            <div class="menu-item" data-item-category="${menuItem.itemCategory}">
                <div class="item-name">${menuItem.itemName}</div>
                <div class="item-price">$${(menuItem.itemPriceCents / 100).toFixed(2)}</div>
                <div class="item-description">${menuItem.itemDescription}</div>
            </div>
            `
        });
        document.getElementById(`${element[0].itemCategory}-section`).innerHTML = menuItemsHTML;
        menuItemsHTML = '';
    });
}

function toggleFixedContent() {
    var fixedContent = document.querySelector('.popup');
    if (fixedContent.style.display === "none") {
        fixedContent.style.display = "block";
    } else {
        fixedContent.style.display = "none";
    }
}