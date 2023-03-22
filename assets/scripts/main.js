// Variables
const urlApi = `https://mindhub-xj03.onrender.com/api/amazing`;
let cardsElement = document.getElementById(`cards`);
let card = {
    id: null,
    name: ``,
    image: ``,
    description: ``,
    price: 0,
    element: function() { 
        return `
        <article class="card card-home col-3 mb-4">
            <figure>                    
                <img src="${this.image}" class="card-img-top mt-2 img-fluid" alt="${this.name}">
            </figure>
            <div class="card-body pt-1 d-flex justify-content-center align-items-center flex-column">
                <div class="row align-items-center">
                    <h5 class="text-center card-title">${this.name}</h5>
                    <p class="card-text">${this.description}</p>
                </div>
        
                <div class="card-end d-flex align-items-center mt-4 w-100">
                    <span class="col me-4">Price: ${this.price}$</span>
                    <a href="./details.html?id=${this.id}" class="col btn text-black p-1">Details</a>
                </div>
            </div>
        </article>
    `}
};
let checkboxs = document.getElementById(`checkboxs`);
let checkbox = {
    name: ``,
    element: function(){
        return `
        <label class="d-flex justify-content-evenly align-items-center">
            <input type="checkbox" name="${this.name}" value="${this.name}">
            <span>${this.name}</span>
        </label>
    `}
};
let searcher = document.forms[0];



// Main
main(urlApi, cardsElement, card, checkboxs, checkbox, searcher);

searcher.addEventListener(`submit`, e => e.preventDefault());



// Funtions
async function main(url, container, element, checkboxs, checkbox, searcher) {
    try {
        const promise = await fetch(url);
        let data;

        if (promise.status == 200) {
            data = await promise.json();
        } else {
            const promiseJson = await fetch(`./assets/data/data.json`);
            data = await promiseJson.json();
        }

        let events = (data.events).sort((a, b) => {
            if (a.date > b.date) {
                return -1;
            }
            if (a.date < b.date) {
                return 1;
            }
            return 0;
        });

        bucleOfElement(container, events, element);

        printCheckboxs(checkboxs, events, checkbox);

        searcher.addEventListener(`input`, () => {
            let cardsFilter = filterByForm(events);

            bucleOfElement(container, cardsFilter, element);
        });

    } catch (error) {
        console.log(error);
    }
};

function bucleOfElement(container, arrayData, element) {
    if (arrayData.length > 0) {
        let htmlComplete = arrayData.reduce( (accumulator, currentElement) => {
                    element.id = currentElement[`_id`];
                    element.name = currentElement.name;
                    element.image = currentElement.image;
                    element.description = currentElement.description;
                    element.price = currentElement.price;
            
                    return accumulator += element.element();
        }, ``);
    
        container.innerHTML = htmlComplete;
    } else {
        container.innerHTML = `<article> <h2 class="text-center">Not Found</h2> </article>`;
    }
};

function printCheckboxs(container, arrayData, element) {
    let categorys = new Set(arrayData.map(item => item.category));
    let htmlComplete = ``;

    categorys.forEach(item => {
        element.name = item;

        htmlComplete += element.element();
    })

    container.innerHTML = htmlComplete;
};

function filterByForm(arrayData) {
    let arrayNew = arrayData;

    arrayNew = filterByCheckbox(arrayData);
    arrayNew = filterBySearcher(arrayNew);
    
    return arrayNew;
};

function filterByCheckbox(arrayData) {
    let arrayNew = arrayData;
    let checkboxs = Array.from(document.querySelectorAll(`input[type='checkbox']`));
    let checkboxsChecked = checkboxs.filter(item => item.checked);

    if (checkboxsChecked.length > 0) {
        arrayNew = checkboxsChecked.reduce((accumulator, currentElement) => {
            return accumulator.concat(arrayData.filter(item => currentElement.value == item.category))
        },[]);
    }

    return arrayNew;
};

function filterBySearcher(array) {
    let arrayNew = array;
    let stringFilter = document.querySelector(`input[type='search']`);

    if (stringFilter != ``) {
        arrayNew = arrayNew.filter(item => item.name.toLowerCase().includes(stringFilter.value.toLowerCase()));
    }

    return arrayNew;
};