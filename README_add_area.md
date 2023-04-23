# オプティマイザーに対応地域を追加する手順

## `public/data/都道府県名/市区町村/urls.txt` を用意する

このファイルは、各自治体の公式ホームページ等における、オプティマイザーが参考にする上で有用と思われる制度について解説された URL の、改行区切りの一覧です。

## `scripts/area/都道府県名/市区町村名/fetch_and_store.ts` を実装する

`scripts/area/Tokyo/Taito/fetch_and_store.ts` を参考にして実装してください。

LangChain.js の HNSWLib が `public/data/都道府県名/市区町村名/vector_stores/base` に保存するようにしてください。

## `scripts/area/都道府県名/市区町村名/summarize_and_store.ts` を実装する

`scripts/area/Tokyo/Taito/summarize_and_store.ts` を参考にして実装してください。

LangChain.js の HNSWLib が `public/data/都道府県名/市区町村名/vector_stores/summarize` に保存するようにしてください。

## `scripts/area/都道府県名/市区町村名/test.ts` を実装する

`scripts/area/Tokyo/Taito/test.ts` を参考に実装してください。

`public/data/都道府県名/市区町村名/vector_stores/base` や
`public/data/都道府県名/市区町村名/vector_stores/summarize` をベクトル検索して、
期待通りの精度で出力が得られることを確認してください。
