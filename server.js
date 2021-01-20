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
    res.json({message:"API Listening..."});
});
app.get('/api/restaurants',(req,res)=>{
    db.getAllRestaurants(req.query.page, req.query.perPage, req.query.borough)
    .then((restaurants)=>{
        res.json(restaurants);
    }).catch((err)=>{
        res.status(404).json({message:"Error getting restaurants"});
    })
});
app.get('/api/restaurants/:id',(req,res)=>{
    db.getRestaurantById(req.params.id)
    .then((restaurant)=>{
        res.json(restaurant);
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
        res.status(400).json({message:"Error adding restaurant"})
    })
  });

  app.put('/api/restaurants/:id', (req,res)=>{
      db.updateRestaurantById(req.body, req.params.id)
      .then((updateRes)=>{
          res.json(updateRes)
      })
      .catch((err)=>{
          res.status(500).json({message:`Error updating restaurant ${err}`})
      })
  });
  app.delete("/api/restaurants/:id",(req,res)=>{
      db.deleteRestaurantById(req.params.id)
      .then((deleteRes)=>{
          res.status(200).json({message:`Restaurant successfully deleted: ${deleteRes}`})
      })
      .catch((err)=>{
          res.status(500).json({message:"Error deleting"})
      })
  })


//Server Listening
// app.listen(PORT,function(){
//     console.log(`🌎 ==> Server listening now on port ${PORT}!`);
// });