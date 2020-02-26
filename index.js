const Discord = require("discord.js");
const fetch = require('node-fetch');
const math = require('mathjs');
const dateFormat = require('dateformat');
const config = require("./config.json");

const client = new Discord.Client();



client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 

  client.user.setActivity(`Slaughtering exiles in ${client.guilds.size} servers`);
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
			var leaguenameX = args[0];
			leaguenameX += " ";
			leaguenameX += args[1];
			var leaguenameY = args[0];
			//HC Check 
			if (leagues.some(element => element.name.toLowerCase() == leaguenameX.toLowerCase()) && leagues.some(element => element.active == true))
			{

				message.delete(1000);

				const file = await fetch('https://api.poe.watch/get?league='+leaguenameX+'&category=currency').then(response => response.json());
				var randomColor = '#' + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);
				var league=leaguenameX;
				//args.slice(3, args.length);
				Currency = args.slice(2, args.length).join(' ');
				let resultList = [];
				for(let i = 0; i < file.length; ++i) {
					let curCurrName = file[i].name;
					let curIcon = file[i].icon; // read icon from api
					if(curCurrName.toLowerCase().indexOf(Currency.toLowerCase()) > -1)
					{
						if(Currency.toLowerCase().indexOf("shard") === -1) { 
            						if(curCurrName.toLowerCase().indexOf("shard") === -1) {
                						resultList.push(curCurrName);
            						}
        					}
        					else {
            						if(curCurrName.toLowerCase().indexOf("shard") > -1) {
                						resultList.push(curCurrName);
            						}
        					}
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
					for(relativeIndex = 0; relativeIndex < 5; relativeIndex++) { 
						if(relativeIndex > (resultList.length - curIndex)) {
							break;
						}
					}
					let results = [];
					for(; curIndex < resultList.length; curIndex++) {
						results.push(resultList[curIndex]);
					}
					let curString="";
					
					if(resultList.length>10)
					{
						curString = "Too many results";
					}
					else
					{
						
						results.forEach(currency => { curString +=  currency + "\n"; });  
						 
					}
					
					const PoePriceEmbed = new Discord.RichEmbed()
					.setColor(randomColor)
					.setDescription("Found " + resultList.length + " items.\n" + curString)
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
			//Standard Check 
			else if(leagues.some(element => element.name.toLowerCase() == leaguenameY.toLowerCase() && leagues.some(element => element.active == true)))
			{

				message.delete(1000);
				
				const file = await fetch('https://api.poe.watch/get?league='+leaguenameY+'&category=currency').then(response => response.json());
				var randomColor = '#' + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);
				var league=args[0];
				args.shift();
				Currency = args.join(" ");
				
				let resultList = [];
				for(let i = 0; i < file.length; ++i) {
					let curCurrName = file[i].name;
					let curIcon = file[i].icon; // read icon from api
					if(curCurrName.toLowerCase().indexOf(Currency.toLowerCase()) > -1)
					{
						if(Currency.toLowerCase().indexOf("shard") === -1) { 
            						if(curCurrName.toLowerCase().indexOf("shard") === -1) {
                						resultList.push(curCurrName);
            						}
        					}
        					else {
            						if(curCurrName.toLowerCase().indexOf("shard") > -1) {
                						resultList.push(curCurrName);
            						}
        					}
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
					for(relativeIndex = 0; relativeIndex < 5; relativeIndex++) { 
						if(relativeIndex > (resultList.length - curIndex)) {
							break;
						}
					}
					let results = [];
					for(; curIndex < resultList.length; curIndex++) {
					results.push(resultList[curIndex]);
					}
					var curString=""; //first item undefined if not set to any value ref XCur1
					if(resultList.length>10)
					{
						curString = "Too many results";
					}
					else
					{
						//results.forEach(curIcon => { curString += curIcon + " "; }); // trying to add icon here later for now output its url 
						results.forEach(currency => { curString +=  currency + "\n"; });  
						//First item malformatted. If search for "alt" predicted output "Orb of Alteration" and "Exalted Orb". Orb of Alteration is an undefined result. XCur1 
					}
					
					const PoePriceEmbed = new Discord.RichEmbed()
					.setColor(randomColor)
					.setDescription("Found " + resultList.length + " items.\n" + curString)
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
		message.delete(1000);
		const UlabEmbed = new Discord.RichEmbed()
		.setColor(randomColor)
		.setDescription("This command has changed. It is now `++lab VERSION` like `++lab uber`")
		.setTimestamp()
		.setFooter("Requested by: " + message.author.username, message.author.avatarURL);
		message.channel.send(UlabEmbed);
	}
	if(command==="lab")
	{
		message.delete(1000);
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
		const UlabEmbed = new Discord.RichEmbed()
		.setColor(randomColor)
		.setImage(ulabdatei)
		.setDescription("Lab Compass File: " + labfile + "\n Image goes here\nLabcompass and Image by https://www.poelab.com")
		.setTimestamp()
		.setFooter("Requested by: " + message.author.username, message.author.avatarURL);
		message.channel.send(UlabEmbed);
	}
});
client.login(config.token);
