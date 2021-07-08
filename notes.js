
//Right before trying to add "multifacotor evolution"

function trainNeuralNetwork(neuralNetStructure,ArrayOfinputArrays,ArrayOfdesiredOutputArrays)
{
    //generate 1000 "random" neural networks and simulate them
    //Step 1: count up all the multipliers that need to be adjusted
    var TotalNetworkMultipliers = 0;
    var TotalNetworkNeurons = 0;
    for(let l = 0; l < neuralNetStructure.length; l++)
    {
        for(let n = 0; n < neuralNetStructure[l]; n++)
        {
            if(l == 0) {
                TotalNetworkMultipliers++
            } else {
                TotalNetworkMultipliers += (neuralNetStructure[l-1])
            }
            TotalNetworkNeurons++;
        }
    }
   
    var startTime = Date.now();
    //Now that we know how many multipliers there are, total possible configurations = 10^(#decPointsPrecison * #multipliers)
    console.log(`=================================================================`)
    console.log(`Training Neural Network: [${neuralNetStructure}] startTime: ${startTime}`)
    console.log(`-----------------------------------------------------------------`)
    console.log(`Network  Inputs: ${JSON.stringify(ArrayOfinputArrays)}`)
    console.log(`Desired Outputs: ${JSON.stringify(ArrayOfdesiredOutputArrays)}`)
    console.log(`-----------------------------------------------------------------`)
    console.log(`Total Neural Network Neurons: ${TotalNetworkNeurons}`)
    console.log(`Total Neural Network Multipliers: ${TotalNetworkMultipliers}`)
    console.log("")

    //prepare crummyness array
    var maxCrummynessArray = [];
    for(let i = 0; i < ArrayOfdesiredOutputArrays.length; i++)
    {
        maxCrummynessArray.push(16);
    }
    //Generate and run the first batch of 1000 neural networks and save their results in an array
    var Gen0Start = {networkMultipliers:generateRandomSetOfNeuralNetMultipliers(TotalNetworkMultipliers),networkBiases:generateRandomSetOfNeuralNetBiases(TotalNetworkNeurons),crummynessLevel:maxCrummynessArray};

    Gen1BestNeuralNetResults = simulateNeuralNetGeneration(Gen0Start,neuralNetStructure,ArrayOfinputArrays,ArrayOfdesiredOutputArrays)
      

    console.log(`Generation 0: Simulation Complete! Best NeuralNets:`)
    console.log(JSON.stringify(Gen1BestNeuralNetResults))

    //now run the neural network to see its outputs
    for(let i = 0; i < ArrayOfinputArrays.length; i++)
    {
        var BestNeuralNetwork = makeNewNeuralNetwork(neuralNetStructure,Gen1BestNeuralNetResults.networkMultipliers,Gen1BestNeuralNetResults.networkBiases)
        
        var BestNeuralNetworkResults = RunNeuralNetwork(BestNeuralNetwork,ArrayOfinputArrays[i])
        console.log(`Network input: [${ArrayOfinputArrays[i]}] -> Network output: [${BestNeuralNetworkResults}]`)
    }


    //Evolve neural network
    var AmountOfGenerations = 6;

    var pastGenerationBest = Gen1BestNeuralNetResults;

    for(let g = 0; g < AmountOfGenerations; g++)
    {
        console.log(`Simulating generation ${g}...`)
        //Now slightly adjust each value
        var gen2best = simulateNeuralNetGeneration(pastGenerationBest,neuralNetStructure,ArrayOfinputArrays,ArrayOfdesiredOutputArrays)
        console.log(`Generation ${g}: Simulation Complete! Best NeuralNets:`)
        console.log(gen2best)

        //now run the neural network to see its outputs
        for(let i = 0; i < ArrayOfinputArrays.length; i++)
        {
            var BestNeuralNetwork = makeNewNeuralNetwork(neuralNetStructure,gen2best.networkMultipliers,gen2best.networkBiases)
            
            var BestNeuralNetworkResults = RunNeuralNetwork(BestNeuralNetwork,ArrayOfinputArrays[i])
            console.log(`Network input: [${ArrayOfinputArrays[i]}] -> Network output: [${BestNeuralNetworkResults}]`)
        }
        pastGenerationBest.networkMultipliers = gen2best.networkMultipliers;
        pastGenerationBest.networkBiases = gen2best.networkBiases;
        pastGenerationBest.crummynessLevel = gen2best.crummynessLevel;
    }

    var TimeElapsed = Date.now() - startTime;
    console.log("======================================================")
    console.log(`Time elapsed: ${TimeElapsed} ms`)
}
function simulateNeuralNetGeneration(theBest,neuralNetStructure,ArrayOfinputArrays,ArrayOfdesiredOutputArrays)
{
    for(let n = 0; n < 1000000; n++)
    {
        var TestSubjectCrummyness = [] //lower is better

        //Prepare to create modified verson of the best
        var copyOfTheBestMultipliers = []
        for(let i = 0; i < theBest.networkMultipliers.length; i++)
        {
            copyOfTheBestMultipliers.push(theBest.networkMultipliers[i]);
        }
        var copyOfTheBestBiases = [];
        for(let i = 0; i < theBest.networkBiases.length; i++)
        {
            copyOfTheBestBiases.push(theBest.networkBiases[i]);
        }

        var modifiedMultiplierSet = SlightlyAdjustRandomSetOfNeuralNetMultipliers(copyOfTheBestMultipliers)
        var modifiedBiasSet = SlightlyAdjustRandomSetOfNeuralNetMultipliers(copyOfTheBestBiases)

        //run for each input scenario
        for(let i = 0; i < ArrayOfinputArrays.length; i++)
        {
            var TestSubjectNeuralNetwork = makeNewNeuralNetwork(neuralNetStructure,modifiedMultiplierSet,modifiedBiasSet)
            
            var TestSubjectResultArray = RunNeuralNetwork(TestSubjectNeuralNetwork,ArrayOfinputArrays[i])
            TestSubjectCrummyness.push(calculateCrummynessLevel(ArrayOfdesiredOutputArrays[i],TestSubjectResultArray))
        }
        //Now save the results and move on to the next test subject
        if(TestSubjectCrummyness[0] < theBest.crummynessLevel[0] && TestSubjectCrummyness[1] < theBest.crummynessLevel[1] && TestSubjectCrummyness[2] < theBest.crummynessLevel[2] && TestSubjectCrummyness[3] < theBest.crummynessLevel[3])
        {
            theBest = {networkMultipliers:modifiedMultiplierSet,networkBiases:modifiedBiasSet,crummynessLevel:TestSubjectCrummyness};
        }
        //console.log(`Gen2 Network Test ${n} crummyness: ${TestSubjectCrummyness} multiplierSet: ${modifiedMultiplierSet}`)
    }
    return theBest;
}