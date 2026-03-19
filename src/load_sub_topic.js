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
        .select('id, name')
        .eq('id', sub_topic_id) 
        .single();

    if (error || !sub_topic_data) {
        console.error("Error loading sub-topic:", error);
        document.getElementById('sub_topic').innerText = "Sub-topic not found";
        return;
    }

    const { data: prob_data, error: prob_error } = await Supabase
        .from('problems')
        .select('id, sub_topic, problem_number, type, difficulty, problem_text, solution, answer, sub_topic_id')
        .eq('sub_topic_id', sub_topic_data.id);

    if (prob_error || !prob_data) {
        console.error("Error loading problems:", prob_error);
        document.getElementById('error_container').innerText = "Problems not found";
        return;
    }

    console.log("Sub-topic data:", sub_topic_data);
    console.log(sub_topic_data.name);
    console.log("Problems data:", prob_data);
    
    const sub_topic_text = sub_topic_data.name.replace(/_/g, " ");

    document.getElementById('sub_topic').innerText = sub_topic_text;
    document.title = sub_topic_text;

    let html = "";

    prob_data.forEach(prob => {

        const local_storage_key = `${sub_topic_data.name}/problem_${prob.problem_number}_status`;
        let status = localStorage.getItem(local_storage_key);

        console.log(`Status for problem ${prob.problem_number}:`, status);
        console.log(`Local storage key: ${local_storage_key}`);

        if (status === "Completed") 
        {
            status = "- Completed";
        }
        else 
        {
            status = "- Not completed";
        }

        html += `<p class="problem"><a href="./problem.html?id=${prob.id}" class="a_problem">Problem ${prob.problem_number}</a><span class="status"> ${status}</span></li>`;
    });

    document.getElementById('problems_container').innerHTML = html;

}

load_sub_topic();