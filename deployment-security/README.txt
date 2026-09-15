Choose the configuration that matches your production hosting:
- Apache/cPanel: use the root .htaccess supplied with the site.
- Nginx: include nginx-security.conf in the HTTPS server block; use nginx-https-redirect.conf for port 80.
- Cloudflare Pages / Netlify: root _headers is ready.
- Vercel: copy deployment-security/vercel.json to root as vercel.json.
- Microsoft IIS: copy deployment-security/web.config to root as web.config.

Do not blindly deploy multiple server configuration formats at once.
After deployment, verify HTTPS, HSTS, CSP and all headers on the real production URL.
