# 対話型制度探索社会最適化支援システム オプティマイザー

## 使い方

### npm packages 依存関係をインストールする

```
npm ci
```

### `.env` ファイルに OpenAI API Key を書く

```
cp .env.example .env
```

```.env
OPENAI_API_KEY=sk-xxxxxxxx
```

### デジタル庁のマイ制度ナビからすべての制度の情報を取得し、ベクトル検索できるように準備する

```
make clean
make
```
