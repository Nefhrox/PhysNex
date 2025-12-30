//for buttons
const ANSWER_BUTTON = document.getElementById("show_answer");
const SOLUTION_BUTTON = document.getElementById("show_solution");

//for solution and answer text/images
const ANSWER = document.getElementById("answer");
const SOLUTION = document.getElementById("solution");    
const ANSWER_IMAGE = document.getElementById("answer_image");          //for image in answer            
const SOLUTION_IMAGE = document.getElementById("solution_image");      //for image in solution



ANSWER_BUTTON.addEventListener("click", () => {

    let A_Element = ANSWER || ANSWER_IMAGE;      //check if elements exists
    let A_is_Hidden = A_Element.style.display === "none" || A_Element.style.display === "";  //check if elements are hidden
    if (A_is_Hidden) {
        if(ANSWER) ANSWER.style.display = "block";
        if(ANSWER_IMAGE) ANSWER_IMAGE.style.display = "block";
        ANSWER_BUTTON.textContent = "Hide answer";
    } else {
        if(ANSWER) ANSWER.style.display = "none";
        if(ANSWER_IMAGE) ANSWER_IMAGE.style.display = "none";
        ANSWER_BUTTON.textContent = "Show answer";
    }
});

SOLUTION_BUTTON.addEventListener("click", () => {
    let S_Element = SOLUTION || SOLUTION_IMAGE;      //check if elements exists
    let S_is_Hidden = S_Element.style.display === "none" || S_Element.style.display === "";  //check if elements are hidden

    if (S_is_Hidden) {
        if (SOLUTION) SOLUTION.style.display = "block";
        if (SOLUTION_IMAGE) SOLUTION_IMAGE.style.display = "block";
        SOLUTION_BUTTON.textContent = "Hide solution";
    } else {
        if (SOLUTION) SOLUTION.style.display = "none";
        if (SOLUTION_IMAGE) SOLUTION_IMAGE.style.display = "none";
        SOLUTION_BUTTON.textContent = "Show solution";
    }
});