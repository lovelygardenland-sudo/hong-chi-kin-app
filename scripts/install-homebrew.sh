#!/bin/bash
# 康姿健 — Homebrew + Watchman 安裝腳本
# 請在 Mac 終端機（Terminal）執行，需要輸入 Mac 登入密碼

set -e

echo "🍺 正在安裝 Homebrew..."
if command -v brew &>/dev/null; then
  echo "✅ Homebrew 已安裝"
else
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

  # Apple Silicon Mac 路徑
  if [ -f /opt/homebrew/bin/brew ]; then
    echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
    eval "$(/opt/homebrew/bin/brew shellenv)"
  fi
  # Intel Mac 路徑
  if [ -f /usr/local/bin/brew ]; then
    echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile
    eval "$(/usr/local/bin/brew shellenv)"
  fi
fi

echo "👀 正在安裝 Watchman（Expo 需要）..."
brew install watchman

echo ""
echo "✅ 完成！現在可以啟動 App："
echo "   cd ~/Desktop/hong-chi-kin-app/mobile"
echo "   npm start"
