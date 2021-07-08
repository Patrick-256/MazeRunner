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

    void draw() {
        fill(140, 107, 83);
        rect(x + gameBounds[3],y + gameBounds[0],50*xUnits,50*yUnits);
    }
}