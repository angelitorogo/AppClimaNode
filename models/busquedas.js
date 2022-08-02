import fs from 'fs';
import axios from "axios";

class Busquedas {


    historial = [];
    dbPath = './db/database.json';


    constructor() {
        
        // Leer DB si existe
        this.historial = this.leerDB();

    }

    get historialCapitalizado() {



        return this.historial.map( lugar => {

            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1));

            return palabras.join(' ')

        })
    }
    

    get paramsMapBox() {
        return {
            'language': 'es',
            'limit': 5,
            'access_token': process.env.MAPBOX_KEY
        }
    }

    async ciudad( lugar = '' ) { //Async porque sera una peticion hhtp

        
        try {
            // peticion http
            
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapBox
            });

            const resp =  await instance.get();

            return resp.data.features.map( lugar => ({ //Asi devuelvo un objeto de forma implicita
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));


        } catch (error){

            return [];

        }
        
        

    }

    get paramsOpenWeather() {
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'lang': 'es',
            'units': 'metric'
        }
    }


    async climaLugar(lat, lon) {

        try {
            // peticion http
            
            /* //Asi valdria
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}`,
                params: this.paramsOpenWeather
            });
            */

            //Pero con desestructuracion del arreglo paramasopenweather y le añadimos lat y lon, funciona igual
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsOpenWeather, lat, lon}
            });

            const resp =  await instance.get();
            
            return {
                desc: resp.data.weather[0].description,
                temp: resp.data.main.temp,
                min: resp.data.main.temp_min,
                max: resp.data.main.temp_max,
                humedad: resp.data.main.humidity
            }
                


        } catch (error){

            console.log(error);

        }

    }

    agregarHistorial(lugar = '') {

        // Evitar duplicados
        if ( this.historial.includes(lugar.toLocaleLowerCase())) {
             return;
        }

        // limitar a 6 lugares en historial.
        this.historial = this.historial.splice(0,5);

        this.historial.unshift( lugar.toLocaleLowerCase() );

        //Grabar en archivo texto
        this.guardarDB();


    }

    
    guardarDB() {

        const payload = {
            historial: this.historial
        }

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));

    }

    leerDB() {

        //Verificar si existe
        if (!fs.existsSync(this.dbPath)) {
            return null;
        }
    
        // Leer de DB
        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});
        const data = JSON.parse(info);
    
        this.historial = data.historial;


    }

}


export { Busquedas }