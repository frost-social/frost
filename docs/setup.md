# 開発環境構築

Frost開発の環境構築について

## 手順

### 前提環境 (Linux系)
- git
- Visual Studio Code
- Docker

### 前提環境 (Windows)
- WSL Ubuntu
- git (ホスト側に導入)
- Visual Studio Code (ホスト側に導入)
- Docker (ゲスト側に導入)

1. **リポジトリのクローン**\
   本プロジェクトのリポジトリをLinuxもしくはWSL内の任意のディレクトリにcloneする。
1. ***Docker Engine*のインストール**\
   [Docker公式ドキュメントのインストール手順](https://docs.docker.com/engine/install/)を参考にDocker Engineをインストールする。

   ℹ️WSLの環境ではWindowsホストではなくLinuxへのDocker Engineインストールで動作を確認済みです。

   ※ Snap から Docker Engine をインストールした場合、Dev Container が動かなくなるので注意すること

1. **VS Codeの設定変更**\
   VS Codeの設定を開き、設定項目 `Dev > Containers: Docker Compose Path` を `docker compose` に変更する。
1. **リポジトリを開く**\
   VS Codeでリポジトリのディレクトリを開く。
1. **Dev Containerを開く**\
   左下の `><` をクリックし、「コンテナーで再度開く」を選択する。 (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> → `Dev Containers: Reopen in Container`)\
   上部中央に開いたモーダルから目的のリポジトリを選択する。
1. **WSLのポートの設定**\
   そのままだとFrontendの`vite dev`が見れないので、Windows側でコマンドを実行します\
   `netsh interface portproxy add v4tov4 listenport=<5173> listenaddress=0.0.0.0 connectport=<5173> connectaddress=(wsl hostname -i)`\
   ref: [ローカル エリア ネットワーク (LAN) からの WSL 2 ディストリビューションへのアクセス](https://learn.microsoft.com/ja-jp/windows/wsl/networking#accessing-a-wsl-2-distribution-from-your-local-area-network-lan)
1. **FEからAPIへのリクエストを行うオリジンの設定**\
   `frontend/.env`に`VITE_API_ORIGIN`を指定するとそのオリジンにAPIアクセスを行います\
   設定しない場合は`http://localhost:3000`が利用されます
