import "./style.css";
import {format} from "date-fns";

let infomation = {};
let days = {};

async function get_weather_info(location, from_date, to_date) {
    location = "london"; 
    from_date = "2024-10-31";
    to_date = "2024-11-01";   
    let response = await fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/'+ location +'/'+ from_date +'/'+ to_date +'?key=6FWBP6SFZFSZ3KE3AXM3Z6V2B&contentType=json', {mode:'cors'});
    console.log(response);
    let info = response.json().then(function(response){
        let info = response;
        let days = info.days;
        return {info,days};
    });
    return info;
}

let search_button = document.querySelector(".search-btn");
// console.log(search_button.innerHTML);

search_button.addEventListener("click", function(){
    let location = document.querySelector("#search").value;
    // get_weather_info(location).then((days) => {
    //     console.log(days);
    // });
    process(infomation, days);
    
});

function process(infomation, days){
    let location = document.querySelector("#search").value;
    let from_date = document.querySelector("#from-date").value;
    from_date = format(from_date, "yyyy-MM-dd");
    let to_date = document.querySelector("#to-date").value;
    to_date = format(to_date, "yyyy-MM-dd");

    let details = get_weather_info(location, from_date, to_date).then((details) => {
        // console.log(details.days);
        // console.log(details.info);        
        return details;
    });

    infomation = details.info;
    // console.log(infomation);        
    days = details.days;
    create_description(infomation, days);
}

function create_description(infomation, days){
    console.log(infomation);
    const desc = {
        Address: infomation.resolvedAddress,
        Latitude: infomation.latitude,
        Longitude: infomation.longitude,
        Timezone: infomation.timezone,
        Forecast: infomation.description,
    };
    

    let description_html = '<div class="discription">';
        
    for(const [key,value] of Object.entries(desc)){
        description_html +=  `<div class='description_unit'>
                                <label>`+ key +`</label>
                                <label>`+ value +`</label>
                              </div>`;
    }
    description_html += '</div>';
    
    let parent_div = document.querySelector(".common-description");
    parent_div.innerHTML += description_html;
}