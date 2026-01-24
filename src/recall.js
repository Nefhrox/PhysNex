// async function get_json() {
//     try 
//     {
//         const url = "./Mechanics.json";
//         const response = await fetch(url);

//         const results = await response.text();

//             if (!response.ok) 
//             {
//                 throw new Error(`Error on ${response.status}`)
//             }

//         console.log("Mechanics json:", results);

    
//     } 
//     catch (error) 
//     {
//         console.error("Error fetching formulae:", error);
//     }
// } 

// get_json();




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

        if (!response.ok) {
            throw new Error(`Error on ${response.status}`);
        }
        
        console.log("Set of fetched formulae: ", formulae_ready);


        const page_formulae = formulae_ready.map(f => `<p class="formulae">${f.latex} - ${f.name}</p>`).join("");

        const formulae_container = document.getElementById("formulae_container");

        if(formulae_container)
        {
            formulae_container.innerHTML = page_formulae;    //write all formulae on a page
        }

        if(window.MathJax)
        {
            MathJax.typesetPromise();
        }

        return formulae_ready;
    }
    catch (error) {
        console.error("Error: ", error);
    }
}

get_formulae();