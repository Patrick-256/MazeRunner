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