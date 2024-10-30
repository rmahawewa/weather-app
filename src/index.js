async function get_weather_info(location) {
    // location = "london";    
    let response = await fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/'+ location +'?key=6FWBP6SFZFSZ3KE3AXM3Z6V2B&contentType=json', {mode:'cors'});
    console.log(response);
    let days = response.json().then(function(response){
        let info = response;
        console.log(info);
        let days = info.days;
        return days;
    });
    return days;
}

let search_button = document.querySelector(".search-btn");
console.log(search_button.innerHTML);

search_button.addEventListener("click", function(){
    let location = document.querySelector("#search").value;
    get_weather_info(location).then((days) => {
        console.log(days);
    });
    
});