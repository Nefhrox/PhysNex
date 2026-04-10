import { Supabase } from '../../src/script.js';

const url_params = new URLSearchParams(window.location.search);
const current_topic_id = url_params.get('id');

console.log("current_topic_id", current_topic_id);

if (!current_topic_id)
{
    console.error("Topic id error");
}


const { data: formulae, error: formulae_error } = await Supabase
.from('formula_sections')
.select('name, formula_items(latex_code,description)')
.eq('topic_id', current_topic_id);

const { data: topic_data, error: topic_error } = await Supabase
.from('topics')
.select('name')
.eq('id', current_topic_id)
.single();


const topic_name = topic_data.name.replace(/_/g, " ");

if (formulae_error)
{
    console.log("Error on formulae data ", formulae_error);
}

if (topic_error) 
{
    console.error("Error on topic data ", topic_error);
}

let html = ""; 

formulae.forEach(formula => {
    html += `<h2 class="sub-topic">${formula.name}</h2>`;

    formula.formula_items.forEach(item => {
        html += `<p class="formula_container"><span class="formula">${item.latex_code}</span> <span class="formula_dash"> — </span> <span class="formula_description">${item.description}</span></p>`;
    });
});


window.MathJax.typesetPromise();

document.getElementById('formulae_container').innerHTML = html;
document.getElementById('topic').innerText = topic_name;