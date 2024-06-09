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

export function fetchMenuCategories() {
    return new Promise((resolve, reject) => {
        fetch('http://localhost:5000/menuCategories')
            .then(response => response.json())
            .then(data => {
                menuCategories = data; // Assign the fetched data to the local variable
                console.log('Data assigned to local variable:', menuCategories);
                fetchMenuItems(resolve); // Resolve the promise when data is fetched and assigned
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                reject(error); // Reject the promise if there's an error
            });
    });
}


export let menu = [];

// fetches the database data and stores in menu
function fetchMenuItems(fun) {
    menuCategories.forEach((value) => {
        fetch(`http://localhost:5000/menu/${value.id}`)
            .then(response => response.json())
            .then(data => {
                menu.push(data); // Assign the fetched data to the local variable
                console.log('Data assigned to local variable:', menu);
                fun();
            })
            .catch(error => console.error('Error fetching data:', error));
    });
}
