#!/bin/bash



# EXECUTION: go to desireble directory(topic/sub-topic) launch script by "bash problem_creator.sh"
# Write number of a problem you want to create
# New directory with new html file, src directory, css file, js file and json file created

echo -n "Problem number: "
read NUM

echo "Problem difficulty 1(easy)-10(hard): "
read DIFFICULTY

echo "Type of problem 1(theory) or 2(calculation): "
read TYPE

if [[ $TYPE == "1" ]]; then
    TYPE="theory"
elif [[ $TYPE == "2" ]]; then
    TYPE="calculation"
else
    echo "Wrong type"
    exit
fi

# New directory and file name
DIR="problem_$NUM"
FILE="problem_$NUM.html"



CURRENT_DIR="$(pwd)"                            
SUB_TOPIC_NAME="$(dirname "$CURRENT_DIR")"
LINK="$(basename "$CURRENT_DIR")"


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

<h1>Problem $NUM</h1>

<p id="type">Type: $TYPE</p>
<p id="difficulty">Difficulty: $DIFFICULTY/10</p>

<h3 id="problem_text">Text of a problem: </h3>



<button id ="show_answer">Show Answer</button>
<button id="show_solution">Show Solution</button>


<h3 id="answer">Answer: </h3>
<h3 id="solution">Solution: </h3>

<script src="../../../src/answer_solution.js"></script>


<h1 class="return"><a href="../$LINK.html">⬅ Back to $(basename "$LINK")  page</a></h1>
<h1 class="return"><a href="../../../../index.html">⬅ Back to main page</a></h1>


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
  "topic": "$SUB_TOPIC_NAME",
  "subtopic": "$CURRENT_DIR",
  "difficulty": "$DIFFICULTY",
  "type": "$TYPE",
  "directory": "$CURRENT_DIR/$DIR"
}
EOF
)                         #with this info will be easier to sort problems on names and difficulty




touch "$DIR/$FILE"       #html file
touch "$DIR/info.json"   #json which is used to search problems using info iside it



echo "$html_text" > "./$DIR/$FILE"              #enter code in html file from variable "html_text"
echo "$json_text" > "./$DIR/info.json"


#Debug
echo "Created directory: $DIR"
echo "Created file: $DIR/$FILE"

echo "exit"
