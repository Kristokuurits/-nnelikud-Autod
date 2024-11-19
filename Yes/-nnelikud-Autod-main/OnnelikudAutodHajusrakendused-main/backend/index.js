const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("./docs/swagger.json");

const app = express();
const host = "localhost";
const port = 8080;

app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

const onnellikudAutod = [
    { id: 1, name: "Õli vahetus", price: 33.00, buttons: ["Muuda", "Kustuta"] },
    { id: 2, name: "Autohooldus", price: 150.00, buttons: ["Lisa järjekorda"] },
    { id: 3, name: "Ülevaatus", price: 40.00 },
    { id: 4, name: "Rehvi vahetus", price: 41.99 },
    { id: 5, name: "Auto elektritööd", price: 220.00 },
    { id: 6, name: "Siduri vahetus", price: 210.00 },
    { id: 7, name: "Hammasrihma vahetus", price: 150.00 },
    { id: 8, name: "Mootori remont", price: 400.00 }
];

const autoJärjekord = [];

app.get("/", (req, res) => {
    res.send(`Server running. Docs at <a href='http://${host}:${port}/docs'>/docs</a>`);
});

app.get("/onnelikud-autod", (req, res) => {
    res.send(onnellikudAutod.map(({ id, name, buttons }) => ({
        id, name, buttons: buttons || []
    })));
});

app.post("/onnelikud-autod", (req, res) => {
    const { name, price } = req.body;
    if (!name || typeof name !== "string" || name.trim() === "") {
        return res.status(400).send({ error: "Missing required field 'name'" });
    }
    const newAuto = {
        id: createId(),
        name: name.trim(),
        price: price ? parseFloat(price) : null
    };
    onnellikudAutod.push(newAuto);
    res.status(201).send(newAuto);
});

app.get("/onnelikud-autod/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const auto = onnellikudAutod.find(a => a.id === id);
    if (!auto) return res.status(404).send({ error: "Autot ei leitud" });
    res.send(auto);
});

app.put("/onnelikud-autod/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const auto = onnellikudAutod.find(a => a.id === id);
    if (!auto) return res.status(404).send({ error: "Autot ei leitud" });

    const { name, price } = req.body;
    if (!name || typeof name !== "string" || name.trim() === "") {
        return res.status(400).send({ error: "Missing required field 'name'" });
    }
    auto.name = name.trim();
    auto.price = price ? parseFloat(price) : auto.price;

    res.send(auto);
});

app.delete("/onnelikud-autod/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = onnellikudAutod.findIndex(a => a.id === id);
    if (index === -1) return res.status(404).send({ error: "Autot ei leitud" });

    onnellikudAutod.splice(index, 1);
    res.send({ message: "Auto kustutatud" });
});

app.get("/auto-jarjekord", (req, res) => {
    res.send(autoJärjekord); 
});

app.get("/auto-jarjekord/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const auto = autoJärjekord.find(a => a.id === id);
    if (!auto) return res.status(404).send({ error: "Auto ei ole järjekorras" });
    res.send(auto);
});

app.post("/auto-jarjekord/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const auto = onnellikudAutod.find(a => a.id === id);
    if (!auto) return res.status(404).send({ error: "Auto ei leitud" });

    const name = req.body.name || auto.name;  
    const status = req.body.status || "Järjekorras"; 

    if (autoJärjekord.some(a => a.id === id)) {
        return res.status(400).send({ error: "Auto on juba järjekorras" });
    }

    autoJärjekord.push({ id, name, status });
    res.send({ message: `Auto ${name} on järjekorras`, auto: { id, name, status } });
});

app.put("/auto-jarjekord/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const autoInQueue = autoJärjekord.find(a => a.id === id);

    if (!autoInQueue) {
        return res.status(404).send({ error: "Auto ei ole järjekorras" });
    }

    const { name, status } = req.body;

    // Muudame ainult neid andmeid, mis on saadetud.
    if (name) {
        autoInQueue.name = name;
    }
    if (status) {
        autoInQueue.status = status;
    }

    res.send({ message: `Auto ${autoInQueue.name} järjekorras uuendatud`, auto: autoInQueue });
});

app.delete("/auto-jarjekord/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = autoJärjekord.findIndex(a => a.id === id);
    if (index === -1) return res.status(404).send({ error: "Auto ei ole järjekorras" });

    autoJärjekord.splice(index, 1);
    res.send({ message: "Auto eemaldatud järjekorrast" });
});

function createId() {
    return Math.max(...onnellikudAutod.map(a => a.id)) + 1;
}

app.listen(port, () => {
    console.log(`Server running at http://${host}:${port}`);
});
