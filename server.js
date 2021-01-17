const http = require('http');
require('dotenv').config()
const express = require('express')
const mysql = require('mysql');
const app = express()
const port = 8080
const numOfDays= 7
const Api_Key = process.env.Api_Key
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_Database
});

// swagger

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


//swagger end

// connect to db

connection.connect(function(err) {
    if (err) throw err;
});

// get start data

async function get7d_data (){

    // lok to db and take all city names

    let sql = "SELECT * FROM city WHERE Id != 1;";
    db (sql).then( result => {

        // do sickle no this data

        for (let i = 0; i <= numOfDays; i++){
            const date = JSON.stringify(new Date(Date.now() - 86400000 * (i))).slice(1, -15) ;
            let sql = "INSERT INTO date_st (id, date_st_name) VALUES ?";
            let dbData = [i + 1, date]
            insertDb (sql, dbData)

            result.forEach(el =>{
                // reg params generator
                let params = {
                    hostname: 'api.weatherapi.com',
                    port: 80,
                    path: `/v1/history.json?key=${Api_Key}&q=${el.city_name}&dt=${date}`,
                    method: 'GET',
                    rejectUnauthorized: false,
                    requestCert: true,
                    agent: false
                };

                // req to data api
                requestTg(params).then( data => {
                    let parsData
                    if(data) {
                        try {
                            parsData = JSON.parse(data)
                        } catch(e) {
                            alert(e); // error in the above string (in this case, yes)!
                        }
                    }
                    let dbData = [
                        parsData.forecast.forecastday[0].day.maxtemp_c,
                        parsData.forecast.forecastday[0].day.maxtemp_f,
                        parsData.forecast.forecastday[0].day.mintemp_c,
                        parsData.forecast.forecastday[0].day.mintemp_f,
                        parsData.forecast.forecastday[0].day.avgtemp_c,
                        parsData.forecast.forecastday[0].day.avgtemp_f,
                        parsData.forecast.forecastday[0].day.maxwind_mph,
                        parsData.forecast.forecastday[0].day.maxwind_kph,
                        parsData.forecast.forecastday[0].day.totalprecip_mm,
                        parsData.forecast.forecastday[0].day.totalprecip_in,
                        parsData.forecast.forecastday[0].day.avgvis_km,
                        parsData.forecast.forecastday[0].day.avgvis_miles,
                        parsData.forecast.forecastday[0].day.avghumidity,
                        i + 1, // date id
                        el.id  // city id
                    ]
                    let sql = "INSERT INTO weather (maxtemp_c, maxtemp_f, mintemp_c, mintemp_f, avgtemp_c, avgtemp_f, maxwind_mph, maxwind_kph, totalprecip_mm, totalprecip_in, avgvis_km, avgvis_miles, avghumidity, dateId, cityId) VALUES ?";
                    insertDb (sql, dbData)
                })
            })
        }
    });
}

// get start data end


//some db fnc

async function insertDb (sql, dbData){
    return new Promise((resolve, reject) => {
        try {
            return connection.query(sql, [[dbData]], function (err, result) {
                return resolve(result);
            });
        } catch {
            return reject
        }
    });
}

async function db (sql){
    return new Promise((resolve, reject) => {
        try {
            return connection.query(sql, function (err, result) {
                return resolve(result);
            });
        } catch {
            return reject
        }
    });
}

//some db fnc end

//http req func

async function requestTg (params){
    return new Promise((resolve, reject) => {
        const req = http.request(params, res => {
            const data = [];
            res.on('data', chunk => {
                data.push(chunk);
            });
            res.on('end', () => resolve(Buffer.concat(data).toString()));
        });
        req.on('error', reject);
        req.end();
    });
}

// api routs

app.get('/get7d_data', (request, response) => {
    let sql = "SELECT * FROM weather;";
    db (sql).then( data => {
        if (data.length === 1){
            get7d_data()
            response.send('loading data...')
        } else if (data.length > 1){
            response.send('You already have some data!')
        }
    })
})

app.get('/city', (request, response) => {
    let sql = "SELECT * FROM city";
    db (sql).then( data => {
        if (data === undefined){
            response.send('Db error')
        }else{
            response.send(data)
        }
    })
})

