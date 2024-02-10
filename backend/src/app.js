    const express = require('express');
    const fs = require('fs');
    const path = require('path');
    const cors = require('cors');

    const app = express();
    const port = 3000;
    app.use(cors());
    //defino  ubicacion el archivo json 
    const DATA_FILE = path.join(__dirname, 'data.json');

    app.use(express.json()); // Middleware para parsear JSON

    app.get('/', (req, res) => {
    res.send('Servidor Express Funcionando');
    });

    app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
    });
    //Genero id para emleados que sean unicos
    function encontrarSiguienteIDDisponibleaEmpleado(datos) {
        let idsExistentes = datos.empleados.map(empleado => empleado.id);
        for (let i = 1; i < 1000; i++) {
            if (!idsExistentes.includes(i)) {
                return i; // Retorna el primer ID no utilizado.
            }
        }
        throw new Error("No hay IDs disponibles.");
    }
    //Generar id de turnos unicos 
    function encontrarSiguienteIDDisponibleaTurnos(datos) {
        let idsExistentes = datos.turnos.map(turno => turno.id);
        for (let i = 1; i < 1000; i++) {
            if (!idsExistentes.includes(i)) {
                return i; // Retorna el primer ID no utilizado.
            }
        }
        throw new Error("No hay IDs disponibles.");
    }
    //genramos id unico de trasacciones 
    function encontrarSiguienteIDDisponibleTransacciones(datos) {
        // Asegúrate de usar transaccionesPropinas en lugar de transacciones
        let idsExistentes = datos.transaccionesPropinas.map(transaccion => transaccion.id);
        for (let i = 1; i <= 1000; i++) {
            if (!idsExistentes.includes(i)) {
                return i; // Retorna el primer ID no utilizado.
            }
        }
        throw new Error("No hay IDs disponibles.");
    }
    
    // Obtengo los datos de data.json no me pedia si deba guardarse en base de datos
    // y pense en guardar en json para que ustdes mantengan l as pruebas
    app.get('/data', (req, res) => {
        fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al leer los datos');
            return;
        }
        res.json(JSON.parse(data));//respondo al clinte el data
        });
    });
    //Metodo post de empelados
    app.post('/empleados', (req, res) => {
        const nuevoEmpleado = req.body; // Obtengo la solicitud HTTPS con el req
        //Leo el archivo Data.json que es donde guardo la informacion
        fs.readFile(DATA_FILE, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error al leer el archivo de datos.');
                return;
            }
            //Guardo lo que se leyo del arcivo en data
            const datos = JSON.parse(data);
    
            try {
                // Generamos un id que no se repita y con tres digitos
                nuevoEmpleado.id = encontrarSiguienteIDDisponibleaEmpleado(datos);
                datos.empleados.push(nuevoEmpleado);//hago un push para añadir el empelado
                //actualizo el archivo Data.json
                fs.writeFile(DATA_FILE, JSON.stringify(datos, null, 2), 'utf8', (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('Error al guardar el nuevo empleado.');
                        return;
                    }
                    res.status(201).send('Empleado agregado con éxito.');
                });
            } catch (error) {
                res.status(500).send(error.message);
            }
        });
    });
    app.post('/empleados/turnos', (req, res) => {
        const nuevoTurno = req.body; // Obtengo la solicitud HTTPS con el req
        //Leo el archivo Data.json que es donde guardo la informacion
        fs.readFile(DATA_FILE, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error al leer el archivo de datos.');
                return;
            }
            //Guardo lo que se leyo del arcivo en data
            const datos = JSON.parse(data);
    
            try {
                // Generamos un id que no se repita y con tres digitos
                nuevoTurno.id = encontrarSiguienteIDDisponibleaTurnos(datos);
                datos.turnos.push(nuevoTurno);//hago un push para añadir turnos
                //actualizo el archivo Data.json
                fs.writeFile(DATA_FILE, JSON.stringify(datos, null, 2), 'utf8', (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('Error al guardar el nuevo turno.');
                        return;
                    }
                    res.status(201).send('Turno agregado con éxito.');
                });
            } catch (error) {
                res.status(500).send(error.message);
            }
        });
    });
    app.post('/empleados/transacciones', (req, res) => {
        const nuevaTransaccion = req.body; // Obtengo la solicitud HTTPS con el req
        // Leo el archivo Data.json que es donde guardo la información
        fs.readFile(DATA_FILE, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error al leer el archivo de datos.');
                return;
            }
            // Guardo lo que se leyó del archivo en data
            const datos = JSON.parse(data);
    
            try {
                // Generamos un id que no se repita y con tres dígitos
                nuevaTransaccion.id = encontrarSiguienteIDDisponibleTransacciones(datos);
                datos.transaccionesPropinas.push(nuevaTransaccion); // Hago un push para añadir la transacción a transaccionesPropinas
                // Actualizo el archivo Data.json
                fs.writeFile(DATA_FILE, JSON.stringify(datos, null, 2), 'utf8', (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('Error al guardar la nueva transacción.');
                        return;
                    }
                    res.status(201).send('Transacción agregada con éxito.');
                });
            } catch (error) {
                res.status(500).send(error.message);
            }
        });
    });
    // Método GET para sumar el monto total de las propinas
app.get('/transacciones/suma', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al leer el archivo de datos.');
            return;
        }

        // Parsea el contenido del archivo data.json
        const datos = JSON.parse(data);

        // Calcula la suma de los montos de las propinas
        const sumaMontoTotalPropina = datos.transaccionesPropinas.reduce((acumulador, transaccion) => {
            return acumulador + (Number(transaccion.montoTotalPropina) || 0);
        }, 0);

        // Envía la suma calculada como respuesta
        res.json({ sumaMontoTotalPropina });
    });
});
app.get('/transacciones', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al leer el archivo de datos.');
            return;
        }
        // Parsea el contenido del archivo data.json
        const datos = JSON.parse(data);

        // Extrae el arreglo de transacciones
        const transacciones = datos.transaccionesPropinas;

        // Envía las transacciones como respuesta
        res.json(transacciones);
    });
});


    