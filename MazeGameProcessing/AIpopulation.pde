class AIpopulation
{
    AIcore[] aiPopulation;
    int popAmountOfAis;
    boolean entirePopulationIsDead;
    AIcore theBest;
    int amountOfAliveAIs;
    int generation;
    int moveCounter;

    //constructor
    AIpopulation(int amountOfAIs,int[] nnConfig,float seedMethod, NeuralNetwork modelNN)
    {
        popAmountOfAis = amountOfAIs;
        amountOfAliveAIs = amountOfAIs;
        aiPopulation = new AIcore[amountOfAIs];
        entirePopulationIsDead = false;
        if(seedMethod == 0)
        {
            //generate a bunch of random AIs for this population
            for(int i = 0; i < amountOfAIs; i++)
            {
                //firstly generate a random neuralnet 
                NeuralNetwork randNN = generateRandomNeuralNetwork(nnConfig);
                aiPopulation[i] = new AIcore(randNN);
            }
            generation = 0;
            moveCounter = 0;
        } else {
            //nothing for now
        }
    }

    //Simulate all AIs in this population
    void moveAllAIs()
    {
        int amountOfAliveAIPlayers = 0;
        for(int i = 0; i < aiPopulation.length; i++)
        {
            aiPopulation[i].makeMoveAI();
            if(aiPopulation[i].aiCoreIsAlive == true) {
                amountOfAliveAIPlayers++;
            }
        }
        amountOfAliveAIs = amountOfAliveAIPlayers;
        //Also check if everyone has died
        if(amountOfAliveAIs == 0) {
            SelectChampionOfPopulation();
            entirePopulationIsDead = true;
        }
        moveCounter++;
    }

    //After simulating all of them, select the best one
    void SelectChampionOfPopulation()
    {
        //after simulating all of them, select the champion based on how close it got to the goal
        float closestGoalDistance = 9999;
        int closestGoalDistanceAIindex = 0;
        
        for(int i = 0; i < aiPopulation.length; i++)
        {
            if(aiPopulation[i].distanceToGoal < closestGoalDistance)
            {
                //we have a new champion
                closestGoalDistanceAIindex = i;
                closestGoalDistance = aiPopulation[i].distanceToGoal;
            }
        }
        //or, select champion based on most rounds survived (to be used with the expanding wall of evolution)
        int longestMovesLasted = 0;
        int longestMovesIndex = 0;
        for(int i = 0; i < aiPopulation.length; i++)
        {
            if(aiPopulation[i].currentMove > longestMovesLasted)
            {
                //we have a new champion
                longestMovesIndex = i;
                longestMovesLasted = aiPopulation[i].currentMove;
            }
        }

        theBest = aiPopulation[closestGoalDistanceAIindex];
    }
    //repopulate with mutations of previous best
    void RepopulateNextGeneration()
    {
        println("Generation "+generation+" complete! best AI:");
        theBest.printAIstats();

        AIcore[] theNextGeneration = new AIcore[popAmountOfAis];

        generation++;
        entirePopulationIsDead = false;
        amountOfAliveAIs = popAmountOfAis;
        moveCounter = 0;


        //Calculate max mutation step size
        float stepSize = 0.01;
        // if(generation > 0) {
        //    stepSize = stepSize / generation;

        //    if(stepSize < 0.01) {
        //        stepSize = 0.01;
        //    }
        // }

        //generate a bunch of AIs that are similar to the provided model neural network
        for(int i = 0; i < popAmountOfAis-1; i++)
        {
            theNextGeneration[i] = new AIcore(theBest.brain);//new AIcore(mutateNeuralNetwork(theBest.brain,stepSize));
        }

        theNextGeneration[popAmountOfAis-1] = new AIcore(theBest.brain); //the last one will be the previous Generations best
        //Also make the last gen champion green
        theNextGeneration[popAmountOfAis-1].aiCharacter.pcRED = 0;
        theNextGeneration[popAmountOfAis-1].aiCharacter.pcGRE = 200;
        theNextGeneration[popAmountOfAis-1].aiCharacter.pcBLU = 0;
        
        println("TESTING placement of BestAI in new generation:");
        theNextGeneration[popAmountOfAis-1].printAIstats();

        aiPopulation = theNextGeneration;
    }
    void printPopulation()
    {
        println("Population Total AIs: "+popAmountOfAis);
        println("Amount of AIs still alive: "+amountOfAliveAIs);
        println("current move: "+moveCounter);
        for(int i = 0; i < aiPopulation.length; i++)
        {
            aiPopulation[i].printAIstats();
        }
    }
}