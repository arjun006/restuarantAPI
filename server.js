/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Arjun Devakumar Student ID: 159076199 Date: January 20, 2021
*  Heroku Link: https://obscure-mesa-81981.herokuapp.com/
*
********************************************************************************/ 

const express = require('express');
const router = express.Router();
const path = require("path");
const dotenv = require('dotenv')
dotenv.config();
const bodyParser = require('body-parser');
const cors = require('cors');
//Express Connection
const app = express();
var HTTP_PORT = process.env.PORT || 3000;
const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
//DB Connection
const RestaurantDB = require("./modules/restaurantDB.js");
const { error } = require('console');
const { read } = require('fs');
const db = new RestaurantDB("mongodb+srv://dbUser:web422@cluster0.vi3h3.mongodb.net/sample_restaurants?retryWrites=true&w=majority");
db.initialize().then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});

//API Routes
app.get('/',function(req,res){
    res.status(200).json({message:"API Listening..."})
    .catch((err)=>{
        res.status(500).json({message:`Server Error: ${err}`})
    })
});
app.get('/api/restaurants',(req,res)=>{
    db.getAllRestaurants(req.query.page, req.query.perPage, req.query.borough)
    .then((restaurants)=>{
        res.status(200).json(restaurants);
    }).catch((err)=>{
        res.status(500).json({message:"Error getting restaurants"});
    })
});
app.get('/api/restaurants/:id',(req,res)=>{
    db.getRestaurantById(req.params.id)
    .then((restaurant)=>{
        res.status(200).json(restaurant);
    })
    .catch((err)=>{
        res.status(404).json({message:`Could not find restaurant with id: ${req.params.id}`})
    })
});

app.post("/api/restaurants", (req, res) => {
    db.addNewRestaurant(req.body)
    .then(res.status(201)
    .json({message:"Successfully added restaurant"}))
    .catch((err)=>{
        res.status(500).json({message:"Error adding restaurant"})
    })
  });

  app.put('/api/restaurants/:id', (req,res)=>{
      db.updateRestaurantById(req.body, req.params.id)
      .then((updateRes)=>{
          res.status(201).json(updateRes)
      })
      .catch((err)=>{
          res.status(500).json({message:`Error updating restaurant: ${err}`})
      })
  });
  app.delete("/api/restaurants/:id",(req,res)=>{
      db.deleteRestaurantById(req.params.id)
      .then((deleteRes)=>{
          res.status(200).json({message:`Restaurant successfully deleted: ${deleteRes}`})
      })
      .catch((err)=>{
          res.status(500).json({message:`Error deleting: ${err}`})
      })
  })
