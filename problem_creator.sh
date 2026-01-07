#!/bin/bash



# EXECUTION: go to desireble directory(topic/sub-topic) launch script by "bash problem_creator.sh"
# Write number of a problem you want to create
# New directory with new html file, src directory, css file, js file and json file created

echo -n "Problem number: "
read NUM

echo "Problem difficulty 1(easy)-10(hard): "
read DIFFICULTY

echo "Type of problem 1(theory) 2(calculation) 3(graphical): "
read TYPE

if [[ $TYPE == "1" ]]; then
    TYPE="theory"
elif [[ $TYPE == "2" ]]; then
    TYPE="calculation"
elif [[ $TYPE == "3" ]]; then
    TYPE="graphical"
else
    echo "Wrong type"
    exit
fi

# New directory and file name
DIR="problem_$NUM"
FILE="problem_$NUM.html"



CURRENT_DIR="$(pwd)"

DIRECTORY="$CURRENT_DIR/$DIR"


SUB_TOPIC_NAME="$(dirname "$CURRENT_DIR")"

REL_SUBTOPIC_PATH="${CURRENT_DIR#*/html/}" 
REL_TOPIC_PATH="${SUB_TOPIC_NAME#*/html/}"
REL_DIRECTORY_PATH="${DIRECTORY#*/html/}"

TOPIC_LINK="$(basename "$CURRENT_DIR")"         #link for navigation to topic page on current webpage in page code 
SUB_TOPIC_LINK=$(basename "$SUB_TOPIC_NAME")    #link for navigation to sub-topic page on current webpage in page code

NEXT_PROBLEM=$((NUM + 1))
PREV_PROBLEM_NUM=$((NUM - 1))



# Check if directory already exist
if [[ -d "$DIR" ]]; then
    echo "Directory $DIR already exists"
    exit 1
fi


# New directory
mkdir "$DIR"



#html text

#IMPORTANT: problem number automatically imports to html file from user when he enter problem number 

html_text=$(cat << EOF
<!DOCTYPE html>

<html>

<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="../../../src/problem.css">
</head>

<body>

<div id="problem-sub-topic" style="display:none;">$REL_SUBTOPIC_PATH</div> <!-- sub-topic for current problem for next_prev_problem.js -->
<div id="problem-number" style="display:none;">$NUM</div> <!-- problem number for next_prev_problem.js -->

<h1>Problem $NUM</h1>

<p id="type">Type: $TYPE</p>
<p id="difficulty">Difficulty: $DIFFICULTY/10</p>

<h3 id="problem_text">Text of a problem:  \( \pmb{} \) </h3>



<button id ="show_answer">Show Answer</button>
<button id="show_solution">Show Solution</button>


<!-- for space in equations" \text { } "  -->
<!-- \pmb{} is a font -->

<h3 id="answer">Answer: <br> \( \pmb{} \) </h3>
<!-- <img src="./src/" alt="answer image" id="answer_image"> -->


<h3 id="solution">Solution: <br> \(\text{} \pmb{} \)</h3>
<!-- <img src="./src/" alt="solution image" id="solution_image"> -->


<h1 class="return"><a href="../problem_$NEXT_PROBLEM/problem_$NEXT_PROBLEM.html"><span id="next-problem"></span></a></h1>
<h1 class="return"><a href="../problem_$PREV_PROBLEM_NUM/problem_$PREV_PROBLEM_NUM.html"><span id="prev-problem"></span></a></h1>


<script src="../../../src/answer_solution.js"></script>
<script src="../../../../src/next_prev_problem.js"></script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@4/tex-mml-chtml.js"></script> <!-- for writing mathematical equations-->

<button id="not_completed" class="not_completed">Not completed</button>

<h1 class="return"><a href="../$TOPIC_LINK.html">⬅ Back to $TOPIC_LINK page</a></h1>
<h1 class="return"><a href="../../$SUB_TOPIC_LINK.html">⬅ Back to $SUB_TOPIC_LINK page</a></h1>
<h1 class="return"><a href="../../../../index.html">⬅ Back to Main page</a></h1>



<h2 class="footer">About:</h2>
<p class="link"><a href="https://discord.gg/xFGw5Spd5V" target="_blank"><img src="../../../../styles/discord_icon.png" id = "discord_icon" alt="Discord">Discord</a></p>
<p class="link"><a href="mailto:physnex@gmail.com" target="_blank"><img src="../../../../styles/gmail_icon.png" id="gmail_icon" alt="Gmail">Gmail</a></p>

</body>

</html> 
EOF
)




json_text=$(cat << EOF
{
  "id": "$NUM",
  "title": "",
  "topic": "$REL_TOPIC_PATH",
  "subtopic": "$REL_SUBTOPIC_PATH",
  "difficulty": "$DIFFICULTY",
  "type": "$TYPE",
  "directory": "$REL_DIRECTORY_PATH",
  "completed": 0
}
EOF
)                         #with this info will be easier to sort problems on names and difficulty




touch "$DIR/$FILE"       #html file
touch "$DIR/info.json"   #json which is used to search problems using info iside it
mkdir "$DIR/src"         #directory for additional materials if is needed


echo "$html_text" > "./$DIR/$FILE"              #enter code in html file from variable "html_text"
echo "$json_text" > "./$DIR/info.json"


#Debug
echo "Created directory: $DIR"
echo "Created file: $DIR/$FILE"

echo "exit"