app.get('/city/req_top', (request, response) => {
    let sql = "SELECT * FROM city WHERE query_total in (SELECT MAX(query_total) FROM city);";
    db (sql).then( data => {
        if (data === undefined){
            response.send('Db error')
        }else{
            response.send(data)
        }
    })
})

app.get('/date', (request, response) => {
    let sql = "SELECT * FROM date_st;";
    db (sql).then( data => {
        if (data === undefined){
            response.send('Db error')
        }else{
            response.send(data)
        }
    })
})

// app.get('/weather', (request, response) => {
//
//     let sql = "SELECT * FROM weather JOIN city ON weather.cityId = city.id JOIN date_st ON weather.dateId = date_st.id"
//     db (sql).then( data => {
//         if (data === undefined){
//             response.send('Db error')
//         }else{
//             response.send(data)
//         }
//     })
// })

app.get('/weather/daily', (request, response) => {
    let city = JSON.stringify(request.query['city']);
    let date = JSON.stringify(request.query['date']);

    // update num of req to city

    let sqlIns = `UPDATE city SET query_total = query_total + 1 WHERE city_name=${city}`
    db (sqlIns)

    let sql = `SELECT * FROM weather JOIN city ON weather.cityId = city.id JOIN date_st ON weather.dateId = date_st.id WHERE cityId in (SELECT id FROM city WHERE city_name = ${city}) AND dateId in (SELECT id FROM date_st WHERE date_st_name = ${date});`
    db (sql).then( data => {
        if (data === 'undefined'){
            response.send('Db error')
        }else{
            response.send(data)
        }
    })
})

app.get('/weather/average_temperature', (request, response) => {
    let sql
    let city = JSON.stringify(request.query['city']);
    let date = JSON.stringify(request.query['date']);
    if (typeof date !== 'undefined' && typeof city !== 'undefined') {
        sql = `SELECT avgtemp_c, avgtemp_f, city_name, date_st_name FROM weather JOIN city ON weather.cityId = city.id JOIN date_st ON weather.dateId = date_st.id WHERE cityId in (SELECT id FROM city WHERE city_name = ${city}) AND dateId in (SELECT id FROM date_st WHERE date_st_name = ${date});`

        // update num of req to city

        let sqlIns = `UPDATE city SET query_total = query_total + 1 WHERE city_name=${city}`
        db (sqlIns)
    } else if (typeof city !== 'undefined') {
        sql = `SELECT avgtemp_c, avgtemp_f, city_name, date_st_name FROM weather JOIN city ON weather.cityId = city.id JOIN date_st ON weather.dateId = date_st.id WHERE cityId in (SELECT id FROM city WHERE city_name = ${city});`

        // update num of req to city

        let sqlIns = `UPDATE city SET query_total = query_total + 1 WHERE city_name=${city}`
        db (sqlIns)
    } else if (typeof date !== 'undefined') {
        sql = `SELECT avgtemp_c, avgtemp_f, city_name, date_st_name FROM weather JOIN city ON weather.cityId = city.id JOIN date_st ON weather.dateId = date_st.id WHERE dateId in (SELECT id FROM date_st WHERE date_st_name = ${date});`
    } else if (typeof date === 'undefined' && typeof city === 'undefined') {
        sql = `SELECT avgtemp_c, avgtemp_f, city_name, date_st_name FROM weather JOIN city ON weather.cityId = city.id JOIN date_st ON weather.dateId = date_st.id;`
    }

    // let sql = `SELECT * FROM weather JOIN city ON weather.cityId = city.id JOIN date_st ON weather.dateId = date_st.id WHERE cityId in (SELECT id FROM city WHERE city_name = ${city}) AND dateId in (SELECT id FROM date_st WHERE date_st_name = ${date});`
    db (sql).then( data => {
        if (data === undefined){
            response.send('Db error')
        }else{
            response.send(data)
        }
    })
})

app.listen(port, (err) => {
    if (err) {
        return console.log('Some error', err)
    }
    console.log(`server is listening on ${port}`)
})
