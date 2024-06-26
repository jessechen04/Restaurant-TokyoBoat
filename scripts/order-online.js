import {menu, menuCategories, fetchMenuCategories} from "../data/menu.js";
import {cart, addToCart, countCart, saveCartToLocalStorage, getCartFromLocalStorage, addToCartDatabase} from "../data/cart.js";
import {user, fetchCurrentUser, signOut} from '../data/user.js';

getCartFromLocalStorage();

fetchCurrentUser()
    .then(() => {
        if (user !== null) {
            document.querySelector('.profile-tab').innerHTML = 
                '<a href="order-online" class="sign-out">Sign out</a>';
        } else {
            document.querySelector('.profile-tab').innerHTML = 
                '<a href="sign-in">Sign in</a>';
        }
    });

let navigationHTML = '';
let categoriesHTML = '';
let menuItemsHTML = '';
let menuItemPopupHTML = '';

//completes the promise and loads navigation bar
fetchMenuCategories()
    .then(() => {
        generateNavigationBar();
        generateMenuCategories();
        generateMenuItems();
        document.querySelector('.cart-count').innerHTML = countCart();

        document.querySelector('.sign-out').addEventListener('click', () => {
            signOut();
        });
    })
    .catch(error => {
        console.error(error);
    }).finally(() => {
        generateMenuItemsPopup();
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
            <div class="menu-item" data-item-category="${menuItem.itemCategory}" data-item-id="${menuItem.id}">
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

function generateMenuItemsPopup() {
    document.querySelectorAll('.menu-item').forEach((element) => {
        //const itemCategory = element.dataset.itemCategory;
        element.addEventListener('click', () => {
            const itemId = parseInt(element.dataset.itemId);
            const itemName = element.children[0].innerHTML;
            const itemPrice = element.children[1].innerHTML;
            const itemDescription = element.children[2].innerHTML;

            menuItemPopupHTML = 
            `
            <div class="menu-item-popup">
                <div class="exit">x</div>
                <div>${itemName}</div>
                <div>${itemPrice}</div>
                <div>${itemDescription}</div>
                <div class="quantity-selector-${itemId}">
                    <select>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                    </select>
                </div>
                <div class="add-to-order">
                    <button class="add-to-order-button">Add To Order</button>
                </div>
            </div>
            `

            document.querySelector('.popup').innerHTML = menuItemPopupHTML;
            toggleItemPopup();

            document.querySelector('.exit').addEventListener('click', () => {
                closeItemPopup();
            });

            document.querySelector('.add-to-order-button').addEventListener('click', () => {
                const count = parseInt(document.querySelector(`.quantity-selector-${itemId}`).children[0].value);

                addToCart(itemId, count);
                
                if (user === null) {
                    saveCartToLocalStorage();
                } else {
                    addToCartDatabase(user.id, itemId, count);
                }

                document.querySelector('.cart-count').innerHTML = countCart();
            });

        });
    });
}

function toggleItemPopup() {
    let fixedContent = document.querySelector('.popup');
    if (fixedContent.style.display === "none") {
        fixedContent.style.display = "block";
    } else {
        fixedContent.style.display = "none";
    }
}

function closeItemPopup() {
    let fixedContent = document.querySelector('.popup');
    if (fixedContent.style.display === "block") {
        fixedContent.style.display = "none";
    }
}