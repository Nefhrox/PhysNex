let allData = { topics: [] };   // container for all data

const MAX_RESULTS = 10;            //max number of results after search to prevent "... and more" on a page after results

async function LoadDataFromDOM()                //async function for downloading data from nodes in DOM 
{                     
    const topicList = document.querySelectorAll('ol > li.topic');     // select only topics
    const promises = [];

    for (const li of topicList) 
        {
        const topicA = li.querySelector('.topic_header > a');   //select link to topic
        if (!topicA) continue;

        const topicName = topicA.textContent.trim();            //takes clear name
        const topicPath = topicA.getAttribute('href');          //get path to topic


        
        const topicObj = 
        {
            name: topicName,
            path: topicPath,
            subtopics: [],
            problems: []  
        };


        allData.topics.push(topicObj);         // add topics to allData


        const sub_topic_A = li.querySelectorAll('ul > li.sub_topic > a');

        for (const subA of sub_topic_A) 
            {

            const subName = subA.textContent.trim();
            const subPath = subA.getAttribute('href');


            const subObj = 
            {
                name: subName,
                path: subPath,
                problems: []
            };


            topicObj.subtopics.push(subObj);


            promises.push(loadProblemsForSub(subObj));
        }
    }


    await Promise.all(promises);

}


async function loadProblemsForSub(subObj) 
{
    try 
    {

        console.log("Fetching subtopic page:", subObj.path);

        const response = await fetch(subObj.path);
        if (!response.ok) 
        {
            throw new Error(`Fetch failed when: ${response.status}: ${subObj.path}`);
        }


        const html = await response.text();

        const doc = new DOMParser().parseFromString(html, "text/html");      //parse DOM from fetched HTML


        const problemA = doc.querySelectorAll('ol > li.problem > a');

        for (const pA of problemA) 
        {

            const title = pA.textContent.trim();
            const relHref = pA.getAttribute('href');


            const baseUrl = new URL(subObj.path, window.location.origin);

            const fullPath = new URL(relHref, baseUrl).href;


            subObj.problems.push(
            {
                title,
                directory: fullPath
            }
            );
        }
    } 
    catch (error) 
    {
        console.error(`Loading problems error on a: ${subObj.name} at ${subObj.path}:`, error.message);
    }
}



window.addEventListener("load", async () => 
{
    await LoadDataFromDOM();
});



function search(query) 
{

    const lower = query.toLowerCase().trim();

    const results = [];


    for (const topic of allData.topics) 
    {
        if (topic.name.toLowerCase().includes(lower)) 
        {
            results.push(
            {
                type: "topic",
                title: topic.name,
                directory: topic.path
            }
            );
        }

        for (const sub of topic.subtopics) 
        {
            if (sub.name.toLowerCase().includes(lower)) 
            {
                results.push(
                {
                    type: "subtopic",
                    title: sub.name,
                    directory: sub.path
                });
            }
        }
    }


    for (const topic of allData.topics) 
    {
        checkProblems(topic.problems, results, lower, topic.name);

        for (const sub of topic.subtopics) 
        {
            checkProblems(sub.problems, results, lower, sub.name);
        }
    }


    if (results.length) return { results };
    return { error: "No match found" };
}


function checkProblems(problems, results, query, parentName) 
{

    for (const problem of problems) 
    {

        const fields = [
            problem.title || "",
            parentName || ""
        ];


        if (fields.some(f => f.toLowerCase().includes(query))) 
        {
            results.push(
            {
                type: "problem",
                title: problem.title,
                directory: problem.directory,
                parent_directory: parentName
            }
            );
        }
    }
}


window.performSearch = function(query) 
{
    if (query.trim() === "") 
    {
        document.getElementById("search_results").innerHTML = "";
        return;
    }

    const result = search(query);

    if (result.results) 
    {

        let html = "<ul>";
        let current_results = 0;           //results counter


        for (const p of result.results) 
        {

            if (current_results >= MAX_RESULTS)
            {
                break;                            //stops search if therer are to many results
            }


            if (p.type === "problem") 
            {
                html += `<li>[Problem] <a href="${p.directory}">${p.title}</a> in ${p.parent_directory}</li>`;
            }

            else if (p.type === "subtopic") 
            {
                html += `<li>[Sub-topic] <a href="${p.directory}">${p.title}</a></li>`;
            }

            else if (p.type === "topic")
            {
                html += `<li>[Topic] <a href="${p.directory}">${p.title}</a></li>`;
            }

            current_results++;
        }

        html += "</ul>";
        document.getElementById("search_results").innerHTML = html;
    }

    else 
    {
        document.getElementById("search_results").innerHTML = "<p>No results found</p>";
    }
    
};