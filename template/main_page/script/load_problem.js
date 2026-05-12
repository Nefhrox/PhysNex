import { Supabase } from '../../global_script/script.js';

async function load_problem() 
{
    // get problem id from url
    
    const urlParams = new URLSearchParams(window.location.search);
    const current_id = parseInt(urlParams.get('id'));
    
    // get problem data(id, type, difficulty, answer, solution, text of a problem, problem number)

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

        // hide and show answer using button

        document.getElementById('show_answer').onclick = () => {
        const el = document.getElementById('answer');
        if (el.style.display === "none")
        {
            el.style.display = "block";
        }
        else 
        {
            el.style.display = "none";
        }
    };


    // hide and show solution using button
    
    document.getElementById('show_solution').onclick = () => {
        const el = document.getElementById('solution');
        
        if (el.style.display === "none")
        {
            el.style.display = "block";
        }
        else 
        {
            el.style.display = "none";
        }
    };


    //insert data into page using data form database

    document.getElementById('problem_number').innerText = `Problem ${problem.problem_number}`;
    document.getElementById('type').innerText = problem.type;
    document.getElementById('difficulty').innerText = problem.difficulty;
    document.getElementById('problem_text').innerHTML = problem.problem_text;
    document.getElementById('answer').innerHTML = problem.answer;
    document.getElementById('solution').innerHTML = problem.solution;


    // hide answer and solution by default

    document.getElementById('answer').style.display = 'none';
    document.getElementById('solution').style.display = 'none';

    setup_return_link(problem);

    MathJax.typesetPromise();

    // user can mark problem as "completed" or "not completed"

    const status_button = document.getElementById('not_completed');
    const status_key = `${problem.sub_topic}/problem_${problem.problem_number}_status`;
    
    // check if next problem is completed
    // if there are no next problem hide link to next problem 

    const next_storage_key = `${problem.sub_topic}/problem_${problem.problem_number + 1}_status`;
    let next_prob_status = " ";
    let next_prob_status_css = " ";

    if (localStorage.getItem(next_storage_key) === "Completed")
    {
        next_prob_status = "Completed";
        next_prob_status_css = "completed_problem";

    }
    else 
    {
        next_prob_status = "Not completed";
        next_prob_status_css = "not_completed_problem";

    }

    // check if previous problem is completed
    // if there are no previous problem hide link to previous problem

    const prev_storage_key = `${problem.sub_topic}/problem_${problem.problem_number - 1}_status`;
    let prev_prob_status = " ";
    let prev_prob_status_css = " ";

    if (problem.problem_number > 1)
    {

        if (localStorage.getItem(prev_storage_key) === "Completed")
        {
            prev_prob_status = "Completed";
            prev_prob_status_css = "completed_problem";
        }
        else 
        {
            prev_prob_status = "Not completed";
            prev_prob_status_css = "not_completed_problem";
        }
    }
    else
    {
        prev_prob_status = "";
    }

    const current_status = localStorage.getItem(status_key);
    
    if (current_status === "Completed") 
    {
        status_button.innerHTML = "Completed";
        status_button.classList.remove("not_completed");
        status_button.classList.add("completed"); 
    }
    

    // set problem status depending on button that user clicks
    // if problem alreay completed user can click on button and set to "not completed"
    // if problem is not completed user can click on button and set to "completed"
    
    status_button.onclick = () => {
        if (localStorage.getItem(status_key) === "Completed") 
        {
            localStorage.setItem(status_key, "Not completed");
            status_button.innerHTML = "Not completed";
            status_button.classList.remove("completed");
            status_button.classList.add("not_completed");
        } else 
        {
            localStorage.setItem(status_key, "Completed");
            status_button.innerHTML = "Completed";
            status_button.classList.remove("not_completed");
            status_button.classList.add("completed");
        }
    };

    await setup_next_link(problem, prev_prob_status, next_prob_status, next_prob_status_css, prev_prob_status_css);
}



async function setup_next_link(current_problem, prev_prob_status, next_prob_status, next_prob_status_css, prev_prob_status_css) 
{

    // get data about next problem (id, difficulty, type etc.) to show in link to next problem

    const { data: next_prob } = await Supabase
        .from('problems')
        .select('id, difficulty, type')
        .eq('sub_topic', current_problem.sub_topic)
        .eq('topic', current_problem.topic)
        .eq('problem_number', current_problem.problem_number + 1)
        .maybeSingle();


    // get data about previous problem (id, difficulty, type etc.) to show in link to previous problem

    const { data: prev_prob } = await Supabase
        .from('problems')
        .select('id, difficulty, type')
        .eq('sub_topic', current_problem.sub_topic)
        .eq('topic', current_problem.topic)
        .eq('problem_number', current_problem.problem_number - 1)
        .maybeSingle();


    // setup link to next and previous problem
    // show difficulty, type and status of next and previous problem in link
    // if there are no next or previous problem or both hide link to them

    const next_link = document.getElementById('a_return_next');
    const prev_link = document.getElementById('a_return_prev');

    if (next_prob) 
    {
        next_link.href = `problem.html?id=${next_prob.id}`;
        next_link.innerHTML = `Next problem: difficulty ${next_prob.difficulty}/10; type ${next_prob.type}; <span class="${next_prob_status_css}">${next_prob_status}</span> ➡`;
    } 
    else 
    {
        next_link.style.display = 'none'; 
    }

    if (prev_prob) 
    {
        prev_link.href = `problem.html?id=${prev_prob.id}`;
        prev_link.innerHTML = `⬅ Previous problem: difficulty ${prev_prob.difficulty}/10; type ${prev_prob.type}; <span class="${prev_prob_status_css}">${prev_prob_status}</span>`;
    } 
    else 
    {
        prev_link.style.display = 'none';
    }
}



function setup_return_link(problem) 
{

    // set "back to $sub-topic" and back to $topic links
    
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
}

window.onload = load_problem;