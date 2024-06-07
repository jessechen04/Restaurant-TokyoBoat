export let menu;

fetch('http://localhost:5000/menu')
            .then(response => response.json())
            .then(data => {
                menu = data; // Assign the fetched data to the local variable
                console.log('Data assigned to local variable:', menu);
            })
            .catch(error => console.error('Error fetching data:', error));