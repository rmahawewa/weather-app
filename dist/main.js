/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (() => {

eval("async function get_weather_info(location) {\n    let info = await fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/'+ location +'?key=6FWBP6SFZFSZ3KE3AXM3Z6V2B&contentType=json', {mode:'cors'});\n    console.log(info);\n}\n\nlet search_button = document.querySelector(\".search\");\n\nsearch_button.addEventListner(\"click\", function(){\n    let location = document.querySelector(\"#search\").value;\n    get_weather_info(location);\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQUE7QUFDQSxpTEFBaUwsWUFBWTtBQUM3TDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9pbmRleC5qcz9iNjM1Il0sInNvdXJjZXNDb250ZW50IjpbImFzeW5jIGZ1bmN0aW9uIGdldF93ZWF0aGVyX2luZm8obG9jYXRpb24pIHtcbiAgICBsZXQgaW5mbyA9IGF3YWl0IGZldGNoKCdodHRwczovL3dlYXRoZXIudmlzdWFsY3Jvc3NpbmcuY29tL1Zpc3VhbENyb3NzaW5nV2ViU2VydmljZXMvcmVzdC9zZXJ2aWNlcy90aW1lbGluZS8nKyBsb2NhdGlvbiArJz9rZXk9NkZXQlA2U0ZaRlNaM0tFM0FYTTNaNlYyQiZjb250ZW50VHlwZT1qc29uJywge21vZGU6J2NvcnMnfSk7XG4gICAgY29uc29sZS5sb2coaW5mbyk7XG59XG5cbmxldCBzZWFyY2hfYnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zZWFyY2hcIik7XG5cbnNlYXJjaF9idXR0b24uYWRkRXZlbnRMaXN0bmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKXtcbiAgICBsZXQgbG9jYXRpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3NlYXJjaFwiKS52YWx1ZTtcbiAgICBnZXRfd2VhdGhlcl9pbmZvKGxvY2F0aW9uKTtcbn0pOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/index.js\n");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval-source-map devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.js"]();
/******/ 	
/******/ })()
;