import {cart, getCartFromLocalStorage} from '../data/cart.js';
import {menu, fetchMenuCategories, menuCategories} from '../data/menu.js';

getCartFromLocalStorage();

let yourBagHTML = '';

console.log(cart);
fetchMenuCategories()
    .then(() => {
        
        console.log(menu);

        cart.forEach(cartItem => {
            let currentItem;

            menu.forEach(menuCategories => {
                menuCategories.forEach(menuItem => {
                    if (menuItem.id === cartItem.id) {
                        currentItem = menuItem;
                        return;
                    }
                });
            });

            yourBagHTML += 
            `
            <div class="bag-item">
                <div class="item-name">${currentItem.itemName}</div>
                <div class="item-price">${(currentItem.itemPriceCents / 100).toFixed(2)}</div>
                <div class="item-quantity">Quantity: ${cartItem.count} <div class="remove-item">Remove</div></div>
            </div>
            `
        });

        document.querySelector('.your-bag-items').innerHTML = yourBagHTML;

        //document.querySelector('.remove-item').addEventListener('click', () => {

        //});
});