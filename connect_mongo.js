//To create a mongo database the following lines are used
//->mongo command line
// > use 'databasename'
// > db.createCollection('namecollectionnew')
// > db.'namecollectionnew'.insert({'item':'valueitem'})

//var timeexc = performance.now();//Execution time task connection
//Import MongoDb
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;

var expres = require('express');
var bparser = require('body-parser');

var app = expres();
app.use(bparser.json());
app.use(bparser.urlencoded({extended:true}));

//MongoDb Interface Client
var MongoClient = mongodb.MongoClient;

//Connection URL
var url = 'mongodb://localhost:27017'; //27017 Default port
MongoClient.connect(url,{useNewUrlParser:true}, function (err, client) {
   if (err)
       console.log('Connection to the mongo server is unable. Error --> ', err);
   else {
        //Restfull Api
       //GET
       app.get('/user', function (request, response) {
           var db = client.db('dbgksoftware');
           db.collection('user').find().toArray(function (err, results) {
               response.json(results);
               console.log("Found "+results.result+" documents");
           });
       });

       //GET BY ID
       app.get('/user/:id', function (request, response) {
           var db = client.db('dbgksoftware');
           db.collection('user')
               .find({"_id":ObjectID(request.params.id)}).toArray(function (err, results) {
               response.json(results);
               console.log("Found "+results.result+" documents");
           });
       });

       /**
        * INSERT NEW ITEM
        */
       app.post('/user', function (request, response, next) {
           var json_val = request.body;
           var db = client.db('dbgksoftware');

           db.collection('user')
               .insertOne(json_val, function (err, results) {
                   if (err) throw err;
                   response.json("1 document has been inserted");
                   console.log("1 document has been inserted");
               });
       });

       /**
        * UPDATE ITEM BY ID
        */
       app.put('/user', function (request, response, next) {
           var json_val = {$set:{user:request.body.user}};
           var db = client.db('dbgksoftware');
           db.collection('user')
               .updateOne({'_id':ObjectID(request.body.id)},json_val, function (err, results) {
                   if (err) throw err;
                   response.json("The document has been updated");
                   console.log("The document has been updated");
               });
       });

       /**
        * UPDATE MULTIPLE ITEMS BY ID
        */
       app.put('/userMultiple', function (request, response, next) {
           var json_val = {$set:{user:request.body.user}};
           var query = {user:/^G/};
           var db = client.db('dbgksoftware');
           db.collection('user')
               .updateMany(query,json_val, function (err, results) {
                   if (err) throw err;
                   response.json(""+results.result.n+"  document has been updated");
                   console.log(""+results.result.n+"  document has been updated");
               });
       });

       /**
        * DELETE ITEMS BY ID
        */
       app.delete('/user', function (request, response, next) {
           var db = client.db('dbgksoftware');
           db.collection('user')
               .deleteOne({'_id':ObjectID(request.body.id)},function (err, results) {
                   if (err) throw err;
                   response.json(""+results.result.n+" document has been deleted");
                   console.log(""+results.result.n+" document has been deleted");
               });
       });

       /**
        * MULTIPLE DELETE ITEMS BY ID
        */
       app.delete('/userMultiple', function (request, response, next) {
           var query = {name: /^G^/};
           var db = client.db('dbgksoftware');
           db.collection('user')
               .deleteMany(query,function (err, results) {
                   if (err) throw err;
                   response.json(""+results.result.n+" documents has been deleted");
                   console.log(""+results.result.n+" documents has been deleted");
               });
       });

       /**
        * ALL DELETE ITEMS BY ID
        */
       app.delete('/userAll', function (request, response, next) {
           var db = client.db('dbgksoftware');
           db.collection('user')
               .drop(function (err, res) {
                   if (err) throw err;
                   response.json("Collention has been deleted");
                   console.log("Collention has been deleted");
               });
       });

       app.listen(3000, ()=>{
           //var endexc = performance.now();
           console.log('Connection established to --> ',url);
           //console.log('Execution connection time --> ',(timeexc-endexc)+'milliseconds');
       })
       /*Get Us State
       db.collection('user').find({'user':'rootgkst'}).toArray(
          function (err,result) {
              if (err)
                  console.log(err);
              else if (result.length){
                  console.log(result);
              } else {
                  console.log('No user(s) found with defined');
              }
              client.close();
          }
      )*/
   }
});