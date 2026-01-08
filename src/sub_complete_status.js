document.addEventListener("DOMContentLoaded", () => 
    {
        const PROBLEMS = document.querySelectorAll(".problem");

        PROBLEMS.forEach(problem => 
        {
            const problem_id = problem.getAttribute("data-id");
            const span_display = problem.querySelector(".problem-status");
            const SUB_TOPIC_PATH = document.getElementById("sub-dir").innerText;

            const key = `${SUB_TOPIC_PATH}/problem_${problem_id}_status`
            const local_problem_status = localStorage.getItem(key);

            if(local_problem_status === "Completed")
            {
                span_display.innerText = " Completed"
                span_display.classList.add("completed_problem")
            }
            if(local_problem_status === "Not completed" || local_problem_status === null)
            {
                span_display.innerText = " Not completed"
                span_display.classList.add("not_completed_problem")
            }

            //Debug if needed
            console.log(key)
            console.log(local_problem_status)
        });
});