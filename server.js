const express = require('express');
const app = express();
const car = require('./model/car.js');
const mongo = require('mongoose');
const dotenv = require('dotenv');
const methodOverride = require("method-override");
dotenv.config();
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride("_method"));
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

async function connect() {
   await mongo.connect(process.env.MONGO_URI);
}

app.get("/" , (req, res) => {
    res.render("index.ejs");
});

app.get("/car/new", (req, res) => {
    res.render("createCar.ejs");
});

app.get("/cars/:id/edit", async (req, res) => {
    res.render("updateCar.ejs", {id: req.params.id, car: await car.findById(req.params.id)});
});

app.delete("/car/delete/:id", async (req, res) => {
    let allCars = await car.find();

    await deleteCar(req.params.id);

    res.render("allCars.ejs", {allCars: allCars});
});

app.post('/create', (req, res) => {
    const manufacturer = req.body.make;
    const model = req.body.model;
    const year = req.body.year;
    const engine = req.body.engine;
    const description = req.body.description;
    const image = req.body.image;
    createCar(manufacturer, model, year, engine, description, image).then(() => { console.log("Car successfully created.") });

    res.render("index.ejs");
});

app.put('/cars/edit', (req, res) => {
    const id = req.body.id;
    const manufacturer = req.body.manufacturer;
    const model = req.body.model;
    const year = Number(req.body.year);
    const engine = req.body.engine;
    const description = req.body.description;
    const image = req.body.image;

    updateCar(id, manufacturer, model, year, engine, description, image).then(() => { console.log("Car has been successfully updated.") })

    res.render("index.ejs");
});

app.get('/cars', async (req, res) => {

    let allCars = await car.find();

    res.render("allCars.ejs",  {allCars: allCars});
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
            manufacturer,
            model
        },
        year,
        engine,
        description,
        image
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
        await carToDelete.deleteOne();
    }
}

async function getCarById(id) {
    const car = await car.findById(id);

    return car;
}

app.listen(3000, () => { console.log("Started on 3000.") })

connect().then(() => { console.log("Connected.") });