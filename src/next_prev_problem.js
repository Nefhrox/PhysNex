const problem_num = document.getElementById("problem-number").innerText;
const prev_problem_num = parseInt(problem_num) - 1;
const next_problem_num = parseInt(problem_num) + 1;


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
        else
        {
            document.getElementById("next-problem").innerHTML = `Go to problem ${next_problem_num}: &nbsp; difficulty: ${data.difficulty} type: ${data.type} ➡`;
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
                else
                {
                    document.getElementById("prev-problem").innerHTML = `⬅ Go to previous problem ${prev_problem_num}: &nbsp; difficulty: ${data.difficulty} type: ${data.type}`;
                }
            }

            catch (error) 
            {
                console.log("Error on: " + prev_num, error.message);
            }
        }
    
        fetchPrevProblemData(prev_problem_num);
    }