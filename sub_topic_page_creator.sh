#!/bin/bash


#EXECUTION 
#go to desireble directory(topic) and launch script by "bash ../../page_creator.sh"
# "../../" only if you are in topics directory such as Mechanics, Electricity, etc.


#IMPORTANT 
#after execution REWRITES all files in directories that are used as sub-topics(like Dynamics, Power, etc.)



CURRENT_DIR="$(pwd)"                         #Current working directory
FILE="$(basename "$CURRENT_DIR")"            #Name for files in current directory
TOPIC_DIR="$(dirname "$CURRENT_DIR")"        #Topic directory path





#loop that creates html file with own name in each subdirectory only if its not src or problem and is a directory

for DIR in *; do

    if [ -d "$DIR" ] && [[ "$DIR" != "src" && "$DIR" != problem_* ]]; then  # Before -d must be space or script wont work 

        pushd "$DIR" >> /dev/null    #create output of pushd command


        touch "$DIR.html"
        touch "info.json"

        DISPLAY_TITLE="${DIR//_/ }"   #Replace underscores with spaces for displaying title


json_text=$(cat << EOF
{
    "title": "$DISPLAY_TITLE",
    "topic": "$(basename "$CURRENT_DIR")"
}
EOF
)


html_text=$(cat << EOF
<!DOCTYPE html>

<html>

<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="../../src/style.css">
    <title>$DISPLAY_TITLE</title>
</head>

<body>

<h1 id="sub_topic">Problems on $DISPLAY_TITLE</h1>

<h3 id="list">List of problems on $DISPLAY_TITLE</h3>

<ol>
    <li class="problem"><a href="./problem_1/problem_1.html">Problem 1</a></li>
</ol>


<h1 class="return"><a href="../$FILE.html">⬅ Back to $FILE page</a></h1>    
<h1 class="return"><a href="../../../index.html">⬅ Back to main page</a></h1>

<h2 class="footer">About:</h2>
<p class="link"><a href="https://discord.gg/xFGw5Spd5V"><img src="../../../styles/discord_icon.png" class = "discord_icon" alt="Discord">Discord</a></p>
<p class="link"><a href="mailto:physnex@gmail.com" target="_blank"><img src="../../../../styles/gmail_icon.png" id="gmail_icon" alt="Gmail">Gmail</a></p>

</body>

</html> 
EOF
)


        echo "$html_text" > "$DIR.html"
        echo "$json_text" > "info.json"


        popd >> /dev/null           #clear output of popd command
    fi
done


