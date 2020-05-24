const discord = require("discord.js");
const bot = new discord.Client();
const twit = require('twit');
const express = require("express");
const app = express();
const token = 'INSERT TOKEN';
const fs = require('fs');
const https = require('https');

var config = require('./config');
const client = new twit(config);

var readyPost = false;

bot.on("ready", () => {
    console.log(`${bot.user.tag} has connected to the server!`);
});

bot.on("message", msg => {
    if (msg.channel.id === 'Insert Channel ID'){
        if (msg.author.bot) return;
        if (msg.attachments || msg.content){
            const result = msg.attachments.map((res, i) => {
                return res.proxyURL;
            });
            console.log(result);
            const file = fs.createWriteStream("file.jpg");
            const request = https.get(result[0], function(response) {
            response.pipe(file);
            });
            console.log('File added');
            var comment = msg.content;
            

            processing(comment);

        }

    }
});


function processing(content) {
    var filename = 'file.jpg'
    var b64content = fs.readFileSync(filename, { encoding: 'base64'});
    client.post('media/upload', { media_data: b64content }, uploaded);
    
    function uploaded(err, data, response) {
        var id = data.media_id_string;
        var tweet = {
            status: content,
            media_ids: [id]
        }
        client.post('statuses/update', tweet, statusUpdate);
    }

    function statusUpdate(err, data, response) {
        if (err) {
             console.log(err);
        }else{
            console.log("Data posted");
            fs.unlinkSync('file.jpg');
            console.log('File Deleted');
        }
    }
}



bot.login(token);