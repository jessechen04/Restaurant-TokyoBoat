import {cart, getCartFromLocalStorage} from '../data/cart.js';
import {menu, fetchMenuCategories, menuCategories} from '../data/menu.js';

const TAX_RATE = 0.06;

getCartFromLocalStorage();

let yourBagHTML = '';

console.log(cart);
fetchMenuCategories()
    .then(() => {
        
        let itemsTotal = 0;
        let tax;
        let orderTotal;

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
                <div class="item-quantity">Quantity: ${cartItem.count} 
                    <div class="edit-item">Edit</div> 
                    <div class="remove-item">Remove</div>
                </div>
            </div>
            `

            itemsTotal += parseFloat((currentItem.itemPriceCents / 100));

        });

        document.querySelector('.your-bag-items').innerHTML = yourBagHTML;

        tax = parseFloat((itemsTotal * TAX_RATE));
        orderTotal = itemsTotal + tax;
        document.querySelector('.order-summary-box').innerHTML = 
        `
        <div class="order-summary-text">Order Summary</div>
        <div class="item-total-flex"><div>Items Total:</div><div>$${itemsTotal.toFixed(2)}</div></div>
        <div class="tax-flex"><div>Tax:</div><div>$${tax.toFixed(2)}</div></div>
        <div class="order-total-flex"><div>Order Total:</div><div>$${orderTotal.toFixed(2)}</div></div>
        <button class="place-order-button">
            <a class="place-order-text">Place Your Order</a>
        </button>
        `

        //document.querySelector('.remove-item').addEventListener('click', () => {

        //});
});