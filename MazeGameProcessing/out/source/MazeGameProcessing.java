import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class MazeGameProcessing extends PApplet {

//2021-07-07 Going to try to recreate my maze game in Processing
Wall[] daWalls = new Wall[2];
int[] gameBounds = {100,350,600,100};
Goal theGoal;
int moveCounter;
boolean gameWon = false;

Player player;
Player ai;


public void setup()
{
    
    background(100);
    daWalls[0] = new Wall(0,150,3,1);
    daWalls[1] = new Wall(50,300,4,1);

    theGoal = new Goal(100,0);
    moveCounter = 0;

    player = new Player(150,400,76,145,156);
    ai = new Player(150,400,76,0,156);
}

public void draw()
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

    //draw the AI
    ai.draw();
    if(ai.checkPositionValid(ai.xPos,player.yPos) == false)
    {
        ai.teleport(150,400);
    }
}

public void keyPressed()
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

public float calculateDistance(int x1, int y1, int x2, int y2)
{
    int xDist = x1 - x2;
    int yDist = y1 - y2;
    float distance = sqrt(xDist*xDist+yDist*yDist);
    return distance;
}
class Goal
{
    int x;
    int y;

    Goal(int xPos, int yPos)
    {
        x = xPos+gameBounds[3];
        y = yPos+gameBounds[0];
    }

    public void draw() {
        fill(242, 188, 61);
        rect(x,y,50,50);
    }

    public boolean checkIfCollided(int playerXpos,int playerYpos)
    {
        if(playerXpos == x && playerYpos == y)
        {
            return true;
        } else {
            return false;
        }
    }
}
class Player
{
    int xPos;
    int yPos;

    int pcRED;
    int pcBLU;
    int pcGRE;

    Player(int initX, int initY, int pcR, int pcB, int pcG) {
        xPos = initX + gameBounds[3];
        yPos = initY + gameBounds[0];
        pcRED = pcR;
        pcBLU = pcB;
        pcGRE = pcG;
    }
    public void move(int direction) {
        if(direction == 0) {
            //move up
            yPos -= 50;
        } 
        else if(direction == 1) {
            //move right
            xPos += 50;
        }
        else if(direction == 2) {
            //move down
            yPos += 50;
        }
        else if(direction == 3) {
            //move left
            xPos -= 50;
        }  
        moveCounter++;
    }

    public boolean checkPositionValid(int checkX, int checkY) {
        boolean positionValid = true;
        //check bounds
        if(checkX < gameBounds[3] || checkX >= gameBounds[1] || checkY < gameBounds[0] || checkY >= gameBounds[2])
        {
            positionValid = false;
        }

        //check walls
        for(int i = 0; i < daWalls.length; i++)
        {
            //calculate pixel boundaries of the wall
            int wallTopEdge = daWalls[i].y + gameBounds[0];
            int wallLeftEdge = daWalls[i].x + gameBounds[3];
            int wallBottomEdge = daWalls[i].y + daWalls[i].yUnits*50 + gameBounds[0];
            int wallRightEdge = daWalls[i].x + daWalls[i].xUnits*50 + gameBounds[3];
            
            if(checkY >= wallTopEdge && checkY < wallBottomEdge && checkX >= wallLeftEdge && checkX < wallRightEdge)
            {
                positionValid = false;
            }
        }
        return positionValid;
    }

    public void teleport(int destinationX, int destinationY)
    {
        xPos = gameBounds[3] + destinationX;
        yPos = gameBounds[0] + destinationY;
        moveCounter = 0;
    }

    public void draw() {
        //player body (just a blue square)
        //fill(76, 145, 156);
        fill(pcRED,pcBLU,pcGRE);
        rect(xPos,yPos,50,50);
        //Player face details
        fill(0);
        ellipse(xPos+15,yPos+23,8,8);
        ellipse(xPos+35,yPos+23,8,7);
        line(xPos+15,yPos+40,xPos+35,yPos+40);
        line(xPos+35,yPos+40,xPos+38,yPos+37);    
    }
}
class Wall
{
    int x;
    int y;
    int xUnits;
    int yUnits;

    Wall(int posXstart, int posYstart,int unitWidth,int unitHeight) {
        x = posXstart;
        y = posYstart;
        xUnits = unitWidth;
        yUnits = unitHeight;
    }

    public void draw() {
        fill(140, 107, 83);
        rect(x + gameBounds[3],y + gameBounds[0],50*xUnits,50*yUnits);
    }
}
  public void settings() {  size(900,700); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "MazeGameProcessing" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
