import { Supabase } from './script.js';

async function load_problem() 
{
    
    const urlParams = new URLSearchParams(window.location.search);
    const current_id = parseInt(urlParams.get('id'));
    
    const { data: problem, error } = await Supabase
        .from('problems')
        .select('*')
        .eq('id', current_id)
        .single();

    if (error || !problem) 
    {
        console.error("Error loading problem:", error);
        document.getElementById('problem_title').innerText = "Problem not found";
        return;
    }

        document.getElementById('show_answer').onclick = () => {
        const el = document.getElementById('answer');
        el.style.display = el.style.display === 'none' ? 'block' : 'none';
    };
    
    document.getElementById('show_solution').onclick = () => {
        const el = document.getElementById('solution');
        el.style.display = el.style.display === 'none' ? 'block' : 'none';
    };


    document.getElementById('problem_number').innerText = `Problem ${problem.problem_number}`;
    document.getElementById('type').innerText = problem.type;
    document.getElementById('difficulty').innerText = problem.difficulty;
    document.getElementById('problem_text').innerHTML = problem.problem_text;
    document.getElementById('answer').innerHTML = problem.answer;
    document.getElementById('solution').innerHTML = problem.solution;


    document.getElementById('answer').style.display = 'none';
    document.getElementById('solution').style.display = 'none';

    setup_return_link(problem);

    MathJax.typesetPromise();


    const status_button = document.getElementById('not_completed');
    const status_key = `${problem.sub_topic}/problem_${problem.problem_number}_status`;
    

    const next_storage_key = `${problem.sub_topic}/problem_${problem.problem_number + 1}_status`;
    let next_prob_status = " ";

    if (localStorage.getItem(next_storage_key) === "Completed")
    {
        next_prob_status = "Completed";
    }
    else 
    {
        next_prob_status = "Not completed";
    }


    const prev_storage_key = `${problem.sub_topic}/problem_${problem.problem_number - 1}_status`;
    let prev_prob_status = " ";

    if (problem.problem_number > 1)
    {

        if (localStorage.getItem(prev_storage_key) === "Completed")
        {
            prev_prob_status = "Completed";
        }
        else 
        {
            prev_prob_status = "Not completed";
        }
    }
    else
    {
        prev_prob_status = "";
    }

    const current_status = localStorage.getItem(status_key);
    
    if (current_status === "Completed") 
    {
        status_button.innerText = "Completed";
        status_button.classList.remove("not_completed");
        status_button.classList.add("completed"); 
    }
    
    
    status_button.onclick = () => {
        if (localStorage.getItem(status_key) === "Completed") 
        {
            localStorage.setItem(status_key, "Not completed");
            status_button.innerText = "Not completed";
            status_button.classList.remove("completed");
            status_button.classList.add("not_completed");
        } else 
        {
            localStorage.setItem(status_key, "Completed");
            status_button.innerText = "Completed";
            status_button.classList.remove("not_completed");
            status_button.classList.add("completed");
        }
    };

    await setup_next_link(problem, prev_prob_status, next_prob_status);
}



async function setup_next_link(current_problem, prev_prob_status, next_prob_status) 
{
    const { data: next_prob } = await Supabase
        .from('problems')
        .select('id, difficulty, type')
        .eq('sub_topic', current_problem.sub_topic)
        .eq('topic', current_problem.topic)
        .eq('problem_number', current_problem.problem_number + 1)
        .maybeSingle();


    const { data: prev_prob } = await Supabase
        .from('problems')
        .select('id, difficulty, type')
        .eq('sub_topic', current_problem.sub_topic)
        .eq('topic', current_problem.topic)
        .eq('problem_number', current_problem.problem_number - 1)
        .maybeSingle();

    const next_link = document.getElementById('a_return_next');
    const prev_link = document.getElementById('a_return_prev');

    if (next_prob) 
    {
        next_link.href = `problem.html?id=${next_prob.id}`;
        next_link.innerText = `Next problem: difficulty ${next_prob.difficulty}/10; type ${next_prob.type}; ${next_prob_status} ➡`;
    } else 
    {
        next_link.style.display = 'none'; 
    }

    if (prev_prob) 
    {
        prev_link.href = `problem.html?id=${prev_prob.id}`;
        prev_link.innerText = `⬅ Previous problem: difficulty ${prev_prob.difficulty}/10; type ${prev_prob.type}; ${prev_prob_status}`;
    } else 
    {
        prev_link.style.display = 'none';
    }
}



function setup_return_link(problem) 
{
    
    const sub_topic_name_link = document.getElementById('sub_topic_name_link');
    const topic_name_link = document.getElementById('topic_name_link');

    sub_topic_name_link.innerText = problem.sub_topic.replace(/_/g, " ");
    topic_name_link.innerText = problem.topic.replace(/_/g, " ");

    const a_return_sub_topic = document.getElementById('return_sub_topic');
    const a_return_topic = document.getElementById('return_topic');

    a_return_sub_topic.href = `./sub_topic.html?id=${problem.sub_topic_id}`;
    a_return_topic.href = `./topic.html?id=${problem.topic_id}`;
    
    const span_sub_topic_name = document.getElementById('sub_topic_name_link');
    const span_topic_name = document.getElementById('topic_name_link');

    span_sub_topic_name.innerText = problem.sub_topic.replace(/_/g, " ");
    span_topic_name.innerText = problem.topic.replace(/_/g, " ");

    console.log(span_sub_topic_name.innerText);
    console.log(span_topic_name.innerText);     
}

window.onload = load_problem;