let allData = { topics: [] }; // container for all data
const MAX_RESULTS = 10; //max number of results after search to prevent "... and more" on a page after results

async function LoadDataFromDOM() //async function for downloading data from nodes in DOM
{
    const topicList = document.querySelectorAll('ol > li.topic'); // select only topics
    const promises = [];
    for (const li of topicList)
        {
        const topicA = li.querySelector('.topic_header > a'); //select link to topic
        if (!topicA) continue;
        const topicName = topicA.textContent.trim(); //takes clear name
        const topicPath = topicA.getAttribute('href'); //get path to topic
       
        const topicObj =
        {
            name: topicName,
            path: topicPath,
            subtopics: [],
            problems: []
        };
        allData.topics.push(topicObj); // add topics to allData
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



async function loadProblemsForSub(subObj) {
    try {
        const response = await fetch(subObj.path);
        if (!response.ok) {
            throw new Error(`Fetch failed when: ${response.status}: ${subObj.path}`);
        }
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, "text/html");
        const problemA = doc.querySelectorAll('div > p.problem > a');
        const problemPromises = [];

        for (const pA of problemA) {
            const title = pA.textContent.trim();
            const relHref = pA.getAttribute('href');

            const baseUrl = new URL(subObj.path, window.location.href);
            const fullUrlObj = new URL(relHref, baseUrl);
            const fullPath = fullUrlObj.href;

            const jsonUrl = fullPath.substring(0, fullPath.lastIndexOf('/')) + '/info.json';


            //Debug

            // console.log(`For problem "${title}":`);
            // console.log(` jsonUrl: ${jsonUrl}`);

            // console.log(` relHref: ${relHref}`);        
            // console.log(` fullPath: ${fullPath}`);
            // console.log(` problemDir: ${fullPath.substring(0, fullPath.lastIndexOf('/'))}`);
            // console.log(` jsonUrl: ${jsonUrl}`);



            
            problemPromises.push(
                fetch(jsonUrl)
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`Failed to fetch ${jsonUrl}`);
                    }
                    return res.json();
                })
                .then(info => ({
                    title,
                    directory: fullPath, 
                    difficulty: info.difficulty || 'N/A',
                    problemType: info.type || 'N/A',
                    id: info.id,
                    subtopic: info.subtopic
                }))
                .catch(err => {
                    console.error(`Error fetching info for ${title}:`, err.message);
                    return {
                        title,
                        directory: fullPath,
                        difficulty: 'N/A',
                        problemType: 'N/A',
                        id: null,
                        subtopic: null
                    };
                })
            );
        }
        const problems = await Promise.all(problemPromises);
        for (const prob of problems) {
            subObj.problems.push(prob);
        }
    } catch (error) {
        console.error(`Error on subtopic: ${subObj.name} at ${subObj.path}:`, error.message);
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
                parent_directory: parentName,
                difficulty: problem.difficulty,
                problemType: problem.problemType,
                id: problem.id,
                subtopic: problem.subtopic
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


    //Debug for local keys

    // console.log("--- Current LocalStorage Contents ---");
    // for (let i = 0; i < localStorage.length; i++) {
    //     console.log("Found in Storage:", localStorage.key(i));
    // }

    const result = search(query);
    if (result.results)
    {
        let html = "<div>";
        let current_results = 0;            //results counter
        for (const p of result.results)
        {
            if (current_results >= MAX_RESULTS)
            {
                break;                  //stops search if there are to many results
            }
            if (p.type === "problem")
            {

                let subPath = p.subtopic || "";
                
                if (subPath.includes("topics/")) 
                {
                    subPath = subPath.substring(subPath.indexOf("topics/"));        //leaves only topics/sub-topic...
                }
                
                subPath = subPath.replace(/'/g, "_");           //replace ' with "_" for clean paths

                const LOCAL_KEY = `${subPath}/problem_${p.id}_status`;
                const status = localStorage.getItem(LOCAL_KEY) || "Not completed";
                
                html += `<div class = "search_text">[Problem] <a href="${p.directory}" class = "search_div">${p.title}</a> in ${p.parent_directory}, Difficulty ${p.difficulty}/10, Type: ${p.problemType}, Status: ${status}</div>`;
            }
            else if (p.type === "subtopic")
            {
                html += `<div class = "search_text">[Sub-topic] <a href="${p.directory}" class = "search_div">${p.title}</a></div>`;
            }
            else if (p.type === "topic")
            {
                html += `<div class = "search_text">[Topic] <a href="${p.directory}" class = "search_div">${p.title}</a></div>`;
            }
            current_results++;
        }
        html += "</div>";
        document.getElementById("search_results").innerHTML = html;
    }
    else
    {
        document.getElementById("search_results").innerHTML = "<p>No results found</p>";
    }
   
};