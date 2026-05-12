import { Supabase } from '../../global_script/script.js';

// get id from url parameters of the page
const url_params = new URLSearchParams(window.location.search);
const current_topic_id = url_params.get('id');


if (!current_topic_id)
{
    console.error("Topic id error");
}


// get data about formulae and topics 

const { data: formulae, error: formulae_error } = await Supabase
.from('formula_sections')
.select('name, formula_items(latex_code,description)')
.eq('topic_id', current_topic_id);

const { data: topic_data, error: topic_error } = await Supabase
.from('topics')
.select('name')
.eq('id', current_topic_id)
.single();


// replace "_" with " "
const topic_name = topic_data.name.replace(/_/g, " ");


if (formulae_error)
{
    console.log("Formulae error", formulae_error);
}

if (topic_error) 
{
    console.error("Topic error", topic_error);
}

let html = ""; 


// go through each sub-topic

formulae.forEach(formula => {
    html += `<h2 class="sub-topic">${formula.name}</h2>`;

    formula.formula_items.forEach(item => {
        html += `<p class="formula_container"><span class="formula">\\( \\pmb{${item.latex_code}} \\) </span> <span class="formula_dash"> — </span> <span class="formula_description">${item.description}</span></p>`;
    });
});



document.getElementById('formulae_container').innerHTML = html;
document.getElementById('topic').innerText = topic_name;


window.MathJax.typesetPromise();