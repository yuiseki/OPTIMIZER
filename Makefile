
all: \
	public/supports.csv

clean:
	rm ./tmp/supports/*
	rm ./public/supports.json
	rm ./public/supports.csv

.PHONY: fetch_all_supports
fetch_all_supports:
	mkdir -p ./tmp/supports
	bash ./scripts/fetch_all_supports.sh

public/supports.json: fetch_all_supports
	cat tmp/supports/*.json | jq -s '.[0].items=([.[].items]|flatten)|.[0]'  > ./public/supports.json

public/supports.csv: public/supports.json
	echo "id,title,summary,body,target" > ./public/supports.csv
	cat public/supports.json | jq -r '.items[] | [.id, .title, .summary, .body, .target] | @csv | gsub("[\\r\\n\\t]"; "") // ""' >> ./public/supports.csv
