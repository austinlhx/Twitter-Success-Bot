const discord = require("discord.js");
const bot = new discord.Client();
const twitter = require('twitter');
const express = require("express.js");
const app = express();
const token = '';

const client = new twitter({
    consumer_key: ' ',
    consumer_secret: ' ',
    access_token_key: ' ',
    access_token_secret: ' '
});

const params = {screen_name: 'nodejs'};

app.set('port', (process.env.PORT || 5000));
app.get(function (request, response){
    var result = 'App is Running';
}).listen(app.get('port'), function () {
    console.log ('App is running, server is listening of port ' + app.get('port'));
});

bot.on("ready", () => {
    console.log(`${bot.user.tag} has connected to the server`);
});

bot.on("message", msg => {
    if (msg.channel.id === ' '){
        if (msg.author.bot) return;

    }
})