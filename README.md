# api-weather
Here you can get up-to-date weather information for the United States


how to run the application!

1. need to rename the .example file to .env
2. enter your mysql options and create a database
3. to work with external api, you need to change the Api_Key parameter in the .env file
4. npm i                        <---for install all node modules
5. running database migrations
6. db-migrate up                <---creating base tables and test data 
7. node server                  <--- to run the application
8. db-migrate down              <---deleting all data and cleaning the database from tables


all documentation is available by url  http://localhost:8080/api-docs/#/
                                             /  host   /port/ path  /

you also have access to a collection of postman with tests in root folder name: weather_api_v1.0.1.postman_collection.json


