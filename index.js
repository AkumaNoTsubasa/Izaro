const Discord = require("discord.js");
const fetch = require('node-fetch');
const math = require('mathjs');
const dateFormat = require('dateformat');
const config = require("./config.json");

const client = new Discord.Client();

const sleep = duration => new Promise(res => setTimeout(res, duration));
const tick = () => new Promise(res => process.nextTick(() => res()));

const reactionListeners = new Map();

const resetReactionTimer = (() => {
	let timer = false;

	return async () => {
		if (timer !== false) {
			clearTimeout(timer);
			timer = false;
		}
		const now = Date.now();

		let next = Infinity;
		for (let listeners of reactionListeners.values()) {
			for (let listener of listeners) {
				if (listener.exceeded <= now) {
					tick().then(() => listener.remove(true));
					continue;
				}
				if (next > listener.exceeded) next = listener.exceeded;
			}
		}

		if (next < Infinity) timer = setTimeout(resetReactionTimer, Math.min(10000, Math.max(next - now, 0)));
	};
})();

const onReaction = (message, timeout, callback, removeCallback) => {
	let listeners;
	const messageId = message.id;

	if (!(listeners = reactionListeners.get(messageId))) {
		reactionListeners.set(messageId, listeners = []);
	}

	const listener = {
		exceeded: Date.now() + timeout,
		timeout,
		callback,
		removeCallback,
		remove: (timeoutExceeded) => {
			const index = listeners.indexOf(listener);
			if (index > -1) {
				listeners.splice(index, 1);
			}
			if (listeners.length === 0) {
				reactionListeners.delete(messageId);
			}
			if (listener.removeCallback) {
				listener.removeCallback(timeoutExceeded);
			}
		},
	};

	listeners.push(listener);

	resetReactionTimer();

	return listener;
}

const emitReaction = async (reaction, user) => {
	const listeners = reactionListeners.get(reaction.message.id);
	if (!listeners) return;

	listeners.forEach(listener => {
		listener.exceeded = Date.now() + listener.timeout;
		try {
			listener.callback(reaction, user);
		} catch (e) { }
	});

	resetReactionTimer();
};

