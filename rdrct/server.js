var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var mysql      = require('mysql');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 6001;
var router = express.Router();
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123456',
  database : 'ren'
});

connection.connect(function(err){
	 if(!err) {
	     console.log("Database is connected ... \n\n");  
	 } else {
	     console.log("Error connecting database ... \n\n");  
	 }
 });

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!'});   
});

router.get('/:code', function(req, res) {
	var sql = 'SELECT url from product where hashid=' + connection.escape(req.params.code) + " limit 1";
    connection.query(sql, function(err, rows, fields) {
   	if (!err)
   		if(rows.length > 0){
   			//res.json({ message: rows[0]['url']});
   			res.redirect(rows[0]['url'])
   		} else {
   			res.json({ message: 'We did not find the thing you need'});
   		}
   	else
     	res.json({ message: 'Something wrong'});
   	});
});

app.use('/api', router);

process.on( 'SIGINT', function() {
  console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
  connection.end();
  process.exit( );
})

app.listen(port);
console.log('Magic happens on port ' + port);