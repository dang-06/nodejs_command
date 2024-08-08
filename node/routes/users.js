var express = require('express');
var router = express.Router();
const { Pool, Client } = require('pg')
/* GET users listing. */
router.get('/', function (req, res, next) {
  // res.render('server');
});
// router.get('/user-list', function (req, res, next) {
//   const pool = new Pool({
//     user: 'aek54321',
//     host: 'ls-3311cb3dd205bf5e24b1afeab0b9a22ec42495db.cukr0ikuloyp.ap-southeast-1.rds.amazonaws.com',
//     database: 'dbmydata',
//     password: 'aek54321',
//     port: 5432,
//   })
//   console.log('data try')
//   res.render('user-list', { title: 'User List', userData: 'data' });
// });

module.exports = router;
