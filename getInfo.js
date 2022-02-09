const fs = require("fs");
const fetch = require("node-fetch");

module.exports = async (username) => {

    const response = await fetch(`https://www.instagram.com/${username}/?__a=1`);

    if (response.status === 200) {
        const body = await response.json();
        fs.writeFileSync(`./data/${username}.json`, JSON.stringify(body));
        console.log("Username:", body.graphql.user.username);
        console.log("Full Name:", body.graphql.user.full_name);
        console.log("Is private?", (body.graphql.user.is_private) ? 'Yes' : 'No');
        console.log("ID:", body.graphql.user.id);
        console.log("Followers:", body.graphql.user.edge_followed_by.count);
        console.log("Following:", body.graphql.user.edge_follow.count);
        console.log("Post Count:", body.graphql.user.edge_owner_to_timeline_media.count);
        console.log("Biography:\n", body.graphql.user.biography);
        console.log("Website:", (body.graphql.user.external_url) ? body.graphql.user.external_url : 'No');

        fetch(body.graphql.user.profile_pic_url_hd).then(res => {
            res.body.pipe(fs.createWriteStream(`./images/${username}.png`));
         console.log(res.status, 'Downloading profile photo is success');

        });
      
    } else {
        console.error(response.status, "Write user name correctly.");
        return process.exit(0);
    }
}

