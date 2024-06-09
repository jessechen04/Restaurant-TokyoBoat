import {menu, menuCategories, loadMenuCategories} from "../data/menu.js";

let navigationHTML = '';

function generateNavigationBar() {
    menuCategories.forEach(element => {
        navigationHTML += 
        `
        <div class="category-flex"><a href="#${element.category}">${element.category}</a></div>
        `
    });

    document.querySelector('.navigation-bar').innerHTML = navigationHTML;
}

/*new Promise((resolve) => {
    loadMenuCategories(() => {
        resolve();
    });
}).then(() => {
    generateNavigationBar();
});*/

loadMenuCategories()
    .then(() => {
        generateNavigationBar();
    })
    .catch(error => {
        console.error('Error loading menu categories:', error);
    });