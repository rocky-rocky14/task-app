# TaskBoard デプロイ情報

Vercel への本番デプロイに関する情報をまとめたドキュメントです。

## 本番 URL

| 種別 | URL |
|------|-----|
| **本番アプリ** | https://task-app-khaki-phi.vercel.app |
| **GitHub リポジトリ** | https://github.com/rocky-rocky14/task-app |

## 管理画面

| サービス | URL | 内容 |
|---------|-----|------|
| **Vercel ダッシュボード** | https://vercel.com/rocky-rocky14s-projects/task-app | デプロイ状況・ログ・環境変数 |
| **Vercel Billing** | https://vercel.com/account/billing | プラン・課金確認 |
| **Neon（Storage）** | https://vercel.com/d/dashboard/integrations/neon/icfg_kGsmoveq8y9kyDbdwuCSLow1/resources/store_ulGD9SPESdQX2kx9 | データベース管理 |

## 実施内容

### 1. Vercel プロジェクト作成・連携

- Vercel プロジェクト `task-app` を作成
- GitHub リポジトリ（`rocky-rocky14/task-app`）と連携
- `main` ブランチへのプッシュで自動デプロイ

### 2. データベース移行（SQLite → PostgreSQL）

Vercel のサーバーレス環境では SQLite が使えないため、PostgreSQL に移行しました。

- Prisma の provider を `sqlite` → `postgresql` に変更
- `@prisma/adapter-pg` + `pg` を導入
- 本番用マイグレーションを適用

### 3. Neon データベース作成

- Vercel Marketplace 経由で Neon を連携
- データベース名: `task-app-db`
- プラン: **Free（`free_v3`）**
- 環境: Production / Preview

### 4. 本番デプロイ

- `prisma migrate deploy` で本番 DB にスキーマ適用
- Next.js ビルド成功
- 本番 URL で動作確認済み（HTTP 200、API 正常応答）

### 5. その他の設定

- `.vercelignore` — ローカルの `.env` や `dev.db` がアップロードされないよう設定
- `.env.example` — 環境変数のサンプルを追加

## 現在のプラン

| サービス | プラン | 月額 |
|---------|--------|------|
| **Vercel** | Hobby（無料） | $0 |
| **Neon（DB）** | Free（`free_v3`） | $0 |

## 無料枠の目安

### Vercel Hobby

| リソース | 無料枠 |
|---------|--------|
| Function 実行 | 月 100 万回 |
| データ転送 | 月 100 GB |
| Active CPU | 月 4 CPU-hrs |
| Provisioned Memory | 月 360 GB-hrs |

- 超過時: **課金ではなく一時停止**（Hobby では追加購入不可）
- 用途: 個人・非商用プロジェクト向け

### Neon Free

| リソース | 無料枠 |
|---------|--------|
| Compute | 100 CU-hours / プロジェクト / 月 |
| ストレージ | 0.5 GB / ブランチ |
| ネットワーク転送 | 5 GB / 月 |
| プロジェクト数 | 100 |

- 超過時: **DB が一時停止**（自動課金されない）
- 用途: プロトタイプ・個人プロジェクト・小規模チーム向け

### TaskBoard での目安

個人利用・少人数での利用であれば、通常は上記の無料枠内に収まります。

## 課金について

現状の構成では **$0 / 月** が想定されます。

課金が発生する可能性があるのは、以下の操作をした場合のみです。

1. Vercel を **Pro（$20/月）** にアップグレード
2. Neon を **Launch / Scale** にアップグレード
3. クレジットカードを登録して有料機能を有効化

無料枠超過時は課金ではなく **サービスが一時停止** する設計です。

## 再デプロイ方法

```bash
cd task-app

# 本番デプロイ（CLI から手動）
npx vercel deploy --prod

# GitHub へプッシュすれば自動デプロイ
git push origin main
```

## 環境変数

本番・Preview 環境では Neon 連携により `DATABASE_URL` などが Vercel に自動設定されています。

ローカルで本番 DB に接続する場合:

```bash
npx vercel env pull .env.local
```

## デプロイ日

2026年6月20日
