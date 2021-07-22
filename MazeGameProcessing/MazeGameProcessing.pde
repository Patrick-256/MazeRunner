//2021-07-07 Going to try to recreate my maze game in Processing
Wall[] daWalls = new Wall[2];
Wall[] daOnlyWalls = new Wall[2];
int[] gameBounds = {100,350,600,100};
Goal theGoal;
int currentTick;

boolean gameWon = false;

//Player player;
AIcore aiCore;
boolean aiCoreTime = false;

NeuralNetwork testNeuralNet;
NeuralNetwork mutNeuralNet;

AIpopulation testPop;
int[] nnConfig;

void setup()
{
    frameRate(10);
    currentTick = 0;
    //set up the game
    size(900,700);
    background(100);
    daOnlyWalls[0] = new Wall(0,150,3,1);
    daOnlyWalls[1] = new Wall(50,300,4,1);
    theGoal = new Goal(100,0);
    //player = new Player(150,400,76,145,156);


    //test neural networks
    int[] nnConfig = { 8,4 };
    println("nnConfig: "+nnConfig);
    printArray(nnConfig);
    //test AI - give it the randomly generated neural net from above
    testNeuralNet = generateRandomNeuralNetwork(nnConfig);
    testNeuralNet.print();
    //test mutate NN
    mutNeuralNet = mutateNeuralNetwork(testNeuralNet,0.1);
    mutNeuralNet.print();

    //aiTestbot = new AIcore(testNeuralNet);
    testPop = new AIpopulation(100,nnConfig,0,null);
}

void draw()
{
    background(100);

    //Draw static text
    textSize(20);
    text("CurrentTick # "+currentTick,50,40);
    text("Population Move # "+testPop.moveCounter,250,40);
    //text("Position 0: "+player.checkPositionValid(player.xPos,player.yPos-50)+" "+calculateDistance(player.xPos,player.yPos-50,theGoal.x,theGoal.y)/50,425,70);
    //text("Position 1: "+player.checkPositionValid(player.xPos+50,player.yPos)+" "+calculateDistance(player.xPos+50,player.yPos,theGoal.x,theGoal.y)/50,425,90);
    //text("Position 2: "+player.checkPositionValid(player.xPos,player.yPos+50)+" "+calculateDistance(player.xPos,player.yPos+50,theGoal.x,theGoal.y)/50,425,110);
    //text("Position 3: "+player.checkPositionValid(player.xPos-50,player.yPos)+" "+calculateDistance(player.xPos-50,player.yPos,theGoal.x,theGoal.y)/50,425,130);
    text("Game Won: "+gameWon,425,150);
    text("Goal location x: "+theGoal.x+" y: "+theGoal.y,425,170);
    //text("Player location x: "+player.xPos+" y: "+player.yPos,425,190);
    //text("AI location x: "+aiTestbot.aiCharacter.xPos+" y: "+aiTestbot.aiCharacter.yPos,425,210);
    text("Population remaining AIs: "+testPop.amountOfAliveAIs,425,230);
    text("AI generation: "+testPop.generation,425,250);
    if(testPop.generation > 0) {
        text("Closest Dist. To Goal: "+testPop.theBest.distanceToGoal/50,425,270);
        text("most moves lasted: "+testPop.theBest.currentMove,425,290);
    }

    //loop through all the AIs in the population to find the one closest to the goal. make it red
    float closestDistance = 2000;
    int closestIndex = 0;
    for(int i = testPop.popAmountOfAis-1; i >= 0; i--)
    {
        if(testPop.aiPopulation[i].distanceToGoal < closestDistance)
        {
            //we found a new (current) champion
            closestDistance = testPop.aiPopulation[i].distanceToGoal;
            closestIndex = i;
        }
    }
    //now make the current best red
    testPop.aiPopulation[closestIndex].aiCharacter.pcRED = 200;
    testPop.aiPopulation[closestIndex].aiCharacter.pcBLU = 0;
    testPop.aiPopulation[closestIndex].aiCharacter.pcGRE = 0;
    text("closest distance: "+closestDistance/50,425,310);
    //testPop.printPopulation();

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

    //if its the start of a new generation, make sure daWalls on have the two starter walls
    daWalls = daOnlyWalls;
    //draw the wall of evolution - increase every 20 rounds
    if(testPop.moveCounter > 20) { Wall aNewWall = new Wall(0,450,5,1); daWalls = (Wall[]) append(daWalls,aNewWall); }
    if(testPop.moveCounter > 40) { Wall aNewWall = new Wall(0,400,5,1); daWalls = (Wall[]) append(daWalls,aNewWall); }
    if(testPop.moveCounter > 60) { Wall aNewWall = new Wall(0,350,5,1); daWalls = (Wall[]) append(daWalls,aNewWall); }
    if(testPop.moveCounter > 80) { Wall aNewWall = new Wall(0,300,5,1); daWalls = (Wall[]) append(daWalls,aNewWall); }
    if(testPop.moveCounter > 100) { Wall aNewWall = new Wall(0,250,5,1); daWalls = (Wall[]) append(daWalls,aNewWall); }
    if(testPop.moveCounter > 120) { Wall aNewWall = new Wall(0,200,5,1); daWalls = (Wall[]) append(daWalls,aNewWall); }
    if(testPop.moveCounter > 140) { Wall aNewWall = new Wall(0,150,5,1); daWalls = (Wall[]) append(daWalls,aNewWall); }

    //draw the walls
    for(int i = 0; i < daWalls.length; i++)
    {
        daWalls[i].draw();
    }
    
    //draw the goal
    theGoal.draw();

    //draw the Players
    //player.draw();
    
    if(testPop.entirePopulationIsDead == true)
    {
        //generate the next generation
        testPop.RepopulateNextGeneration();

        // if(aiCoreTime == false)
        // {
        //     //spawn in that generations best
        //     testPop.moveCounter = 0;
        //     aiCore = new AIcore(testPop.theBest.brain);
        //     println("Spawning the generation best!");
        //     aiCore.printAIstats();
        //     println("neuralNet details:");
        //     aiCore.brain.print();
        //     aiCoreTime = true;
        // }
        // aiCore.makeMoveAI();
    }

    

    testPop.moveAllAIs();

    //gameWon = theGoal.checkIfCollided(player.xPos,player.yPos);
    currentTick++;
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
            //player.move(3);
        }
        else if (keyCode == RIGHT)
        {
            //player.move(1);
        }
        else if (keyCode == UP)
        {
            //player.move(0);
        }
        else if (keyCode == DOWN)
        {
            //player.move(2);
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