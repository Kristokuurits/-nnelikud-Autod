const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("./docs/swagger.json");

const app = express();
const host = "localhost";
const port = 8080;

app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

let services = [
    { id: 1, name: "Oil Change", price: 33.00},
    { id: 2, name: "Car Maintenance", price: 150.00},
    { id: 3, name: "Inspection", price: 40.00 },
    { id: 4, name: "Tire Change", price: 41.99 },
    { id: 5, name: "Car Electric Repair", price: 220.00 },
    { id: 6, name: "Clutch Replacement", price: 210.00 },
    { id: 7, name: "Timing Belt Replacement", price: 150.00 },
    { id: 8, name: "Engine Repair", price: 400.00 }
];

let Queue = [];
let clients = [
    { id: 1, name: "John Doe", email: "john@example.com", phoneNumber: "1234567890", address: "123 Elm Street" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", phoneNumber: "0987654321", address: "456 Oak Avenue" }
];


function createId(arr) {
    return arr.length === 0 ? 1 : Math.max(...arr.map(a => a.id)) + 1;
}

app.get("/", (req, res) => {
    res.send(`Server running. Docs at <a href='http://${host}:${port}/docs'>/docs</a>`);
});

app.get("/services", (req, res) => {
    res.json(services);
});

app.post("/services", (req, res) => {
    const { name,price } = req.body;


    if (!name || !price) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const newAuto = {
        id: createId(services),
        name,
        price: price || 0
    };

    services.push(newAuto);
    res.status(201).json(newAuto);
});

// Get car repair by ID
app.get("/services/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const auto = services.find(a => a.id === id);
    if (!auto) return res.status(404).json({ error: "Car not found" });
    res.json(auto);
});

// Update car repair details
app.put("/services/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const auto = services.find(a => a.id === id);
    if (!auto) return res.status(404).json({ error: "Car not found" });

    const { name, price, clientName, carName, clientemail, clientnumber } = req.body;

    if (name) auto.name = name;
    if (price !== undefined) auto.price = price;
    if (clientName) auto.clientName = clientName;
    if (carName) auto.carName = carName;
    if (clientemail) auto.clientemail = clientemail;
    if (clientnumber) auto.clientnumber = clientnumber;

    res.json(auto);
});

// Delete car repair
app.delete("/services/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = services.findIndex(a => a.id === id);
    if (index === -1) return res.status(404).json({ error: "Car not found" });

    services.splice(index, 1);
    res.json({ message: "Car deleted" });
});

// Get all cars in the queue
app.get("/Car-Repair-Queue", (req, res) => {
    res.json(Queue);
});

// Get car from the queue by ID
app.get("/Car-Repair-Queue/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const auto = Queue.find(a => a.id === id);
    if (!auto) return res.status(404).json({ error: "Car not in queue" });
    res.json(auto);
});

// Add car to the queue
app.post("/Car-Repair-Queue/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const auto = services.find(a => a.id === id);
    if (!auto) return res.status(404).json({ error: "Car not found" });

    const { name = auto.name, status = "In Queue" } = req.body;

    if (Queue.some(a => a.id === id)) {
        return res.status(400).json({ error: "Car is already in queue" });
    }

    Queue.push({ id, name, status });
    res.json({ message: `Car ${name} added to the queue`, auto: { id, name, status } });
});

// Update car status in the queue
app.put("/Car-Repair-Queue/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const autoInQueue = Queue.find(a => a.id === id);
    if (!autoInQueue) return res.status(404).json({ error: "Car not found in queue" });

    const { carName, clientName, queueStatus, details, serviceDuration } = req.body;

    if (carName) autoInQueue.carName = carName;
    if (clientName) autoInQueue.clientName = clientName;
    if (queueStatus) autoInQueue.queueStatus = queueStatus;
    if (details) autoInQueue.details = details;
    if (serviceDuration) autoInQueue.serviceDuration = serviceDuration;

    res.json(autoInQueue);
});

// Remove car from queue
app.delete("/Car-Repair-Queue/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = Queue.findIndex(a => a.id === id);
    if (index === -1) return res.status(404).json({ error: "Car not in queue" });

    Queue.splice(index, 1);
    res.json({ message: "Car removed from queue" });
});

// Clients routes

// Get all clients
app.get("/Clients", (req, res) => {
    res.json(clients);
});

// Add a new client
app.post("/Clients", (req, res) => {
    const { name, email, phoneNumber, address } = req.body;

    if (!name || !email || !phoneNumber) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const newClient = {
        id: createId(clients),
        name,
        email,
        phoneNumber,
        address: address || "Not provided"
    };

    clients.push(newClient);
    res.status(201).json(newClient);
});

// Get client by ID
app.get("/Clients/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const client = clients.find(c => c.id === id);
    if (!client) return res.status(404).json({ error: "Client not found" });
    res.json(client);
});

// Update client details
app.put("/Clients/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const client = clients.find(c => c.id === id);
    if (!client) return res.status(404).json({ error: "Client not found" });

    const { name, email, phoneNumber, address } = req.body;

    if (name) client.name = name;
    if (email) client.email = email;
    if (phoneNumber) client.phoneNumber = phoneNumber;
    if (address) client.address = address;

    res.json(client);
});

// Delete client
app.delete("/Clients/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = clients.findIndex(c => c.id === id);
    if (index === -1) return res.status(404).json({ error: "Client not found" });

    clients.splice(index, 1);
    res.json({ message: "Client deleted" });
});

app.listen(port, () => {
    console.log(`Server running at http://${host}:${port}`);
});
