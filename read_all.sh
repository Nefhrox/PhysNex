#!/bin/bash

# DIR = directory of the script
DIR="$(dirname "$(realpath "$0")")"
topic_dir="$DIR/topics"

search_found=0

if [ $# -eq 0 ]; then
    echo "Collected problems:"
    echo "========================================================"
    echo "["

    comma_needed=0

    for files in "$topic_dir"/*/; do
        DIRPATH="${files%/}"
        INFOPATH="$DIRPATH/info.json"

        if [ -f "$INFOPATH" ]; then
            INFO_CONTENT=$(cat "$INFOPATH")

            if [ $comma_needed -eq 1 ]; then
                echo ","
            fi

            echo "$INFO_CONTENT"
            comma_needed=1
        fi
    done

    echo "]"
    echo "========================================================"
else
    # Extract basename from the query to handle paths
    query_basename=$(basename "$1")
    search_query="${query_basename%/}"  # Remove trailing / if any
    lower_search=$(echo "$search_query" | tr 'A-Z' 'a-z')

    for files in "$topic_dir"/*/; do
        if [ -d "$files" ]; then
            topic=$(basename "$files")
            lower_topic=$(echo "$topic" | tr 'A-Z' 'a-z')
            sub_topic="$(basename "$(dirname "$topic")")"
            lower_sub_topic=$(echo "$sub_topic" | tr 'A-Z' 'a-z')

            if [[ $lower_topic == $lower_search ]]; then
                search_found=1
                echo "{\"redirect\": \"./topics/$topic/$topic.html\"}"
                break
            fi

            if [[ $lower_sub_topic == $lower_search ]]; then
                search_found=1
                echo "{\"redirect\": \".topics/$topic.html\"}"
                break
            fi
        fi
    done

    if [ $search_found -eq 0 ]; then
        echo "No topic found for $1 (basename: $search_query)"
    fi
fi