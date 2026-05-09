import { Supabase } from './script.js';                  

let current_deck = [];
let current_deck_index = 0;



//Fisher-Yates shuffle algorithm

function shuffle(array) 
{
    for (let i = array.length - 1; i > 0; i--) 
    {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}



function show_card() 
{
    const container = document.getElementById("formulae_container");
    const item = current_deck[current_deck_index];


    container.innerHTML = `
        <div class="card_container">
            <div class="card" onclick="this.classList.toggle('flipped')">
                <div class="front">
                    <p class="label">Name:</p>
                    <p class="text">${item.name}</p>
                </div>
                <div class="back">
                    <p class="label">${item.name}</p>
                    <p class="text">\\( ${item.latex} \\)</p>
                </div>
            </div>
            <button class="next_card" onclick="nextCard()">Next formula →</button>
        </div>
    `;


    if (window.MathJax) 
    {
        window.MathJax.typesetPromise();
    }
}

function nextCard() {
    current_deck_index = (current_deck_index + 1) % current_deck.length; 
    console.log("Current index:", current_deck_index);
    show_card();
}



async function get_formulae() {
    
    try {

        const url_params = new URLSearchParams(window.location.search);
        const sub_topic_id = url_params.get("id");



        const { data: formula_data, error: formula_error } = await Supabase
        .from("formula_items")
        .select("latex_code, description, section_id")
        .eq("section_id", sub_topic_id);

        const { data: data_formula_sections, error: error_sections } = await Supabase
        .from("formula_sections")
        .select("topic_id")
        .eq("id", sub_topic_id)
        .single();

        const { data: data_topic, error: error_topic } = await Supabase
        .from("topics")
        .select("name, id")
        .eq("id", data_formula_sections.topic_id)
        .single();

        if (error_sections)
        {
            console.log("Error loading section data ", error_sections);
        }

        if (error_topic)
        {
            console.log("Error loading topic data ", error_topic);
        }

        if (formula_error)
        {
            console.error("Error on loading formula data ", formula_error);
        }

        const link_back_topic = document.getElementById("link_back_topic");
        link_back_topic.href = `./recall_topic.html?id=${data_topic.id}`;
        link_back_topic.innerText = `⬅ Back to ${data_topic.name.replace(/_/g, " ")}`;


        const formula_get = formula_data.map(item => ({
            latex: item.latex_code,
            name: item.description
        }));

        if (formula_get.length > 0)
        {
            current_deck = shuffle(formula_get);
            current_deck_index = 0;
            show_card();
        }
    }
    catch (error)
    {
        console.error("Error constructing card ", error);
    }
}
window.nextCard = nextCard;
get_formulae();