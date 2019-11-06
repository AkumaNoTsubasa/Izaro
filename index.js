const Discord = require("discord.js");
const fetch = require('node-fetch');
const math = require('mathjs');
const config = require("./config.json");

const client = new Discord.Client();

client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 

  client.user.setActivity(`Slaughtering exiles in ${client.guilds.size} servers`);
});

client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Slaughtering exiles in ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Slaughtering exiles in ${client.guilds.size} servers`);
});

client.on("message", async message => {

  if(message.author.bot) return;
  /*
  if(message.guild === null)
  {
	var randomColor = '#' + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);
	const exampleEmbed = new Discord.RichEmbed()
	.setColor(randomColor)
	.setTitle('New DM from ' + message.author.id)
	//.setURL('https://www.google.de')
	.setAuthor(message.author.username, message.author.avatarURL)
	//.setDescription('New DM from an User')
	.setThumbnail(message.author.avatarURL)
	.addField('DM Content', message.content)
	.addBlankField()
	.setTimestamp()
	.setFooter('Kanna Kamuis DM report', 'https://i.imgur.com/F8ovkgb.gif');

	client.channels.get(`636897256368242719`).send(exampleEmbed);
  }*/
  
  if(message.author.id==='247655326831083520')
  {
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    
    if(command==="adminshowbotsize")
    {
        message.channel.send("I am currently on " + client.guilds.size + " servers and I can see " + client.users.size + " Users");
    }
  }

  if(message.content.indexOf(config.prefix) !== 0) return;

  const args = message.content.slice(config.prefix.length).trim().split(" ");

  const command = args.shift().toLowerCase();

  if(command === "ping") {
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }
  
  if(command === "invite")
  {
      message.channel.send('Izaro wants to see new servers as ideas for his labyrinth. Invite Izaro here: https://discordapp.com/oauth2/authorize?client_id=638458844770598914&scope=bot&permissions=392257');
  }

	if(command==="support")
	{
		message.channel.send("The Supportserver can be found here: https://discord.gg/SkzzY4q");
	}
	if(command==="help")
	{
		message.channel.send('I am currently in the works and in an early alpha-status. \n\nMy current commands are: `'+config.prefix+'price`. \n\nI have also some not yet public shown commands as they might result in weird behaviour. If you have any questions, you can message `Akuma no Tsubasa#0001`\n\nIf you need further help, you can request a Serverinvite to the Support Server with `§support`.');
	}

	
	if(command==="price")
	{
		if(!args.length)
		{		
		message.delete(1000);
		const file = await fetch('https://api.poe.watch/get?league=Blight&category=currency').then(response => response.json());
		var randomColor = '#' + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);
		
		var zufallsding = math.floor(math.random(0,file.length));
		
		var currencyname = file[zufallsding].name;
		var currencyvalue = file[zufallsding].median;
		
		const PoePriceEmbed = new Discord.RichEmbed()
		.setColor(randomColor)
		.setDescription("You did not supply valid arguments, so I am showing you some random currency.\n\n***"+ currencyname + "*** has currently a value of ***"+ currencyvalue + " Chaos Orbs.***")
		.setTimestamp()
		.setFooter("Requested by: "+message.author.username, message.author.avatarURL);
		message.channel.send(PoePriceEmbed);
		}
		else
		{		
			const leagues = await fetch('https://api.poe.watch/leagues').then(response => response.json());
			if (leagues.some(element => element.name.toLowerCase() == args[0].toLowerCase()))
			{

				message.delete(1000);
				
				const file = await fetch('https://api.poe.watch/get?league='+args[0]+'&category=currency').then(response => response.json());
				var randomColor = '#' + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);
				var league=args[0];
				args.shift();
				Currency = args.join(" ");
				
				let resultList = [];
				for(let i = 0; i < file.length; ++i) {
					let curCurrName = file[i].name;
					if(curCurrName.toLowerCase().indexOf(Currency.toLowerCase()) > -1)
					{
						resultList.push(curCurrName);
					}
				}

				if(resultList.length < 1)
				{ 
					const PoePriceEmbed = new Discord.RichEmbed()
					.setColor(randomColor)
					.setDescription("Sadly there is no currency called **" + Currency + "**. Please check the exact name incl. captital letters like `Mirror of Kalandra` instead of `mirror of kalandra`.")
					.setTimestamp()
					.setFooter("Requested by: " + message.author.username, message.author.avatarURL);
					message.channel.send(PoePriceEmbed);
				}
				else if(resultList.length > 1) {
					let curIndex = 0;
					let relativeIndex; 
					for(relativeIndex = 0; relativeIndex < 5; ++relativeIndex) { 
						if(relativeIndex > (resultList.length - curIndex)) {
							break;
						}
					}
					let results = [];
					for(; curIndex < resultList.length - curIndex; ++curIndex) {
						results.push(resultList[curIndex]);
					}
					let curString;
					
					results.forEach(currency => { curString += currency + "\n"; });

					const PoePriceEmbed = new Discord.RichEmbed()
					.setColor(randomColor)
					.setDescription("There has been " + resultList.length + " found.\n" + curString)
					.setTimestamp()
					.setFooter("Requested by: " + message.author.username, message.author.avatarURL);
					message.channel.send(PoePriceEmbed);
					// Add cool reactions here
					// Await for user reaction
					// this code should run in a loop ! so that curIndex can increment and decrement depending on user input.
				}

				else
				{ 
					let curr = file.find(element => element.name.toLowerCase() === resultList[0].toLowerCase());
					league[0] = league[0].toUpperCase();
					const PoePriceEmbed = new Discord.RichEmbed()
					.setColor(randomColor)
					.setDescription("**" + curr.name + "** has currently a value of **"+ curr.median.toFixed(2) + "** Chaos Orbs or **" +
					 	curr.exalted.toFixed(3) + "** Exalted Orbs in the **" + league + "** league.")
					.setThumbnail(curr.icon)
					.setTimestamp()
					.setFooter("Requested by: " + message.author.username, message.author.avatarURL);
					message.channel.send(PoePriceEmbed);
				}
			}
			else
			{
				const file = await fetch('https://api.poe.watch/leagues').then(response => response.json());
				var LigaListe="";
				var LeagueName;
				var x = 0;
				while (x < file.length)
				{
					//LeagueName = file[x].name;
					LigaListe += x +": "+ file[x].name +"\n ";
					x++;
				}
				message.channel.send("Sorry, the league " + args[0] + " does not exist.\nCurrent Leagues are: \n" + LigaListe);
			}
		}
		
		

		
		
	}
});
client.login(config.token);
