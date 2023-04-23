
all: \
	public/data/DigitalAgency/supports.csv \
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

public/data/DigitalAgency/supports.json: fetch_all_supports
	cat tmp/supports/*.json | jq -s '.[0].items=([.[].items]|flatten)|.[0]'  > ./public/data/DigitalAgency/supports.json

public/data/DigitalAgency/supports.csv: public/data/DigitalAgency/supports.json
	echo "id,title,summary,body,target" > ./public/data/DigitalAgency/supports.csv
	cat public/supports.json | jq -r '.items[] | [.id, .title, .summary, .body, .target] | @csv | gsub("[\\r\\n\\t]"; "") // ""' >> ./public/supports.csv

public/data/DigitalAgency/supportsSummarized.csv:
	echo "id,title,generatedSummary" > ./public/data/DigitalAgency/supportsSummarized.csv
	cat public/data/DigitalAgency/supportsSummarized.json | jq -r '.[] | [.id, .title, .generatedSummary] | @csv | gsub("[\\r\\n\\t]"; "") // ""' >> ./public/data/DigitalAgency/supportsSummarized.csv

.PHONY: vector_store
vector_store:
	npm run store
