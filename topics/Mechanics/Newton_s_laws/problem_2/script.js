const ANSWER_BUTTON = document.getElementById("show_answer");
const SOLUTION_BUTTON = document.getElementById("show_solution");

const ANSWER = document.getElementById("answer");
const SOLUTION = document.getElementById("solution");

ANSWER_BUTTON.addEventListener("click", () => 
{
    if (ANSWER.style.display === "none" || ANSWER.style.display === "") {
        ANSWER.style.display = "block";
        ANSWER_BUTTON.textContent = "Hide answer";
    } 
    else {
        ANSWER.style.display = "none";
        ANSWER_BUTTON.textContent = "Show answer";
    }
});

//same as ANSWER_BUTTON

SOLUTION_BUTTON.addEventListener("click", () => 
{
    if (SOLUTION.style.display === "none" || SOLUTION.style.display === "") {
        SOLUTION.style.display = "block";
        SOLUTION_BUTTON.textContent = "Hide solution";
    } 
    else {
        SOLUTION.style.display = "none";
        SOLUTION_BUTTON.textContent = "Show solution";
    }
});
