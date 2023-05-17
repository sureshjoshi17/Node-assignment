# Node.js Project

This is a Node assignment project. It has two api, for user login. 

## Features

## generate OTP
    - User will send his email address (which also acts as the login id) in the request body
    - backend will generate an OTP and send it back to the user provided certain conditions are met. The conditions that need to be met are listed below. 


## Login API
    - User will send his email address and OTP in the request body
    - If OTP is valid then generate a new JWT token and send it back to the user


## Important Conditions:
    - OTP once used can not be reused
    - OTP is valid for 5 minutes only. Not after that.
    - 5 consecutive wrong OTP will block the user account for 1 hour. The login can be reattempted only after an hour.
    - There should be a minimum 1 min gap between two generate OTP requests. 


## Prerequisites

Before running this project, make sure you have the following prerequisites installed:

- Node.js [version >= v14.20.0]
- mongodb

## Getting Started

To get started with this project, follow these steps:

1. Clone this repository to your local machine.

   git clone -b master https://github.com/sureshjoshi17/Node-assignment.git  

2. install required packages

    npm install

3. run app

    npm start
