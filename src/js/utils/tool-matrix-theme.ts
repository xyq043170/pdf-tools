type ToolMatrixTheme = 'light' | 'dark';

function applyTheme(theme: ToolMatrixTheme): void {
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.style.colorScheme = theme;
  sessionStorage.setItem('toolMatrixTheme', theme);
}

const params = new URLSearchParams(window.location.search);
const embedded = window.self !== window.top || params.get('embedded') === '1';

if (embedded) document.documentElement.classList.add('tool-matrix-embedded');
applyTheme(params.get('theme') === 'light' ? 'light' : 'dark');

window.addEventListener('message', (event: MessageEvent) => {
  if (event.data?.type === 'tool-matrix-theme') {
    applyTheme(event.data.theme === 'light' ? 'light' : 'dark');
  }
  if (event.data?.type === 'tool-matrix-language') {
    const language = event.data.language === 'zh' ? 'zh' : 'en';
    sessionStorage.setItem('toolMatrixLanguage', language);
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  }
});
