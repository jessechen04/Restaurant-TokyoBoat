export let cart = null;

export function addToCart(itemId, count) {
    let cartItem;

    cart.forEach(element => {
        if (element.itemId === itemId) {
    
            cartItem = element;
        }
    });

    if (cartItem) {
        cartItem.count += count;
    } else {
        cart.push({
            itemId: itemId,
            count: count
        });
        
    }
}

export function removeFromCart(itemId) {
    cart = cart.filter(cartItem => {
        return cartItem.itemId !== itemId;
    });
    //console.log(cart);
}

export function editCart(itemId, count) {
    let cartItem;

    cart.forEach(element => {
        if (element.itemId === itemId) {
    
            cartItem = element;
        }
    });

    cartItem.count = count;
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




export function fetchCart() {
    return new Promise((resolve, reject) => {
        fetch('http://localhost:5000/getCart')
        .then(response => response.json())
            .then(data => {
                cart = data;
                //console.log(cart);
                resolve();
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                reject(error); // Reject the promise if there's an error
            });
    })
}

export function addToCartDatabase(userId, itemId, count) {
    fetch('/addToCart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({userId: userId, itemId: itemId, count: count})
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error(error);
    });
}

export function removeFromCartDatabase(userId, itemId) {
    fetch('/removeFromCart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({userId: userId, itemId: itemId})
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error(error);
    });
}

export function editCartDatabase(userId, itemId, count) {
    fetch('/editCart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({userId: userId, itemId: itemId, count: count})
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error(error);
    });
}