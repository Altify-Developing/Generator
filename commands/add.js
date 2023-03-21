const { MessageEmbed, Message } = require('discord.js');
const fs = require('fs');
const os = require('os');
const config = require('../config.json');
const CatLoggr = require('cat-loggr');


const log = new CatLoggr();

module.exports = {
	name: 'add', 
	description: 'Add an account to a service.', 
   
	execute(message, args) {
        
        const service = args[0];
        const account = args[1];

        
        if (!service) {
            return message.channel.send(
                new MessageEmbed()
                .setColor(config.color.red)
                .setTitle('Missing parameters!')
                .setDescription('You need to specify a service!')
                .addField('For example', `${config.prefix}${this.name} **tree** apple`)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                .setTimestamp()
            );
            
        };

        
        if (!account) {
            return message.channel.send(
                new MessageEmbed()
                .setColor(config.color.red)
                .setTitle('Missing parameters!')
                .setDescription('You need to specify an account!')
                .addField('For example', `${config.prefix}${this.name} tree **apple**`)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                .setTimestamp()
            );            
        };

        const filePath = `${__dirname}/../stock/${args[0]}.txt`; 

        
        fs.appendFile(filePath, `${os.EOL}${args[1]}`, function (error) {
            if (error) return log.error(error); // 

            message.channel.send(
                new MessageEmbed()
                .setColor(config.color.green)
                .setTitle('Account added!')
                .setDescription(`Successfuly added \`${args[1]}\` account to \`${args[0]}\` service!`)
                .setFooter(message.author.tag, message.author.displayAvatarURL())
                .setTimestamp()
            ).then(message => message.delete({ timeout: 5000 })); 
        });
    }
};
