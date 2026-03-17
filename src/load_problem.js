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

    setup_next_link(problem);

    setup_return_link(problem);

    MathJax.typesetPromise();


    const status_button = document.getElementById('not_completed');
    const status_key = `${problem.topic}/${problem.sub_topic}/problem_${problem.problem_number}_status`;
    
    
    const currentStatus = localStorage.getItem(status_key);
    
    if (currentStatus === "Completed") 
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
}

async function setup_next_link(current_problem) 
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
        next_link.innerText = `Next problem: difficulty ${next_prob.difficulty}/10; type ${next_prob.type} ➡`;
    } else 
    {
        next_link.style.display = 'none'; 
    }

    if (prev_prob) 
    {
        prev_link.href = `problem.html?id=${prev_prob.id}`;
        prev_link.innerText = `⬅ Previous problem: difficulty ${prev_prob.difficulty}/10; type ${prev_prob.type}`;
    } else 
    {
        prev_link.style.display = 'none';
    }
}

function setup_return_link(problem) 
{
    const topicPage = `${problem.topic}.html`.toLowerCase();
    const subTopicPage = `${problem.sub_topic}.html`.toLowerCase();

    document.getElementById('return_topic').href = topicPage;
    document.getElementById('return_topic').innerText = `Back to ${problem.topic.replace(/_/g, ' ')}`;
    
    document.getElementById('return_sub-topic').href = subTopicPage;
    document.getElementById('return_sub-topic').innerText = `Back to ${problem.sub_topic.replace(/_/g, ' ')}`;
}

window.onload = load_problem;