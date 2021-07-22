class AIcore
{
    NeuralNetwork brain;
    Player aiCharacter;
    boolean aiCoreIsAlive;
    float distanceToGoal;
    int currentMove;
    boolean aiHasWonTheGame;

    //constructor
    AIcore(NeuralNetwork nBrain)
    {
        brain = nBrain;
        //Figure what color to make the ai player based on the multipliers and biases of the neural net
        // -> well, ill hold off on that idea for now becasue there are only 256^3 unique colors and 
        //    there are about 100^50 different possible NN multiplier/bias configs, so a significant 
        //    amount of different neural nets would end up with the same color -_-
        aiCharacter = new Player(150,400,76,0,156);
        aiCoreIsAlive = true;
        aiHasWonTheGame = false;
    }

    //Make a move
    void makeMoveAI()
    {
        if(gameWon == true)
        {
            //do not move AI if game has already been won
            aiHasWonTheGame = true;
        } else {
            if(aiCoreIsAlive == true)
            {
                aiCharacter.draw();
                currentMove++;
                //STEP 1: Observe the AI's current position to generate the neuralnet input array
                float[] nnInputs = new float[8];

                //Input 1 of 8: position 0 open or not
                boolean position0open = aiCharacter.checkPositionValid(aiCharacter.xPos,aiCharacter.yPos-50);
                if(position0open == true) { nnInputs[0] = 1; }
                else { nnInputs[0] = 0; }

                //Input 2 of 8: distance from position 0 to Goal
                nnInputs[1] = calculateDistance(aiCharacter.xPos,aiCharacter.yPos-50,theGoal.x,theGoal.y)/50;

                //Input 3 of 8: position 1 open or not
                boolean position1open = aiCharacter.checkPositionValid(aiCharacter.xPos+50,aiCharacter.yPos);
                if(position1open == true) { nnInputs[2] = 1; }
                else { nnInputs[2] = 0; }

                //Input 4 of 8: distance from position 0 to Goal
                nnInputs[3] = calculateDistance(aiCharacter.xPos+50,aiCharacter.yPos,theGoal.x,theGoal.y)/50;

                //Input 5 of 8: position 2 open or not
                boolean position2open = aiCharacter.checkPositionValid(aiCharacter.xPos,aiCharacter.yPos+50);
                if(position2open == true) { nnInputs[4] = 1; }
                else { nnInputs[4] = 0; }

                //Input 6 of 8: distance from position 0 to Goal
                nnInputs[5] = calculateDistance(aiCharacter.xPos,aiCharacter.yPos+50,theGoal.x,theGoal.y)/50;

                //Input 7 of 8: position 3 open or not
                boolean position3open = aiCharacter.checkPositionValid(aiCharacter.xPos-50,aiCharacter.yPos);
                if(position3open == true) { nnInputs[6] = 1; }
                else { nnInputs[6] = 0; }

                //Input 8 of 8: distance from position 0 to Goal
                nnInputs[7] = calculateDistance(aiCharacter.xPos-50,aiCharacter.yPos,theGoal.x,theGoal.y)/50;

                //STEP 2: simulate the neuralnet with the provided inputs
                brain.runNeuralNetwork(nnInputs);

                //STEP 3: choose the strongest result from the neuralnet
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
                //STEP 4: move to the chosen position
                aiCharacter.move(highestChoiceIndex);

                //STEP 5: check if its new position is valid (not hitting a wall)
                boolean newPositionValid = checkSelfPositionValid();
                if(newPositionValid == false) {
                    killAI();
                }  else {
                    //its position is valid, so update its currentDistance from goal
                    distanceToGoal = calculateDistance(aiCharacter.xPos,aiCharacter.yPos,theGoal.x,theGoal.y);
                }    
            } else {
                //AIcore is dead. do not move

            }
        }
    }
    void draw()
    {
        //only draw live AIs
        if(aiCoreIsAlive == true) {
            aiCharacter.draw();
        }
    }
    boolean checkSelfPositionValid()
    {
        boolean positionValid = aiCharacter.checkPositionValid(aiCharacter.xPos,aiCharacter.yPos);
        return positionValid;
    }
    void killAI()
    {
        aiCoreIsAlive = false;
        //amountOfMovesMadeBeforeDeath = moveCounter;
        //aiCharacter.teleport(150,400);
    }
    void printAIstats()
    {
        //print: AI location, distance from goal, and current move count
        float[] aiInfo = new float[4];
        aiInfo[0] = aiCharacter.xPos;
        aiInfo[1] = aiCharacter.yPos;
        aiInfo[2] = distanceToGoal/50;
        aiInfo[3] = currentMove;

        println("AI stats:");
        printArray(aiInfo);
        println("AI brain:");
        brain.print();
    }
}