
const headingEl = document.getElementById("result-heading");
const mealsEl = document.getElementById("meals");
const single_mealEl = document.getElementById("single-meal");
const middleEl = document.getElementById("middle");

generateBeer('null');

$("#search-btn").on('click', function(e){
    e.preventDefault();
    $("#single-meal").hide();
    $("#result-heading").show();
    $("#meals").show();
    var searchStr = $("#text-input").val().trim();
    getBeer(searchStr.toLowerCase());
});

$("#random").on('click',function(e){
    e.preventDefault();
    generateBeer('null');
});

//validates input
function getBeer(searchStr){
    //clear previous meals
    single_mealEl.innerHTML = '';

    //check for empty string
    if(searchStr === ''){
        alert("Please enter a Beer ");
    }else{
        generateBeer(searchStr);
        //clear search text
        $("#text-input").val('');
    }
}

//generates some beers and update dom
function generateBeer(str){
    var result = [];//to store response
    $.ajax({ 
        url: "https://s3-ap-southeast-1.amazonaws.com/he-public-data/beercraft5bac38c.json",
        method: "get",
        success(response){
            
            for(var i=0; i<2410; i++){
                result.push(response[i]);
            }
            //console.log("x: ", result);
            

            //api call to get image urls
            $.ajax({
                url: "https://s3-ap-southeast-1.amazonaws.com/he-public-data/beerimages7e0480d.json",
                method: 'get',
                success(res){
                    //console.log(res);
                    //now add the images to result of the beer fetch api 
                    var i = 0
                    while(i < 2410){
                        for(var j=0; j<5; j++){
                            result[i]['img'] = res[j].image;
                            i++;
                        }
                        
                    }
                    //console.log(result);



                    //now show the results on the dom
                    if(result === null){
                        //clear previous results
                        mealsEl.innerHTML = '';
                        middleEl.innerHTML = '<div class="sorry-img-container"> <img class="sorry" src="images/sorry.png"></div>';
                    }
                    else{
        
                        //if user asked for a specific beer by searching it
                        if(str != 'null'){
                            middleEl.innerHTML = '';
                            //console.log(str);
                            var i = 0
                            while(i < 2410){
                                //2410 is the length of the array
                               
                                if(result[i].name.toLowerCase().indexOf(str) != -1){
                                    beer = result[i];
        
                                    //console.log('beer', response[i].name);
        
                                    mealsEl.innerHTML =  `
                                    <div class="meal">
                                        <img src="${beer.img}" class="meal-img" alt="beer" id="img-"/>
                                        <div class="meal-info" data-mealID="${beer.id}">
                                        <h3>${beer.name}</h3>
                                            <ul>
                                                <li> <p> Style: ${beer.style}</p></li>
                                                <li> <p>Ounces: ${beer.ounces}</p></li>
                                                <li> <p>Abv: ${beer.abv}</p></li>
                                                <li> <p>IBU: ${beer.ibu}</p></li>
                                            </ul>
                                        </div>
                                    </div>
                                `
                                }
        
                                i++;
                            }
                        }
        
                        else{
                            middleEl.innerHTML = '';
                            mealsEl.innerHTML = result.map(beer => 
                                `
                                <div class="meal">
                                    <img src="${beer.img}" class="meal-img" alt="beer" id="img-"/>
                                    <div class="meal-info" data-mealID="${beer.id}">
                                        <h3>${beer.name}</h3>
                                        <ul>
                                            <li> <p> Style: ${beer.style}</p></li>
                                            <li> <p>Ounces: ${beer.ounces}</p></li>
                                            <li> <p>Abv: ${beer.abv}</p></li>
                                            <li> <p class="ibu">IBU: ${beer.ibu}</p></li>
                                        </ul>
                                    </div>
                                </div>
                            `)
                            .join('');
                            
                        }
                       
                    }


                },
                error(){
                    alert('Could not fetch images!!');
                }
            });

            
        },
        error(xhr){
            alert("could not fetch !");
        }
    });
}

