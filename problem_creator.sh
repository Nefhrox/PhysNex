sudo dpkg -i package.deb or sudo apt install ./package.deb

# EXECUTION: go to desireble directory(topic/sub-topic) launch script by "bash problem_creator.sh"
# Write number of a problem you want to create
# New directory with new HTML file, src directory and css file created

echo -n "Problem number: "
read NUM

# New directory and file name
DIR="problem_$NUM"
FILE="problem_$NUM.html"


# Check if directory already exist
if [[ -d "$DIR" ]]; then
    echo "Directory $DIR already exists. Aborting."
    exit 1
fi


# New directories
mkdir "$DIR"
mkdir "./$DIR/src"


# Debug 
touch "$DIR/$FILE"
touch "$DIR/style.css"

echo "Created directory: $DIR"
echo "Created directory: $DIR/scr"

echo "Created file: $DIR/$FILE"

echo "exit"
