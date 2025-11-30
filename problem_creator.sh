# EXECUTION: go to desireble directory(topic/sub-topic) launch script by "bash problem_creator.sh"
# Write number of a problem you want to create
# New directory with new html file, src directory, css file, js file and json file created

echo -n "Problem number: "
read NUM

# New directory and file name
DIR="problem_$NUM"
FILE="problem_$NUM.html"



CURRENT_DIR="$(pwd)"                            
SUB_TOPIC_NAME="$(dirname "$CURRENT_DIR")"



# Check if directory already exist
if [[ -d "$DIR" ]]; then
    echo "Directory $DIR already exists. Aborting."
    exit 1
fi


# New directories
mkdir "$DIR"
mkdir "./$DIR/src"


#text that you want to create in script js when creating it

js_script_text=$(cat << 'EOF'
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
EOF
)



#html text

#IMPORTANT: problem number automatically imports to html file from user when he enter problem number 

html_text=$(cat << EOF
<!DOCTYPE html>

<html>

<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="./src/style.css">
</head>

<body>

<h1>Problem $NUM</h1>

<h3>Text of a problem: </h3>



<button id ="show_answer">Show Answer</button>
<h3 id="answer">Answer: </h3>


<button id="show_solution">Show solution</button>
<h3 id="solution">Solution: </h3>

<script src="script.js"></script>


</body>

</html> 
EOF
)



css_text=$(cat << 'EOF'
#show_solution {
    font-size: medium;
    margin-top: 10px;
    margin-bottom: 10px;
}

#show_answer {
    font-size: medium;
    margin-top: 10px;
    margin-bottom: 10px;
}

#answer {
    display: none;
}

#solution {
    display: none;
}
.problem {
    margin-top: 10px;
    margin-bottom: 10px;
}
EOF
)


json_text=$(cat << EOF
{
  "id": "$NUM",
  "title": "",
  "topic": "$SUB_TOPIC_NAME",
  "subtopic": "$CURRENT_DIR",
  "difficulty": "",
  "type": "",
  "directory": "$CURRENT_DIR/$DIR"
}
EOF
)                                   #with this info will be easier to sort problems on names and difficulty




touch "$DIR/$FILE"       #html file
touch "$DIR/style.css"   #css file
touch "$DIR/script.js"   #js script
touch "$DIR/info.json"   #json which is used to search problems using info iside it


echo "$js_script_text" > "./$DIR/script.js"     #enter code in script js form variable "js_script_text"
echo "$html_text" > "./$DIR/$FILE"              #enter code in html file from variable "html_text"
echo "$css_text" > "./$DIR/style.css"           #IMPORTANT: save "$" for normal script work
echo "$json_text" > "./$DIR/info.json"


#Debug
echo "Created directory: $DIR"
echo "Created directory: $DIR/scr"

echo "Created file: $DIR/$FILE"

echo "exit"
