/*global $*/

let event=10;
let year=[];
let start=0;

let monthes = [ [1,3,5,7,8,10,12],[4,6,9,11], [2] ];
let monthTxtNum = ["Januaray", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let days_limit;
let actualYear = new Date().getFullYear();
let month = new Date().getMonth()+1; 
let actual_days = new Date().getDate();

buildCalender();

$("#month_back").click(function() {
    if(month > 1) {
        month=month-1;
        buildCalender();
    }
});

$("#month_for").click(function() {
    if(month < 12) {
        month=month+1;
        buildCalender();
    }
});

function buildCalender(response) {
    $("#ul_date").empty();
    
    if(monthes[0].includes(month)) {
        days_limit=31;
    }else if(monthes[1].includes(month)) {
        days_limit=30;
    }else if(monthes[2].includes(month)) {
        for(let i=start; i<start+event; i++) {
            if(actualYear%400===0) {
                days_limit=28;
            }else{
                days_limit=29;
            }
        }
    }
    
    for(actual_days=1; actual_days<=days_limit; actual_days++) {
        $(`#ul_date`).append(`<li class="date_cir" id="date_cir${actual_days}"> ${actual_days} </li>`); 
        $("#year_title").text(`${actualYear}`); 
        $("#month").text(monthTxtNum[month-1]);
        $(`#date_cir${actual_days}`).click(function() {
                let id=this.id;
                id = id.replace("date_cir","");
                id = parseInt(id);
            $(".date_cir").css('background-color','white');
            $(`.date_cir`).css('color','black');
            $(`#date_cir${id}`).css('background-color','red');
            $(`#date_cir${id}`).css('color','white');
            
            actual_days=id;
            setAjax(month, actual_days);
            console.log(actual_days);
        });
    }
}

function setAjax() {
    $.ajax({ 
        url: `https://history.muffinlabs.com/date/${month}/${actual_days}`,
        dataType:"Jsonp",
        success: function(response) 
        { 
            $("#backward").click(function() {
                if(start >= event) {
                    start-=event;
                    buildTimeline(response);
                }
                  
    
            });
    
            $("#forward").click(function() {
                if(start + event <= response.data.Events.length - event) 
                {
                    start+=event;
                    buildTimeline(response);
                }   
            });  

            buildTimeline(response);  
            $("#searchEvents").click(function() {
                let input_year = $("#searchBar").val();
                response.data.Events.forEach(function(actual_year) {
                    year.push(actual_year.year);
                    if(actual_year.year === input_year) { 
                        console.log(actual_year.year);
                        console.log(input_year);
                        $("#description").text(actual_year.text);
                        $("#year").text(`(${actual_year.year})`);
                    }else if(!year.includes(input_year)) {      
                        $("#description").text(`No specific Events happened on ${monthTxtNum[month-1]}/${input_year}`);
                        $("#year").text(`(${input_year})`);
                    } 
                });
            });
            
        }
    });
}



function buildTimeline(response) {
    $(".timeline").empty();

    for(let i=start; i<start+event; i++) 
    {              
                
        $(".timeline").append(`<div class="ts" id="ts${i}"> </div>`);
        $(`#ts${i}`).append(`<h1 class="ys" id="ys${i}">${response.data.Events[i].year} </h1>`);
        $("#date").text(`${monthTxtNum[month-1]} ${actual_days}`);
        //console.log(event);
        //console.log(response.data.Events[events]);
        
        $(`#ts${i}`).click(function() {
            //console.log("success");
            let id=this.id;
            id = id.replace("ts","");
            id = parseInt(id);
           $("#description").text(response.data.Events[id].text);
           $("#year").text(`(${response.data.Events[id].year})`);
        });  
    }
}

setAjax();