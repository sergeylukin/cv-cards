# CV Cards

Isomorphic web app. Fetches CVs from http://hs-resume-data.herokuapp.com/ (see
`API_URL` in `next.config.js`).

## Development

- Clone the repo

- Install deps

  ```
  npm install
  ```

- Add `.env` file:

  ```
  API_URL=http://localhost:3333/cv-cards
  ```

- Run mock json server

  ```
  npm run mock
  ```

- Run dev server

  ```
  npm run dev
  ```

- Visit http://localhost:3000/

## Deployment

On your deployment server run `npm install && npm run build && npm run export`
and serve the `out/` directory
