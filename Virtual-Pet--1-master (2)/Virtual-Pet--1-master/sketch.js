var dog, happyDog, database, foodS, foodStock
var fedTime, lastFed, addFood, feed, foodObj
var gameState, readState
var garden, washroom, bedroom

function preload()
{
  dogImg = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
  garden = loadImage("images/Garden.png");
  bedroom = loadImage("images/Bed Room.png");
  washroom = loadImage("images/Wash Room.png");
}

function setup() {
  createCanvas(1000,400);
  database = firebase.database();

  dog = createSprite(800,200,50,50);
  dog.addImage(dogImg);
  dog.scale = 0.2
  
  foodStock = database.ref("Food");
  foodStock.on("value",readStock);

  foodObj = new Food();
  
  feed = createButton("Feed Dog");
  feed.position(900,95);

  addFood = createButton("Add food");
  addFood.position(1000,95);

  feed.mousePressed(feedDog);
  addFood.mousePressed(addFoods);

  readState = database.ref("gameState");
  readState.on("value", function(data){
    gameState = data.val();
  });

  fedTime = database.ref("FeedTime");
  fedTime.on("value",function(data){
    lastFed = data.val()
  });


}


function draw() {  
  background (46, 139, 87);

  /*fedTime = database.ref("FeedTime");
  fedTime.on("value",function(data){
    lastFed = data.val();
  });*/

  if(gameState!=="hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  } else{
    feed.show();
    addFood.show();
    dog.addImage(dogImg);
  }

  currenttime = hour();
  if (currenttime==(lastFed)){
    update("playing");
    foodObj.garden();
  }else if(currenttime==(lastFed+1)){
    update("sleeping");
    foodObj.bedroom();
  }else if(currenttime>(lastFed+1)&&currenttime<=(lastFed+4)){
    update("bathing");
    foodObj.washroom();
  }else{
    update("hungry");
    foodObj.display();
  }

  drawSprites();
    /*fill("yellow");
    stroke("black");
    textSize(20);
    text("Amount of food remaining: "+foodS, 200, 50);*/

    console.log(gameState);
    console.log(currenttime);
    console.log(lastFed);

}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDog);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref("/").update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour(),
    gameState: "hungry"
  });
}

function addFoods(){
  foodS++;
  database.ref("/").update({
    Food: foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}