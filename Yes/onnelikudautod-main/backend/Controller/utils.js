const {db} = require("./db")

function getBaseUrl(req) {
    return (req.connection && req.connection.encrypted ? 'https' : 'http') + '://${req.headers.host}'
}

async function getCar(req, res ) {
    const idNumber = parseInt(req.params.id)
    if (isNaN(idNumber)) {
        res.status(400).send({error: 'IDmust be a whole number: ${req.params.id}'})
        return null
    }
    const game = await db.cars.findByPk(idNumber)
    if (!car) {
        res.status(404).send({error: 'Car Not found!'})
        return null
    }
    return car
}