// Load up the discord.js library
const Discord = require("discord.js");

// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(`s'Update seul`);
});

client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.find(ch => ch.name === 'général');
  if (!channel) return;
  channel.send(`Bienvenue sur le serveur, ${member}`);
});

client.on('guildMemberRemove', member => {
  const channel = member.guild.channels.find(ch => ch.name === 'général');
  if (!channel) return;
  channel.send(`A+ Sous le bus, ${member}`);
});


client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.
  
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;
  
  // Also good practice to ignore any message that does not start with our prefix, 
  // which is set in the configuration file.
  if(message.content.indexOf(config.prefix) !== 0) return;
  
  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  // Let's go with a few common example commands! Feel free to delete or change those.
  
  if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! La latence est de  ${m.createdTimestamp - message.createdTimestamp}ms. latence API est de ${Math.round(client.ping)}ms`);
  }
  
  if(command === "say") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
    // To get the "message" itself we join the `args` back into a string with spaces: 
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{}); 
    // And we get the bot to say the thing: 
    message.channel.send(sayMessage);
  }
  
  
  if(command === "kick") {

    if(!message.member.roles.some(r=>["Staff", "Helpeurs"].includes(r.name)) )
      return message.reply("Désolé mais tu ne peux pas faire ça !");
    

    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("Merci de mentionner quelqu'un sur le serveur !");
    if(!member.kickable) 
      return message.reply("Mais attend ! Pourquoi tu veux kick un grade plus élevé que le tiens ! Noob va !");
    

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "Aucune raison";
    

    await member.kick(reason)
      .catch(error => message.reply(`Désolé ${message.author} tu ne peux pas car : ${error}`));
    message.reply(`${member.user.tag} vient d'être kick par ${message.author} pour: ${reason}`);

  }
  
  if(command === "ban") {
 
    if(!message.member.roles.some(r=>["Staff"].includes(r.name)) )
      return message.reply("Désolé mais tu ne peux pas faire ça !");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Merci de mentionner quelqu'un sur le serveur !");
    if(!member.bannable) 
      return message.reply("Mais attend ! Pourquoi tu veux kick un grade plus élevé que le tiens ! Noob va !");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "Aucune raison";
    
    await member.ban(reason)
      .catch(error => message.reply(`Désolé ${message.author} tu ne peux pas car : ${error}`));
    message.reply(`${member.user.tag} a été ban  ${message.author} pour: ${reason}`);
  }
  
  if(command === "purge") {
    
    const deleteCount = parseInt(args[0], 10);
    
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Merci de sélectionné un nombre de message entre 2 et 100");
    
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`tu ne peux pas supprimer ces messages car : ${error}`));
  }

});

client.login(config.token);