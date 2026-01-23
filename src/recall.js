async function get_json() {
    try 
    {
        const url = "./Mechanics.json";
        const response = await fetch(url);

        const results = await response.text();

            if (!response.ok) 
            {
                throw new Error(`Error on ${response.status}`)
            }

        console.log("Mechanics json:", results);

    
    } 
    catch (error) 
    {
        console.error("Error fetching formulae:", error);
    }
} 

get_json();




async function get_formulae() {
    
    try {

        const current_url = window.location.pathname.split("/").pop().replace(".html", "");

        console.log("Current URL:", current_url);

        const url = `../../formulae/${current_url}_formulae/${current_url}_formulae.html`;
        const response = await fetch(url);
        const html_text = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html_text, "text/html");

        const p_text = Array.from(doc.querySelectorAll("p.formulae"));

        const formulae_ready = p_text.map(p => {
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
            // formulae_container.innerHTML = page_formulae;    //write all formulae on a page
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