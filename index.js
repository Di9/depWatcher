const express = require('express')
const expressHsb = require('express-handlebars')
const routes = require('./routes')

const app = express()

// view engine setup
app.engine('.hbs', expressHsb({ defaultLayout: 'layout', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use('/', routes)

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})

module.exports = app
