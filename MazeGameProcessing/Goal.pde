class Goal
{
    int x;
    int y;

    Goal(int xPos, int yPos)
    {
        x = xPos+gameBounds[3];
        y = yPos+gameBounds[0];
    }

    void draw() {
        fill(242, 188, 61);
        rect(x,y,50,50);
    }

    boolean checkIfCollided(int playerXpos,int playerYpos)
    {
        if(playerXpos == x && playerYpos == y)
        {
            return true;
        } else {
            return false;
        }
    }
}