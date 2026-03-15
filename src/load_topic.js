const supabaseUrl = 'https://fzqehoqdprmyjycgexna.supabase.co';
const supabaseKey = 'sb_publishable_8zStLSmxvToxZLBuMkApag_Qc91Wd3V'; 
const Supabase = supabase.createClient(supabaseUrl, supabaseKey);

async function load_topic() {
    const url_params = new URLSearchParams(window.location.search);
    const topic_id = url_params.get('id'); 

    if (!topic_id) {
        console.error("Id error");
        document.getElementById('topic').innerText = "Id element error";
        return;
    }

    const { data: topic_data, error } = await Supabase
        .from('topics')
        .select('*')
        .eq('id', topic_id) 
        .single();

    if (error || !topic_data) {
        console.error("Error loading topic:", error);
        document.getElementById('topic').innerText = "Topic not found";
        return;
    }

    console.log("Topic data:", topic_data);

    const topic_text = topic_data.name.replace(/_/g, ' ');

    document.getElementById('topic').innerText = topic_text;

}

window.onload = load_topic;