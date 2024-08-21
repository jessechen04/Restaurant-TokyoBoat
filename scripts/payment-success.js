import { cart, getCartFromLocalStorage, fetchCart } from '../data/cart.js';
import { user, fetchCurrentUser, signOut } from '../data/user.js';
import { menu, fetchMenuCategories } from '../data/menu.js';

const TAX_RATE = 0.06;
let orderHTML = '';

fetchMenuCategories()
    .then(() => {
fetchCurrentUser()
    .then(() => {
        if (user === null) {
            getCartFromLocalStorage();
            document.querySelector('.profile-tab').innerHTML = 
                '<a class="sign-in" href="sign-in">Sign in</a>';
            generateSuccessPage();
        } else {
            document.querySelector('.profile-tab').innerHTML = 
                '<a class="sign-in sign-out">Sign out</a>';
            fetchCart().then(() => {
                generateSuccessPage();
            });
        }
        
        document.querySelector('.sign-out').addEventListener('click', () => {
            signOut();
            //edit this later
            window.location.href = window.location.href;
        });
    });
});

function generateSuccessPage() {
    cart.forEach(cartItem => {
        let currentItem;

        menu.forEach(menuCategories => {
            menuCategories.forEach(menuItem => {
                if (menuItem.id === cartItem.itemId) {
                    currentItem = menuItem;
                    return;
                }
            });
        });

        orderHTML += 
            `
            <div class="order-information your-order">
                <div class="content-flex">
                    <div class="order-summary-text">Your Order</div>
                    <div class="purchased-items">
                        <div>
                            <div class="item-name">${currentItem.itemName} </div>
                            <div class="item-quantity">Quantity: ${cartItem.count}</div>
                        </div>
                        <div class="item-price">$${(currentItem.itemPriceCents * cartItem.count / 100).toFixed(2)}</div>
                    </div>
                </div>
            </div>
            `
    });

    document.querySelector('.purchased-order').innerHTML = orderHTML;

    generateOrderSummaryHTML();
}

function generateOrderSummaryHTML() {
    let itemsTotal = 0;
    let tax;
    let orderTotal;

    cart.forEach(cartItem => {
        let currentItem;

        menu.forEach(menuCategories => {
            menuCategories.forEach(menuItem => {
                if (menuItem.id === cartItem.itemId) {
                    currentItem = menuItem;
                    return;
                }
            });
        });

        itemsTotal += parseFloat((currentItem.itemPriceCents / 100) * cartItem.count);
    });

    tax = parseFloat((itemsTotal * TAX_RATE));
    orderTotal = itemsTotal + tax;
    document.querySelector('.order-summary-box').innerHTML = 
        `
        <div class="order-information your-order order-summary">
            <div class="content-flex">
                <div class="order-summary-text">Order Summary</div>
                <div class="item-total-flex"><div>Items Total:</div><div>$${itemsTotal.toFixed(2)}</div></div>
                <div class="tax-flex"><div>Tax:</div><div>$${tax.toFixed(2)}</div></div>
                <div class="order-total-flex"><div>Order Total:</div><div>$${orderTotal.toFixed(2)}</div></div>
            </div>
        </div>
        `

}

console.log(window.location.href);
