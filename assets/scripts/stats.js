// Variables
const urlApi = `https://mindhub-xj03.onrender.com/api/amazing`;
let pastEvent = [];
let upcomingEvent = [];
let table = document.querySelectorAll(`tbody`);



// Main
main(urlApi, pastEvent, upcomingEvent, table);



// Funtions
async function main(url, pastArray, upcomingArray, containers) {
    try {
        const promise = await fetch(url);
        let data;

        if (promise.status == 200) {
            data = await promise.json();
        } else {
            const promiseJson = await fetch(`./assets/data/data.json`);
            data = await promiseJson.json();
        }

        pastArray = filterByDate(data.currentDate, data.events, `past`);
        upcomingArray = filterByDate(data.currentDate, data.events, `future`);

        printPercentageRow(containers[0], pastArray);

        printEventsRows(containers[1], upcomingArray, `estimate`);
        
        printEventsRows(containers[2], pastArray, `assistance`);

    } catch (error) {
        console.log(error);
    }
};

function filterByDate(currentDate, arrayData, time) {
    let newArray = [];

    if (time == "past") {
        newArray = arrayData.filter(item => item.date < currentDate);
    } else {
        newArray = arrayData.filter(item => item.date > currentDate);
    }

    return newArray;
};

function largestToSmallest(array, property, relative = false, property2) {

    if (relative) {
        array.map(item => {
            item.percentage = (item[property] / item[property2]) * 100;
        });

        array.sort((a, b) => b.percentage - a.percentage);

    } else {
        array.sort((a, b) => b[property] - a[property]);
    }

    return array;
};

function printPercentageRow(container, array) {

    let higherPercentage = (largestToSmallest(array, `assistance`, true, `capacity`))[0];
    let lowerPercentage = ((largestToSmallest(array, `assistance`, true, `capacity`)).reverse())[0];
    let largerCapacity = (largestToSmallest(array, `capacity`))[0];

    container.innerHTML = `
        <tr>
            <td>${higherPercentage.name} (${higherPercentage.percentage.toFixed(2)})</td>
            <td>${lowerPercentage.name} (${lowerPercentage.percentage.toFixed(2)})</td>
            <td>${largerCapacity.name} (${largerCapacity.capacity})</td>
        </tr>
    `;
};

function printEventsRows(container, array, property) {
    let htmlComplete = ``;
    let element = {
        category: ``,
        revenues: 0,
        percentage: 0,
        element: function() {
            return `
                <tr>
                    <td>${this.category}</td>
                    <td>${this.revenues}$</td>
                    <td>${this.percentage.toFixed(2)}%</td>
                </tr>
            `
        }
    };
    let categorys = Array.from(new Set(array.map(item => item.category)));
    let aux;

    categorys.sort();
    
    categorys.forEach(item => {
        aux = array.filter(object => object.category == item);

        element.category = item;

        element.revenues = aux.reduce((accumulator, currentElement) => {
            return accumulator + (currentElement.price * currentElement[property]);
        }, 0);

        element.percentage = aux.reduce((accumulator, customElements) => {
            return accumulator + ((customElements[property] / customElements.capacity) * 100)
        }, 0);

        element.percentage = element.percentage / aux.length;

        htmlComplete += element.element();
    });

    container.innerHTML = htmlComplete;
};