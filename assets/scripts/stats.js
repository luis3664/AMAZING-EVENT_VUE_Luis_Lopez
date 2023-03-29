// Variables
const { createApp } = Vue;

const app = createApp({
    data() {
        return{
            urlApi: `https://mindhub-xj03.onrender.com/api/amazing`,
            eventsPast: [],
            eventsFuture: [],
            categorys: [],
            statisticsTable: {
                higherPercentage: {},
                lowerPercentage: {},
                largerCapacity: {}
            },
            upcomingTable: [],
            pastTable: []
        }
    },
    created(){
        this.getData();
    },
    methods:{
        getData: async function() {
            try {
                const response = await axios.get(this.urlApi);
                this.filterByDate(response.data.currentDate, response.data.events);
                this.getCategorys(response.data.events);
                this.percentageRow();
                this.upcomingTable = this.eventsRow(this.eventsFuture, `estimate`);
                this.pastTable = this.eventsRow(this.eventsPast, `assistance`);
                
            } catch (error) {
                const responseJson = await axios.get(`./assets/data/data.json`);
                this.filterByDate(responseJson.data.currentDate, responseJson.data.events);
                this.getCategorys(responseJson.data.events);
                this.percentageRow();
                this.upcomingTable = this.eventsRow(this.eventsFuture, `estimate`);
                this.pastTable = this.eventsRow(this.eventsPast, `assistance`);
            }
        },
        getCategorys: function(array) {
            this.categorys = new Set(array.map(item => item.category));
        },
        filterByDate: function(currentDate, events) {

            this.eventsPast = events.filter(item => item.date < currentDate);
            this.eventsFuture = events.filter(item => item.date > currentDate);
        },
        largestToSmallest: function(array, property, relative = false, property2) {

            if (relative) {
                array.map(item => {
                    item.percentage = ((item[property] / item[property2]) * 100).toFixed(2);
                });
        
                array.sort((a, b) => b.percentage - a.percentage);
        
            } else {
                array.sort((a, b) => b[property] - a[property]);
            }
        
            return array;
        },
        percentageRow: function() {
            this.statisticsTable.higherPercentage = (this.largestToSmallest(this.eventsPast, `assistance`, true, `capacity`))[0];
            this.statisticsTable.lowerPercentage = ((this.largestToSmallest(this.eventsPast, `assistance`, true, `capacity`)).reverse())[0];
            this.statisticsTable.largerCapacity = (this.largestToSmallest(this.eventsPast, `capacity`))[0];
        },
        eventsRow: function(array, property) {
            let aux;
            let arrayNew = [];
            
            this.categorys.forEach(category => {
                let item = {};
                aux = array.filter(event => event.category == category);
                item.category = category;

                item.revenues = aux.reduce((accumulator, currentElement) => {
                    return accumulator + (currentElement.price * currentElement[property]);
                }, 0);
        
                item.percentage = aux.reduce((accumulator, customElements) => {
                    return accumulator + ((customElements[property] / customElements.capacity) * 100);
                }, 0);

                item.percentage = (item.percentage / aux.length).toFixed(2);

                arrayNew.push(item);
            })

            return arrayNew;
        }
    },
}).mount('#app');