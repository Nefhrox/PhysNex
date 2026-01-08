const problem_num = document.getElementById("problem-number").innerText;
const prev_problem_num = parseInt(problem_num) - 1;
const next_problem_num = parseInt(problem_num) + 1;


const SUB_TOPIC_PATH = document.getElementById("problem-sub-topic").innerText;
const PROBLEM_NUM = document.getElementById("problem-number").innerText;


const PREV_KEY = localStorage.getItem(`${SUB_TOPIC_PATH}/problem_${prev_problem_num}_status`);
const NEXT_KEY = localStorage.getItem(`${SUB_TOPIC_PATH}/problem_${next_problem_num}_status`);

async function fetchNextProblemData(next_num) 
{
    try 
    {
        const response = await fetch(`../problem_${next_problem_num}/info.json`);
        
        if (!response.ok) 
        {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        if(data.difficulty === undefined)
        {
            document.getElementById("next-problem").innerHTML = ``;
        }

        if(NEXT_KEY === null)
        {
            document.getElementById("next-problem").innerHTML = `Go to problem ${next_problem_num}: &nbsp; difficulty: ${data.difficulty} &nbsp; type: ${data.type} &nbsp; status: Not completed ➡`;
        }
        else
        {
            document.getElementById("next-problem").innerHTML = `Go to problem ${next_problem_num}: &nbsp; difficulty: ${data.difficulty} &nbsp; type: ${data.type} &nbsp; status: ${NEXT_KEY} ➡`;
        }
    }

    catch (error) 
    {
        console.log("Error on: " + next_num, error.message);
    }
}

fetchNextProblemData(next_problem_num);

if (prev_problem_num > 0) 
    {
        async function fetchPrevProblemData(prev_num) 
        {
            try 
            {
                const response = await fetch(`../problem_${prev_problem_num}/info.json`);
                
                if (!response.ok) 
                {
                    throw new Error(`Error: ${response.status}`);
                }
    
                const data = await response.json();


                if(data.difficulty === undefined)
                {
                    document.getElementById("prev-problem").innerHTML = ``;
                }

                if(PREV_KEY === null)
                {
                    document.getElementById("prev-problem").innerHTML = `⬅ Go to previous problem ${prev_problem_num}: &nbsp; difficulty: ${data.difficulty} &nbsp; type: ${data.type} &nbsp; status: Not completed`;
                }
                else
                {
                    document.getElementById("prev-problem").innerHTML = `⬅ Go to previous problem ${prev_problem_num}: &nbsp; difficulty: ${data.difficulty} &nbsp; type: ${data.type} &nbsp; status: ${PREV_KEY}`;
                }
                
            }

            catch (error) 
            {
                console.log("Error on: " + prev_num, error.message);
            }
        }
    
        fetchPrevProblemData(prev_problem_num);
    }