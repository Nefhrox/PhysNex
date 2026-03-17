import { Supabase } from './script.js';

async function load_sub_topic() {
    const url_params = new URLSearchParams(window.location.search);
    const sub_topic_id = url_params.get('id'); 

    if (!sub_topic_id) {
        console.error("Id error");
        document.getElementById('sub_topic').innerText = "Id element error";
        return;
    }

    const { data: sub_topic_data, error } = await Supabase
        .from('sub_topics')
        .select('*')
        .eq('id', sub_topic_id) 
        .single();

    if (error || !sub_topic_data) {
        console.error("Error loading sub-topic:", error);
        document.getElementById('sub_topic').innerText = "Sub-topic not found";
        return;
    }

    console.log("Sub-topic data:", sub_topic_data);
    
    const sub_topic_text = sub_topic_data.name.replace(/_/g, " ");

    document.getElementById('sub_topic').innerText = sub_topic_text;

}

window.onload = load_sub_topic;