# TaskBoard

Trello風のシンプルなタスク管理アプリ。複数人でプロジェクトを共有し、カンバンボードでタスクを管理できます。

## 機能

### 必須機能
- タスクの作成・編集・削除
- タスクの状態管理（To Do / Doing / Done）
- ドラッグ&ドロップでタスクの移動・並び替え
- 担当者・期限の設定
- プロジェクトへのメンバー招待（招待リンク）

## 技術スタック

- **フロントエンド**: Next.js 16, React 19, Tailwind CSS
- **バックエンド**: Next.js API Routes
- **データベース**: SQLite + Prisma
- **ドラッグ&ドロップ**: @dnd-kit

## セットアップ

```bash
# 依存関係のインストール
npm install

# データベースのマイグレーション
npx prisma migrate dev

# 開発サーバーの起動
npm run dev
```

http://localhost:3000 でアプリにアクセスできます。

## 使い方

1. 初回アクセス時に表示名を入力
2. 「新規プロジェクト」からプロジェクトを作成
3. カンバンボードでタスクを作成・管理
4. メンバーパネルから招待リンクをコピーして共有
5. 招待された人はリンクからプロジェクトに参加

## プロジェクト構成

```
src/
  app/
    page.tsx                    # プロジェクト一覧
    projects/[id]/page.tsx      # カンバンボード
    invite/[code]/page.tsx      # 招待参加ページ
    api/                        # API Routes
  components/                   # UIコンポーネント
  lib/                          # ユーティリティ
prisma/
  schema.prisma                 # データベーススキーマ
```
