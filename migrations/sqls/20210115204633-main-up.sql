CREATE TABLE city(
    id INT PRIMARY KEY AUTO_INCREMENT,
    city_name varchar(255),
    query_total int DEFAULT 0
);
@@@
CREATE TABLE date_st(
    id INT PRIMARY KEY AUTO_INCREMENT,
    date_st_name varchar(255)
);
@@@
CREATE TABLE weather(
    id INT PRIMARY KEY AUTO_INCREMENT,
    maxtemp_c int,
    maxtemp_f int,
    mintemp_c int,
    mintemp_f int,
    avgtemp_c int,
    avgtemp_f int,
    maxwind_mph int,
    maxwind_kph int,
    totalprecip_mm int,
    totalprecip_in int,
    avgvis_km int,
    avgvis_miles int,
    avghumidity int,
    dateId int,
    cityId int,
    FOREIGN KEY (cityId) REFERENCES city (id),
    FOREIGN KEY (dateId) REFERENCES date_st (id)
);
@@@
INSERT INTO city (city_name)
VALUES
       ('test_city'),
       ('Alabama'),
       ('Alaska'),
       ('Arizona'),
       ('Arkansas'),
       ('California'),
       ('Colorado'),
       ('Connecticut'),
       ('Delaware'),
       ('Florida'),
       ('Georgia'),
       ('Guam'),
       ('Hawaii'),
       ('Idaho'),
       ('Illinois'),
       ('Indiana'),
       ('Iowa'),
       ('Kansas'),
       ('Kentucky'),
       ('Louisiana'),
       ('Maine'),
       ('Maryland'),
       ('Massachusetts'),
       ('Michigan'),
       ('Minnesota'),
       ('Mississippi'),
       ('Missouri'),
       ('Montana'),
       ('Nebraska'),
       ('Nevada'),
       ('New_Mexico'),
       ('New_York'),
       ('Ohio'),
       ('Oklahoma'),
       ('Oregon'),
       ('Pennsylvania'),
       ('Puerto_Rico'),
       ('Tennessee'),
       ('Texas'),
       ('Utah'),
       ('Vermont'),
       ('Virginia'),
       ('Washington'),
       ('Wisconsin'),
       ('Wyoming');
@@@
INSERT INTO date_st (date_st_name)
VALUES
('2000-01-01');
@@@
INSERT INTO weather (
    maxtemp_c,
    maxtemp_f,
    mintemp_c,
    mintemp_f,
    avgtemp_c,
    avgtemp_f,
    maxwind_mph,
    maxwind_kph,
    totalprecip_mm,
    totalprecip_in,
    avgvis_km,
    avgvis_miles,
    avghumidity,
    dateId,
    cityId)
VALUES
(1,1,1,1,1,1,1,1,1,1,1,1,1,1,1);
