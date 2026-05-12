import { Supabase } from '../../global_script/script.js';

async function load_catalog()
{

    const data_container = document.getElementById("data_container");

    // get data about topics (id, name, image name(to display correct image), sub-topics(and their id and name))

    const {data: topic, error: topics_error} = await Supabase
    .from('topics')
    .select('id, name, image_name, sub_topics (id, name)');

    if (topics_error) 
    {
        console.error("Catalog error", topics_error);
        document.getElementById('data_container').innerText = "Error loading topics";
    }

    let html = "";

    // get logo for website

    const bucket = Supabase.storage.from('structure_img');

    const logo = bucket.getPublicUrl('physnex.png');

    document.getElementById('physnex').src = logo.data.publicUrl;

    // create html table for topics

    topic.forEach(topic => {

        const img_name = topic.image_name;
        const img_url = bucket.getPublicUrl(img_name).data.publicUrl;

        html += `<li class="topic">
        <div class="topic_header">
        <a href="./template/main_page/topic.html?id=${topic.id}">${topic.name.replace(/_/g, " ")}</a>
        <img src="${img_url}.png" class="topic_image"></img></div><ul>`;

        topic.sub_topics.forEach(sub_t => {
            html += `<li class="sub_topic"><a href="./template/main_page/sub_topic.html?id=${sub_t.id}">${sub_t.name.replace(/_/g, " ")}</a></li>`;
        });
        html += `</ul></li>`;
    });
    
    data_container.innerHTML = html;
}

load_catalog();