# Деплой на GitHub Pages

## Быстрый старт

### 1. Создайте репозиторий на GitHub
- Название: `gromover-truth` (или любое другое)
- Публичный репозиторий
- Добавьте README.md

### 2. Обновите package.json
Замените `yourusername` на ваше имя пользователя GitHub:
```json
{
  "repository": {
    "url": "https://github.com/YOUR_USERNAME/gromover-truth.git"
  },
  "homepage": "https://YOUR_USERNAME.github.io/gromover-truth"
}
```

### 3. Загрузите файлы
```bash
git clone https://github.com/YOUR_USERNAME/gromover-truth.git
cd gromover-truth
# Скопируйте все файлы проекта
git add .
git commit -m "Initial commit"
git push origin main
```

### 4. Настройте GitHub Pages
1. Перейдите в Settings → Pages
2. Source: "Deploy from a branch"
3. Branch: `gh-pages`
4. Folder: `/ (root)`
5. Save

### 5. Проверьте деплой
Через несколько минут сайт будет доступен по адресу:
`https://YOUR_USERNAME.github.io/gromover-truth`

## Структура файлов
```
├── index.html              # Главная страница
├── dossiers.html           # Страница досье
├── styles.css              # Стили
├── script.js               # JS главной страницы
├── dossiers.js             # JS страницы досье
├── Gromovercreative_upscaled.webp
├── package.json
├── .github/workflows/deploy.yml
├── .gitignore
└── README.md
```

## Автоматический деплой
При каждом push в ветку `main` сайт автоматически обновляется на GitHub Pages.

## Локальная разработка
```bash
npm install
npm start
```
Сайт будет доступен по адресу: `http://localhost:8080` 