# Izaro

Needed fix before everything else

1. Thanks to the new Exalted Orbs we can't search for "Exalted Orb" anymore as it shows up all possibilities. This needs to be fixed instantly.

Top Priority

1. Rework fetching league names, so I don't need duplicate codes to fetch leagues with one or to word names (or even worse if a league gets added that adds yet another word)
2. Rework Code-Structure to have commands put in own files, to not to have a huge single code file.
3. If more then 10 items are found, make the list multi-page
4. Adding reactions to the result list on finding multiple items, ranging from 0 - 9. On reaction edit the list to the result of the chosen item.


QoL

1. ~~Making the Botstatus only change on start-up and once every minute, so we don't send too much queries when the bot gets put/kicked from too many servers quick~~
2. Make all output in sexy embeds
3. Add a log function to fetch errors and put them per server in files, to ease up bug fixing
4. Add role-checks where needed to prevent useless console spam if bot doesn't have the rights to delete a message etc.
5. Already add the currency icon infront of the name in the list 
6. Create more ways to search
6a. Be able to search for quantities of items and have the bot show price for 1 item and the given quantity
6b. Be able to search for currency and price it up in any other given currency

Mayor next features, when those are done

1. Add Support for Database to allow a per server botconfiguration like own prefix and savestates
2. Allow servers to define a channel where Izaro automatically posts the new lab layouts each day (must be activated to be used)
3. Add a GGG-Trackerfunction for new threads in the 3 announcement forums, posts on a per userbase from reddit, twitter tracker from GGG People. All sources individually enableable with a preset channel per server. So admins can put up twitter tracker in one channel and reddit tracker on another.

More features in my head but first need to create this core base to add further things