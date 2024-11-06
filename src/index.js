import "./style.css";
import {format} from "date-fns";
import { addDays } from "date-fns";
import { subDays } from "date-fns";
import { isValid } from "date-fns";


let date_picker_a = document.querySelector("#from-date");
let date_picker_b = document.querySelector("#to-date");

date_picker_a.addEventListener("change", function(){
    set_last_date();
});

date_picker_b.addEventListener("change", function(){
    set_first_date();
});

function get_last_date(first_date){
    let last_date = addDays(first_date, 7);
    return {last_date};
}

function get_first_date(last_date){
    let first_date = subDays(last_date, 7);
    return {first_date};
}

function set_last_date(){
    let date_picker_a = document.querySelector("#from-date");
    let date_picker_b = document.querySelector("#to-date");
    let first_date = date_picker_a.value;
    first_date = format(first_date, "yyyy-MM-dd");
    let last_date = get_last_date(first_date).last_date;
    last_date = format(last_date, "yyyy-MM-dd");
    console.log("last date: " + last_date);

    date_picker_b.setAttribute("min", first_date);
    date_picker_b.setAttribute("max", last_date);
}

function set_first_date(){
    let date_picker_a = document.querySelector("#from-date");
    let date_picker_b = document.querySelector("#to-date");
    let last_date = date_picker_b.value;
    last_date = format(last_date, "yyyy-MM-dd");
    let first_date = get_first_date(last_date).first_date;
    first_date = format(first_date, "yyyy-MM-dd");
    console.log("first date: " + first_date);

    date_picker_a.setAttribute("min", first_date);
    date_picker_a.setAttribute("max", last_date);
}

function store_info(info){
    // if(localStorage.getItem("weather_info") === null){
        
        let weather_info = JSON.stringify(info);
        
        localStorage.setItem("weather_info", weather_info);
        
    // }
}

function get_info(){
    let info = "";
    if(localStorage.getItem("weather_info") !== null){
        info = JSON.parse(localStorage.getItem("weather_info"));
    }
    
    return {info};
}

function add_selectives(){
    let selectives = {
        'days_index': 0,
        'days_max_index': -1,
        'Time': 1,
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
    console.log(days);
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
        console.log(result);
        address = result.resolvedAddress;
        forecast = result.description;
        latitude = result.latitude;
        longitude = result.longitude;
        timezone = result.timezone;
        days = result.days;
        console.log(days);
       
        let weather_obj = create_weather_objects(address, forecast, latitude, longitude, timezone, days).weather_obj;
        console.log(weather_obj);
        store_info(weather_obj);

    }).catch(function(){

    }).finally(function(){

    });
}

async function get_weather_info(location, from_date, to_date) {
    // location = "london"; 
    // from_date = "2024-10-31";
    // to_date = "2024-11-03";   
    let response = await fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/'+ location +'/'+ from_date +'/'+ to_date +'?key=6FWBP6SFZFSZ3KE3AXM3Z6V2B&contentType=json', {mode:'cors'});
    let info = response.json().then(function(response){
        let info = response;
        
        return info;
    });

    return info;
}

let search_button = document.querySelector(".search-btn");

function validate_data(){
    let from_date = document.querySelector("#from-date").value;
    let to_date = document.querySelector("#to-date").value;
    let is_valid_from_date = isValid(from_date);
    let is_valid_to_date = isValid(to_date);
    let location = document.querySelector("#search").value;
}

search_button.addEventListener("click", function(){
    // validate_data();
    process();
    view_day_switch_buttons();
    
});

function process(){
    let location = document.querySelector("#search").value;
    let from_date = document.querySelector("#from-date").value;
    from_date = format(from_date, "yyyy-MM-dd");
    let to_date = document.querySelector("#to-date").value;
    to_date = format(to_date, "yyyy-MM-dd");

    let details = get_weather_info(location, from_date, to_date).then((details) => {      
        return details;
    });
    
    store_info_object(details);
    add_day_array_max_index();
    create_description();
    reset_selectives_index();
    let item_obj = get_selectives().items_obj;
    
    create_item_board(item_obj);
    console.log(item_obj);
    get_forecast(item_obj['days_index'], item_obj['Hours']);
    
}

