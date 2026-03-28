import { Supabase } from './script.js';

async function load_catalog()
{

    const data_container = document.getElementById("data_container");

    const {data: topic, error: topics_error} = await Supabase
    .from('topics')
    .select('id, name, image_name, sub_topics (id, name)');

    if (topics_error) 
    {
        console.error("Error loading topics ", topics_error);
        document.getElementById('data_container').innerText = "Error loading topics";
    }

    let html = "";

    const bucket = Supabase.storage.from('style images');

    const logo = bucket.getPublicUrl('physnex.png');
    const discord_icon = bucket.getPublicUrl('discord_icon.png');
    const gmail_icon = bucket.getPublicUrl('gmail_icon.png');

    document.getElementById('physnex').src = logo.data.publicUrl;
    document.getElementById('discord_icon').src = discord_icon.data.publicUrl;
    document.getElementById('gmail_icon').src = gmail_icon.data.publicUrl;


    topic.forEach(topic => {

        const img_name = topic.image_name;
        const img_url = bucket.getPublicUrl(img_name).data.publicUrl;

        html += `<li class="topic">
        <div class="topic_header">
        <a href="./template/topic.html?id=${topic.id}">${topic.name.replace(/_/g, " ")}</a>
        <img src="${img_url}.png" class="topic_image"></img></div><ul>`;
        console.log("img url ", img_url);

        topic.sub_topics.forEach(sub_t => {
            html += `<li class="sub_topic"><a href="./template/sub_topic.html?id=${sub_t.id}">${sub_t.name.replace(/_/g, " ")}</a></li>`;
        });
        html += `</ul></li>`;
    });
    
    data_container.innerHTML = html;
}

load_catalog();