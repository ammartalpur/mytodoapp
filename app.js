const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
// const date = require("./data")
const path = require('path')


const app = express()
const hostname = "127.0.0.1"
const port = 3000

let newItem

mongoose.connect('mongodb://0.0.0.0:27017/todolistDB')

function disconnectFromDB() {
  mongoose.connection.close().then(function () {
    console.log("Disconnected successfully from database");
  }).catch(function (err) {
    console.log(err);
    console.log("Failed to disconnect from database");
  })
}

const itemSchema = new mongoose.Schema({
  name: String
})

const Item = mongoose.model("Item", itemSchema)

const item1 = new Item({
  name: "Eat Food"
})

const item2 = new Item({
  name: "Sleep Over"
})

const item3 = new Item({
  name: "Play Game"
})

const item4 = new Item({
  name: "Repeat"
})

const defaultItems = [item1, item2, item3, item4]

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection failed:"));
db.once("open", function () {
  console.log("Database Connected Succesfully");
  // Item.insertMany(defaultItems).then(function () {
  //   console.log("Default Items inserted into DB");
  //   disconnectFromDB()
  // }).catch(function (err) {
  //   console.log(err._message);
  // })
  Item.find().then(
    function (items) {
      // items.forEach(item => {
      //   // newItem = item
      //   let name = item.name
      //   console.log(name);
      // })
      newItem = items
    }
  ).catch(
    function (err) {
      console.log(err._message);
    }
  )
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname))

// let workItems = [];
// let newItems = ['test1', 'test2', 'test3']





app.get('/', (req, res) => {
  // let renderDay = date.getDate()
  // console.log(newItem);
  // console.log(newItem.lenght)
  // if (newItem === undefined) {
  // console.log(newItem)
  // console.log("Success")
  // Item.insertMany(defaultItems).then(function () {
  //   console.log("Default Items inserted into DB");
  //   res.render('list', { listTitle: "Today", newItemList: newItem })
  // }).catch(function (err) {
  //   console.log(err._message);
  // })
  // } else {
  // console.log(newItem.lenght)

  // console.log("Failed");
  // }
  // res.render('list', { listTitle: "Today", newItemList: newItem })

})


app.post('/', (req, res) => {

  let newItem = req.body.items
  if (req.body.list == 'Work') {
    const itemCreated = new Item({
      name: newItem
    })
    itemCreated.save().then(function () {
      res.redirect('/')

    })

  } else {
    console.log(newItem);
    const itemCreated = new Item({
      name: newItem
    })
    itemCreated.save().then(function () {
      res.redirect('/')
    })

  }

  if (req.body.list == 'remove') {
    Item.deleteMany({}).then(function () {
      console.log("Item Deleted");
    }).catch(
      function (err) {
        console.log(err)
      }
    )
  }

})

app.get('/work', (req, res) => {
  res.render('list', { listTitle: "Work List", newItemList: workItems })
})

app.post('/work', (req, res) => {
  res.redirect('/work')
})

app.listen(port, hostname, () => {
  console.log(`The server is running on http://${hostname}:${port}/`);
})  