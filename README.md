# Izaro
 POE Price-Check Bot for Discord

Strictly closed source

Current important Commands

++price "league" "currency"
Check the chosen league for the currency to see what it is currently worth
With Failsafe Checks. Needs Rework, see priority 1.

++leagues
Shows all currently active leagues. Excludes already finished leagues, privates leagues and SSF-Versions as they have no need to be listed.

++lab normal/curel/merciless/uber
Shows the current lablayout incl. the corresponding compass file 


To do list:

Top Priority

1. Rework fetching league names, so I don't need duplicate codes to fetch leagues with one or to word names (or even worse if a league gets added that adds yet another word)
2. Adding reactions to the result list on finding multiple items, ranging from 0 - 9. On reaction edit the list to the result of the chosen item.
3. If more then 10 items are found, make the list multi-page
4. Rework Code-Structure to have commands put in own files, to not to have a huge single code file.

QoL

1. ~~Making the Botstatus only change on start-up and once every minute, so we don't send too much queries when the bot gets put/kicked from too many servers quick~~
2. Make all output in sexy embeds
3. Add a log function to fetch errors and put them per server in files, to ease up bug fixing
4. Add role-checks where needed to prevent useless console spam if bot doesn't have the rights to delete a message etc.