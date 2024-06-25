export let user;

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
            num++;
    });
}