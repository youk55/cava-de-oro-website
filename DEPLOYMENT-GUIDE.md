# Cava de Oro プロジェクト デプロイメントガイド

## 📦 ファイル内容
このZIPファイルには以下が含まれています：
- Next.js 15 プロジェクトファイル
- shadcn/ui コンポーネント
- カート・決済システム
- メール通知機能
- WhatsApp連携
- 多言語対応（英語・中国語）

## 🚀 自分のサーバーにデプロイする方法

### 1. 静的サイトとしてデプロイ（推奨）

```bash
# 1. 依存関係をインストール
bun install
# または npm install

# 2. 静的サイトをビルド
bun run build
# または npm run build

# 3. outフォルダをサーバーにアップロード
# outフォルダ内のファイルをWebサーバーのルートディレクトリにコピー
```

### 2. Next.js サーバーとしてデプロイ

```bash
# 1. 依存関係をインストール
bun install

# 2. プロダクションビルド
bun run build

# 3. サーバー起動
bun start
# または npm start
```

## ⚙️ 必要な設定

### EmailJS設定（注文メール機能）
1. https://www.emailjs.com/ でアカウント作成
2. `src/app/page.tsx` の以下を変更：
   - `YOUR_PUBLIC_KEY` → EmailJS公開キー
   - `YOUR_SERVICE_ID` → EmailJSサービスID
   - `YOUR_TEMPLATE_ID` → EmailJSテンプレートID

### 環境変数設定
`.env.local` ファイルを作成：
```
EMAILJS_PUBLIC_KEY=your_public_key
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
```

## 📁 サーバー要件

### 静的ホスティング
- Apache/Nginx
- Netlify/Vercel/GitHub Pages
- AWS S3 + CloudFront

### Node.js ホスティング
- Node.js 18+
- Vercel/Netlify
- AWS/GCP/Azure
- 専用サーバー

## 🔧 カスタマイズ

### 商品情報変更
`src/app/page.tsx` の `productData` 配列を編集

### スタイル変更
- `src/app/globals.css` - グローバルスタイル
- `tailwind.config.ts` - Tailwind設定
- `src/components/ui/` - UIコンポーネント

### 多言語設定
`src/app/page.tsx` の `translations` オブジェクトを編集

## 📞 サポート
- EmailJS設定: `emailjs-setup.md` 参照
- エラーが発生した場合は、`bun run dev` でローカル開発サーバーを起動してテスト

## 🌐 デモサイト
https://same-3qk8b0nadid-latest.netlify.app
