const { MessageEmbed, Message } = require('discord.js');
const fs = require('fs');
const config = require('../config.json');
const CatLoggr = require('cat-loggr');

const log = new CatLoggr();
const generated = new Set();

module.exports = {
  name: 'gen',
  description: 'Generate a specified service if stocked.',

  execute(message, args) {

    try {
      message.client.channels.cache.get(config.genChannel).id;
    } catch (error) {
      if (error) log.error(error);


      if (config.command.error_message === true) {
        return message.channel.send(
          new MessageEmbed()
            .setColor(config.color.red)
            .setTitle('Error occured!')
            .setDescription('Not a valid gen channel specified!')
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
            .setTimestamp()
        );
      } else return;
    };


    if (message.channel.id === config.genChannel) {

      if (generated.has(message.author.id)) {
        return message.channel.send(
          new MessageEmbed()
            .setColor(config.color.red)
            .setTitle('Cooldown!')
            .setDescription('Please wait **2m** before executing that command again!')
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
            .setTimestamp()
        );
      } else {

        const service = args[0];


        if (!service) {
          return message.channel.send(
            new MessageEmbed()
              .setColor(config.color.red)
              .setTitle('Missing parameters!')
              .setDescription('You need to give a service name!')
              .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
              .setTimestamp()
          );
        };


        const filePath = `${__dirname}/../stock/${args[0]}.txt`;


        fs.readFile(filePath, function(error, data) {

          if (!error) {
            data = data.toString();

            const position = data.toString().indexOf('\n');
            const firstLine = data.split('\n')[0];


            if (position === -1) {
              return message.channel.send(
                new MessageEmbed()
                  .setColor(config.color.red)
                  .setTitle('Generator error!')
                  .setDescription(`I do not find the \`${args[0]}\` service in my stock!`)
                  .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                  .setTimestamp()
              );
            };


            message.author.send(
              new MessageEmbed()
                .setColor(config.color.green)
                .setTitle('Generated account')
                .addField('Service', `\`\`\`${args[0][0].toUpperCase()}${args[0].slice(1).toLowerCase()}\`\`\``, true)
                .addField('Account', `\`\`\`${firstLine}\`\`\``, true)
                .setTimestamp()
            )


            if (position !== -1) {
              data = data.substr(position + 1);


              fs.writeFile(filePath, data, function(error) {
                message.channel.send(
                  new MessageEmbed()
                    .setColor(config.color.green)
                    .setTitle('Account generated seccessfully!')
                    .setDescription(`Check your private ${message.author}! *If you do not recieved the message, please unlock your private!*`)
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                    .setTimestamp()
                );

                generated.add(message.author.id);


                setTimeout(() => {
                  generated.delete(message.author.id);
                }, config.genCooldown);

                if (error) return log.error(error); // If an error occured, log to console
              });
            } else {
              // If the service is empty
              return message.channel.send(
                new MessageEmbed()
                  .setColor(config.color.red)
                  .setTitle('Generator error!')
                  .setDescription(`The \`${args[0]}\` service is empty!`)
                  .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                  .setTimestamp()
              );
            };
          } else {

            return message.channel.send(
              new MessageEmbed()
                .setColor(config.color.red)
                .setTitle('Generator error!')
                .setDescription(`Service \`${args[0]}\` does not exist!`)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                .setTimestamp()
            );
          };
        });
      };
    } else {

      message.channel.send(
        new MessageEmbed()
          .setColor(config.color.red)
          .setTitle('Wrong command usage!')
          .setDescription(`You cannot use the \`gen\` command in this channel! Try it in <#${config.genChannel}>!`)
          .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
          .setTimestamp()
      );
    };
  }
};
