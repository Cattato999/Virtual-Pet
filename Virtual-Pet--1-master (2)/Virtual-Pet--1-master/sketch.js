var dog, happyDog, database, foodS, foodStock
var fedTime, lastFed, addFood, feed, foodObj

function preload()
{
  dogImg = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
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
}


function draw() {  
  background (46, 139, 87);


  foodObj.display();

  fedTime = database.ref("FeedTime");
  fedTime.on("value",function(data){
    lastFed = data.val();
  });

  drawSprites();
    fill("yellow");
    stroke("black");
    textSize(20);
    text("Amount of food remaining: "+foodS, 200, 50);

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
    FeedTime: hour()
  })
}

function addFoods(){
  foodS++;
  database.ref("/").update({
    Food: foodS
  })
}