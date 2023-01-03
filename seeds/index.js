const express = require('express');
const path = require('path');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const mongoose = require('mongoose');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database Connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            price: price,
            image: `https://source.unsplash.com/random/1600x900?camping,${i}`,
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolore quod sint ratione facere est aliquam ipsa commodi aut, distinctio ut voluptatum voluptas dignissimos maxime facilis dolorem ullam enim veritatis natus.'
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});