# WishList (计划事务清单)

A WeChat Mini Program for creating and managing personal wish lists / task plans with deadline reminders. Users set 1-6 plans with titles and deadlines, and receive WeChat subscription message notifications when deadlines are due.

## Features

- **Plan creation** -- create 3-6 plans with custom titles (3+ characters) and deadline dates/times
- **Deadline reminders** -- WeChat subscription messages notify users when a deadline is approaching (default: 1 year)
- **Persistent storage** -- plans are saved to a backend server via REST API, tied to the user's WeChat openid
- **Plan management** -- view existing plans, add new ones, remove unwanted plans
- **Simple onboarding** -- home page with feature highlights, one-tap entry to plan creation

## Tech Stack

- **WeChat Mini Program** -- WXML, WXSS, JavaScript (ES6)
- **Backend API** -- Node.js / Express server (`POST /api/login`, `GET /api/plans/:userId`, `POST /api/plans`)
- **WeChat APIs** -- `wx.login()`, `wx.requestSubscribeMessage()`, `wx.request()`, `wx.setStorageSync()`
- **AppID**: `wx88ca53bf2b92c46f`

## Local Development

1. Open the project in **微信开发者工具** (WeChat DevTools)
2. Set the backend API base URL in `app.js` (`globalData.apiBase`)
3. Start the backend server (see server-side code repository)
4. Preview in the simulator or on a real device via the DevTools QR code

### Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `pages/index/index` | Landing page with "Start Planning" button |
| Plans | `pages/plans/plans` | Plan creation form (1-6 plans with date/time pickers) |
| Result | `pages/result/result` | Success page showing saved plans summary |

### Backend API

The mini program expects a backend server providing these endpoints:

- `POST /api/login` -- exchanges `wx.login()` code for userId + openid
- `POST /api/plans` -- saves plans for a user
- `GET /api/plans/:userId` -- retrieves existing plans for a user

Set the server IP/port in `app.js`:
```js
apiBase: 'http://<YOUR_SERVER_IP>:3000/api'
```

## Deployment

See [DEPLOY.md](DEPLOY.md) and [../DEPLOY_COMMON.md](../DEPLOY_COMMON.md)
