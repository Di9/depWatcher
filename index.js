const express = require('express')
const expressHsb = require('express-handlebars')
const routes = require('./routes')

const app = express()

app.set('port', (process.env.PORT || 5000))

// view engine setup
app.engine('.hbs', expressHsb({ defaultLayout: 'layout', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use('/', routes)

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'))
})

module.exports = app
