// Variables
const { createApp } = Vue;

const app = createApp({
    data() {
        return{
            urlApi: `https://mindhub-xj03.onrender.com/api/amazing`,
            events: [],
            eventsFilter: [],
            checkboxs: [],
            checkboxsFilter: [],
            search: ``,
            time: `past`,
        }
    },
    created(){
        this.getData();
    },
    mounted(){
    },
    methods:{
        getData: async function() {
            try {
                const response = await axios.get(this.urlApi);
                this.filterByDate(response.data.currentDate, response.data.events);
                this.eventsFilter = this.events;
                this.getCategorys(this.events);
                
            } catch (error) {
                const responseJson = await axios.get(`./assets/data/data.json`);
                this.filterByDate(responseJson.data.currentDate, responseJson.data.events);
                this.eventsFilter = this.events;
                this.getCategorys(this.events);
            }
        },
        getCategorys: function(array) {
            this.checkboxs = new Set(array.map(element => element.category));
        },
        filterByDate: function(currentDate, events) {
            let newArray = [];

            if (this.time == "past") {
                newArray = events.filter(item => item.date < currentDate);
            } else {
                newArray = events.filter(item => item.date > currentDate);
            }

            this.events = newArray;
        }
    },
    computed:{
        filterCards: function() {
            let arrayNew = this.events;

            if (this.checkboxsFilter.length > 0) {
                arrayNew = this.events.filter(item => this.checkboxsFilter.includes(item.category));
            }
    
            if (this.search != ``) {
                arrayNew = arrayNew.filter(item => item.name.toLowerCase().includes(this.search.toLowerCase()));
            };
    
            this.eventsFilter = arrayNew;
        },
    }
}).mount('#app');