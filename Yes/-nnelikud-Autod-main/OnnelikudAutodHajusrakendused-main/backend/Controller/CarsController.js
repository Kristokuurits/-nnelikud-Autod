const { db } = require("../db");
const utils = requier("./utils");

exports.getAll = async (req, res) => {
    const cars = await db.cars.findAll();
    res.send(cars.map(({id, name}) => {return {id, name}}))
}

exports.create = async (req, res) => {
    if (!req.body.name || req.body.name.trim().lenght === 0) {
        return res.status(400).send({error:"Missing required field 'name'"})
    }
    const newPrice = parseFloat(req.body.price);
    const newCar = {
        name: req.body.name,
        price: isNaN(newPrice) ? null : newPrice
    }
    const createCar = await db.game.create(newCar);
    res.status(201)
        .location('${Utils.getBaseUrl(req)}/cars/${createCar.id}')
        .send(createdCar)
}
export const deleteById = () => {

};
export const getById = async (req, res) => {
    const car = await getGame(req, res)
    if (!car) { return }
    return res.send(car)
};
export const editById = () => {

};