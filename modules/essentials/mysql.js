const res = require('express/lib/response');
var mysql = require('mysql2');
const config = require('../../config/config.json').DATABASE;

module.exports = class MySQL {
	host = config.HOST;
	user = config.USER;
	password = config.PASSWORD;
	database = config.DATABASE;

	constructor(deleting, hashkey) {
		this.con = mysql.createPool({
			connectionLimit: 5,
			host: this.host,
			user: this.user,
			password: this.password,
			database: this.database,
		});
		this.con.getConnection((err, connection) => {
			if (err) throw err;
			console.log('Database connected successfully');
			connection.release();
		});
		//this.defaultDatabases();
	}

	getInputQuizz(callback) {
		this.con.query('SELECT * FROM question_answer;', function (err, result) {
			if (err) throw err;
			return callback(result);
		});
	}

	Quiz1z4(callback) {
		this.con.query('SELECT * FROM quiz1z4_answer;', function (err, result) {
			if (err) throw err;
			return callback(result);
		});
	}

	quiztf(callback) {
		this.con.query('SELECT * FROM quiztf;', function (err, result) {
			if (err) throw err;
			return callback(result);
		});
	}

	saveUserKey(username, hashedKey) {
		let sql = "INSERT INTO user_key (username, key) VALUES (?, ?)";
		let values = [username, hashedKey];
		this.con.query("INSERT INTO user_key (username, users_key) VALUES (?, ?)", [username, hashedKey], (err, result) => {
		  if (err) throw err;
		  console.log("User key added to database");
		});    
	  }
	
	  verifyUserKey(username, callback) {
		let sql = "SELECT * FROM user_key WHERE username = ? ";
		let values = [username];
		this.con.query(sql, values, (err, result) => {
		  if (err) throw err;
		  callback(result);
		});
	  }
};
