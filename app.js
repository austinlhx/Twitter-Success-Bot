const discord = require("discord.js");
const bot = new discord.Client();
const twit = require("twit");
const token = "Insert Discord Token";
const fs = require("fs");

const axios = require("axios");
const path = require("path");

var config = require("./config");
const client = new twit(config);

bot.on("ready", () => {
  console.log(`${bot.user.tag} has connected to the server!`);
});

bot.on("message", (msg) => {
  if (msg.channel.id === "Insert Channel ID") {
    if (msg.author.bot) return;

    if (msg.attachments.size > 0) {
      const result = msg.attachments.map((res, i) => {
        return res.proxyURL;
      });

      var comment = msg.content;
      
      async function downloadImage() {
        const url = result[0];
        const file_dir = path.resolve(__dirname, "files", "success.png");
        const writer = fs.createWriteStream(file_dir);

        const response = await axios({
          method: "GET",
          url: url,
          responseType: "stream",
        });
        response.data.pipe(writer);
      }

      downloadImage();

      setTimeout(function () {
        var b64 = fs.readFileSync("files/success.png", {
          encoding: "base64",
        });
        client.post("media/upload", { media_data: b64 }, uploaded);
      }, 5000);
      
     /*
     async function downloadImage() {
        const url = result[0];

        const response = await axios({
          method: "GET",
          url: url,
          responseType: "arrayBuffer",
        });

        const b64 = await Buffer.from(response.data, "utf-8");
        client.post("media/upload", { media_data: b64 }, uploaded);
    }
    downloadImage();
    */

      function uploaded(err, data, response) {
          if (err) {
              console.log(err);
          }else{
        var mediaIdStr = data.media_id_string;
        var tweet = {
          status: `Success posted by ${msg.author.username} \n ${comment}`,
          media_ids: [mediaIdStr],
        };
        client.post("statuses/update", tweet, statusUpdate);
    }
      }

      function statusUpdate(err, data, response) {
        if (err) {
          console.log(err);
        } else {
          //add embed reply
          console.log(data);
          var tweet_link =
            "https://twitter.com/INSERT YOUR ACCOUNT HERE/status/" + data.id_str;
          const embed = {
            title: "Your Success has been posted!",
            color: 8519796,
            thumbnail: {
              url: "Insert Custom Logo",
            },
            fields: [
              {
                name: "Click the 👎 to delete the tweet",
                value: `You can view your tweet [here](${tweet_link})`,
              },
            ],
            footer: {
              text: "created by austin_hx#2583",
            },
            timestamp: new Date(),
          };
          msg.channel.send({ embed }).then((embedMessage) => {
            embedMessage.react("👎");

            const filter = (reaction, user) => {
              return reaction.emoji.name === "👎" && user.id === msg.author.id;
            };

            embedMessage
              .awaitReactions(filter, { max: 1 })

              .then((collected) => {
                client.post(
                  "statuses/destroy/:id",
                  { id: data.id_str },
                  function (err, data, response) {
                    console.log(data);
                  }
                );
                embedMessage.delete();
                msg.delete();
              });
          });
        }
      }
    }
  }
});

bot.login(token);
