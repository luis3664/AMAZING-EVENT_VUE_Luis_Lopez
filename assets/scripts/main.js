// Variables
const { createApp } = Vue;

createApp({
    data() {
        return{
            urlApi: `https://mindhub-xj03.onrender.com/api/amazing`,
            data: {},
            events: [],
            checkboxs: [],
            search: ``,
        }
    },
    async mounted(){
        try {
            const response = await axios.get(this.urlApi);
            this.data = response.data;

            // Los ordeno por relevancia segun la fecha
            this.events = (this.data.events).sort((a, b) => {
                if (a.date > b.date) {
                    return -1;
                }
                if (a.date < b.date) {
                    return 1;
                }
                return 0;
            });
            

            this.checkboxs = new Set(this.events.map(item => item.category));

        } catch (error) {
            const responseJson = await axios.get(`./assets/data/data.json`);
            this.data = responseJson.data;

            this.events = this.data.events;

            this.checkboxs = new Set(this.events.map(item => item.category));
        }
    },
    methods:{
        filterByCheckbox: function() {
            let arrayNew = this.data.events;
            let checkboxs = Array.from(document.querySelectorAll(`input[type='checkbox']`));
            let checkboxsChecked = checkboxs.filter(item => item.checked);
    
            if (checkboxsChecked.length > 0) {
                arrayNew = checkboxsChecked.reduce((accumulator, currentElement) => {
                    return accumulator.concat(this.data.events.filter(item => currentElement.value == item.category))
                },[]);
            }
    
            this.events = arrayNew;
        },
        filterBySearcher: function() {
            let arrayNew = this.events;
    
            if (this.search != ``) {
                arrayNew = arrayNew.filter(item => item.name.toLowerCase().includes(this.search.toLowerCase()));
            };
    
            this.events = arrayNew;
        }
    }
}).mount('#app');