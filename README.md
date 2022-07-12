## remove all migration
npx sequelize db:migrate:undo:all

## apply migration
npx sequelize db:migrate

## create new model
npx sequelize model:generate --name User --attributes firstName:string,lastName:string,email:string