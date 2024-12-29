/*
This part is for more dynamic styling of HTML items

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            entry.target.classList.remove('show');
        }
    });
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((element) => {
    observer.observe(element);
});

*/

/* Below is for if i want to use google cloud api key to render my map
console.log("home")
fetch('/map')
    .then(response => response.json())
    .then(data => {
        const iframe = document.getElementById('map'); // Get the existing iframe
        iframe.src = data.url; // Set the source URL dynamically
    })
    .catch(error => console.error('Error fetching the map URL:', error));
*/