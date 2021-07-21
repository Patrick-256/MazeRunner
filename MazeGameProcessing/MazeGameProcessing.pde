//2021-07-07 Going to try to recreate my maze game in Processing
Wall[] daWalls = new Wall[2];
int[] gameBounds = {100,350,600,100};
Goal theGoal;
int moveCounter;
boolean gameWon = false;

Player player;

NeuralNetwork testNeuralNet;

AIcore aiTestbot;
AIpopulation testPop;

void setup()
{
    frameRate(2);

    size(900,700);
    background(100);
    daWalls[0] = new Wall(0,150,3,1);
    daWalls[1] = new Wall(50,300,4,1);

    theGoal = new Goal(100,0);
    moveCounter = 0;

    player = new Player(150,400,76,145,156);

    //test neural networks
    int[] nnConfig = { 8,4 };
    println("nnConfig: "+nnConfig);
    printArray(nnConfig);
    //test AI - give it the randomly generated neural net from above
    testNeuralNet = generateRandomNeuralNetwork(nnConfig);
    aiTestbot = new AIcore(testNeuralNet);
    testPop = new AIpopulation(10000,nnConfig);
    
}

void draw()
{
    background(100);

    //Draw static text
    textSize(20);
    text("Move # "+moveCounter,50,40);
    text("Position 0: "+player.checkPositionValid(player.xPos,player.yPos-50)+" "+calculateDistance(player.xPos,player.yPos-50,theGoal.x,theGoal.y)/50,425,70);
    text("Position 1: "+player.checkPositionValid(player.xPos+50,player.yPos)+" "+calculateDistance(player.xPos+50,player.yPos,theGoal.x,theGoal.y)/50,425,90);
    text("Position 2: "+player.checkPositionValid(player.xPos,player.yPos+50)+" "+calculateDistance(player.xPos,player.yPos+50,theGoal.x,theGoal.y)/50,425,110);
    text("Position 3: "+player.checkPositionValid(player.xPos-50,player.yPos)+" "+calculateDistance(player.xPos-50,player.yPos,theGoal.x,theGoal.y)/50,425,130);
    text("Game Won: "+gameWon,425,150);
    text("Goal location x: "+theGoal.x+" y: "+theGoal.y,425,170);
    text("Player location x: "+player.xPos+" y: "+player.yPos,425,190);
    text("AI location x: "+aiTestbot.aiCharacter.xPos+" y: "+aiTestbot.aiCharacter.yPos,425,210);
    text("Population remaining AIs: "+testPop.amountOfAliveAIs,425,230);


    //draw the boundaries
    fill(50);
    rect(50,50,350,600);
    fill(100);
    rect(100,100,250,500);

    if(gameWon == true)
    {
        fill(3,252,23);
        rect(50,50,350,600);
        fill(100);
        rect(100,100,250,500);
    }

    //draw the walls
    for(int i = 0; i < daWalls.length; i++)
    {
        daWalls[i].draw();
    }

    //draw the goal
    theGoal.draw();

    //draw the Players
    player.draw();
    
    //aiTestbot.draw();
    aiTestbot.makeMoveAI();
    testPop.moveAllAIs();

    gameWon = theGoal.checkIfCollided(player.xPos,player.yPos);

    if(player.checkPositionValid(player.xPos,player.yPos) == false)
    {
        player.teleport(150,400);
    }
    
    moveCounter++;
}

void keyPressed()
{
    //pause simulation
    if(key == 'p')
    {
        if(looping) noLoop();
        else        loop();
    }
    //Arrowkeys
    if (key == CODED)
    {
        if (keyCode == LEFT)
        { 
            player.move(3);
        }
        else if (keyCode == RIGHT)
        {
            player.move(1);
        }
        else if (keyCode == UP)
        {
            player.move(0);
        }
        else if (keyCode == DOWN)
        {
            player.move(2);
        }
    }
}

float calculateDistance(int x1, int y1, int x2, int y2)
{
    int xDist = x1 - x2;
    int yDist = y1 - y2;
    float distance = sqrt(xDist*xDist+yDist*yDist);
    return distance;
}