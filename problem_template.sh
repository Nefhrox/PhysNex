#!/bin/bash

#Script for replacing problem code with new one if there are changes 

#EXECUTION: go to sub-topic directory and type "bash ../../problem_template.sh"

#IMPORTANT: rewrites all problems in topic with most recent code but text of a problems, solutions, answers remain 

CURRENT_DIR="$(pwd)"

TOPIC=$(echo "$CURRENT_DIR" | awk -F '/' '{print $NF}')

for topics in */; do
    echo "Go through $topics"


    sub_topic=${topics%/}

    SUB_TOPIC_PATH="${CURRENT_DIR#*/html/}/$sub_topic"

    for problem in "$topics"problem_*; do 
        if [ -d "$problem" ]; then


        topic_name=$(echo "$TOPIC" | sed 's/_/ /g')

        sub_topic_name=$(echo "$sub_topic" | sed 's/_/ /g')


        NUM=${problem##*_}

        NEXT_PROBLEM=$((NUM+1))
        PREV_PROBLEM=$((NUM-1))

        PROBLEM="$problem/problem_${NUM}.html"

        #getting all needed information from current page


        PROBLEM_TEXT=$(grep 'id="problem_text"' "$PROBLEM" | sed 's/.*<h3[^>]*>//;s/<\/h3>.*//')

        #takes text only in specific line which starts with id="problem_text" 
        #after this delets everything that is in front of h3 (.*<h3)
        #[^>]*> means "anything except ">" in any combination before another ">" "  
        # "//" means find and delete 
        # ";" next command
        # "<\/h3>" "\" is needed in case sed command is gonna try to execute a command if see a "/"
        # ".*//" delete everything 

        SOLUTION=$(grep 'id="solution"' "$PROBLEM" | sed 's/.*<h3[^>]*>//;s/<\/h3>.*//')

        ANSWER=$(grep 'id="answer"' "$PROBLEM" | sed 's/.*<h3[^>]*>//;s/<\/h3>.*//')

        TYPE=$(grep 'id="type"' "$PROBLEM" | sed 's/.*<p[^>]*>//;s/<\/p>.*//' | sed 's/Type: //g')

        DIFFICULTY=$(grep 'id="difficulty"' "$PROBLEM" | sed 's/.*<p[^>]*>//;s/<\/p>.*//' | sed 's/Difficulty: //g; s/\/10//g')

        PROBLEM_IMG=$(grep 'id="problem_image"' "$PROBLEM" | sed -n 's/.*src="\([^"]*\)".*/\1/p')

        ANSWER_IMG=$(grep 'id="answer_image"' "$PROBLEM" | sed -n 's/.*src="\([^"]*\)".*/\1/p')

        SOLUTION_IMG=$(grep 'id="solution_image"' "$PROBLEM" | sed -n 's/.*src="\([^"]*\)".*/\1/p')


#rewriting problem page with latest template

html_text=$(cat << EOF
<!DOCTYPE html>

<html>

<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="../../../src/problem.css">
</head>

<body>

<div id="problem-sub-topic" style="display:none;">$SUB_TOPIC_PATH</div> <!-- sub-topic for current problem for next_prev_problem.js -->
<div id="problem-number" style="display:none;">$NUM</div> <!-- problem number for next_prev_problem.js -->

<h1>Problem $NUM</h1>

<p id="type">Type: $TYPE</p>
<p id="difficulty">Difficulty: $DIFFICULTY/10</p>

<h3 id="problem_text">$PROBLEM_TEXT</h3>
<!-- <img id="problem_image" src="$PROBLEM_IMG" alt="problem image"> -->


<button id ="show_answer">Show Answer</button>
<button id="show_solution">Show Solution</button>
<button id="not_completed" class="not_completed">Not completed</button>


<!-- for space in equations" \text { } "  -->
<!-- \pmb{} is a font -->

<h3 id="answer">$ANSWER</h3>
<!-- <img src="$ANSWER_IMG" alt="answer image" id="answer_image"> -->


<h3 id="solution">$SOLUTION</h3>
<!-- <img src="$SOLUTION_IMG" alt="solution image" id="solution_image"> -->

<h1 class="return_next"><a href="../problem_$NEXT_PROBLEM/problem_$NEXT_PROBLEM.html"><span id="next-problem"></span></a></h1>
<h1 class="return_prev"><a href="../problem_$PREV_PROBLEM/problem_$PREV_PROBLEM.html"><span id="prev-problem"></span></a></h1>


<script src="../../../src/answer_solution.js"></script>
<script src="../../../../src/next_prev_problem.js"></script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@4/tex-mml-chtml.js"></script> <!-- for writing mathematical equations-->

<h1 class="return_first"><a href="../../$TOPIC.html">⬅ Back to $topic_name page</a></h1>
<h1 class="return"><a href="../$sub_topic.html">⬅ Back to $sub_topic_name page</a></h1>
<h1 class="return"><a href="../../../../index.html">⬅ Back to Main page</a></h1>



<h2 class="footer">About:</h2>
<p class="link"><a href="https://discord.gg/xFGw5Spd5V" target="_blank"><img src="../../../../styles/discord_icon.png" id = "discord_icon" alt="Discord">Discord</a></p>
<p class="link"><a href="mailto:physnex@gmail.com" target="_blank"><img src="../../../../styles/gmail_icon.png" id="gmail_icon" alt="Gmail">Gmail</a></p>

</body>

</html> 
EOF
)
        echo "$html_text" > "$PROBLEM"
        fi 
    done
done