//2021-07-07 Going to try to recreate my maze game in Processing
Wall[] daWalls = new Wall[2];
int[] gameBounds = {100,350,600,100};
Goal theGoal;
int moveCounter;

Player player;
Player ai;


void setup()
{
    size(900,700);
    background(100);
    daWalls[0] = new Wall(0,150,3,1);
    daWalls[1] = new Wall(50,300,4,1);

    theGoal = new Goal(100,0);
    moveCounter = 0;

    player = new Player(150,400,76,145,156);
    ai = new Player(150,400,76,0,156);
}

void draw()
{
    background(100);

    //Draw static text
    textSize(20);
    text("Move # "+moveCounter,50,40);
    text("Position 0: "+player.checkPositionValid(player.xPos,player.yPos-50)+" "+calculateDistance(player.xPos,player.yPos-50,theGoal.x+gameBounds[3],theGoal.y+gameBounds[0])/50,425,70);
    text("Position 1: "+player.checkPositionValid(player.xPos+50,player.yPos)+" "+calculateDistance(player.xPos+50,player.yPos,theGoal.x+gameBounds[3],theGoal.y+gameBounds[0])/50,425,90);
    text("Position 2: "+player.checkPositionValid(player.xPos,player.yPos+50)+" "+calculateDistance(player.xPos,player.yPos+50,theGoal.x+gameBounds[3],theGoal.y+gameBounds[0])/50,425,110);
    text("Position 3: "+player.checkPositionValid(player.xPos-50,player.yPos)+" "+calculateDistance(player.xPos-50,player.yPos,theGoal.x+gameBounds[3],theGoal.y+gameBounds[0])/50,425,130);

    //draw the boundaries
    fill(50);
    rect(50,50,350,600);
    fill(100);
    rect(100,100,250,500);

    //draw the walls
    for(int i = 0; i < daWalls.length; i++)
    {
        daWalls[i].draw();
    }

    theGoal.draw();

    //Players
    player.draw();
    if(player.checkPositionValid(player.xPos,player.yPos) == false)
    {
        player.teleport(150,400);
    }

    ai.draw();
    if(ai.checkPositionValid(ai.xPos,player.yPos) == false)
    {
        ai.teleport(150,400);
    }
}

void keyPressed()
{
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