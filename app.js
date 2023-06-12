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



  CustomList.findOne({ name: customListName }).then(function (data) {
    if (data.length === 0) {
      console.log("not Found");
      list.save().then(function () {
        console.log("Saved on Database")
        console.log(data)
        res.render('list', { listTitle: data[0].name, newItemList: data[0].item })

      }).catch(function (err) {
        console.log(err)
        console.log("Failed to Database")
      })
    } else {
      console.log("Found customListName Data");
      // console.log(data)
      res.render('list', { listTitle: data.name, newItemList: data.item })
    }
  }).catch(function (err) {
    console.log(err);
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
  let listName = req.body.list
  const itemCreated = new Item({
    name: newItem
  })
  console.log(listName)
  if (listName == 'Today') {

    itemCreated.save().then(function () {
      res.redirect('/')
    })
  } else {
    // CustomList.findOne({ name: listName }).then(
    //   function (foundList) {
    //     console.log("Founded listName data");
    //     // console.log(foundList);
    //     foundList.item.push(itemCreated)
    //     // foundList.save()
    //     // res.redirect("/" + listName)
    //   }
    // ).catch(function () {
    //   console.log("cant find")
    //   // res.redirect("/" + listName)
    // })


    // CustomList.findOneAndUpdate({ name: listName }, { item: itemCreated }).then(
    //   function (Founded) {
    //     console.log("Find and Updated");
    //     // console.log(Founded);
    //     Founded.item.push(itemCreated)
    //     res.redirect("/" + listName)
    //   }
    // ).catch(function () {
    //   console.log("Failed");
    // })





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
    res.redirect('/ ')
  })
})




db.once("open", function () {
  console.log("Database Connected Succesfully");
  app.listen(port, hostname, () => {
    console.log(`The server is running on http://${hostname}:${port}/`);
  })
})