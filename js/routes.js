var express = require('express')
const scraperToronto = require('./scrapperToronto')
const scraperVancouver = require('./scrapperVancouver')
var app = express()
const port = 3000

//route to get international tuitions

app.get('/tuitions', function (req, res, next) {
  //Toronto Universities 

  const scrapeCentennial = new Promise((resolve, reject) => {
    scraperToronto
      .scrapeCentennial()
      .then(data => {
        resolve(data)
      })
      .catch(function (err) {
        console.log(err.message)
        console.log(err.stack)
      })
  })

  const scrapeFanshawec = new Promise((resolve, reject) => {
    scraperToronto
      .scrapeFanshawec()
      .then(data => {
        resolve(data)
      })
      .catch(function (err) {
        console.log(err.message)
        console.log(err.stack)
      })
  })

  const scrapeYork = new Promise((resolve, reject) => {
    scraperToronto
      .scrapeYork()
      .then(data => {
        resolve(data)
      })
      .catch(function (err) {
        console.log(err.message)
        console.log(err.stack)
      })
  })

  //Vancouver universities

  const scrapeCapilano = new Promise((resolve, reject) => {
    scraperVancouver
      .scrapeCapilano()
      .then(data => {
        resolve(data)
      })
      .catch(function (err) {
        console.log(err.message)
        console.log(err.stack)
      })
  })

  const scrapeDouglas = new Promise((resolve, reject) => {
    scraperVancouver
      .scrapeDouglas()
      .then(data => {
        resolve(data)
      })
      .catch(function (err) {
        console.log(err.message)
        console.log(err.stack)
      })
  })

  const scrapeUBC = new Promise((resolve, reject) => {
    scraperVancouver
      .scrapeUBC()
      .then(data => {
        resolve(data)
      })
      .catch(function (err) {
        console.log(err.message)
        console.log(err.stack)
      })
  })
  //resolve all promises to get data
  Promise.all([scrapeCentennial, scrapeFanshawec, scrapeYork, scrapeCapilano, scrapeDouglas, scrapeUBC])
    .then(data => {
      res.send({ cities: { Toronto: data[0].concat(data[1]).concat(data[2]), Vancouver: data[3].concat(data[4]).concat(data[5]) } })
    })
    .catch(err => res.status(500).send(err))
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})