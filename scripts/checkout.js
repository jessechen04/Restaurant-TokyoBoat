import { cart, countCart, removeFromCart, removeFromCartDatabase, getCartFromLocalStorage, saveCartToLocalStorage, fetchCart, editCart, editCartDatabase } from '../data/cart.js';
import { menu, fetchMenuCategories, menuCategories } from '../data/menu.js';
import { user, fetchCurrentUser } from '../data/user.js';

const TAX_RATE = 0.06;

fetchMenuCategories()
    .then(() => {
        fetchCurrentUser().then(() => {
            if (user === null) {
                getCartFromLocalStorage();
                //console.log(cart);
                generateCheckoutPage();
                document.querySelector('.cart-count').innerHTML = countCart();
            } else {

                fetchCart().then(() => {
                    generateCheckoutPage();
                    document.querySelector('.cart-count').innerHTML = countCart();
                });
            }
        });
});

function generateCheckoutPage() {
    generateYourBagHTML();
    generateOrderSummaryHTML();
}

function generateYourBagHTML() {
    let yourBagHTML = '';

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

        yourBagHTML += 
            `
            <div class="bag-item">
                <div class="item-name">${currentItem.itemName}</div>
                <div class="item-price">$${(currentItem.itemPriceCents / 100).toFixed(2)}</div>
                <div class="item-quantity">Quantity:
                    <div class="quantity-selector" data-item-id="${currentItem.id}" data-count="${cartItem.count}">
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
                    <div class="remove-item" data-item-id="${cartItem.itemId}">Remove</div>
                </div>
            </div>
            `
    });

    document.querySelector('.your-bag-items').innerHTML = yourBagHTML;

    document.querySelectorAll('.quantity-selector').forEach(bagItem => {
        const itemId = parseInt(bagItem.dataset.itemId);
        let count = parseInt(bagItem.dataset.count);

        bagItem.children[0].value = count;

        bagItem.addEventListener('change', () => {
            //console.log(cart);
            
            count = parseInt(bagItem.children[0].value);
            editCart(itemId, count);

            if (user === null) {
                saveCartToLocalStorage();
            } else {
                editCartDatabase(user.id, itemId, count);
            }

            document.querySelector('.cart-count').innerHTML = countCart();
            generateOrderSummaryHTML();

            //console.log(cart);
        });
    });

    document.querySelectorAll('.remove-item').forEach(element => {
        element.addEventListener('click', () => {
            const itemId = parseInt(element.dataset.itemId);
            removeFromCart(itemId);
            //console.log(itemId);
            //console.log(cart);
            saveCartToLocalStorage();
            if (user === null) {
                saveCartToLocalStorage();
            } else {
                removeFromCartDatabase(user.id, itemId);
            }
            
            generateCheckoutPage();
            document.querySelector('.cart-count').innerHTML = countCart();
        });
    });
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
        <div class="order-summary-text">Order Summary</div>
        <div class="item-total-flex"><div>Items Total:</div><div>$${itemsTotal.toFixed(2)}</div></div>
        <div class="tax-flex"><div>Tax:</div><div>$${tax.toFixed(2)}</div></div>
        <div class="order-total-flex"><div>Order Total:</div><div>$${orderTotal.toFixed(2)}</div></div>
        <button class="place-order-button">
            <a class="place-order-text">Place Your Order</a>
        </button>
        `

    document.querySelector('.place-order-button').addEventListener('click', () => {
        fetch('/place-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cart: cart })
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            return response.json().then(json => Promise.reject(json));
        })
        .then(({ url }) => {
            //console.log(url);
            window.location = url;
        })
        .catch(error => {
            console.error(error);
        });
    });
}