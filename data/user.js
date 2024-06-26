export let user = null;

export function fetchCurrentUser() {
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:5000/user-info`)
            .then(response => response.json())
            .then(data => {
                user = data;
                console.log(user);
                resolve();
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                reject(error);
            });
    });
}

export function signOut() {
    fetch('/signout', {
        method: 'POST',
        credentials: 'same-origin', // include cookies
    })
    .then(response => response.json())
    .then(data => {
        user = null;
        console.log(data.message); // Optional: handle response
        // Redirect or update UI as needed
    })
    .catch(error => {
        console.error('Error signing out:', error);
        // Handle error
    });
    
}
