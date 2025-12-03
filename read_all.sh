#!/bin/bash


DIR="$(dirname "$(realpath "$0")")"         #takes path of current script
topic_dir="$DIR/topics"

if [ $# -eq 0 ]; then                   #if there are no additional arguments like sub_topic name or other argument


    comma_needed=0                      #for proper json info writing

    for files in "$topic_dir"/*/; do
        DIRPATH="${files%/}"                #removes "/" form the end of a directory path
        INFOPATH="$DIRPATH/info.json"       

        if [ -f "$INFOPATH" ]; then             #works only if therer are file called "info.json"
            INFO_CONTENT=$(cat "$INFOPATH")     #reads content from info.json

            if [ $comma_needed -eq 1 ]; then       #wtites "," after each line
                echo ","
            fi

            echo "$INFO_CONTENT"       #prints text fron info.json
            comma_needed=1
        fi
    done


else

    query_basename=$(basename "$1")            #takes clear name from argument like ".../Power/" or ".../Diffraction"
    search_query="${query_basename%/}"         #removes "/" from name of directory
    lower_search=$(echo "$search_query" | tr "[:upper:]" "[:lower:]")    #converts upper case in lower case

    found=0


    for topic_files in "$topic_dir"/*/; do             
        if [ -d "$topic_files" ]; then
            topic=$(basename "$topic_files")
            lower_topic=$(echo "$topic" | tr "[:upper:]" "[:lower:]")

            if [[ $lower_topic == $lower_search ]]; then
                found=1
                echo "{\"redirect\": \"./topics/$topic/$topic.html\"}"
                break
            fi
        fi
    done


    if [ $found -eq 0 ]; then
        for topic_files in "$topic_dir"/*/; do
            if [ -d "$topic_files" ]; then
                topic=$(basename "$topic_files")

                for sub_files in "$topic_files"/*/; do
                    if [ -d "$sub_files" ]; then
                        subtopic=$(basename "$sub_files")
                        lower_subtopic=$(echo "$subtopic" | tr "[:upper:]" "[:lower:]")

                        if [[ $lower_subtopic == $lower_search ]]; then
                            found=1
                            echo "{\"redirect\": \"./topics/$topic/$subtopic/$subtopic.html\"}"
                            break
                        fi
                    fi
                done
            fi
        done
    fi

    if [ $found -eq 0 ]; then
        echo "No topic or subtopic found for $1 (searched: $search_query)"
    fi
fi