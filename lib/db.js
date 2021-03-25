//const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:pw@cluster0.cnfxe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
//const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });





var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Comment = new Schema({
	Visitor: String,
	Comment: String,
	MessageID: Schema.Types.ObjectId,
	CreateDate: Date
});

var Blog = new Schema({
	Username: String,
	Article: String,
	CreateDate: Date
});

var Users = new Schema({
    Username: String,
    Password: String
});

var Comment = mongoose.model('Comment', Comment );
var Blog = mongoose.model('Blog', Blog );
var Uses = mongoose.model('Users',Users);



//mongoose.connect('mongodb://localhost/blog');

mongoose.connect(uri);
