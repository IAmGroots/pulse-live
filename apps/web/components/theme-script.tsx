const themeScript = `(function(){try{var saved=localStorage.getItem("pulse-theme");var dark=saved==="dark"||(saved!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.dataset.theme=dark?"dark":"light";}catch(error){document.documentElement.dataset.theme="light";}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}
