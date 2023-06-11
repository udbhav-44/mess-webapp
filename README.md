# Mess WebApp
This webapp provides all mess related things at one place.


## How to run?

1. Install `NodeJS`
2. Clone this repo using `git clone https://github.com/sameeryadv/mess-webapp.git`
3. Open terminal at type `npm install`.
4. Then run `node app.js`

## How to contribute?

1. Fork this repo.
2. Make change.
3. Make Pull request.


## API Documentation

Below are APIs take `POST` request in `x-www-form-urlencoded`.

1. `/authenticate/generateOTP` : if we will send request to this then it will generate otp and send it to the user. It take `roll` as parameter. it will give two type of `{status: true}` for successful otp sent or `{status:false}` on some error.

2. `/authenticate` : it will take two params `roll` and `otp`. it will give two type of response `authenticated:true` if otp is correct or `authenticated:false` if otp is not correct or otp has expired or any other server error