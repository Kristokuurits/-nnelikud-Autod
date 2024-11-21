const CarsController = require("../Controller/CarsController");
module.exports = (app)=>{
    app.route("/cars")
        .get(CarsController.getAll)
        .post(CarsController.create);
    app.route("/games/:id")
        .get(CarsController.getById)
        .put(CarsController.editById)
        .delete(CarsController.deleteById)
}