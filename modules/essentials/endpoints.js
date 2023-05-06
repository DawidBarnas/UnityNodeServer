const config = require('../../config/config.json');
const app = require('./server_start').app;
const mysql = require('./mysql');
var db = new mysql();
const bcrypt = require('bcrypt');
const session = require('express-session');
const cookieParser = require('cookie-parser');

function verifyUserKey(req, res, next) {
    const { username, key } = req.body;
  
    if (!username || !key) {
      return res.status(401).json({ message: 'Brak nazwy użytkownika lub klucza autoryzacyjnego' });
    }

    
    db.verifyUserKey(username,  async (result) =>  {
      if (result) {
        console.log(key);
        var exists = false;
        for(const r of result){
          var compared = await bcrypt.compare(key,r.users_key);
          if(compared){
            exists = true;
            break;
          }
        }
        if(exists){
          next()
        } else {
          return res.status(401).json({ message: 'Nieprawidłowa nazwa użytkownika lub klucz autoryzacyjny' });

        }
        
      } 
      
       else {
        return res.status(401).json({ message: 'Nieprawidłowa nazwa użytkownika lub klucz autoryzacyjny' });
      }
    });
  }

function endpoints() {
	


	app.post('/api/data',verifyUserKey, (req, res) => {
        
    db.getInputQuizz((data) =>{
       
       res.json(data)
       
    })
});

	app.get('/api/data1z4', (req, res) => {
		db.Quiz1z4((data) => {
			// data.map(x => data = x)
			res.json(data);
			console.log(data);
		});
	});

	app.get('/api/datatf', (req, res) => {
		db.quiztf((data) => {
			// data.map(x => data = x)
			res.json(data);
			console.log(data);
		});
	});

	// Save user key
    app.post('/api/key_generate', (req, res) => {
        const { username, key } = req.body;
        const hashedKey = bcrypt.hashSync(key,10);
        db.saveUserKey(username, hashedKey);
        res.send("User key saved.");
    });
}

module.exports = { endpoints };
