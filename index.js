import 'dotenv/config';
import { inquirerMenu, leerInput, listarLugares, pausa } from "./helpers/inquirer.js";
import { Busquedas } from "./models/busquedas.js";


const main = async() => {

    let opt = '';

    const busquedas = new Busquedas();

    

    do {
        opt = await inquirerMenu();
        
        switch (opt) {
            case 1:
                //Mostrar mensaje para escribir
                const busqueda = await leerInput('Ciudad: ');
                
                //Busqueda los lugares
                const lugares = await busquedas.ciudad(busqueda);

                //Seleccionar uno de esos lugares
                const id = await listarLugares(lugares);

                //Si despues de buscar lugares, cancelamos...opcion 0 Cancelar
                if (id === '0') continue;

                //console.log({id});
                const lugarSel = lugares.find(l => l.id === id); //busca en el arreglo el objeto que coincida con el id seleccionado
                
                // guardar en histaorial
                busquedas.agregarHistorial(lugarSel.nombre);

                //Datos del clima
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);
                //console.log(clima);

                //Mostrar resultados

                console.clear();
                console.log('\nInformacion de la ciudad\n'.green);
                console.log('Ciudad:', lugarSel.nombre.green);
                console.log('Lat:', lugarSel.lat);
                console.log('Lng:', lugarSel.lng);
                console.log('Tiempo:', clima.desc.green);
                console.log('Temperatura:', clima.temp);
                console.log('Mínima:', clima.min);
                console.log('Máxima:', clima.max);
                console.log('Humedad:', clima.humedad);
                
            break;
    
            case 2:
                // Ver historial
                busquedas.leerDB();
                busquedas.historialCapitalizado.forEach( (lugar, i) => {
                    const idx = `${i + 1}.`.green;
                    console.log(`${idx} ${lugar}`);
                })
                
            break;
    
        }

        
        if (opt !== 0) await pausa();
           
    
      } while (opt !== 0);
    
      console.clear();



}

main();