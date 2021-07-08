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
    void move(int direction) {
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

    boolean checkPositionValid(int checkX, int checkY) {
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

    void teleport(int destinationX, int destinationY)
    {
        xPos = gameBounds[3] + destinationX;
        yPos = gameBounds[0] + destinationY;
        moveCounter = 0;
    }

    void draw() {
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