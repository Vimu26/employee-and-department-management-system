export const environment = {
  production: false,
  API_URL: (window as any).env?.API_URL || 'http://localhost:3000',
  WEB_URL: (window as any).env?.WEB_URL ||'http://localhost:4200',
};
