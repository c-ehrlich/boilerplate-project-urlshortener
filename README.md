# [URL Shortener Microservice](https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/url-shortener-microservice)

This is a URL shortening API. Submit a URL to either get it shortened or receive the existing short URL if that same URL has been processed before. Alternatively visit a shortened URL to get redirected to the page it refers to.

Note: I am fully aware of the irony that the long Heroku URL + the long UUID that is used to identify shortened URLs will make most "shortened" URLs longer than the original URL that they're shortening. This project was mostly just an initial test of using Express with MongoDB, not an attempt to create a "useful" project.

Part of the FreeCodeCamp Back End Development Certification.

## Installation
* Clone down the repo
* Create a MongoDB Database. One possbility for this is using [MongoDB Atlas](https://www.freecodecamp.org/news/get-started-with-mongodb-atlas/).
* In the root directory of the project, create a .env file containing: `MONGO_URI: <your Mongo URI>`
* `npm start`

## Sample deployment
https://fcc-urlshortener-service.herokuapp.com/

## Deployment
Heroku is shown as a sample deployment because it's free and doesn't required a Procfile.

With the [Heroku CLI](https://devcenter.heroku.com/categories/command-line) installed,
```
heroku login -i
heroku create <app name>
heroku git:remote -a <app name>
git push heroku main
```
* Create a MongoDB Database. One possbility for this is using [MongoDB Atlas](https://www.freecodecamp.org/news/get-started-with-mongodb-atlas/).
* In the Heroku Project Settings, in Config Vars add key `MONGO_URI`, value is the URI of your MongoDB Database.

## Sample Requests

### Create shortened URL

#### Request
`POST /api/shorturl`

Body (`application/x-www-form-urlencoded`):
```json
{
    "url": "https://www.github.com/c_ehrlich"
}
```
#### Response
```json
{
    "original_url": "https://github.com/c-ehrlich",
    "short_url": "61e5647981137d80d5726035"
}
```

### Visit shortened URL
Visit `/api/shorturl/<short_url>`
