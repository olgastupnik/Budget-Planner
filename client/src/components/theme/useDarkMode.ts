import { MouseEventHandler, useEffect, useState } from 'react';

export const useDarkMode = () => {
  const [theme, setTheme] = useState<string>('light');

  const setMode = (mode: string) => {
    window.localStorage.setItem('theme', mode);
    setTheme(mode);
  };

  const themeToggler: MouseEventHandler<HTMLButtonElement> | undefined = (): void =>
    theme === 'light' ? setMode('dark') : setMode('light');

  useEffect(() => {
    const localTheme = window.localStorage.getItem('theme');
    localTheme && setTheme(localTheme);
  }, []);

  return [theme, themeToggler];
};
