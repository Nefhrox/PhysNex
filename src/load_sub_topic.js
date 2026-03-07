const supabaseUrl = 'https://fzqehoqdprmyjycgexna.supabase.co';
const supabaseKey = 'sb_publishable_8zStLSmxvToxZLBuMkApag_Qc91Wd3V'; 
const Supabase = supabase.createClient(supabaseUrl, supabaseKey);

async function load_sub_topic() {
    const urlParams = new URLSearchParams(window.location.search);
    const subTopicId = urlParams.get('id'); 

    if (!subTopicId) {
        console.error("Id error");
        document.getElementById('sub_topic').innerText = "Id element error";
        return;
    }

    const { data: subTopicData, error } = await Supabase
        .from('sub_topics')
        .select('*')
        .eq('id', subTopicId) 
        .single();

    if (error || !subTopicData) {
        console.error("Error loading sub-topic:", error);
        document.getElementById('sub_topic').innerText = "Sub-topic not found";
        return;
    }

    const topicTitle = subTopicData.topic.replace(/_/g, ' ');
    const subTopicTitle = subTopicData.sub_topic.replace(/_/g, ' ');

    document.getElementById('sub_topic').innerText = `${topicTitle} - ${subTopicTitle}`;

}

window.onload = loadSubTopic;