client.on("ready", () => {
	console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`); 

	client.user.setActivity(`Slaughtering exiles in ${client.guilds.cache.size} servers`);

	client.on("messageReactionAdd", (reaction, user) => {
		if (user === client.user) return;
		emitReaction(reaction, user);
	});
});

client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});

var minutes = 1
var interval = minutes * 60 * 1000;
setInterval(function() {
    
	var nummer;
	var izarostatus = [
	  "Slaughtering exiles in " + client.guilds.size + " servers",
	  "++help", 
	  "++leagues",
	  "++price LEAGUE Currency",
	  "++lab uber"
	  ];
	var low = 0;
	var high = izarostatus.length;

	nummer = Math.floor(Math.random() * (high - low) + low);
	client.user.setActivity(izarostatus[nummer]);	
	//client.user.setActivity(`Slaughtering exiles in ${client.guilds.size} servers`);
}, interval);


client.on("message", async message => {

  if(message.author.bot || message.guild === null) return;
  /*
  if(message.guild === null)
  {
	var randomColor = '#' + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);
	const exampleEmbed = new Discord.MessageEmbed()
	.setColor(randomColor)
	.setTitle('New DM from ' + message.author.id)
	//.setURL('https://www.google.de')
	.setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
	//.setDescription('New DM from an User')
	.setThumbnail(message.author.avatarURL({dynamic: true}))
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
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
  }
  
  if(command === "invite")
  {
      message.channel.send('Izaro wants to see new servers as ideas for his labyrinth. Invite Izaro here: https://discordapp.com/oauth2/authorize?client_id=638458844770598914&scope=bot&permissions=392256');
  }

	if(command==="support")
	{
		message.channel.send("The Supportserver can be found here: https://discord.gg/SkzzY4q");
	}
	if(command==="help")
	{
		message.channel.send('I am currently in the works and in an early alpha-status. \n\nMy current commands are: `'+config.prefix+'price`, `'+config.prefix+'lab [normal/cruel/merciless/uber]`, `'+config.prefix+'leagues`. \n\nI have also some not yet public shown commands as they might result in weird behaviour. If you have any questions, you can message `Akuma no Tsubasa#0001`\n\nIf you need further help, you can request a Serverinvite to the Support Server with `'+config.prefix+'support`.');
	}

	
	if(command==="price") {
		if (args.length === 0) {
			message.delete({timeout: 1000});
			const file = await fetch('https://api.poe.watch/get?league=Blight&category=currency').then(response => response.json());
			var randomColor = '#' + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);

			var zufallsding = Math.floor(Math.random(0, file.length));

			var currencyname = file[zufallsding].name;
			var currencyvalue = file[zufallsding].median;

			const PoePriceEmbed = new Discord.MessageEmbed()
				.setColor(randomColor)
				.setDescription("You did not supply valid arguments, so I am showing you some random currency.\n\n***" + currencyname + "*** has currently a value of ***" + currencyvalue + " Chaos Orbs.***")
				.setTitle(message.content.substr(0, 256))
				.setTimestamp()
				.setFooter(`Requested by: ${message.author.username}`, message.author.avatarURL({dynamic: true}));
			message.channel.send(PoePriceEmbed);
		}
		else {
			const leagues = await fetch('https://api.poe.watch/leagues').then(response => response.json());

			const activeLeagues = leagues.filter(({ active }) => active);

			// we want to find the league. this variable should point towards it:
			let league;

			// possible argument configurations to find a league
			[
				`${args[0]} ${args[1]}`,
				args[0],
			]

				// change arguments to lower case
				.map(name => name.toLowerCase())

				// try to find the first match and abort further iterations
				.some(name => {
					// let's check if we can find the given name within the leagues:
					const _league = activeLeagues.find(league => {
						return league.name.toLowerCase() === name;
					});

					// if we do, let's remove the league from the arguments and return the league object.
					if (_league) {
						// this will split the name from "foo bar" into ["foo", "bar"]
						// with length we get 2
						// .splice(0, 2) will remove args[0] and args[1] and shift all the remaining arguments over
						// so args[2] becomes args[0] and args[3] becomes args[1] and so on.
						args.splice(0, name.split(" ").length);
						// we found the league. let's store it.
						league = _league;
						// by returning "true", .some will stop further iteration.
						return true;
					}
					// by returning "false", .some will continue further iteration.
					return false;
				});

			// at this point, if league === undefined, then we could not find a league.
			// if league is an object, we found a league and removed the name from args

			if (league) {

				message.delete({timeout: 1000});

				const allItems = await fetch(`https://api.poe.watch/get?league=${league.name}&category=currency`).then(response => response.json());
				const randomColor = '#' + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);
				const Currency = args.splice(0, args.length).join(' ');

				const items = allItems.filter(item => {
					const name = item.name.toLowerCase();
					const searchName = Currency.toLowerCase();

					if (name.includes(searchName)) {
						if (!searchName.includes("shard")) {
							if (!name.includes("shard")) {
								return true;
							}
						}
						else if (name.includes("shard")) {
							return true;
						}
					}
				});

				// no results
				if (items.length === 0) {
					const PoePriceEmbed = new Discord.MessageEmbed()
						.setColor(randomColor)
						.setDescription(`Sadly there is no currency called **${Currency}**.\nPlease use the exact name like \`Mirror of Kalandra\`.`)
						.setTitle(message.content.substr(0, 256))
						.setTimestamp()
						.setFooter(`Requested by: ${message.author.username}`, message.author.avatarURL({dynamic: true}));
					await message.channel.send(PoePriceEmbed);
				}
				// at least one result
				else {
					// if we only found one item, use it no matter if the name is not exact. search "foo" and find "foobar". if it's the only item, display the price.
					// if we found more than one item, try to find the exact match
					let item = items.length === 1 ? items[0] : items.find(({ name }) => name.toLowerCase() === Currency.toLowerCase());
					// if we found an item acording to the rule above, display it's price
					if (item) {
						const PoePriceEmbed = new Discord.MessageEmbed()
							.setColor(randomColor)
							.setDescription("**" + item.name + "** has currently a value of **" + item.median.toFixed(2) + "** Chaos Orbs or **" +
								item.exalted.toFixed(3) + "** Exalted Orbs in the **" + league.name + "** league.")
							.setTitle(message.content.substr(0, 256))
							.setThumbnail(item.icon.replace(/ /g, "%20"))
							.setTimestamp()
							.setFooter(`Requested by: ${message.author.username}`, message.author.avatarURL({dynamic: true}));
						await message.channel.send(PoePriceEmbed);
					}

					// if we found more than one item, display a list of items too:
					if (items.length > 1) {
						const names = items.map(({ name }) => name);
						const PoePriceEmbed = new Discord.MessageEmbed()
							.setTitle(message.content.substr(0, 256))
							.setColor(randomColor)
							.setTimestamp()
							.setFooter(`Requested by: ${message.author.username}`, message.author.avatarURL({dynamic: true}));

						const maximum = 10;
						let page = 0;
						const generatePage = (page = 0) => {
							const text = names.slice(maximum * page);
							if (text.length > 10) {
								text.splice(10);
								text.push("hit ➡️ to get to the next page");
							}

							if (page > 0) {
								text.unshift("hit ⬅️ to get to the previous page");
							}

							text.unshift(`Found ${items.length} items.${names.length > maximum ? ` Page ${page + 1} of ${Math.ceil(names.length / maximum)}` : ""}`);

							return PoePriceEmbed.setDescription(text.join("\n")).setTimestamp();
						}

						const listMessage = await message.channel.send(generatePage(0));

						if (names.length <= maximum) return;

						const back = await listMessage.react("⬅️");
						const close = await listMessage.react("🆗");
						const forward = await listMessage.react("➡️");

						const reactionListener = onReaction(listMessage, 10000, async (reaction, user) => {
							reaction.users.remove(user.id);

							if (user !== message.author) return;

							if (reaction === close) {
								reactionListener.remove();
								return;
							}

							if (reaction === back && page > 0) {
								await listMessage.edit(generatePage(--page));
								return;
							}

							if (reaction === forward && page < maximum) {
								await listMessage.edit(generatePage(++page));
								return;
							}
						}, async timeoutExceeded => {
							await listMessage.reactions.removeAll();
							return;
						});
					}
				}

			}
			else
			{
				const file = await fetch('https://api.poe.watch/leagues').then(response => response.json());
				var LigaListe = "";
				var LeagueName;
				var x = 0;
				var y = 1;
				var now = new Date().getTime;
				while (x < file.length) {
					if (file[x].active == true || file[x].upcoming == true) {
						if (!file[x].end && file[x].upcoming == false) {
							//LeagueName = file[x].name;
							LigaListe += y + ": " + file[x].name + "\n";
							x++;
							y++;

						}
						else if (!file[x].end && file[x].upcoming == true) {
							var leagueend = new Date(file[x].start).getTime();
							var now = new Date().getTime();
							var timespan = leagueend - now;
							var days = Math.floor(timespan / (1000 * 60 * 60 * 24));
							var hours = Math.floor((timespan % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
							var minutes = Math.floor((timespan % (1000 * 60 * 60)) / (1000 * 60));
							var seconds = Math.floor((timespan % (1000 * 60)) / 1000);
							LigaListe += y + ": " + file[x].name + " - Starts in: " + days + " days " + hours + " hours " + minutes + " minutes " + seconds + " seconds.\n";
							x++;
							y++;
						}
						else {

							var leagueend = new Date(file[x].end).getTime();
							var now = new Date().getTime();
							var timespan = leagueend - now;
							var days = Math.floor(timespan / (1000 * 60 * 60 * 24));
							var hours = Math.floor((timespan % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
							var minutes = Math.floor((timespan % (1000 * 60 * 60)) / (1000 * 60));
							var seconds = Math.floor((timespan % (1000 * 60)) / 1000);
							LigaListe += y + ": " + file[x].name + " - Ends in: " + days + " days " + hours + " hours " + minutes + " minutes " + seconds + " seconds.\n";
							x++;
							y++;
						}
					}
					else {
						x++;
					}
				}
				message.channel.send("Sorry, the league " + args[0] + " does not exist.\nCurrent Leagues are: \n" + LigaListe);
			}
		}
	}
	
	if(command==="leagues")
	{
				const file = await fetch('https://api.poe.watch/leagues').then(response => response.json());
				var LigaListe="";
				var LeagueName;
				var x = 0;
				var y = 1;
				var now = new Date().getTime;
				while (x < file.length)
				{
					if(file[x].active == true || file[x].upcoming== true)
					{
						if(!file[x].end && file[x].upcoming == false)
						{
							//LeagueName = file[x].name;
							LigaListe += y +": "+ file[x].name +"\n";
							x++;
							y++;

						}
						else if(!file[x].end && file[x].upcoming == true)
						{
							var leagueend = new Date(file[x].start).getTime();
							var now = new Date().getTime();
							var timespan = leagueend - now;
							var days = Math.floor(timespan / (1000 * 60 * 60 * 24));
							var hours = Math.floor((timespan % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
							var minutes = Math.floor((timespan % (1000 * 60 * 60)) / (1000 * 60));
							var seconds = Math.floor((timespan % (1000 * 60)) / 1000);
							LigaListe += y +": "+ file[x].name +" - Starts in: "+days+" days "+hours+" hours "+minutes+" minutes "+seconds+" seconds.\n";
							x++;
							y++;
						}
						else
						{

							var leagueend = new Date(file[x].end).getTime();
							var now = new Date().getTime();
							var timespan = leagueend - now;
							var days = Math.floor(timespan / (1000 * 60 * 60 * 24));
							var hours = Math.floor((timespan % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
							var minutes = Math.floor((timespan % (1000 * 60 * 60)) / (1000 * 60));
							var seconds = Math.floor((timespan % (1000 * 60)) / 1000);
							LigaListe += y +": "+ file[x].name +" - Ends in: "+days+" days "+hours+" hours "+minutes+" minutes "+seconds+" seconds.\n";
							x++;
							y++;
						}
					}
					else
					{
						x++;
					}
				}
				message.channel.send("Here is a list of all currently running leagues. Please note that *SSF* Leagues and private leagues are not listed.\nCurrent Leagues are: \n" + LigaListe);
	}
	
	if(command==="ulab" || command==="mlab" || command==="clab" || command==="nlab")
	{
		message.delete({timeout: 1000});
		const UlabEmbed = new Discord.MessageEmbed()
		.setColor(randomColor)
		.setDescription("This command has changed. It is now `++lab VERSION` like `++lab uber`")
		.setTimestamp()
		.setFooter("Requested by: " + message.author.username, message.author.avatarURL({dynamic: true}));
		message.channel.send(UlabEmbed);
	}
	if(command==="lab")
	{
		message.delete({timeout: 1000});
		if(dateFormat(now,"HH")<1)
		{
			var now = new Date();
			now.setDate(now.getDate()-1);
		}
		else
		{
			var now = new Date();
		}
		const dateiname=dateFormat(now, "isoDate");
		const ulabdatei="https://www.poelab.com/wp-content/labfiles/" + dateiname + "_"+args[0]+".jpg";
		const labfile = "https://www.poelab.com/wp-content/labfiles/"+args[0]+"-" + dateiname + ".json";
		const UlabEmbed = new Discord.MessageEmbed()
		.setColor(randomColor)
		.setImage(ulabdatei)
		.setDescription("Lab Compass File: " + labfile + "\n Image goes here\nLabcompass and Image by https://www.poelab.com")
		.setTimestamp()
		.setFooter("Requested by: " + message.author.username, message.author.avatarURL({dynamic: true}));
		message.channel.send(UlabEmbed);
	}
});
client.login(config.token);
