export let cart = [];

export function addToCart(itemId) {
    let cartItem;

    cart.forEach(element => {
        if (element.id === itemId) {
            cartItem = element;
        }
    });

    if (cartItem) {
        cartItem.count++;
    } else {
        cart.push({
            id: itemId,
            count: 1
        });
    }
}

export function countCart() {
    let count = 0;
    cart.forEach(element => {
        count += element.count;
    });
    
    return count;
}

export function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function getCartFromLocalStorage() {
    cart = JSON.parse(localStorage.getItem('cart'));
}