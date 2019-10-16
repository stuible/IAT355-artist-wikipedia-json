var express = require('express');
var router = express.Router();
const { getChart, listCharts } = require('billboard-top-100');
const wiki = require('wikijs').default;

const topArtists = require('../public/json/data')


let wikiData = []

// getChart('hot-100', '2016', (err, chart) => {
//   if (err) console.log(err);

// console.log(chart);
// use chart
// billboardData = chart;
// console.log('finished grabbing from billboard')

// wiki().find("Lizzo")
//   .then(page => page.info())
//   .then(info => console.log(info))

const start = async () => {
  // let index = 0;

  // const shorter = billboardData.songs.slice(0,  1);
  // console.log(shorter);

  await asyncForEach(Object.values(topArtists), async (artist) => {
    // index++;
    console.log('Getting Wikipedia Data on: ' + artist.artist);
    await wiki()
      .find(artist.artist)
      .catch(error => {
        return error;
      })
      .then(page => page.info())
      .catch(error => {
        return error;
      })
      .then(info => {
        let mergedData = info;
        mergedData['billboard_rankings'] = artist.rankings;
        wikiData.push(mergedData)
        // console.log(info)
      })
  });



}

start();

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

/* GET home page. */
router.get('/', function (req, res, next) {

  res.render('index', { title: 'Billboard Data' });
});

router.get('/charts', function (req, res, next) {
  listCharts((err, charts) => {
    if (err) console.log(err);
    // console.log(charts); // prints array of all charts
    res.status(200).json(charts);
  });

});



router.get('/data', function (req, res, next) {
  // let billboardData = 'lol';
  res.status(200).json(wikiData);

});

module.exports = router;
