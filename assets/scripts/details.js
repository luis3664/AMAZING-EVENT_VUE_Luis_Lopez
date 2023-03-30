// Variables
const { createApp } = Vue;

createApp({
    data() {
        return{
            urlApi: `https://mindhub-xj03.onrender.com/api/amazing`,
            id: null,
            event: {},
            time: false,
            found: false,
        }
    },
    created(){
        const params = new URLSearchParams(document.location.search);
        this.id = Number(params.get(`id`));
        this.getData(this.id);
    },
    mounted(){
    },
    methods:{
        getData: async function(id) {
            try {
                const response = await axios.get(this.urlApi);
                let aux = response.data.events.find(item => item._id == id);
                if (!aux) {
                    this.event = {};
                } else {
                    this.event = aux;
                    this.found = true;

                    const title = document.querySelector(`title`);
                    title.textContent = this.event.name;

                    this.time = this.event.date > response.data.currentDate;
                }
                
            } catch (error) {
                const responseJson = await axios.get(`./assets/data/data.json`);
                let aux = responseJson.data.events.find(item => item._id == id);
                if (!aux) {
                    this.event = {};
                } else {
                    this.event = aux;
                    this.found = true;

                    const title = document.querySelector(`title`);
                    title.textContent = this.event.name;

                    this.time = this.event.date > response.data.currentDate;
                }
            }
        },
    }
}).mount('#main-details');