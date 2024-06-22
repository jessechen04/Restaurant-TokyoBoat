export let cart = [];

export function addToCart(itemId, count) {
    let cartItem;

    cart.forEach(element => {
        if (element.id === itemId) {
            cartItem = element;
        }
    });

    if (cartItem) {
        cartItem.count += count;
    } else {
        cart.push({
            id: itemId,
            count: count
        });
    }
}

export function removeFromCart(id) {
    cart = cart.filter(cartItem => {
        return cartItem.id !== id;
    });
}

export function editCart() {

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