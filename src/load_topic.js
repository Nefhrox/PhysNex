import { Supabase } from './script.js';

async function load_topic() {
    const url_params = new URLSearchParams(window.location.search);
    const topic_id = url_params.get('id'); 

    if (!topic_id) {
        console.error("Id error");
        document.getElementById('topic').innerText = "Id element error";
        return;
    }

    const {data: topic, error: topics_error} = await Supabase
    .from('topics')
    .select('id, name, sub_topics (id, name)')
    .eq('id', topic_id)
    .single();

    if (topics_error || !topic) {
        console.error("Error loading topic:", topics_error);
        document.getElementById('topic').innerText = "Topic not found";
        return;
    }

    console.log("Topic data:", topic);

    const topic_text = topic.name.replace(/_/g, ' ');

    document.getElementById("topic").innerHTML = topic_text;
    document.getElementById("about_topic").innerHTML = topic_text;
    document.title = topic_text;

    let html = "";

    const sub_topics = topic.sub_topics;

    topic.sub_topics.forEach((sub_t, i) => {

        const is_last_el = (i === sub_topics.length - 1);
        const is_odd = (i % 2 === 1);
        let style = "";

        if(is_odd && is_last_el)
        {
            style = 'style="margin: 0px 0px 0px 58%; width: 80%;"';
        }

        html += `<li class="card" ${style}><a href="../template/sub_topic.html?id=${sub_t.id}" class="sub_toppic">${sub_t.name.replace(/_/g, " ")}</a></li>`;

    });

    document.getElementById("sub_topics_grid").innerHTML = html;

}

load_topic();