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
                    <p class="text">${item.latex}</p>
                </div>
            </div>
            <button class="next_card" onclick="nextCard()">Next formula →</button>
        </div>
    `;

    if (window.MathJax) 
    {
        MathJax.typesetPromise();
    }
}

function nextCard() {
    current_deck_index = (current_deck_index + 1) % current_deck.length; 
    console.log("Current index:", current_deck_index);
    show_card();
}



async function get_formulae() {
    
    try {

        const current_url = window.location.pathname.split("/").pop().replace(".html", "");
        const url_params = new URLSearchParams(window.location.search);

        const sub = url_params.get("sub");
        const topic = url_params.get("topic");

        console.log("Sub-topic:", sub);
        console.log("Topic:", topic);
        console.log("Current URL:", current_url);

        const url = `../../../additional/formulae/${topic}_formulae/${topic}_formulae.html`;
        const response = await fetch(url);
        const html_text = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html_text, "text/html");

        let sub_formulae = [];

        const clean_sub_topic = sub.replace(/_/g, " ");

        const headers = Array.from(doc.querySelectorAll("h2.sub-topic"));

        const clean_header = headers.find(h => h.innerText.trim() === clean_sub_topic);

        if(clean_header)
        {
            let current_e = clean_header.nextElementSibling;

            while(current_e && current_e.tagName !== "H2")
            {
                if(current_e.classList.contains("formulae"))
                {
                    sub_formulae.push(current_e);
                }
                current_e = current_e.nextElementSibling;
            }
        }

        else 
        {
            sub_formulae = Array.from(doc.querySelectorAll("p.formulae"));
        }

        console.log("headers:", clean_header);


        const formulae_ready = sub_formulae.map(p => {
        const raw_formulae = p.innerText;

        last_dash = raw_formulae.lastIndexOf(" - ");   // find last "-" in text

        if (last_dash !== -1)     // skip "-" in a formula if finded
        {
            return {
                latex: raw_formulae.substring(0, last_dash).trim(),    //latex code of a formula "\( \pmb{...} \)" 
                name: raw_formulae.substring(last_dash + 3).trim()      //skip "-" and get name of formula
            };
        }
        return null; 
        }).filter(item => item !== null);      // delete text that doesnt have "-"



        if (formulae_ready.length > 0)
        {
            current_deck = shuffle(formulae_ready);
            current_deck_index = 0;
            show_card();
        }



        if (!response.ok) {
            throw new Error(`Error on ${response.status}`);
        }
        
        console.log("Set of fetched formulae: ", formulae_ready);


        if(window.MathJax)
        {
            MathJax.typesetPromise();
        }

    }
    catch (error) {
        console.error("Error: ", error);
    }
}

get_formulae();