# 🗺️ u-one Web

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/u-one/uoneweb)

u-oneの個人ウェブサイト。MapLibre GLを使用したインタラクティブな地図アプリケーションを含む、モダンなWebサイトです。

## ✨ 特徴

### 🏠 ホームページ
- **自己紹介**: スキル、興味・関心、プロジェクトの紹介
- **レスポンシブデザイン**: デスクトップ・モバイル対応
- **ソーシャルリンク**: GitHub、X（Twitter）、ブログへのリンク

### 🗺️ マップアプリケーション
- **インタラクティブ地図**: MapLibre GLベースの高性能地図
- **複数スタイル対応**: OpenStreetMap、地理院地図、ラスタタイルなど
- **レイヤー管理**: 表示/非表示切り替え、展開/折りたたみ機能
- **フィーチャー情報**: 地図上のオブジェクトの詳細データ表示
- **現在位置取得**: GPS機能による現在位置の表示
- **URL連携**: 地図の状態をURLで共有可能
- **モバイル最適化**: FAB（フローティングアクションボタン）とモーダル表示

## 🚀 デモ

- **ライブサイト**: [https://uoneweb.net](https://uoneweb.net)
- **マップデモ**: [https://uoneweb.net/maps](https://uoneweb.net/maps)

## 🛠️ 技術スタック

- **フレームワーク**: [Next.js 15](https://nextjs.org/) (App Router)
- **言語**: TypeScript
- **地図ライブラリ**: [MapLibre GL JS](https://maplibre.org/)
- **スタイリング**: CSS-in-JS (インラインスタイル)
- **デプロイ**: [Vercel](https://vercel.com/)
- **パッケージマネージャー**: npm

## 📦 開発

```bash
# リポジトリをクローン
git clone https://github.com/u-one/uoneweb.git
cd uoneweb

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 🏗️ ビルド

```bash
# 本番ビルド
npm run build

# 本番サーバーを起動
npm start

# 型チェック
npm run lint
```

## 📁 プロジェクト構造

```
uoneweb/
├── app/
│   ├── layout.tsx          # ルートレイアウト
│   ├── page.tsx           # ホームページ
│   ├── globals.css        # グローバルスタイル
│   └── maps/              # マップアプリケーション
│       ├── page.tsx       # メインページ
│       ├── hooks/         # カスタムフック
│       ├── components/    # UIコンポーネント
│       └── config/        # 設定ファイル
├── public/                # 静的ファイル
└── README.md
```

## 🎯 主要機能

### マップ機能
- **スタイル切り替え**: 複数の地図スタイルから選択
- **レイヤー管理**: 個別レイヤーの表示制御
- **フィーチャー検索**: 地図上のオブジェクト情報表示
- **位置情報**: 現在位置の取得と表示
- **URL状態管理**: ブックマーク・共有対応

### レスポンシブ対応
- **デスクトップ**: サイドパネル表示
- **モバイル**: FABとモーダル表示
- **タブレット**: 中間的なレイアウト

## 👤 作者

**u-one**
- GitHub: [@u-one](https://github.com/u-one)
- X (Twitter): [@uonejp](https://x.com/uonejp)
- Blog: [https://blog.uoneweb.net/](https://blog.uoneweb.net/)

## 🙏 謝辞

- [MapLibre GL JS](https://maplibre.org/) - オープンソースの地図ライブラリ
- [OpenStreetMap](https://www.openstreetmap.org/) - オープンな地図データ
- [国土地理院](https://www.gsi.go.jp/) - 地理院地図タイル
- [Next.js](https://nextjs.org/) - Reactフレームワーク