function get_forecast(days_array_index, hours_array_index){

    let whole_forecast = get_info().info;
    console.log(whole_forecast);

    if(whole_forecast !== undefined){
        let forecast = whole_forecast.days.days_array;
        console.log(forecast);

        if(forecast !== undefined){
            weather_all_day(forecast, days_array_index);
            weather_for_hour(forecast, days_array_index, hours_array_index);
        }
        
    }
   
}

function create_description(){

    let description = get_info().info;

    let description_html = '<h3>Details</h3><div class="discription" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px,1fr)); gap: 1rem;">';
        
    for(const [key,value] of Object.entries(description)){
        if(key.localeCompare("days") === 0){ continue; }
        description_html +=  `<div class='description_unit'>
                                <label class="topic">`+ key +`</label>
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
                            <input type="number" id="hour-value" min="0" max="23" value=`+ hour_value +`>
                            </div>
                            <div class="item_check_boxes" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px,1fr)); gap: 1rem;">
                            <div class='checkbox'>
                                    <input type="checkbox" class='weather-item' id='all' value='All' checked>
                                    <label>All</label>
                            </div>`;
    if(Object.keys(item_obj).length > 0){
        for(const [key,value] of Object.entries(item_obj)){
            let is_checked = value === 1 ? "checked" : "";
            if(not_in_hours.includes(key) && item_obj.Hours > -1){ continue; }
            if(key.localeCompare("Hours") === 0 || key.localeCompare("days_index") === 0 || key.localeCompare("days_max_index") === 0){ continue; }
            item_container += `
                                <div class='checkbox'>
                                    <input type="checkbox" class='weather-item one-item' id="`+ key +`" value="`+ key +`" `+ is_checked +`>
                                    <label>`+ key +`</label>
                                </div>
            `;
        }
        
    }
    item_container += `</div>`;

    let parent_div = document.querySelector(".choose");
    parent_div.innerHTML = item_container;
}

function weather_all_day(days_obj, index){   //see line number 21
    let not_in_hours = ['Date','Moonphase', 'Description', 'Maximum temperature', 'Minimum temperature', 'Sunrise time', 'Sunset time'];
    let details = days_obj[index];

    let item_container = '<h3>Throughout day forecast</h3><div class="forecast-discription" width="100%" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(225px,1fr)); gap: 1rem;">';

    console.log(details);

    if(details !== undefined){
        for(const [key,value] of Object.entries(details)){
            if(value !== undefined && not_in_hours.includes(key)){
                item_container += `
                    <div class="all-day-item" style="display: flex; flex-direction: column;">
                        <label class="topic">`+ key +`</label>
                        <label>`+ value +`</label>
                    </div>            
                `;
            }
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
            let name = key.localeCompare("Date") === 0 ? "Time": key;
            item_container += `
                <div class="additional-item" style="display: flex; flex-direction: column;">
                    <label class="topic">`+ name +`</label>
                    <label>`+ value +`</label>
                </div>
            `;
        }
    }

    item_container += `</div>`;

    let parent_div = document.querySelector(".hourly-forecast");
    parent_div.innerHTML = item_container;

}

function add_day_array_max_index(){
    let info_object = get_info().info;
    let info_object_length = info_object.days.days_array.length;
    let info_object_max_index = info_object_length - 1;
    console.log(info_object.days.days_array);

    let selectives = get_selectives().items_obj;
    selectives['days_max_index'] = info_object_max_index;
    update_selectives(selectives);
}

function reset_selectives_index(){
    let selectives = get_selectives().items_obj;
    selectives['days_index'] = 0;
    update_selectives(selectives);
}

function get_selectives(){    

    let items_obj = "";
    
    if(localStorage.getItem("weather_items") === null || localStorage.getItem("weather_items") === undefined){

        let selectives = add_selectives().selectives;
        let selectives_string = JSON.stringify(selectives);
        localStorage.setItem("weather_items", selectives_string);

    }

    if(localStorage.getItem("weather_items") !== null){
        let items = localStorage.getItem("weather_items");
        
        items = JSON.parse(items);
        items_obj = items;
    }
    
    return {items_obj};
}

function update_selectives(selectives){
    let selectives_string = JSON.stringify(selectives);
    localStorage.setItem("weather_items", selectives_string);
    
}

function one_checkbox_click(k, v){
    let selectives_obj = get_selectives().items_obj;

    for(const [key,value] of Object.entries(selectives_obj)){
        if(key.localeCompare(k) === 0)
        selectives_obj[key] = v;
    }

    update_selectives(selectives_obj);

    get_forecast(selectives_obj['days_index'], selectives_obj['Hours']);

}

function all_items_button_click(v){
    
    let selectives_obj = get_selectives().items_obj;
    
        for(const [key,value] of Object.entries(selectives_obj)){
            
            if(key.localeCompare("Hours") === 0){ continue; }
            if(key.localeCompare("days_index") === 0){ continue; }
            
            selectives_obj[key] = v;
            
        }

    update_selectives(selectives_obj);    

    const is_checked = v === 1 ? true : false; 
    let checkboxes = document.querySelectorAll(".weather-item");

    checkboxes.forEach((checkbox) => {
        checkbox.checked = is_checked;
    });

    get_forecast(selectives_obj['days_index'], selectives_obj['Hours']);
}

let choose = document.querySelector(".choose");
choose.addEventListener('click', (e) => {
    
    if(e.target.getAttribute("id") !== null && e.target.getAttribute("id").localeCompare("all") === 0){
        let is_checked = e.target.checked ? 1 : 0;
        all_items_button_click(is_checked);
    }

    if(e.target.getAttribute("class") !== null){
        let array = e.target.getAttribute("class").split(" ");
        if(array.includes("one-item")){        
            let key = e.target.getAttribute("value");
            let value = e.target.checked ? 1 : 0;
            
            one_checkbox_click(key, value);
        }
    }    

    if(e.target.getAttribute("id") !== null && e.target.getAttribute("id").localeCompare("hour-value") === 0){
        let value = e.target.value;
        hour_change_function(value);
    }
});

function hour_change_function(hour){
    
    let weather_items = get_selectives().items_obj;
    
    weather_items['Hours'] = hour;
    update_selectives(weather_items);
    get_forecast(weather_items['days_index'], weather_items['Hours']);
}

function view_day_switch_buttons(){
    let buttons = `
                    <div class="previous-day"><button class="day-switch-btn" id="previous-day">previous-day</button></div>
                    <div class="next-day"><button class="day-switch-btn" id="next-day">next-day</button></div>
                `;

    let parent_div = document.querySelector(".day-switch");
    parent_div.innerHTML = buttons;

    let item_obj = get_selectives().items_obj;
    let current_index = item_obj['days_index'];
    let max_index = item_obj['days_max_index'];

    if(current_index === 0){
        document.querySelector("#previous-day").setAttribute("style", "display: none");
    }
}

let day_buttons = document.querySelector(".day-switch");
day_buttons.addEventListener("click", (e) => {

    let item_obj = get_selectives().items_obj;
    let current_index = item_obj['days_index'];
    let max_index = item_obj['days_max_index'];

    if(e.target.getAttribute("id") !== null && e.target.getAttribute("id").localeCompare("previous-day") === 0){
        document.querySelector("#next-day").setAttribute("style","display: flex");
        if(current_index > 0){
            item_obj['days_index'] = current_index - 1;
            if(item_obj['days_index'] === 0){
                e.target.setAttribute("style", "display: none");
            }
        }
    }

    if(e.target.getAttribute("id") !== null && e.target.getAttribute("id").localeCompare("next-day") === 0){
        document.querySelector("#previous-day").setAttribute("style","display: flex");
        if(current_index < max_index){
            item_obj['days_index'] = current_index + 1;
            if(item_obj['days_index'] === max_index){
                e.target.setAttribute("style", "display: none");
            }
        }
    }

    update_selectives(item_obj);
    create_item_board(item_obj);
    get_forecast(item_obj['days_index'], item_obj['Hours']);

});