const fs = require("fs");
const fetch = require("node-fetch");
const { log } = console;
module.exports = async (username) => {
    //Get profile info:
    const response = await fetch(`https://www.instagram.com/${username}/?__a=1`);
    //Success or 
    if (response.status === 200) {
        //Get in JSON type:
        const body = await response.json();
        //Write to a file named username:
        fs.writeFileSync(`./data/${username}.json`, JSON.stringify(body));
        //Logging to console user infos:
        const user = body.graphql.user;
        log("Username:", user.username);
        log("Full Name:", user.full_name);
        log("Is private?", user.is_private ? 'Yes' : 'No');
        log("ID:", user.id);
        log("Followers:", user.edge_followed_by.count);
        log("Following:", user.edge_follow.count);
        log("Post Count:", user.edge_owner_to_timeline_media.count);
        log("\nWebsite:", user.external_url ? user.external_url : 'No');
        log("\nBiography:\n" + user.biography);

        //Download user profile photo:
        const pic = await fetch(user.profile_pic_url_hd);
        pic.body.pipe(fs.createWriteStream(`./images/${username}.png`));
        log(pic.status, 'Downloading profile photo is success');


    } else { //Not success
        console.error(response.status, "Write user name correctly.");
        return process.exit(0);
    }
}

