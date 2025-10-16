const express = require('express');
const app = express();
const car = require('./model/car.js');
const mongo = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function connect() {
   await mongo.connect(process.env.MONGO_URI);
}

app.get("/" , (req, res) => {
    const name = process.env.APP_NAME;
    res.render("index.ejs", { name: name });
});

app.get("/car/new", (req, res) => {
    res.render("createCar.ejs");
});

app.get("/cars/:id/edit", (req, res) => {
    res.render("updateCar.ejs", req.params.id);
});

app.get("/car/:id", (req, res) => {
    res.render("deleteCar.ejs", req.params.id);
});

app.post('/create', (req, res) => {
    const manufacturer = req.body.manufacturer;
    const model = req.body.model;
    const year = Number(req.body.year);
    const engine = req.body.engine;
    const description = req.body.description;
    const image = req.body.image;
    createCar(manufacturer, model, year, engine, description, image).then(() => { console.log("Car successfully created.") });

    res.render("created.ejs");
});

app.put('/cars', (req, res) => {
    const id = req.body.id;
    const manufacturer = req.body.manufacturer;
    const model = req.body.model;
    const year = Number(req.body.year);
    const engine = req.body.engine;
    const description = req.body.description;
    const image = req.body.image;

    updateCar(id, manufacturer, model, year, engine, description, image).then(() => { console.log("Car has been successfully updated.") })

    res.render("updated.ejs");
});

app.get('/cars', (req, res) => {
    const allCars = car.find();

    res.render("allCars.ejs", allCars);
});

app.get('/cars/:id', (req, res) => {
    const id = req.params.id;

    const car = getCarById(id);

    res.render("allCars.ejs", car);
})

app.delete("/cars", (req, res) => {
   const id = req.body.id;

   deleteCar(id).then(() => { console.log("Car successfully deleted.") });

   res.render("index.ejs");
});

async function createCar(manufacturer, model, year, engine, description, image) {
    const createdCar = await car.create({
        name: {
            manufacturer: manufacturer,
            model: model
        },
        year: year,
        engine: engine,
        description: description,
        image: image
    });

    console.log(createdCar);
}

async function updateCar(id, manufacturer, model, year, engine, description, image) {

    let carToUpdate = await car.findById(id);

    carToUpdate.manufacturer = manufacturer;
    carToUpdate.model = model;
    carToUpdate.year = year;
    carToUpdate.engine = engine;
    carToUpdate.description = description;
    carToUpdate.image = image;

    const updatedCar = await carToUpdate.save();

    console.log(updatedCar);
}

async function deleteCar(id) {
    const carToDelete = await car.findById(id);

    if(carToDelete !== null) {
        carToDelete.deleteOne();

        console.log(carToDelete);
    }else {
        console.log("Car not found.");
    }
}

async function getCarById(id) {
    const car = await car.findById(id);

    return car;
}

app.listen(3000, () => { console.log("Started on 3000.") })

connect().then(() => { console.log("Connected.") });