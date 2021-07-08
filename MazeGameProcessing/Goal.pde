class Goal
{
    int x;
    int y;

    Goal(int xPos, int yPos)
    {
        x = xPos;
        y = yPos;
    }

    void draw() {
        fill(242, 188, 61);
        rect(x + gameBounds[3],y + gameBounds[0],50,50);
    }
}