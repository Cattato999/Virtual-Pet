var dog, happyDog, database, foodS, foodStock

function preload()
{
  dogImg = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
}

function setup() {
  createCanvas(500, 500);
  database = firebase.database();

  dog = createSprite(250,250,50,50);
  dog.addImage(dogImg);
  dog.scale = 0.2
  
  foodStock = database.ref("Food");
  foodStock.on("value",readStock);
}


function draw() {  
  background (46, 139, 87);

  if(keyWentDown(UP_ARROW)){
    writeStock(foodS);
    dog.addImage(happyDog);
  }

  

  drawSprites();
    fill("yellow");
    stroke("black");
    textSize(20);
    text("Amount of food remaining: "+foodS, 200, 50);
    text("Press the up arrow key to feed dog",100,400)

}

function readStock(data){
  foodS = data.val();
}

function writeStock(x){
  if(x<=0){
    x=0;
  } else{
    x=x-1;
  }

  database.ref('/').update({
    Food:x
  })
}

