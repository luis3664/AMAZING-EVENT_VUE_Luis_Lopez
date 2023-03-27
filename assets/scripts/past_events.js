// Variables
const { createApp } = Vue;

createApp({
    data() {
        return{
            urlApi: `https://mindhub-xj03.onrender.com/api/amazing`,
            data: {},
            events: [],
            eventsFilter: [],
            checkboxs: [],
            search: ``,
            time: `past`,
        }
    },
    async mounted(){
        try {
            const response = await axios.get(this.urlApi);
            this.data = response.data;

            this.filterByDate();

            this.checkboxs = new Set(this.eventsFilter.map(item => item.category));

        } catch (error) {
            const responseJson = await axios.get(`./assets/data/data.json`);
            this.data = responseJson.data;

            this.filterByDate();

            this.checkboxs = new Set(this.eventsFilter.map(item => item.category));
        }
    },
    methods:{
        filterByCheckbox: function() {
            let arrayNew = this.events;
            let checkboxs = Array.from(document.querySelectorAll(`input[type='checkbox']`));
            let checkboxsChecked = checkboxs.filter(item => item.checked);
    
            if (checkboxsChecked.length > 0) {
                arrayNew = checkboxsChecked.reduce((accumulator, currentElement) => {
                    return accumulator.concat(this.events.filter(item => currentElement.value == item.category))
                },[]);
            }
    
            this.eventsFilter = arrayNew;
        },
        filterBySearcher: function() {
            let arrayNew = this.eventsFilter;

            if (this.search != ``) {
                arrayNew = arrayNew.filter(item => item.name.toLowerCase().includes(this.search.toLowerCase()));
            };
    
            this.eventsFilter = arrayNew;
        },
        filterByDate: function() {
            let newArray = [];

            if (this.time == "past") {
                newArray = this.data.events.filter(item => item.date < this.data.currentDate);
            } else {
                newArray = this.data.events.filter(item => item.date > this.data.currentDate);
            }

            // Los ordeno por relevancia segun la fecha
            let sortArray = (newArray).sort((a, b) => {
                if (a.date > b.date) {
                    return -1;
                }
                if (a.date < b.date) {
                    return 1;
                }
                return 0;
            });

            this.events = sortArray;
            this.eventsFilter = this.events;
        }
    }
}).mount('#app');