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
    console.log(info.days.days_array[0]);
    return {info};
}

function add_selectives(){
    let selectives = {
        'days_index': 0,
        'Date': 1,
        'Conditions': 1,
        'Cloud cover': 1,
        'Windspeed': 1,
        'Dew': 1,      
        'Humidity': 1,
        'Icon': 1,       
        'Solar energy': 1,
        'Solar radiation': 1,
        'Snow': 1,       
        'Snow depth': 1,
        'Visibility': 1,
        'Wind direction': 1,
        'Hours': 10,
    }
    return {selectives};
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
    // location = "london"; 
    from_date = "2024-10-31";
    to_date = "2024-11-01";   
    let response = await fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/'+ location +'/'+ from_date +'/'+ to_date +'?key=6FWBP6SFZFSZ3KE3AXM3Z6V2B&contentType=json', {mode:'cors'});
    let info = response.json().then(function(response){
        let info = response;
        console.log(info);
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
    let item_obj = get_selectives();
    create_item_board(item_obj);

    get_forecast(item_obj['days_index'], item_obj['Hours']);
}

function get_forecast(days_array_index, hours_array_index){
    let whole_forecast = get_info().info;
    let forecast = whole_forecast.days.days_array;

    weather_all_day(forecast, days_array_index);
    weather_for_hour(forecast, days_array_index, hours_array_index);
}

function create_description(){

    let description = get_info().info;

    let description_html = '<h3>Details</h3><div class="discription" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px,1fr)); gap: 1rem;">';
        
    for(const [key,value] of Object.entries(description)){
        if(key.localeCompare("days") === 0){ continue; }
        description_html +=  `<div class='description_unit'>
                                <label>`+ key +`</label>
                                <label>`+ value +`</label>
                              </div>`;
    }
    description_html += '</div>';
    
    let parent_div = document.querySelector(".common-description");
    parent_div.innerHTML = description_html;
}

function create_item_board(item_obj){

    let not_in_hours = ['Moonphase', 'Description', 'Maximum temperature', 'Minimum temperature', 'Sunrise time', 'Sunset time'];
    let hour_value = (item_obj.Hours > -1 ? item_obj.Hours : "");
    let item_container = `<h3>Add required additional information</h3>
                            <div class="hour">
                            <label>Hour</label>
                            <input type="number" min="0" max="23" value=`+ hour_value +`>
                            <div class="item_check_boxes" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px,1fr)); gap: 1rem;">
                            <div class='checkbox'>
                                    <input type="checkbox" class='weather-item' id='all' value='All' checked>
                                    <label>All</label>
                            </div>`;
    if(Object.keys(item_obj).length > 0){
        for(const [key,value] of Object.entries(item_obj)){
            let is_checked = value === 1 ? "checked" : "";
            if(not_in_hours.includes(key) && item_obj.Hours > -1){ continue; }
            if(key.localeCompare("Hours") === 0 || key.localeCompare("days_index") === 0){ continue; }
            item_container += `
                                <div class='checkbox'>
                                    <input type="checkbox" class='weather-item' id=`+ key +` value=`+ key +` `+ is_checked +`>
                                    <label>`+ key +`</label>
                                </div>
            `;
        }
        item_container
    }
    let parent_div = document.querySelector(".choose");
    parent_div.innerHTML = item_container;
}

function weather_all_day(days_obj, index){   //see line number 21
    let not_in_hours = ['Moonphase', 'Description', 'Maximum temperature', 'Minimum temperature', 'Sunrise time', 'Sunset time'];
    let details = days_obj[index];

    let item_container = '<h3>Throughout day forecast</h3><div class="forecast-discription" width="100%" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(225px,1fr)); gap: 1rem;">';

    for(const [key,value] of Object.entries(details)){
        if(value !== undefined && not_in_hours.includes(key)){
            item_container += `
                <div class="all-day-item" style="display: flex; flex-direction: column;">
                    <label>`+ key +`</label>
                    <label>`+ value +`</label>
                </div>            
            `;
        }
    }

    item_container += `</div>`;

    let parent_div = document.querySelector(".general-forecast");
    parent_div.innerHTML = item_container;

}

function weather_for_hour(days_obj, index, hour){
    let selectives = localStorage.getItem("weather_items");
    let selectives_obj = JSON.parse(selectives);
    let details = days_obj[index].hours[hour];
    hour = hour < 10 ? "0"+hour : hour;

    let item_container = '<h3>'+ hour +' hour forecast</h3><div class="forecast-discription" width="100%" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(225px,1fr)); gap: 1rem;">';

    for(const [key,value] of Object.entries(details)){
        if(key in selectives_obj && key.localeCompare("days_index") === 0){ continue; }
        if(key in selectives_obj && selectives_obj[key] > 0){
            item_container += `
                <div class="additional-item" style="display: flex; flex-direction: column;">
                    <label>`+ key +`</label>
                    <label>`+ value +`</label>
                </div>
            `;
        }
    }

    item_container += `</div>`;

    let parent_div = document.querySelector(".hourly-forecast");
    parent_div.innerHTML = item_container;

}

function get_selectives(){
    let items_obj = {};
    if(localStorage.getItem("weather_items") === null || localStorage.getItem("weather_items") === undefined){

        let selectives = add_selectives().selectives;
        let selectives_string = JSON.stringify(selectives);
        localStorage.setItem("weather_items", selectives_string);

    }

    if(localStorage.getItem("weather_items") !== null){
        let items = localStorage.getItem("weather_items");
        console.log(items);
        items = JSON.parse(items);
        items_obj = items;
    }
    console.log(items_obj);
    return items_obj;
}

function all_items_button_click(value){
    let selectives = localStorage.getItem("weather_items");
    let selectives_obj = JSON.parse(selectives);

    if(value === 1){
        for(const [key,value] of Object.entries(selectives_obj)){
            if(key.localeCompare("Hours") === 0){ continue; }
            selectives_obj[key] = 1;
        }
    }
    if(value === 0){
        for(const [key,value] of Object.entries(selectives_obj)){
            if(key.localeCompare("Hours") === 0){ continue; }
            selectives_obj[key] = 0;
        }
    }

    let weather_items = JSON.stringify(selectives_obj);
    localStorage.setItem("weather_items", weather_items);

    const is_checked = value === 1 ? true : false; 
    let checkboxes = document.querySelectorAll(".weather-item");

    checkboxes.forEach((checkbox) => {
        checkbox.checked = is_checked;
    });

}

let choose = document.querySelector(".choose");
choose.addEventListener('click', (e) => {
    if(e.target.getAttribute("id").localeCompare("all") === 0){
        let is_checked = checkbox_all.checked;
        all_items_button_click(is_checked);
    }
});
