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
Goal theGoal;

Player player;


public void setup()
{
  
  background(100);
  daWalls[0] = new Wall(0,150,3,1);
  daWalls[1] = new Wall(50,300,4,1);

  theGoal = new Goal(100,0);

  player = new Player(150,400);
}

public void draw()
{
  background(100);

  //draw the walls
  for(int i = 0; i < daWalls.length; i++)
  {
    daWalls[i].draw();
  }

  theGoal.draw();

  player.draw();
  if(player.checkPositionValid() == false)
  {
      player.teleport(150,400);
  }
}

public void keyPressed()
{
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

class Player
{
    int xPos;
    int yPos;

    Player(int initX, int initY) {
        xPos = initX;
        yPos = initY;
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
    }

    public boolean checkPositionValid() {
        boolean positionValid = true;
        //check bounds
        if(xPos < 0 || xPos > 200 || yPos < 0 || yPos > 450)
        {
            positionValid = false;
        }

        //check walls
        for(int i = 0; i < daWalls.length; i++)
        {
            //calculate pixel boundaries of the wall
            int wallTopEdge = daWalls[i].y;
            int wallLeftEdge = daWalls[i].x;
            int wallBottomEdge = daWalls[i].y + daWalls[i].yUnits*50;
            int wallRightEdge = daWalls[i].x + daWalls[i].xUnits*50;
            
            if(yPos >= wallTopEdge && yPos < wallBottomEdge && xPos >= wallLeftEdge && xPos < wallRightEdge)
            {
                positionValid = false;
            }
        }
        return positionValid;
    }

    public void teleport(int destinationX, int destinationY)
    {
        xPos = destinationX;
        yPos = destinationY;
    }

    public void draw() {
        fill(76, 145, 156);
        rect(xPos,yPos,50,50);
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
        rect(x,y,50*xUnits,50*yUnits);
    }
}

class Goal
{
    int x;
    int y;

    Goal(int xPos, int yPos)
    {
        x = xPos;
        y = yPos;
    }

    public void draw() {
        fill(242, 188, 61);
        rect(x,y,50,50);
    }
}
  public void settings() {  size(250,500); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "MazeGameProcessing" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
