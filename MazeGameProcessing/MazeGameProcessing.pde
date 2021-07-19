//2021-07-07 Going to try to recreate my maze game in Processing
Wall[] daWalls = new Wall[2];
int[] gameBounds = {100,350,600,100};
Goal theGoal;
int moveCounter;
boolean gameWon = false;

Player player;
//Player ai;

//test arraylists
ArrayList<ArrayList> testInts;
ArrayList<String> actStrings;
ArrayList<String> actStrings2;

//test neural networks
ArrayList<Integer> nnConfig;
ArrayList<Float> nnMultipliers;
ArrayList<Float> nnBiases;
NeuralNetwork testNeuralNet;

int empty;


void setup()
{
    //test arraylists
    actStrings = new ArrayList <String>();
    actStrings2 = new ArrayList <String>();
    actStrings.add("actStr0");
    actStrings.add("actStr1");
    actStrings2.add("2actStr0");
    actStrings2.add("2actStr1");
    testInts = new ArrayList <ArrayList>();
    testInts.add(actStrings);
    testInts.add(actStrings2);
    println(testInts);
    println(testInts.get(0).get(1));




    //test neural networks
    int[] nnConfig = { 8,4 };
    println("nnConfig: "+nnConfig);
    printArray(nnConfig);

    float[] nnMultipliers = generateRandomNN_Multipliers(40); //new float[40];
    // for(int m = 0; m < 40; m++) {
    //     nnMultipliers[m] = 0.5;
    // }
    println("nnMultipliers: -----------------------------------");
    printArray(nnMultipliers);

    float[] nnBiases = generateRandomNN_Biases(12); //new float[12];
    // for(int b = 0; b < 12; b++) {
    //     nnBiases[b] = 0.1;
    // }
    println("nnBiases: ----------------");
    printArray(nnBiases);


    testNeuralNet = new NeuralNetwork(nnConfig,nnMultipliers,nnBiases);
    float[] inputs = { 1, 10, 1, 10.5, 1, 11, 1, 9.6};
    printArray(inputs);
    testNeuralNet.runNeuralNetwork(inputs);

    // //ArrayList version
    // //test neural networks
    // nnConfig = new ArrayList <Integer>();
    // nnConfig.add(8);
    // nnConfig.add(4);
    // println("nnConfig: "+nnConfig);

    // nnMultipliers = new ArrayList <Float>();
    // for(int m = 0; m < 40; m++) {
    //     nnMultipliers.add(0.5);
    // }
    // println("nnMultipliers: "+nnMultipliers);

    // nnBiases = new ArrayList <Float>();
    // for(int b = 0; b < 12; b++) {
    //     nnBiases.add(0.1);
    // }
    // println("nnBiases: "+nnBiases);

    // testNeuralNet = new NeuralNetwork(nnConfig,nnMultipliers,nnBiases);
    // println("empty: "+empty);
    // float e = exp(1);
    // float squish = 1 /(1 + exp(8.5));
    // println("squishy = "+squish);

    // float x = 5.936;
    // int cas = (int) x;
    // println("cast = "+cas);







    size(900,700);
    background(100);
    daWalls[0] = new Wall(0,150,3,1);
    daWalls[1] = new Wall(50,300,4,1);

    theGoal = new Goal(100,0);
    moveCounter = 0;

    player = new Player(150,400,76,145,156);
    // ai = new Player(150,400,76,0,156);
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

    //draw the Player
    player.draw();
    gameWon = theGoal.checkIfCollided(player.xPos,player.yPos);

    if(player.checkPositionValid(player.xPos,player.yPos) == false)
    {
        player.teleport(150,400);
    }

    // //draw the AI
    // ai.draw();
    // if(ai.checkPositionValid(ai.xPos,player.yPos) == false)
    // {
    //     ai.teleport(150,400);
    // }
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