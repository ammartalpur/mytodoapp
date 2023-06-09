const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const path = require('path')


const app = express()
const hostname = "127.0.0.1"
const port = 3000

let newItem

mongoose.connect('mongodb://0.0.0.0:27017/todolistDB')


// Extra Work


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


const customListSchema = new mongoose.Schema({
  name: String,
  item: [itemSchema]
})

const Item = mongoose.model("Item", itemSchema)
const CustomList = mongoose.model('CustomList', customListSchema)

const item1 = new Item({
  name: "Press + to add item"
})

const item2 = new Item({
  name: "Press - to Remove Item"
})

const item3 = new Item({
  name: "Created By Ammar"
})




const defaultItems = [item1, item2, item3]

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection failed:"));
db.once("open", function () {
  console.log("Database Connected Succesfully");


})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname))


app.get('/:customListName', (req, res) => {
  const customListName = req.params.customListName
  console.log(customListName);
  const list = new CustomList({
    name: customListName,
    item: defaultItems
  })

  list.save().then(function () {
    console.log("Saved on Database")
  }).catch(function (err) {
    console.log(err)
    console.log("Failed to Database")
  })
})


app.get('/', (req, res) => {

  Item.find().then(
    function (items) {
      newItem = items
      if (newItem.length === 0) {
        Item.insertMany(defaultItems).then(function () {

        }).catch(function (err) {
          console.log(err._message);
        })
        res.redirect('/')
      } else {

        res.render('list', { listTitle: "Today", newItemList: newItem })

      }
    }
  ).catch(
    function (err) {
      console.log(err._message);
    }
  )



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
    const itemCreated = new Item({
      name: newItem
    })
    itemCreated.save().then(function () {
      res.redirect('/')
    })

  }

  if (req.body.list == 'remove') {
    Item.deleteMany({}).then(function () {

    }).catch(
      function (err) {
        console.log(err)
      }
    )
  }

})

app.post('/delete', (req, res) => {
  let id = req.body.checkbox
  Item.deleteOne({ _id: id }).then(function () {
    res.redirect('/')
  })
})


app.listen(port, hostname, () => {
  console.log(`The server is running on http://${hostname}:${port}/`);
})  