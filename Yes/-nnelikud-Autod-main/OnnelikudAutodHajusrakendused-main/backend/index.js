const express = require('express');
const app = express();
const host = 'localhost';
const port = 8080;
const swaggerDoc = require("./docs/swagger.json");
const swaggerUi = require("swagger-ui-express");

app.use(express.json());

const onnellikudAutod = [
    {id: 1, name: "Õli vahetus", price: 33.00},
    {id: 2, name: "Autohooldus", price: 150.00},
    {id: 3, name: "Ülevaatus", price: 40.00},
    {id: 4, name: "Rehvi vahetus", price: 41.99},
    {id: 5, name: "Auto elektritööd", price: 220.00},
    {id: 6, name: "Siduri vahetus", price: 210.00},
    {id: 7, name: "Hammasrihma vahetus", price: 150.00},
    {id: 8, name: "Mootori remont", price: 400.00}
];

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.get("/", (req, res) => {
    res.send(`Server running. Docs at <a href='http://${host}:${port}/docs'> /docs</a>`);
});

app.get("/onnelikud-autod", (req, res) => {
    res.send(onnellikudAutod.map(({id, name}) => {
        return {id, name};
    }));
});

function createId() {
    if (onnellikudAutod.length === 0) return 1;
    const max = onnellikudAutod.reduce((prev, current) => (prev.id > current.id) ? prev : current);
    return max.id + 1;
}

app.post("/onnelikud-autod", (req, res) => {
    if (!req.body.name || req.body.name.trim().length === 0) {
        return res.status(400).send({error: "Missing required field 'name'"});
    }
    const newPrice = parseFloat(req.body.price);
    const newAuto = {
        id: createId(),
        name: req.body.name,
        price: isNaN(newPrice) ? null : newPrice
    };
    onnellikudAutod.push(newAuto);
    res.status(201).send(newAuto);
});

app.get("/onnelikud-autod/:id", (req, res) => {
    const idNumber = parseInt(req.params.id);
    if (isNaN(idNumber)) {
        return res.status(400).send({error: `ID peab olema ainult numbrid: ${req.params.id}`});
    }
    const auto = onnellikudAutod.find(g => g.id === idNumber);
    if (!auto) {
        return res.status(404).send({error: `Autot ei leitud`});
    }
    res.send(auto);
});

app.delete("/onnelikud-autod/:id", (req, res) => {
    const idNumber = parseInt(req.params.id);
    if (isNaN(idNumber)) {
        return res.status(400).send({error: "ID peab olema ainult numbrid"});
    }
    
    const index = onnellikudAutod.findIndex(auto => auto.id === idNumber);
    if (index === -1) {
        return res.status(404).send({error: "Autot ei leitud"});
    }

    onnellikudAutod.splice(index, 1);
    res.send({message: `Auto with ID ${idNumber} has been deleted.`});
});

app.put("/onnelikud-autod/:id", (req, res) => {
    const idNumber = parseInt(req.params.id);
    if (isNaN(idNumber)) {
        return res.status(400).send({error: "ID peab olema ainult numbrid"});
    }
    
    const index = onnellikudAutod.findIndex(auto => auto.id === idNumber);
    if (index === -1) {
        return res.status(404).send({error: "Autot ei leitud"});
    }

    const { name, price } = req.body;
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).send({error: "Missing required field 'name'"});
    }

    const updatedPrice = price !== undefined ? parseFloat(price) : onnellikudAutod[index].price;

    onnellikudAutod[index] = {
        id: idNumber,
        name: name,
        price: isNaN(updatedPrice) ? null : updatedPrice
    };

    res.send(onnellikudAutod[index]);
});


app.listen(port, () => {
    console.log(`API up at : http://${host}:${port}`);
});
