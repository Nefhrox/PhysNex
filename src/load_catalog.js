import { Supabase } from './script.js';

async function load_catalog()
{

    const data_container = document.getElementById("data_container");

    const {data: topic, error: topics_error} = await Supabase
    .from('topics')
    .select('id, name, sub_topics (id, name)');

    if (topics_error) 
    {
        console.error("Error loading topics ", topics_error);
        document.getElementById('topics').innerText = "Error loading topics";
    }

    let html = "";



    topic.forEach(topic => {

        html += `<li class="topic"><div class="topic_header"><a href="./template/topic.html?id=${topic.id}">${topic.name.replace(/_/g, " ")}</a></div><ul>`;

        topic.sub_topics.forEach(sub_t => {
            html += `<li class="sub_topic"><a href="./template/sub_topic.html?id=${sub_t.id}">${sub_t.name.replace(/_/g, " ")}</a></li>`;
        });
        html += `</ul></li>`;
    });
    
    data_container.innerHTML = html;
}

load_catalog();