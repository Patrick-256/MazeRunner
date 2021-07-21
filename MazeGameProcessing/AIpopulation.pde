class AIpopulation
{
    AIcore[] aiPopulation;
    boolean entirePopulationIsDead;
    AIcore theBest;
    int amountOfAliveAIs;

    //constructor
    AIpopulation(int amountOfAIs,int[] nnConfig)
    {
        amountOfAliveAIs = amountOfAIs;
        aiPopulation = new AIcore[amountOfAIs];
        entirePopulationIsDead = false;
        //generate a bunch of random AIs for this population
        for(int i = 0; i < amountOfAIs; i++)
        {
            //firstly generate a random neuralnet 
            NeuralNetwork randNN = generateRandomNeuralNetwork(nnConfig);
            aiPopulation[i] = new AIcore(randNN);
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
            entirePopulationIsDead = true;
        }
    }
    //After simulating all of them, select the best one
    void SelectChampionOfPopulation()
    {
        //after simulating all of them, select the champion based on how close it got to the goal
        float closestGoalDistance = 99;
        int closestGoalDistanceAIindex = 0;

        for(int i = 0; i < aiPopulation.length; i++)
        {
            if(aiPopulation[i].distanceToGoalOnDeath < closestGoalDistance)
            {
                //we have a new champion
                closestGoalDistanceAIindex = i;
            }
        }
        theBest = aiPopulation[closestGoalDistanceAIindex];
    }
}