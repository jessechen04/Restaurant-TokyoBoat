export let menu;

// fetches the database data and stores in menu
fetch('http://localhost:5000/menu')
            .then(response => response.json())
            .then(data => {
                menu = data; // Assign the fetched data to the local variable
                console.log('Data assigned to local variable:', menu);
            })
            .catch(error => console.error('Error fetching data:', error));

export let menuCategories;

/*export function loadMenuCategories(fun) {
    fetch('http://localhost:5000/menuCategories')
                .then(response => response.json())
                .then(data => {
                    menuCategories = data; // Assign the fetched data to the local variable
                    console.log('Data assigned to local variable:', menuCategories);
                })
                .catch(error => {
                    console.error('Error fetching data:', error)
                });
    fun();
}*/

export function loadMenuCategories() {
    return new Promise((resolve, reject) => {
        fetch('http://localhost:5000/menuCategories')
            .then(response => response.json())
            .then(data => {
                menuCategories = data; // Assign the fetched data to the local variable
                console.log('Data assigned to local variable:', menuCategories);
                resolve(); // Resolve the promise when data is fetched and assigned
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                reject(error); // Reject the promise if there's an error
            });
    });
}