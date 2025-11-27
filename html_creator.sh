CURRENT_DIR="$(pwd)"
FILE="$(basename "$CURRENT_DIR")"


style_css_text=$(cat << 'EOF'
.sub_topic {
    margin-top: 4px;
}
EOF
)

html_text=$(cat << 'EOF'
<!DOCTYPE html>

<html>

<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="./src/style.css">
    <title></title>
</head>

<body>

<h1></h1>

<h3></h3>

<ol>
    <li class="problem"><a href="./problem_1/problem_1.html">Problem 1</a></li>
</ol>

</body>

</html> 
EOF
)



echo "$style_css_text" > "$CURRENT_DIR/src/style.css"
echo "$html_text" > "$CURRENT_DIR/$FILE.html"


echo " "
echo "$CURRENT_DIR"
echo "current dir"
echo " "
echo "file name:"
echo "$FILE"