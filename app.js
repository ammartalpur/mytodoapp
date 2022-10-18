const express = require("express");
const bodyParser = require("body-parser");
const date = require("./data")
const path = require('path')


const app = express()
const hostname = "0.0.0.0"
const port = 3000



app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname))

let workItems = [];
let newItems = ['test1', 'test2', 'test3']

app.get('/', (req, res) => {
  let renderDay = date.getDate()
  res.render('list', { listTitle: renderDay, newItemList: newItems })
})


app.post('/', (req, res) => {

  let newItem = req.body.items
  if (req.body.list == 'Work') {
    workItems.push(newItem)
    res.redirect('/work')
  } else {
    newItems.push(newItem)
    res.redirect('/')
  }
  if (req.body.list == 'remove') {
    newItems = []
    workItems = []
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