## session auth using Passport
discont. session not working in heroku, due to limited cookie scoping(*.herokuapp.com) see https://devcenter.heroku.com/articles/cookies-and-herokuapp-com#cedar-and-herokuapp-com

## remove all migration
npx sequelize db:migrate:undo:all

## apply migration
npx sequelize db:migrate

## create new model
npx sequelize model:generate --name User --attributes firstName:string,lastName:string,email:string
