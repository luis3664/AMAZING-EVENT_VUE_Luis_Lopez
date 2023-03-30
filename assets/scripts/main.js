// Variables
const { createApp } = Vue;

const app = createApp({
    data() {
        return{
            urlApi: `https://mindhub-xj03.onrender.com/api/amazing`,
            events: [],
            eventsDb: [],
            checkboxs: [],
            checkboxsFilter: [],
            search: ``,
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
                this.events = response.data.events;
                this.eventsDb = response.data.events;
                this.getCategorys(this.events);
                
            } catch (error) {
                const responseJson = await axios.get(`./assets/data/data.json`);
                this.events = responseJson.data.events;
                this.eventsDb = responseJson.data.events;
                this.getCategorys(this.events);
            }
        },
        getCategorys: function(array) {
            this.checkboxs = new Set(array.map(element => element.category));
        }
    },
    computed:{
        filterCards: function() {
            let arrayNew = this.eventsDb;

            if (this.checkboxsFilter.length > 0) {
                arrayNew = this.eventsDb.filter(item => this.checkboxsFilter.includes(item.category));
            }
    
            if (this.search != ``) {
                arrayNew = arrayNew.filter(item => item.name.toLowerCase().includes(this.search.toLowerCase()));
            };
    
            this.events = arrayNew;
        },
    }
}).mount('#app');