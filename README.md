# StockLens

StockLensは、株式投資の学習・分析・判断記録を1画面で行うためのダッシュボードアプリです。

## 概要

ユーザーが銘柄を選択し、以下を統合的に確認できます。

- 株価チャートと出来高
- テクニカル指標
- ファンダメンタルズ情報
- ニュースとAI総合判断
- 自分の売買判断記録

## 技術スタック

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Recharts
- yahoo-finance2

## セットアップ

```bash
npm install
npm run dev
```

## フォルダ構成

- `src/app`: ルーティングとAPI Routes
- `src/components`: 画面コンポーネント群
- `src/lib`: データ取得ラッパー、指標計算、スコア計算
- `src/types`: 型定義
- `src/utils`: 共通ユーティリティ

## ロードマップ

- **Phase 1**: スキャフォールド、銘柄検索、ダッシュボード基盤、localStorage保存
- **Phase 2**: Firebase Auth / Firestore連携、市場レジーム推定(HMM)、ユーザー管理
- **Phase 3**: ニュース評価ロジック改善、AI判断の精緻化、分析の自動化
