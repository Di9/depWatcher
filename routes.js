const express = require('express')
const axios = require('axios')

// const svgLink = require('./getdata')

const router = express.Router()

router.get('/package/:user/:name', (req, res, next) => {
  const userName = req.params.user
  const packageName = req.params.name

  const badge = {}
  badge.up = 0
  badge.maj = 0
  badge.min = 0
  let svgLink = ''

  const getData = axios.get(`https://raw.githubusercontent.com/${userName}/${packageName}/master/package.json`)
    .then((response) => {
      const deps = response.data.dependencies

      const promises = []
      const items = []

      const npmReqest = (() => {
        for (const item of Object.keys(deps)) {
          // return console.log(item)
          // console.log(`start parse ${item} v${deps[item]}`)
          const npmData = axios.get(`https://registry.npmjs.org/${item}`)
          items.push(item)
          promises.push(npmData)
        }
        return Promise.all(promises)
      })

      npmReqest()
        .then((npmResponse) => {
          for (let i = 0; i < npmResponse.length; i++) {
            const item = items[i]
            const latest = npmResponse[i].data['dist-tags'].latest
            const current = deps[item]

            badge[item] = {}
            badge[item].current = current
            badge[item].latest = latest

            let a = current.replace(/^\D+/g, '')
            let b = latest.replace(/^\D+/g, '')
            // console.log(a + ' ' + b)
            if (a === b) {
              badge.up++
              badge[item].status = 'up-to-date'
            }

            a = current.replace(/^\D+/g, '').split('.')
            b = latest.replace(/^\D+/g, '').split('.')

            if (a[0] < b[0]) {
              badge.maj++
              badge[item].status = 'maj-out'
            }
            if (a[1] < b[1] || a[2] < b[2] || a[2] === undefined) {
              badge.min++
              badge[item].status = 'min-out'
            }
          }
        })
        .then(() => {
          // console.log(`current: ${badge.up} - ${badge.maj} - ${badge.min}`)
          svgLink = `/badge/${badge.up}/${badge.maj}/${badge.min}.svg`
          res.render('package', { name: packageName, badge: svgLink })
        })
        .catch((e) => {
          console.log(e)
        })
    })
    .catch((e) => {
      const error = e.response.status === 404 ? 'Package not found' : 'There is an error with request, please try again.'
      // console.log('Error with github request')
      res.render('index', { error })
    })
})

router.get('/search/', (req, res, next) => {
  const reqs = req.query.form.split('/')
  // console.log('redirect to package page')
  res.redirect(`/package/${reqs[0]}/${reqs[1]}`)
})


// make svg badge
router.get('/badge/:up/:maj/:min.svg', (req, res, next) => {
  const num1 = req.params.up
  const num2 = req.params.maj
  const num3 = req.params.min

  const svg = `<svg width="100%" height="100%" viewBox="0 0 194 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;"><path d="M146,3c0,-1.656 -1.344,-3 -3,-3l-140,0c-1.656,0 -3,1.344 -3,3l0,14c0,1.656 1.344,3 3,3l140,0c1.656,0 3,-1.344 3,-3l0,-14Z" style="fill:#555;"/><path d="M193.333,3c0,-1.656 -1.344,-3 -3,-3l-99.333,0c-1.656,0 -3,1.344 -3,3l0,14c0,1.656 1.344,3 3,3l99.333,0c1.656,0 3,-1.344 3,-3l0,-14Z" style="fill:#e05d44;"/><path d="M88,0l35.973,0l0,20l-35.973,0l0,-20Z" style="fill:#a2e7b7;fill-rule:nonzero;"/><path d="M123.834,0l36.388,0l0,20l-36.388,0l0,-20Z" style="fill:#e7d2a2;fill-rule:nonzero;"/><path d="M193.333,3c0,-1.656 -1.344,-3 -3,-3l-187.333,0c-1.656,0 -3,1.344 -3,3l0,14c0,1.656 1.344,3 3,3l187.333,0c1.656,0 3,-1.344 3,-3l0,-14Z" style="fill:url(#_Linear1);"/><g><text x="7.413px" y="15px" style="font-family:'Verdana', sans-serif;font-size:11px;fill:#010101;fill-opacity:0.298039;">dependencies</text><text x="7.413px" y="14px" style="font-family:'Verdana', sans-serif;font-size:11px;fill:#fff;">dependencies</text><text x="96.06px" y="15px" style="font-family:'Verdana', sans-serif;font-size:11px;fill:#010101;fill-opacity:0.298039;">${num1}</text><text x="131.598px" y="15px" style="font-family:'Verdana', sans-serif;font-size:11px;fill:#010101;fill-opacity:0.298039;">${num2}</text><text x="167.205px" y="15px" style="font-family:'Verdana', sans-serif;font-size:11px;fill:#010101;fill-opacity:0.298039;">${num3}</text><text x="96.06px" y="14px" style="font-family:'Verdana', sans-serif;font-size:11px;fill:#fff;">${num1}</text><text x="131.598px" y="14px" style="font-family:'Verdana', sans-serif;font-size:11px;fill:#fff;">${num2}</text><text x="167.205px" y="14px" style="font-family:'Verdana', sans-serif;font-size:11px;fill:#fff;">${num3}</text></g><defs><linearGradient id="_Linear1" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(1.62168e-15,20,-26.484,1.22465e-15,0,0)"><stop offset="0%" style="stop-color:#bbb;stop-opacity:0.0980392"/><stop offset="100%" style="stop-color:#000;stop-opacity:0.0980392"/></linearGradient></defs></svg>`
  res.writeHead(200, { 'Content-Type': 'image/svg+xml' })
  res.end(svg)
})

// Home page.
router.get('/', (req, res, next) => {
  res.render('index', { titls: 'title' })
})

module.exports = router
