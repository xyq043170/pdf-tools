type ToolMatrixTheme = 'light' | 'dark';

function applyTheme(theme: ToolMatrixTheme): void {
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.style.colorScheme = theme;
}

const params = new URLSearchParams(window.location.search);
const embedded = window.self !== window.top || params.get('embedded') === '1';

if (embedded) document.documentElement.classList.add('tool-matrix-embedded');
applyTheme(params.get('theme') === 'light' ? 'light' : 'dark');

window.addEventListener('message', (event: MessageEvent) => {
  if (event.data?.type !== 'tool-matrix-theme') return;
  applyTheme(event.data.theme === 'light' ? 'light' : 'dark');
});
