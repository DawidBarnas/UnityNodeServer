const config = require("../../config/config.json");
const express = require("express");
const app = express();

app.use(express.json({ extended: true }));       // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies

const PORT = process.env.PORT || 3010;

function start_server(){
    app.listen(config.PORT, () => {
        console.log(`Serwer uruchomiony na porcie ${PORT}.`);
    });

}
module.exports = {start_server, app};