var trex, trex_running, edges;
var groundImage;
var piso ;
var piso_invisible;
var imagennube;
var cactus1;
var cactus2;
var cactus3;
var cactus4;
var cactus5;
var cactus6;
var puntos= 0;
var INICIO = 1;
var FIN= 0;
var estadodejuego = INICIO;
var trexcollided;
var gameover;
var gameoverimg;
var reinicio;
var reinicioimg;
var saltar;
var morir;
var sonidopuntaje;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");


  groundImage = loadImage("ground2.png");
  imagennube = loadImage("cloud.png");
  cactus1 = loadImage("obstacle1.png");
  cactus2 = loadImage("obstacle2.png");
  cactus3 = loadImage("obstacle3.png");
  cactus4 = loadImage("obstacle4.png");
  cactus5 = loadImage("obstacle5.png");
  cactus6 = loadImage("obstacle6.png");
  trexcollided = loadAnimation("trex_collided.png");
  gameoverimg = loadImage("gameOver.png");
  reinicioimg = loadImage("restart.png");
  saltar = loadSound("jump.mp3");
  morir = loadSound("die.mp3");
  sonidopuntaje = loadSound("checkpoint.mp3");

}

function setup(){
  createCanvas(windowWidth,windowHeight);
  
  //crear sprite de Trex
  trex = createSprite(50,height -60,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trexcollided);
  trex.debug= false;
  trex.setCollider("circle",0,0,50)
  edges = createEdgeSprites();
  //crear sprite piso 
  piso= createSprite(width/2,height -30, width, 55);
  piso.addImage(groundImage);
  piso.x = piso.width /2;
  //
  piso_invisible = createSprite(width/2, height -20, width, 5);
  piso_invisible.visible = false;
  //agregar tamaño y posición al Trex
  trex.scale = 0.5;
  trex.x = 50;
 
  //crear gameover
  gameover = createSprite(300,100);
  gameover.addImage(gameoverimg);
  gameover.scale = 0.5;

  reinicio = createSprite(300, 130);
  reinicio.addImage(reinicioimg);
  reinicio.scale = 0.5;

  grupodenubes = new Group();
  grupodecactus = new Group();
}


function draw(){
  //establecer color de fondo.
  background("white");

  text ("Puntaje: " + puntos ,500,50);

  
  
 if (estadodejuego === INICIO){

  puntos=puntos+Math.round(getFrameRate()/60);
  trex.changeAnimation("running", trex_running);
  if(puntos>0 && puntos%100 === 0){
    sonidopuntaje.play();
  }
  gameover.visible = false;
  reinicio.visible = false;
  //hacer que el Trex salte al presionar la barra espaciadora
  if(touches.length>0 || keyDown("space")&& trex.y>= 140){
    trex.velocityY = -10;
    saltar.play();
    touches=[];
  }

  // aplicar gravedad
  trex.velocityY = trex.velocityY + 0.5;
  //hace que el piso sea infinito
  piso.velocityX=-(5+puntos/100);
  if(piso.x<0){
    piso.x = piso.width /2;
  }

  crearnubes();
  obstaculos();
  if(grupodecactus.isTouching(trex)){
    /*trex.velocityY=-10;
    saltar.play();*/
    estadodejuego = FIN;
    morir.play();

  }

 }else if (estadodejuego === FIN){

  piso.velocityX = 0;
  grupodecactus.setVelocityXEach(0); 
  grupodenubes.setVelocityXEach(0);
  grupodecactus.setLifetimeEach(-1);
  grupodenubes.setLifetimeEach(-1);
  trex.changeAnimation("collided", trexcollided);
  trex.velocityY = 0;
  gameover.visible = true;
  reinicio.visible = true;

  if(mousePressedOver(reinicio)){
    reiniciarjuego();
  }
 }

  //cargar la posición Y del Trex
  console.log(trex.y)

 
  
  
  
  /*if(keyDown("right")){
    trex.x = trex.x +2;
  }*/

  

  console.log (frameCount);

  //evitar que el Trex caiga
  trex.collide(piso_invisible);
  drawSprites();
}

function crearnubes(){
  if (frameCount%50 === 0){
  var nubes = createSprite (width +20, height -100, 30, 30);
  nubes.addImage(imagennube);
  nubes.velocityX = -5;
  nubes.y=Math.round(random (10,100));
  trex.depth= nubes.depth;
  trex.depth= trex.depth+1;
  nubes.lifetime = 135;
  grupodenubes.add(nubes);
  }
}

function obstaculos(){
  if(frameCount%60 === 0){
 var cactus = createSprite(width +20, height -55, 30, 30);
 cactus.velocityX = -(5+puntos/100);
 var numeroal= Math.round(random(1,6));
 switch (numeroal){
   case 1:cactus.addImage(cactus1);break;
   case 2:cactus.addImage(cactus2);break;
   case 3:cactus.addImage(cactus3);break;
   case 4:cactus.addImage(cactus4);break;
   case 5:cactus.addImage(cactus5);break;
   case 6:cactus.addImage(cactus6);break;
   default:break;
 }
 grupodecactus.add(cactus);
 cactus.scale = 0.6;
 cactus.lifetime = 135;
  }

}

function reiniciarjuego(){
  estadodejuego= INICIO;
  gameover.visible = false;
  reinicio.visible = false;
  grupodecactus.destroyEach();
  grupodenubes.destroyEach();
  puntos = 0;


}