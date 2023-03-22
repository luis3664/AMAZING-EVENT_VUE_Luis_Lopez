const params = new URLSearchParams(document.location.search);
const eventId = params.get(`id`);
const urlApi = `https://mindhub-xj03.onrender.com/api/amazing`;
const title = document.querySelector(`title`);
let containerElement = document.getElementById(`main-details`);



// Main
main(urlApi, eventId, containerElement, title);


// Functions
async function main(url, id, container, titleNav) {
    try {
        const promise = await fetch(url);
        let data;

        if (promise.status == 200) {
            data = await promise.json();
        } else {
            const promiseJson = await fetch(`./assets/data/data.json`);
            data = await promiseJson.json();
        }

        const eventCard = data.events.find(item => item[`_id`] == id);
        let time = eventCard.date > data.currentDate;

        printDetails(container, eventCard, time, titleNav);

    } catch (error) {
        console.log(error);
    }
}

function printDetails(container, card, time, titleNav) {
    if (card != undefined) {
        titleNav.textContent = card.name;
    
        if (time) {
            container.innerHTML = `
                <article class="d-flex px-4 justify-content-center align-items-center flex-column flex-lg-row" id="card-details">
                    <figure class="col-lg-5 col-12" id="figure">
                        <img class="h-100 w-100" src="${card.image}" alt="Food">
                    </figure>
            
                    <div class="col-lg-5 col-12 p-4 d-flex flex-column justify-content-center" id="detailsText">
                        <h5>${card.name}</h5>
                        <p>${card.description} The event will be in ${card.place} and will have a capacity of ${card.capacity} people.</p>
                        <p>The cost per person would be ${card.price}$ and the date is ${card.date}. For more information <a href="./contact.html">contact us.</a></p>
                    </div>
                </article>
            `;
        } else {
            container.innerHTML = `
                <article class="d-flex px-4 justify-content-center align-items-center flex-column flex-lg-row" id="card-details">
                    <figure class="col-lg-5 col-12" id="figure">
                        <img class="h-100 w-100" src="${card.image}" alt="Food">
                    </figure>
            
                    <div class="col-lg-5 col-12 p-4 d-flex flex-column justify-content-center" id="detailsText">
                        <h5>${card.name}</h5>
                        <p>${card.description} The event was in ${card.place} and had an assist of ${card.assistance} people.</p>
                        <p>The cost per person was ${card.price}$ and the date was ${card.date}. For more information <a href="./contact.html">contact us.</a></p>
                    </div>
                </article>
            `;
        }
    } else {
        container.innerHTML = `<article> <h2 class="text-center">Not Found</h2> </article>`;
    }
}