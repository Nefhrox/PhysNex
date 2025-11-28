#EXECUTION 
#go to desireble directory(topic) and launch script by "bash ../../html_creator.sh"
# "../../" only if you are in topics directory such as Mechanics, Electricity, etc.


CURRENT_DIR="$(pwd)"                         #Current working directory
FILE="$(basename "$CURRENT_DIR")"            #Name for files in current directory



style_css_text=$(cat << EOF                 #text for css file for that page
.sub_topic {                                
    margin-top: 4px;
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


html_text=$(cat << EOF
<!DOCTYPE html>

<html>

<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="./src/style.css">
    <title>Problems $DIR</title>
</head>

<body>

<h1>Problems on $DIR</h1>

<h3>List of problems on $DIR</h3>

<ol>
    <li class="problem"><a href="./problem_1/problem_1.html">Problem 1</a></li>
</ol>

</body>

</html> 
EOF
)


        echo "$style_css_text" > "./src/style.css"
        echo "$html_text" > "$DIR.html"


        popd >> /dev/null           #clear output of popd command
    fi
done


