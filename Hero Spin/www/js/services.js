angular.module("HeroSpin.services", []).factory("DataFactory", function () {

    var data = {};
    if (window.localStorage.getItem("myHero") != null) {data.myHero = window.localStorage.getItem("myHero");} else {data.myHero = 'none';}
    data.setHero = function (hro) {        
        data.myHero = hro;       
        window.localStorage.setItem("myHero", data.myHero);
    }
    return data;

})