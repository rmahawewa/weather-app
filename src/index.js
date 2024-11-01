import "./style.css";
import {format} from "date-fns";

let infomation = {};
let days = {};

function store_info(info){
    // if(localStorage.getItem("weather_info") === null){
        console.log(info);
        let weather_info = JSON.stringify(info);
        console.log(weather_info);
        localStorage.setItem("weather_info", weather_info);
    // }
}

function get_info(){
    let info = "";
    if(localStorage.getItem("weather_info") !== null){
        info = JSON.parse(localStorage.getItem("weather_info"));
    }
    console.log(info);
    return info;
}

function create_forecast_object(object){
    let forecast = {
        'Date': object.datetime,
        'Conditions': object.conditions,
        'Moonphase': object.moonphase,
        'Cloud cover': object.cloudcover,
        'Description': object.description,
        'Windspeed': object.windspeed,
        'Dew': object.dew,
        'Humidity': object.humidity,
        'Icon': object.icon,
        'Solar energy': object.solarenergy,
        'Maximum temperature': object.tempmax,
        'Minimum temperature': object.tempmin,
        'Solar radiation': object.solarradiation,
        'Sunrise time': object.sunrise,
        'Sunset time': object.sunset,
        'Snow': object.snow,
        'Snow depth': object.snowdepth,
        'Visibility': object.visibility,
        'Wind direction': object.winddir,
    }
    return {forecast};
}

function create_hourly_forecast(hours){
    let hours_array = [];
    for(let hour of hours){
        let forecast = create_forecast_object(hour).forecast;
        hours_array.push(forecast);
    }

    return {hours_array};
}

function create_day_object(day){
    let hours = day.hours;
    let hours_array = create_hourly_forecast(hours).hours_array;
    let days = create_forecast_object(day).forecast;
    days.hours = hours_array;
    return {days};
}

function create_days_array(days){
    let days_array = [];
    for(let day of days){
        let entry = create_day_object(day).days;
        days_array.push(entry);
    }
    return {days_array};
}

function create_weather_objects(address, forecast, latitude, longitude, timezone, days){
    let days_array = create_days_array(days);
    let weather_obj = {
        Address: address,
        Forecast: forecast,
        Latitude: latitude,
        Longitude: longitude,
        Timezone: timezone,
        days: days_array,
    }
    return {weather_obj};
}

function store_info_object(promise){
    let address = "";
    let forecast = "";
    let latitude = "";
    let longitude = "";
    let timezone = "";
    let days = [];

    promise.then(function(result){
        address = result.resolvedAddress;
        forecast = result.description;
        latitude = result.latitude;
        longitude = result.longitude;
        timezone = result.timezone;
        days = result.days;
       
        let weather_obj = create_weather_objects(address, forecast, latitude, longitude, timezone, days).weather_obj;
        store_info(weather_obj);

    }).catch(function(){

    }).finally(function(){

    });
}

async function get_weather_info(location, from_date, to_date) {
    location = "london"; 
    from_date = "2024-10-31";
    to_date = "2024-11-01";   
    let response = await fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/'+ location +'/'+ from_date +'/'+ to_date +'?key=6FWBP6SFZFSZ3KE3AXM3Z6V2B&contentType=json', {mode:'cors'});
    let info = response.json().then(function(response){
        let info = response;
        return info;
    });

    return info;
}

let search_button = document.querySelector(".search-btn");
// console.log(search_button.innerHTML);

search_button.addEventListener("click", function(){
    let location = document.querySelector("#search").value;
    process(infomation, days);
    
});

function process(infomation, days){
    let location = document.querySelector("#search").value;
    let from_date = document.querySelector("#from-date").value;
    from_date = format(from_date, "yyyy-MM-dd");
    let to_date = document.querySelector("#to-date").value;
    to_date = format(to_date, "yyyy-MM-dd");

    // let details = get_weather_info(location, from_date, to_date).then((details) => {      
    //     return details;
    // });
    // store_info_object(details);
    create_description();
}

function create_description(){

    let description = get_info();

    let description_html = '<h3>Description</h3><div class="discription" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px,1fr)); gap: 1rem;">';
        
    for(const [key,value] of Object.entries(description)){
        if(key.localeCompare("days") === 0){ continue; }
        description_html +=  `<div class='description_unit'>
                                <label>`+ key +`</label>
                                <label>`+ value +`</label>
                              </div>`;
    }
    description_html += '</div>';
    
    let parent_div = document.querySelector(".common-description");
    parent_div.innerHTML += description_html;
}