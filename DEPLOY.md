# Deploy: WishList (计划事务清单)

## Type

WeChat Mini Program -- deployed via WeChat DevTools to the WeChat Mini Program platform.

## Prerequisites

- Registered WeChat Mini Program account (AppID: `wx88ca53bf2b92c46f`)
- Backend API server deployed and accessible (provides `/api/login`, `/api/plans`)
- WeChat DevTools installed on macOS or Windows

## Deploy Steps

1. **Open project** in 微信开发者工具 (WeChat DevTools)
2. **Enter AppID**: `wx88ca53bf2b92c46f` (auto-loaded from `project.config.json`)
3. **Verify backend connection**: ensure `apiBase` in `app.js` points to your deployed server
4. **Test in simulator**: preview all pages (index, plans, result) and verify API calls succeed
5. **Set server domain whitelist** in the WeChat Mini Program admin panel:
   - Add your API server domain to the request whitelist
   - Add subscription message template ID (`iLfFBjJovf2crtLiOCc4gyRLUPK8p_HabJid_5g7EN0`)
6. **Upload** to WeChat platform (click "上传" in DevTools)
7. **Submit for review** if publishing to users, or use as a "体验版" (trial version) for testing

## Server Requirements

The backend API server must:
- Run on HTTPS (WeChat requires HTTPS for production)
- Provide `POST /api/login` -- accepts `{ code }`, returns `{ success, data: { userId, openid } }`
- Provide `POST /api/plans` -- accepts `{ userId, plans }`, returns `{ success }`
- Provide `GET /api/plans/:userId` -- returns `{ success, data: [...] }`
- Handle WeChat subscription message scheduling based on plan deadlines
