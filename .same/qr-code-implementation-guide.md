# QRコード実装ガイド

## 問題の原因
画像ファイルが実際にはHTMLドキュメントになっていたため、ブラウザで表示できませんでした。

## 解決方法

### 1. 正しい画像ファイルの準備
- 実際の画像ファイル（PNG, JPG）を使用する
- `file` コマンドで画像ファイルの種類を確認する
```bash
file cava-de-oro-clone/public/images/paynow-qr.png
# 正しい場合：PNG image data, 200 x 200, 8-bit/color RGBA
# 間違っている場合：HTML document, ASCII text
```

### 2. 画像を正しい場所に配置
```bash
cp uploads/OCBC_paynow_QR.jpg cava-de-oro-clone/public/images/paynow-qr.png
cp uploads/photo_2025-09-02_16-08-41.jpg cava-de-oro-clone/public/images/whatsapp-qr.png
```

### 3. Next.jsコードでの表示

#### ❌ 間違った方法（imgタグ）
```tsx
<img
  src="/images/paynow-qr.png"
  alt="PayNow QR Code"
  className="w-64 h-64 object-contain"
/>
```

#### ✅ 正しい方法（Next.js Imageコンポーネント）
```tsx
<Image
  src="/images/paynow-qr.png"
  alt="PayNow QR Code"
  width={256}
  height={256}
  className="object-contain"
/>
```

### 4. 静的エクスポートの設定

#### package.json
```json
{
  "scripts": {
    "build": "next build && mkdir -p out && cp -r public/* out/"
  }
}
```

#### next.config.js
```javascript
const nextConfig = {
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};
```

#### netlify.toml
```toml
[build]
  command = "bun run build"
  publish = "out"  # ← 重要：outディレクトリを指定
```

### 5. デプロイ前の確認
```bash
# ビルド実行
bun run build

# 画像ファイルが正しくコピーされたか確認
ls -lh out/images/*.png
file out/images/paynow-qr.png
file out/images/whatsapp-qr.png
```

## チェックリスト
- [ ] 画像ファイルが実際の画像形式（PNG/JPG）であることを確認
- [ ] public/imagesディレクトリに画像を配置
- [ ] Next.js Imageコンポーネントを使用
- [ ] package.jsonのbuildコマンドに画像コピーを追加
- [ ] next.config.jsでimages.unoptimized: trueを設定
- [ ] netlify.tomlでpublish: "out"を設定
- [ ] ビルド後にout/images/に画像が存在することを確認

## 成功事例
- PayNowのQRコード：正しく表示 ✅
- WhatsAppのQRコード：更新予定

## トラブルシューティング
1. 画像が表示されない → `file`コマンドで画像形式を確認
2. ビルドエラー → package.jsonのbuildコマンドを確認
3. デプロイ後に画像が404 → netlify.tomlのpublishパスを確認
