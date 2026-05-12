import { Supabase } from '../../global_script/script.js';   


// idea is that we have a deck of cards, each of the cards is a individual formula
// we shuffle deck with Fisher-Yates shuffle algorithm 
// then we show cards one by one with a button to flip the card and a button to show next card
// each card has front and back side
// front side has name of the formula which user should try to recall the formula from memory
// then user can click on the card to flip it and see correct formula 



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


// card structure 
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

// if we click throught the whole deck we start from the beggining

function nextCard() {
    current_deck_index = (current_deck_index + 1) % current_deck.length; 
    show_card();
}



async function get_formulae() 
{
    
    try 
    {

        // get topic id or sub-topic id or if user want to see all formulae, from url parameters

        const url_params = new URLSearchParams(window.location.search);
        const sub_topic_id = url_params.get("id");
        const topic_id = url_params.get("topic_id");
        const all_topic = url_params.has("all");

        // get all the formulae from database or filter by topic or sub-topic what user want to see

        let query = Supabase.from("formula_items").select("*, formula_sections!inner(*, topics(*))");

        const link_back_topic = document.getElementById("link_back_topic");

        if (all_topic)
        {
            link_back_topic.style.display = "none";    
        }
        else if (topic_id)
        {
            query = query.eq("formula_sections.topic_id", topic_id);
        }
        else if (sub_topic_id)
        {
            query = query.eq("section_id", sub_topic_id);
        }
        const { data, error } = await query;
        
        if (error)
        {
            console.error("Error on getting data", error);
            return;
        }

        // setup link to topic page and to recall page

        const first_item = data[0];

        if (link_back_topic)
        {
            if (all_topic)
            {
                link_back_topic.href = `./recall_topics.html`;
                link_back_topic.innerText = "⬅ Back to formula recall";
            }
            else
            {
                const section = first_item.formula_sections;
                const topic = section.topics;
                link_back_topic.href = `./recall_topic.html?id=${section.topic_id}`;
                link_back_topic.innerText = `⬅ Back to ${topic.name.replace(/_/g, " ")}`; 
            }
            
        }


        // setup cards using data from formula

        const formula_get = data.map(item => ({
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