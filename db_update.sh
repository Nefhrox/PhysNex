#!/bin/bash

if [ -f "../../.env" ]; then
    source ../../.env
else
    echo ".env file not found"
    exit 1
fi

CURRENT_DIR="$(pwd)"

TOPIC=$(echo "$CURRENT_DIR" | awk -F '/' '{print $NF}')

for topics in */; do
    echo "Go through $topics"

    sub_topic=${topics%/}

    for problem in "$topics"problem_*; do 
        if [ -d "$problem" ]; then

        NUM=${problem##*_}

        PROBLEM="$problem/problem_${NUM}.html"

        PROBLEM_TEXT=$(grep 'id="problem_text"' "$PROBLEM" | sed 's/.*<h3[^>]*>//;s/<\/h3>.*//')

        SOLUTION=$(grep 'id="solution"' "$PROBLEM" | sed 's/.*<h3[^>]*>//;s/<\/h3>.*//')

        ANSWER=$(grep 'id="answer"' "$PROBLEM" | sed 's/.*<h3[^>]*>//;s/<\/h3>.*//')

        TYPE=$(grep 'id="type"' "$PROBLEM" | sed 's/.*<p[^>]*>//;s/<\/p>.*//' | sed 's/Type: //g')

        DIFFICULTY=$(grep 'id="difficulty"' "$PROBLEM" | sed 's/.*<p[^>]*>//;s/<\/p>.*//' | sed 's/Difficulty: //g; s/\/10//g')        



        JSON_DATA=$(jq -n \
        --arg t "$TOPIC" \
        --arg st "$sub_topic" \
        --argjson nr "$NUM" \
        --arg p_txt "$PROBLEM_TEXT" \
        --arg sol "$SOLUTION" \
        --arg ans "$ANSWER" \
        --argjson diff "$DIFFICULTY" \
        --arg p_type "$TYPE" \
        '{topic: $t, sub_topic: $st, problem_number: $nr, problem_text: $p_txt, solution: $sol, answer: $ans, difficulty: $diff, type: $p_type}')



        curl -X POST "$SUPABASE_URL" \
        -H "apikey: $SUPABASE_PUBLIC_KEY" \
        -H "Authorization: $SUPABASE_SERVICE_KEY" \
        -H "Content-Type: application/json" \
        -d "$JSON_DATA"

        echo "$problem added to supabase"
    fi
    done 
done