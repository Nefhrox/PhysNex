const supabaseUrl = 'https://fzqehoqdprmyjycgexna.supabase.co';
const supabaseKey = 'sb_publishable_8zStLSmxvToxZLBuMkApag_Qc91Wd3V'; 

export const Supabase = supabase.createClient(supabaseUrl, supabaseKey);

const MAX_RESULTS = 10;

window.perform_search = async function(query) 
{
    const results_container = document.getElementById("search_results");
    const lower_query = query.trim().toLowerCase();

    if (lower_query === "")
    {
        results_container.innerHTML = "";
        return;
    }


    try 
    {
        const promise_problems = Supabase
        .from('problems')
        .select('id, problem_number, topic, sub_topic, difficulty, type')
        .or(`problem_text.ilike.%${lower_query}%, topic.ilike.%${lower_query}%, sub_topic.ilike.%${lower_query}%`)
        .limit(7)   

        const promise_sub_topics = Supabase
        .from('sub_topics')
        .select('id, name')
        .ilike('name', `%${lower_query}%`)
        .limit(4)

        const promise_topics = Supabase
        .from('topics')
        .select('id, name')
        .ilike('name', `%${lower_query}%`)
        .limit(1)

        const [problem_result, sub_topic_result, topics_result] = await Promise.all([promise_problems, promise_sub_topics, promise_topics]);

        let all_results = [];

        if (topics_result.data)
        {
            topics_result.data.forEach(topic => all_results.push({ type: 'topic', id: topic.id, name: topic.name }));
        }

        if (sub_topic_result.data)
        {
            sub_topic_result.data.forEach(sub_topic => all_results.push({ type: 'sub_topic', id: sub_topic.id , name: sub_topic.name }));
        }
        
        if (problem_result.data)
        {
            problem_result.data.forEach(prob => all_results.push({ 
                category: 'problem', 
                id: prob.id, 
                problem_number: prob.problem_number, 
                topic: prob.topic, 
                sub_topic: prob.sub_topic, 
                sub_topic_id: prob.sub_topic_id,
                difficulty: prob.difficulty, 
                type: prob.type 
            }));
        }

        search_results(all_results.slice(0, MAX_RESULTS), results_container);
    }
    catch (error)
    {
        console.error("Error on collecting data:", error);
    }
};


function search_results(results, container) 
{
    let html = "<div class='search_list'>";

    results.forEach(result => {
        let url = "";
        let label_class = "";
        let display_text = result.name || "";
        let label_text = "";

        if (result.category === "problem") 
        {

            url = `./template/problem.html?id=${result.id}`;
            label_class = "problem-label";
            display_text = `Problem ${result.problem_number}`;
            label_text = `[${result.type}]` || "";
        }
        else if (result.type === "sub_topic") 
        {
            url = `./template/sub_topic.html?id=${result.id}`;
            label_class = "sub-topic-label";
            display_text = result.name || "Error on sub-topic name";
            label_text = "[sub-topic]";
        }
        else if (result.type === "topic") 
        {
            url = `./template/topic.html?id=${result.id}`;
            label_class = "topic-label";
            display_text = result.name || "Error on topic name";
            label_text = "[topic]";
        }

            let storage_key = `${result.sub_topic}/problem_${result.problem_number}_status`;
            let status = localStorage.getItem(storage_key);
            let status_css = status;

            if (status === "Completed") 
            {
                status = "- Completed";
                status_css = "completed";
            }
            else 
            {
                status = "- Not Completed";
                status_css = "not_completed";
            }


        const safe_text = (display_text || "").replace(/_/g, ' ');
        const safe_sub_topic = (result.sub_topic || "").replace(/_/g, ' ');

        html += `<div class="search_results"> <span class="search-label_${label_class}">${label_text}</span>
        <a href="${url}" class="search-link">${safe_text}</a>${result.category === "problem" ? `<span class="search_info"> in ${safe_sub_topic} <span class="status ${status_css}">${status}</span></span>` : ''}</div>`;
    });

    html += "</div>";
    container.innerHTML = html;
}