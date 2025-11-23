DIR=$(pwd)     #current directory

echo "Collected problems:"

echo "["


    
for files in "$DIR"/*/; do              #select only directories
        DIRPATH=${files%/}              #remove "/"
        INFOPATH="$DIRPATH/info.json"

        if [ -f "$INFOPATH" ]; then
            
            INFO_CONTENT=$(cat "$INFOPATH")
            echo "
            "
            
            echo "$INFO_CONTENT"
        fi
done

echo "]"
