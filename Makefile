
all: \
	public/supports.csv \
	vector_store

clean:
	rm ./tmp/supports/*
	rm ./public/supports.json
	rm ./public/supports.csv
	rm ./public/vector_store/*

.PHONY: fetch_all_supports
fetch_all_supports:
	mkdir -p ./tmp/supports
	bash ./scripts/fetch_all_supports.sh

public/supports.json: fetch_all_supports
	cat tmp/supports/*.json | jq -s '.[0].items=([.[].items]|flatten)|.[0]'  > ./public/supports.json

public/supports.csv: public/supports.json
	echo "id,title,summary,body,target" > ./public/supports.csv
	cat public/supports.json | jq -r '.items[] | [.id, .title, .summary, .body, .target] | @csv | gsub("[\\r\\n\\t]"; "") // ""' >> ./public/supports.csv

public/supportsSummarized.csv:
	echo "id,title,generatedSummary" > ./public/supportsSummarized.csv
	cat public/supportsSummarized.json | jq -r '.[] | [.id, .title, .generatedSummary] | @csv | gsub("[\\r\\n\\t]"; "") // ""' >> ./public/supportsSummarized.csv

.PHONY: vector_store
vector_store:
	npm run store
