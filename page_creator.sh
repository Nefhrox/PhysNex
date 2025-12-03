#!/bin/bash


#EXECUTION 
#go to desireble directory(topic) and launch script by "bash ../../html_creator.sh"
# "../../" only if you are in topics directory such as Mechanics, Electricity, etc.


CURRENT_DIR="$(pwd)"                         #Current working directory
FILE="$(basename "$CURRENT_DIR")"            #Name for files in current directory
TOPIC_DIR="$(dirname "$CURRENT_DIR")"        #Topic directory path


style_css_text=$(cat << EOF                 #text for css file for that page
.sub_topic {                                
    margin-top: 4px;
}
.footer {
    margin-top: 600px;
    text-align: center;
    font-size: 50px;
}

.link {
    text-align: center;
    font-size: 40px;
    margin-top: 10px;
}
.discord_icon {
    width: 70px;
    height: 45px;
    margin-right: 7px;
    vertical-align: middle;
}

#sub_topic {
    margin-bottom: 30px;
    text-align: center;
    font-size: 40px;
}

#list {
    margin-top: 20px;
    font-size: 35px;
    margin-left: 7px;
}

.problem {
    font-size: 20px;
    margin-left: 7px;
    margin-bottom: 50px;
}
EOF
)




#loop that creates html file with own name in each subdirectory only if its not src or problem and is a directory

for DIR in *; do

    if [ -d "$DIR" ] && [[ "$DIR" != "src" && "$DIR" != problem_* ]]; then  # Before -d must be space or script wont work 

        pushd "$DIR" >> /dev/null    #creal output of pushd command


        mkdir -p "src"               #create src directory if it doesnt exist
        touch "./src/style.css"
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
    <link rel="stylesheet" href="./src/style.css">
    <title>$DISPLAY_TITLE</title>
</head>

<body>

<h1 id="sub_topic">Problems on $DISPLAY_TITLE</h1>

<h3 id="list">List of problems on $DISPLAY_TITLE</h3>

<ol>
    <li class="problem"><a href="./problem_1/problem_1.html">Problem 1</a></li>
</ol>

<h2 class="footer">About:</h2>
<p class="link"><a href="https://discord.gg/xFGw5Spd5V"><img src="../../../styles/discord_icon.png" class = "discord_icon" alt="Discord">Discord</a></p>

</body>

</html> 
EOF
)


        echo "$style_css_text" > "./src/style.css"
        echo "$html_text" > "$DIR.html"
        echo "$json_text" > "info.json"


        popd >> /dev/null           #clear output of popd command
    fi
done


