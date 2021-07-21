float[] generateRandomNN_Multipliers(int amount)
{
    float[] randNNmultipliers = new float[amount];

    for(int i = 0; i < amount; i++)
    {
        randNNmultipliers[i] = random(1);
    }

    return randNNmultipliers;
}

float[] generateRandomNN_Biases(int amount)
{
    float[] randNNbiases = new float[amount];

    for(int i = 0; i < amount; i++)
    {
        randNNbiases[i] = random(1);
    }

    return randNNbiases;
}

NeuralNetwork generateRandomNeuralNetwork(int[] nNetConfig)
{
    int amountOfMultipliers = 0;
    int amountOfBiases = 0;

    //figure out how many multipliers are needed
    for(int l = 0; l < nNetConfig.length; l++)
    {
        if(l == 0)
        {
            //For the first layer, only 1 multiplier is needed per neuron
            amountOfMultipliers += nNetConfig[0];
        } else {
            //For all other layers, each neuron needs the previous layers worth of neurons,
            //so the entire layer needs (previousLayer)*(currentLayer) amount of multipliers
            int currentLayerMultipliers = nNetConfig[l-1] * nNetConfig[l];

            amountOfMultipliers += currentLayerMultipliers;
        }
    }
    
    //figure out how many biases are needed
    //amount of biases needed = amount of neurons in the neural net
    for(int l = 0; l < nNetConfig.length; l++)
    {
        amountOfBiases += nNetConfig[l];
    }

    //Now use the two randomizing functions above to generate some multipliers and biases
    float[] nnMultipliers = generateRandomNN_Multipliers(amountOfMultipliers);
    float[] nnBiases = generateRandomNN_Biases(amountOfBiases);

    NeuralNetwork randomNeuralNet = new NeuralNetwork(nNetConfig,nnMultipliers,nnBiases);

    return randomNeuralNet;
}