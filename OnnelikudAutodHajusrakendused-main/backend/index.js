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
    {id: 5, name: "Auto elektritööd", price: 22000.00},
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
    const max = onnellikudAutod.reduce((prev, current) => (prev.id > current.id) ? prev : current, {id: 0});
    return max.id + 1;
}

app.post("/onnelikud-autod", (req, res) => {
    if (!req.body.name || req.body.name.trim().length === 0) {
        return res.status(400).send({error: "Missing required field 'name'"});
    }
    const newPrice = parseFloat(req.body.price);
    onnellikudAutod.push({
        id: createId(),
        name: req.body.name,
        price: isNaN(newPrice) ? null : newPrice
    });
    res.send(onnellikudAutod);
});

app.get("/onnelikud-autod/:id", (req, res) => {
    const idNumber = parseInt(req.params.id);
    if (isNaN(idNumber)) {
        return res.status(400).send({error: `ID must be a whole number: ${req.params.id}`});
    }
    const auto = onnellikudAutod.find(g => g.id === idNumber);
    if (!auto) {
        return res.status(404).send({error: `Auto Not Found!`});
    }
    res.send(auto);
});

app.listen(port, () => {
    console.log(`API up at : http://${host}:${port}`);
});
