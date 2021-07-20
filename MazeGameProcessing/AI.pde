class AIcore
{
    NeuralNetwork brain;
    Player aiCharacter;
    boolean aiCoreIsAlive;

    //constructor
    AIcore(NeuralNetwork nBrain)
    {
        brain = nBrain;
        aiCharacter = new Player(150,400,76,0,156);
        aiCoreIsAlive = true;
    }

    //Make a move
    void makeMoveAI()
    {
        if(aiCoreIsAlive == true)
        {
            //Observe the AI's current position to generate the neuralnet input array
            float[] nnInputs = new float[8];

            //Input 1 of 8: position 0 open or not
            boolean position0open = aiCharacter.checkPositionValid(aiCharacter.xPos,aiCharacter.yPos-50);
            if(position0open == true) { nnInputs[0] = 1; }
            else { nnInputs[0] = 0; }

            //Input 2 of 8: distance from position 0 to Goal
            nnInputs[1] = calculateDistance(player.xPos,player.yPos-50,theGoal.x,theGoal.y)/50;

            //Input 3 of 8: position 1 open or not
            boolean position1open = aiCharacter.checkPositionValid(aiCharacter.xPos+50,aiCharacter.yPos);
            if(position1open == true) { nnInputs[2] = 1; }
            else { nnInputs[2] = 0; }

            //Input 4 of 8: distance from position 0 to Goal
            nnInputs[3] = calculateDistance(player.xPos+50,player.yPos,theGoal.x,theGoal.y)/50;

            //Input 5 of 8: position 2 open or not
            boolean position2open = aiCharacter.checkPositionValid(aiCharacter.xPos,aiCharacter.yPos+50);
            if(position2open == true) { nnInputs[4] = 1; }
            else { nnInputs[4] = 0; }

            //Input 6 of 8: distance from position 0 to Goal
            nnInputs[5] = calculateDistance(player.xPos,player.yPos+50,theGoal.x,theGoal.y)/50;

            //Input 7 of 8: position 3 open or not
            boolean position3open = aiCharacter.checkPositionValid(aiCharacter.xPos-50,aiCharacter.yPos);
            if(position3open == true) { nnInputs[6] = 1; }
            else { nnInputs[6] = 0; }

            //Input 8 of 8: distance from position 0 to Goal
            nnInputs[7] = calculateDistance(player.xPos-50,player.yPos,theGoal.x,theGoal.y)/50;

            //simulate the neuralnet with the provided inputs
            brain.runNeuralNetwork(nnInputs);

            //choose the strongest result from the neuralnet
            float highestChoice = 0;
            int highestChoiceIndex = 0;

            for(int i = 0; i < brain.outputArray.length; i++)
            {
                if(brain.outputArray[i] > highestChoice)
                {
                    highestChoice = brain.outputArray[i];
                    highestChoiceIndex = i;
                }
            }
            //move to the chosen position
            aiCharacter.move(highestChoiceIndex);

            
        } else {
            //AIcore is dead. do not move


        }
    }
    void draw()
    {
        aiCharacter.draw();
    }
    boolean checkSelfPositionValid()
    {
        boolean positionValid = aiCharacter.checkPositionValid(aiCharacter.xPos,aiCharacter.yPos);
        return positionValid;
    }
    void killAI()
    {
        aiCoreIsAlive = false;
        aiCharacter.teleport(150,400);
    }
}