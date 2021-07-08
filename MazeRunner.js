//2021-06-30 This is my very first attempt at programming a neural network
//           The goal of this program is to:
//           1. Create my own game (the maze) and each tick will present possible moves to the player (the nueral network)
//           2. Create a neural network that will decide where to move to based in its current location and possible options to move to
//           3. Create some sort of learning algorigthm that will modify the neural network to make it learn






//  ███    ███  █████  ███████ ███████      ██████   █████  ███    ███ ███████ 
//  ████  ████ ██   ██    ███  ██          ██       ██   ██ ████  ████ ██      
//  ██ ████ ██ ███████   ███   █████       ██   ███ ███████ ██ ████ ██ █████   
//  ██  ██  ██ ██   ██  ███    ██          ██    ██ ██   ██ ██  ██  ██ ██      
//  ██      ██ ██   ██ ███████ ███████      ██████  ██   ██ ██      ██ ███████ 
//                                                                             
//                                                                             

// var theNeuralNetwork = makeNewNeuralNetwork([2,3,3,2]);
// console.log("output array: "+RunNeuralNetwork(theNeuralNetwork,[0,1]))
//TrainSimpleNeuralNetwork()

//TrainFullANDgate();


//createAndRunNeuralNetworkAND();

TrainSimpleNeuralNetworkMultiples();



//TESTcalculateCrummynessLevel()
//createAndRunNeuralNetwork();

function createNewMaze()
{
    var newMaze = {
        size:[5,10],
        goalLocation:[3,10],
        wallLocations:[[1,7],[2,4],[2,7],[3,4],[3,7],[4,4],[5,4]],
        startingPlayerPos:[4,2],
        currentTick:0,
        currentPlayerPos:[4,2],
        playerStillAlive:true,
        playerHasWon:false,
        playerPositionLog:[],
        playerPositionLogBasic:[]
    }
    return newMaze;
}



function hostMazeGame()
{
    //Step 1: Create a new game
    var maze = createNewMaze()

    //Step 2: Run the game until the player dies or wins
    var i = 0;
    while(maze.playerStillAlive == true && maze.playerHasWon == false)
    {
        //Player is currently still alive and has not yet won the game
        runTick(maze)
        console.log(maze.playerPositionLog[i])
        i++;
    }
    console.log('GAME OVER')
    if(maze.playerStillAlive == false)
    {
        console.log("Player has died")
    }
    if(maze.playerHasWon == true)
    {
        console.log("Player has won!")
    }

}

function runTick(maze)
{
    //This function will look at the current state of the game, and feed possible moves to the neural network
    //It will the process the neural nework's response and advance the game by one tick, and return the new game state.

    //Step 0: check that player is still alive and the player has not yet won the game
    if(maze.playerStillAlive == false || maze.playerHasWon == true)
    {
        return false;
    }

    //Step 1: Prepare the Inputs for the neural network
    var NeuralNetInputs = {
        TilePosition1:ProcessPossibleTilePosition(maze,1),
        TilePosition2:ProcessPossibleTilePosition(maze,2),
        TilePosition3:ProcessPossibleTilePosition(maze,3),
        TilePosition4:ProcessPossibleTilePosition(maze,4),
        TilePosition5:ProcessPossibleTilePosition(maze,5),
        TilePosition6:ProcessPossibleTilePosition(maze,6),
        TilePosition7:ProcessPossibleTilePosition(maze,7),
        TilePosition8:ProcessPossibleTilePosition(maze,8),
        currentTick:maze.currentTick
    }

    //Step 2: Provide the inputs to the neural net and recieve the tile position to move to.
    var NewTilePosID = mockNeuralNetwork(NeuralNetInputs)

    //Step 3: Move the player to the new position, apply circumstances (death if out of bounds or hit wall) and log the tick
    maze.currentPlayerPos = getCoordinatesOfTileID(maze,NewTilePosID)

    //3.1 check if the player position is a wall or out of bounds
    if(checkIfTileIsAbleToBeOccupied(maze,maze.currentPlayerPos) == false)
    {
        //The player is in an invalid area (wall or out of bounds)
        maze.playerStillAlive = false;   
    }

    //3.11 check if the player is in the goal tile
    if(maze.currentPlayerPos[0] == maze.goalLocation[0] && maze.currentPlayerPos[1] == maze.goalLocation[1])
    {
        //the player has won the game
        maze.playerHasWon = true;
    }

    //3.2 Update the log
    var logEntry = `Tick #${maze.currentTick} Player moved to position ${NewTilePosID} located at [${maze.currentPlayerPos}]`
    maze.playerPositionLog.push(logEntry)

    if(maze.playerStillAlive == false) {
        maze.playerPositionLog.push(`Tick #${maze.currentTick} Player has died`)
    }
    if(maze.playerHasWon == true) {
        maze.playerPositionLog.push(`Tick #${maze.currentTick} Player has Won the game`)
    }

    //3.3 Increment tick
    maze.currentTick++
}



function ProcessPossibleTilePosition(maze,positionID)
{
    //Step 1: Determine if this position is able to be occupied
    var tileCoordinates =  getCoordinatesOfTileID(maze,positionID);
    var tileIsAbleToBeOccupied = checkIfTileIsAbleToBeOccupied(maze,tileCoordinates)

    //Step 2: If that tile is able to be occupied, calculate its distance from the goal\
    var TileDistanceFromGoal = 9999999;

    if(tileIsAbleToBeOccupied == true)
    {
        TileDistanceFromGoal = calculateTileDistanceBetweenTiles(maze.goalLocation,tileCoordinates)
    }

    return {
        TileIsAvailable:tileIsAbleToBeOccupied,
        TileDistanceFromGoal:TileDistanceFromGoal
    }
}

function getCoordinatesOfTileID(maze,positionID)
{
    var addX = 0;
    var addY = 0;
    //Add the X and Y offsets based on what relative position to move in to
    switch(positionID) {
        case 1: {
            addX = -1;
            addY = 1;
            break;
        }
        case 2: {
            addX = 0;
            addY = 1;
            break;
        }
        case 3: {
            addX = 1;
            addY = 1;
            break;
        }
        case 4: {
            addX = 1;
            addY = 0;
            break;
        }
        case 5: {
            addX = 1;
            addY = -1;
            break;
        }
        case 6: {
            addX = 0;
            addY = -1;
            break;
        }
        case 7: {
            addX = -1;
            addY = -1;
            break;
        }
        case 8: {
            addX = -1;
            addY = 0;
            break;
        }
        default: {
            console.log(`ERROR POSITION ID ${positionID} IS INVALID`)
            return 'ERROR_getCoordinatesOfTileID'
        }
    }
    var Xcord = maze.currentPlayerPos[0] + addX;
    var Ycord = maze.currentPlayerPos[1] + addY;

    return [Xcord,Ycord];
}

function checkIfTileIsAbleToBeOccupied(maze,coordinatesToCheck)
{
    var checkX = coordinatesToCheck[0];
    var checkY = coordinatesToCheck[1];

    //loop through the wallLocations of the maze, and if the coordinatesToCheck doesnt match any of them, then that tile is able to be occupied
    for(let i = 0; i < maze.wallLocations.length; i++)
    {
        var X = maze.wallLocations[i][0];
        var Y = maze.wallLocations[i][1];
        if(X == checkX && Y == checkY)
        {
            //matching coordinates found. 
            return false;       
        }
    }
    //Made it though the loop without finding any matching coordinates. check out of bounds
    var maxX = maze.size[0];
    var maxY = maze.size[1];

    if(checkX < 1 || checkX > maxX || checkY < 1 || checkY > maxY)
    {
        //coordinate is out of bounds.
        return false;
    }
    
    
    //That tile is open
    return true;
}

function calculateTileDistanceBetweenTiles(Tile1Cords,Tile2Cords)
{
    //parse individual values out of the arrays
    var Tile1X = Tile1Cords[0];
    var Tile1Y = Tile1Cords[1];
    var Tile2X = Tile2Cords[0];
    var Tile2Y = Tile2Cords[1];

    var Xdist = Tile1X - Tile2X;
    var Ydist = Tile1Y - Tile2Y;

    return Math.sqrt((Xdist*Xdist) + (Ydist*Ydist))
}



//TEST FUNCTIONS

function TESTcheckIfTileIsAbleToBeOccupied()
{
    //create maze
    var TheMaze = createNewMaze();
    
    //Test these coordinates
    var TestCord1 = [2,3]; //true
    var TestCord2 = [3,4]; //false
    var TestCord3 = [1,6]; //true
    var TestCord4 = [2,7]; //false
    var TestCord5 = [4,4]; //false
    var TestCord6 = [0,4]; //false - out of bounds
    var TestCord7 = [6,2]; //false - out of bounds


    console.log(`Coordinate ${TestCord1} is available. -> ${checkIfTileIsAbleToBeOccupied(TheMaze,TestCord1)}`)
    console.log(`Coordinate ${TestCord2} is available. -> ${checkIfTileIsAbleToBeOccupied(TheMaze,TestCord2)}`)
    console.log(`Coordinate ${TestCord3} is available. -> ${checkIfTileIsAbleToBeOccupied(TheMaze,TestCord3)}`)
    console.log(`Coordinate ${TestCord4} is available. -> ${checkIfTileIsAbleToBeOccupied(TheMaze,TestCord4)}`)
    console.log(`Coordinate ${TestCord5} is available. -> ${checkIfTileIsAbleToBeOccupied(TheMaze,TestCord5)}`)
    console.log(`Coordinate ${TestCord6} is available. -> ${checkIfTileIsAbleToBeOccupied(TheMaze,TestCord6)}`)
    console.log(`Coordinate ${TestCord7} is available. -> ${checkIfTileIsAbleToBeOccupied(TheMaze,TestCord7)}`)
}

function TESTgetCoordinatesOfTileID()
{
    //create maze
    var TheMaze = createNewMaze();

    //test IDs
    console.log(`Player located at ${TheMaze.currentPlayerPos} and position 1 is at ${getCoordinatesOfTileID(TheMaze,1)}`)
    console.log(`Player located at ${TheMaze.currentPlayerPos} and position 2 is at ${getCoordinatesOfTileID(TheMaze,2)}`)
    console.log(`Player located at ${TheMaze.currentPlayerPos} and position 3 is at ${getCoordinatesOfTileID(TheMaze,3)}`)
    console.log(`Player located at ${TheMaze.currentPlayerPos} and position 4 is at ${getCoordinatesOfTileID(TheMaze,4)}`)
    console.log(`Player located at ${TheMaze.currentPlayerPos} and position 5 is at ${getCoordinatesOfTileID(TheMaze,5)}`)
    console.log(`Player located at ${TheMaze.currentPlayerPos} and position 6 is at ${getCoordinatesOfTileID(TheMaze,6)}`)
    console.log(`Player located at ${TheMaze.currentPlayerPos} and position 7 is at ${getCoordinatesOfTileID(TheMaze,7)}`)
    console.log(`Player located at ${TheMaze.currentPlayerPos} and position 8 is at ${getCoordinatesOfTileID(TheMaze,8)}`)
}

function TESTcalculateTileDistanceBetweenTiles()
{
    var cord1 = [4,2];
    var cord2 = [3,10]
    console.log(`Distance between ${cord1} and ${cord2} = ${calculateTileDistanceBetweenTiles(cord1,cord2)}`)
    cord1 = [1,10];
    cord2 = [1,1]
    console.log(`Distance between ${cord1} and ${cord2} = ${calculateTileDistanceBetweenTiles(cord1,cord2)}`)
}



//   █████  ███    ██ ██████       ██████   █████  ████████ ███████      ██████   █████  ███    ███ ███████ 
//  ██   ██ ████   ██ ██   ██     ██       ██   ██    ██    ██          ██       ██   ██ ████  ████ ██      
//  ███████ ██ ██  ██ ██   ██     ██   ███ ███████    ██    █████       ██   ███ ███████ ██ ████ ██ █████   
//  ██   ██ ██  ██ ██ ██   ██     ██    ██ ██   ██    ██    ██          ██    ██ ██   ██ ██  ██  ██ ██      
//  ██   ██ ██   ████ ██████       ██████  ██   ██    ██    ███████      ██████  ██   ██ ██      ██ ███████ 
//                                                                                                          
//                                                                                                          

function HostAndGateGame()
{
    var Inputs1 = [0,0];
    var Inputs2 = [0,1];
    var Inputs3 = [1,0];
    var Inputs4 = [1,1];



}











//  ███    ██ ███████ ██    ██ ██████   █████  ██          ███    ██ ███████ ████████ 
//  ████   ██ ██      ██    ██ ██   ██ ██   ██ ██          ████   ██ ██         ██    
//  ██ ██  ██ █████   ██    ██ ██████  ███████ ██          ██ ██  ██ █████      ██    
//  ██  ██ ██ ██      ██    ██ ██   ██ ██   ██ ██          ██  ██ ██ ██         ██    
//  ██   ████ ███████  ██████  ██   ██ ██   ██ ███████     ██   ████ ███████    ██    
//                                                                                    
//                                                                                    

function mockNeuralNetwork(NeuralNetInputs)
{
    //Enter the locations of spaces to occupy into the array
    //starting pos: [4,2]
    var MovesToMake_Perfect = [1,8,1,3,3,3,1,2,2];

    var MovesToMake_HitsWall = [2,2,2,2,2,2,2,1];

    var MovesToMake_OutOfBounds = [3,4,2,2,1,1,1,2,2];

    //return the coordinates that the mock-neural network wishes to move to
    return MovesToMake_Perfect[NeuralNetInputs.currentTick]
}







function FeedNeuralNetwork(NeuralNetInputs,neuralNetwork)
{
    //This function will input data into the neural network, capture the neural networks outputs, and output the strongest output

    //step 1: parse the inputs into a single array

    //step 2: input that into the neural network and recieve the output array

    //step 3: choose the stongest output from the output array
}

function RunNeuralNetwork(neuralNetwork,InputArray)
{
    
    //Step 1: Set the input values on the input neurons
    for(let i = 0; i < InputArray.length; i++)
    {
        neuralNetwork[0][i].inputConnections[0].inputNeuronValue = InputArray[i];
        //console.log(`set neuron [0, ${i}] input connection value to ${InputArray[i]}`)
        neuralNetwork[0][i].neuronResultValue = neuralNetwork[0][i].inputConnections[0].inputNeuronValue * neuralNetwork[0][i].inputConnections[0].inputNeuronMultiplier;
        //console.log(`set neuron [0, ${i}] result value to ${neuralNetwork[0][i].neuronResultValue} (input: ${neuralNetwork[0][i].inputConnections[0].inputNeuronValue} * mult: ${neuralNetwork[0][i].inputConnections[0].inputNeuronMultiplier}`)

        //Add the bias
        neuralNetwork[0][i].neuronResultValue += neuralNetwork[0][i].neuronBias;
    }

    //Step 2: With the input neuron values in place, calculate the values for the rest of the neurons in the following layers
    for(let l = 1; l < neuralNetwork.length; l++)
    {
        //do this for each neuron for each layer
        for(let n = 0; n < neuralNetwork[l].length; n++)
        {
            var neuronValueTotal = 0;
            //do this for each connection of the neuron - find the orginal neuron and copy its result value into this neurons input value
            for(let c = 0; c < neuralNetwork[l][n].inputConnections.length; c++)
            {
                //get the address of the souce neuron
                var neuronConnection = neuralNetwork[l][n].inputConnections[c].inputNeuronID;

                //apply its result value into this neurons input value
                neuralNetwork[l][n].inputConnections[c].inputNeuronValue = neuralNetwork[neuronConnection[0]][neuronConnection[1]].neuronResultValue;

                //Now multiply the input value by the input multiplier for this connection and add to this neuron's total value
                neuronValueTotal += neuralNetwork[l][n].inputConnections[c].inputNeuronValue * neuralNetwork[l][n].inputConnections[c].inputNeuronMultiplier;
            }

            //After going through all of this neuron's connections, set the neuron result value
            neuralNetwork[l][n].neuronResultValue = neuronValueTotal;
            //Add the bias
            neuralNetwork[l][n].neuronResultValue += neuralNetwork[l][n].neuronBias;
        }
    }

    //console.log(JSON.stringify(neuralNetwork,null,4))
    //Step 3: Return an array of the neuronResultValues in the final layer of the neural network
    var outputArray = [];

    for(let n = 0; n < neuralNetwork[neuralNetwork.length-1].length; n++)
    {
        //push the neuron result value into the output array
        outputArray.push(neuralNetwork[neuralNetwork.length-1][n].neuronResultValue);
    }

    return outputArray;
}




function makeNewNeuralNetwork(NeuralNetStructure,NeuralNetMultipliers,NeuralNetBiases) // Example: [2,3,3,2] , [0.5,0.5,0.43,0.65, ... , 0.91] , [0.2,-0.1,0.4, ... , -0.5]
{
    // var InputLayer = [makeNewNeuron([0,0],['in_1'],0.5,true),makeNewNeuron([0,1],['in_2'],0.5,true)];
    // var HiddenLayer1 = [makeNewNeuron([1,0],InputLayer,0.5,false),makeNewNeuron([1,1],InputLayer,0.5,false),makeNewNeuron([1,2],InputLayer,0.5,false)]
    // var HiddenLayer2 = [makeNewNeuron([2,0],HiddenLayer1,0.5,false),makeNewNeuron([2,1],HiddenLayer1,0.5,false),makeNewNeuron([2,2],HiddenLayer1,0.5,false)]
    // var OutputLayer = [makeNewNeuron([3,0],HiddenLayer2,0.5,false),makeNewNeuron([3,1],HiddenLayer2,0.5,false)]

    var newNeuralNetwork = []
    var currentNeuron = 0;
    //Input layer first
    var InputLayer = []
    for(let n = 0; n < NeuralNetStructure[0]; n++)
    {
        //create each neuron and push to Input Layer
        var neuronID = [0,n];
        var neuronConnection = ['in_'+neuronID[1]];
        
        var newInputNeuron = makeNewNeuron(neuronID,neuronConnection,0.5,true,NeuralNetBiases[currentNeuron]);
        InputLayer.push(newInputNeuron)
        currentNeuron++;
    }
    newNeuralNetwork.push(InputLayer)

    //Now for the rest of the layers
    for(let l = 1; l < NeuralNetStructure.length; l++)
    {
        //make all the neurons in this layer
        var ThisLayer = [];
        for(let n = 0; n < NeuralNetStructure[l]; n++)
        {
            //create each neuron and push to this Layer
            var neuronID = [l,n];
            var neuronConnections = newNeuralNetwork[l-1]; //input the previous layer as the connections
            
            var newNeuron = makeNewNeuron(neuronID,neuronConnections,0.5,false,NeuralNetBiases[currentNeuron])
            ThisLayer.push(newNeuron)
            currentNeuron++;
        }
        newNeuralNetwork.push(ThisLayer)
    }

    //prepare the AmountOfConnectionsInEachNeuron array to help with the code below
    var AmountOfConnectionsInEachNeuron = []
    for(let l = 0; l < NeuralNetStructure.length; l++)
    {
        for(let n = 0; n < NeuralNetStructure[l]; n++)
        {
            if(l == 0) {
                AmountOfConnectionsInEachNeuron.push(1);
            } else {
                AmountOfConnectionsInEachNeuron.push(NeuralNetStructure[l-1])
            }
        }
    }

    //Now that the Neural Network has been created, lets fill in all the multipliers for each neuron
    var currentNeuron = 0;
    var currentConnection = 0;
    for(let l = 0; l < NeuralNetStructure.length; l++)
    {
        for(let n = 0; n < NeuralNetStructure[l]; n++)
        {
            for(let c = 0; c < AmountOfConnectionsInEachNeuron[currentNeuron]; c++)
            {
                //console.log(`setting inputMultiplier on connection ${c} on neuron ${n} on layer ${l} to: ${NeuralNetMultipliers[currentConnection]}`)
                newNeuralNetwork[l][n].inputConnections[c].inputNeuronMultiplier = NeuralNetMultipliers[currentConnection]; 
                currentConnection++;
            }
            currentNeuron++;
        }
    }
    return newNeuralNetwork;
}
function makeNewNeuron(newNeuronID,ArrayOfInputNeurons,startingMultiplier,IsInputNeuron,Bias)
{
    var newNeuron = {
        neuronID:newNeuronID,
        neuronResultValue:null,
        neuronBias:Bias,
        inputConnections:[]
    }

    if(IsInputNeuron == true)
    {
        //This is an input neuron 
        //build the connections
        for(let i = 0; i < ArrayOfInputNeurons.length; i++)
        {
            var newConnection = {
                inputNeuronID:ArrayOfInputNeurons[i],
                inputNeuronValue:null,
                inputNeuronMultiplier:startingMultiplier
            };
            newNeuron.inputConnections.push(newConnection);
        }
        return newNeuron;
    } else {
        //this is not an imput neuron. extract this new neuron's input nueron names from an array of neurons rather than an array of strings.
        for(let i = 0; i < ArrayOfInputNeurons.length; i++)
        {
            var newConnection = {
                inputNeuronID:ArrayOfInputNeurons[i].neuronID,
                inputNeuronValue:null,
                inputNeuronMultiplier:startingMultiplier
            };
            newNeuron.inputConnections.push(newConnection);
        }
        return newNeuron;
    }
}


















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
    for(let focus = 0; focus < ArrayOfdesiredOutputArrays.length; focus++)
    {
        //focus on one desired output array at a time

        //simulate 1000000 steps to possibly take
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
            if(TestSubjectCrummyness[focus] < theBest.crummynessLevel[focus])
            {
                theBest = {networkMultipliers:modifiedMultiplierSet,networkBiases:modifiedBiasSet,crummynessLevel:TestSubjectCrummyness};
            }
            //console.log(`Gen2 Network Test ${n} crummyness: ${TestSubjectCrummyness} multiplierSet: ${modifiedMultiplierSet}`)
        }
    }
    
    return theBest;
}
function generateRandomSetOfNeuralNetMultipliers(AmtOfMultipliers)
{
    var randomMultiplierArray = [];
    for(let i = 0; i < AmtOfMultipliers; i++)
    {
        randomMultiplierArray.push(Number((Math.random()).toFixed(4)))
    }
    return randomMultiplierArray;
}
function generateRandomSetOfNeuralNetBiases(AmtOfBiases)
{
    var randomBiasArray = [];
    for(let i = 0; i < AmtOfBiases; i++)
    {  
        randomBiasArray.push(Number((getRandomArbitrary(-1,1)).toFixed(4)))
    }
    return randomBiasArray;
}
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function SlightlyAdjustRandomSetOfNeuralNetMultipliers(Multipliers)
{
    
    for(let i = 0; i < Multipliers.length; i++)
    {
        var randomNumber = Math.random();
        if(randomNumber < 0.3333333333) {
            Multipliers[i] -= 0.001;
            Multipliers[i] = Number((Multipliers[i]).toFixed(4))
        } else if(randomNumber > 0.666666666) {
            Multipliers[i] += 0.001;
            Multipliers[i] = Number((Multipliers[i]).toFixed(4))
        }
    }
    return Multipliers;
}

function calculateCrummynessLevel(desiredOutputArray,actualOutputArray)
{
    var totalCrummyness = 0;
    for(let i = 0; i < desiredOutputArray.length; i++)
    {
        totalCrummyness += Math.abs(desiredOutputArray[i] - actualOutputArray[i])
    }
    return totalCrummyness;
}









function TrainFullANDgate()
{
     var neuralNetStructure = [8,12,12,4];
     trainNeuralNetwork(neuralNetStructure,[[0,0,0,1,1,0,1,1]],[[0,0,0,1]])
    
    //var neuralNetStructure = [2,8,12,12,4,1];
    //trainNeuralNetwork(neuralNetStructure,[[0,0],[1,0],[0,1],[1,1]],[[0],[0],[0],[1]])
    
}
function TrainSimpleNeuralNetwork()
{
    var neuralNetStructure = [2,3,3,1];

    trainNeuralNetwork(neuralNetStructure,[[0,0]],[[1]])
}


function TrainSimpleNeuralNetworkMultiples()
{
    var neuralNetStructure = [2,3,3,1];

    trainNeuralNetwork(neuralNetStructure,[[0,0],[1,0],[0,1],[1,1]],[[0],[1],[1],[1]])
}













function TESTcalculateCrummynessLevel()
{
    var DesiredOutputArray = [1,0]
    var Actual_OutputArray = [1.0897772560704508,0.03255207545432381]

    var crummyness = calculateCrummynessLevel(DesiredOutputArray,Actual_OutputArray)
    console.log(`Crummyness level: ${crummyness}`)
}

function createAndRunNeuralNetwork()
{
    var networkStructure = [2,3,3,1]
    var multipliers = [0.9631, 0.1536, 0.2011,
        0.1752, 0.7012, 0.9063,
        0.8278,  0.274, 0.0662,
        0.0925, 0.2503, 0.8643,
        0.0345, 0.5137, 0.1037,
        0.6609, 0.7402, 0.0198,
        0.0036, -0.007];
    var biases = [0.0836, 0.8046,
        0.532,  0.747,
       0.0992,  0.637,
       0.1075, 0.2974,
        -0.01];

    var inputArray = [0,1];
    var expectedOutput = [0]

    var NeuralNetwork = makeNewNeuralNetwork(networkStructure,multipliers,biases);
    var Output = RunNeuralNetwork(NeuralNetwork,inputArray);
    var Crummyness = calculateCrummynessLevel(expectedOutput,Output)
    console.log(`Network input: [${inputArray}] -> Network output: [${Output}]`)
    console.log(`Crummyness level: ${Crummyness}`)
}

function createAndRunNeuralNetworkAND()
{
    //Orginal Network
    var OrigStructure = [8,12,12,4]

    var multipliers = [0.1812,0.4361,0.4376,0.2913,-0.0007,0.1593,0.9425,0.3504,0.0414,0.9363,0.291,0.1142,0.3162,0.5204,0.1398,0.8217,0.3752,0.983,0.2036,0.5649,0.8877,0.8959,0.8056,0.1586,0.8433,0.4787,0.0094,0.1933,0.6202,0.0582,0.5118,0.5928,0.5126,0.8561,0.3518,0.8273,0.5626,0.401,0.7273,0.6967,0.8188,0.3478,0.8588,0.5562,0.8572,0.0275,0.7274,0.381,0.3453,0.8251,0.0974,0.7775,0.3467,0.9629,0.398,1.0075,0.1444,0.4331,0.3485,0.4737,0.2284,0.6429,0.9642,0.699,0.5326,0.2607,0.6593,0.5793,0.166,0.7078,0.5242,0.6108,0.9313,0.7128,0.4304,0.7822,0.6132,0.4243,0.5521,0.8757,0.5146,0.0331,0.6496,0.2943,0.8013,0.4294,0.5424,-0.0034,0.3915,0.2245,0.3442,0.8694,0.0305,0.4252,0.3498,0.797,0.7191,0.9252,0.8937,0.6594,0.6152,0.2826,0.2712,0.5726,0.6001,0.7677,0.6246,0.0231,0.1566,0.7771,0.9911,0.0537,0.1562,0.8046,0.2073,0.3835,0.0935,0.6209,0.3651,0.9025,0.0773,0.2797,0.1046,0.955,0.5066,0.0631,0.7589,0.9457,0.5224,0.1425,0.0035,0.1614,0.5194,0.6561,0.3803,0.9922,0.6545,0.9627,0.8703,0.0179,0.1511,0.1664,0.247,0.2594,0.3732,0.7649,0.6767,0.6637,0.1188,0.6606,0.6956,0.4478,0.0453,0.7806,0.4063,0.1795,0.7321,0.717,0.1356,0.145,0.6977,0.7667,0.4016,0.3275,0.5271,0.6993,0.3554,0.7391,0.178,0.6228,0.5406,0.0503,0.3348,0.3523,0.2505,0.4657,0.2836,0.4031,0.665,0.2096,0.8906,0.2091,0.5547,0.7829,0.5919,0.4257,0.4304,0.0956,0.6702,0.0983,0.2243,0.2974,0.2472,0.717,0.3517,0.0318,0.0836,0.4237,0.8192,0.4799,0.6506,0.2249,0.7596,0.5066,0.7149,0.4212,0.899,0.2631,0.5762,0.3698,0.4011,0.7023,0.0221,0.481,0.2847,0.3826,0.3301,0.4424,0.4463,0.3777,0.5974,0.2157,0.2905,0.0282,0.8187,0.5558,0.2862,0.5537,0.032,0.3018,0.7,0.2912,0.4162,0.0176,0.9532,0.6073,0.2733,0.5556,0.579,0.6856,0.484,0.5999,0.071,0.5252,0.8503,0.4696,0.2588,0.0212,0.9236,0.9972,0.4936,0.3582,0.3327,0.6019,0.6314,0.1598,0.2185,0.0318,0.5613,0.5305,0.1526,0.993,0.6927,0.0749,0.0747,0.1198,0.329,0.6665,0.0885,0.1776,0.171,0.9916,0.542,0.3377,0.7483,0.4713,0.527,0.0496,0.1494,0.7303,0.6502,0.4977,0.1339,0.2226,0.1911,0.2065,0.7546,0.1867,0.1496,0.0456,0.1876,0.8813,0.9051,0.404,0.9582,0.975];

    var biases = [-0.8195,-0.9244,-0.1785,0.7234,-0.7313,-0.1405,0.669,-0.2786,-0.1031,0.7732,-0.1529,0.1072,-0.3266,0.4496,0.2094,-0.3766,-0.9713,-0.8031,0.6444,0.2611,-0.8511,0.3825,-0.5494,-0.971,-0.3537,-0.8255,-0.6946,0.3817,0.4619,-0.6486,-0.2264,-0.4532,0.6557,0.2808,0.2268,0.8977];

    var inputArray = [0,0,0,1,1,0,1,1];
    var expectedOutput = [0,0,0,1];

    var NeuralNetwork = makeNewNeuralNetwork(OrigStructure,multipliers,biases);
    var Output = RunNeuralNetwork(NeuralNetwork,inputArray);
    var Crummyness = calculateCrummynessLevel(expectedOutput,Output)
    console.log(`Network input: [${inputArray}] -> Network output: [${Output}]`)
    console.log(`Crummyness level: ${Crummyness}`)

    //Experimental network
    var EXnetworkStructure = [2,8,12,12,4,1]

    var EXmultipliers = [1,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,0.1812,0.4361,0.4376,0.2913,-0.0007,0.1593,0.9425,0.3504,0.0414,0.9363,0.291,0.1142,0.3162,0.5204,0.1398,0.8217,0.3752,0.983,0.2036,0.5649,0.8877,0.8959,0.8056,0.1586,0.8433,0.4787,0.0094,0.1933,0.6202,0.0582,0.5118,0.5928,0.5126,0.8561,0.3518,0.8273,0.5626,0.401,0.7273,0.6967,0.8188,0.3478,0.8588,0.5562,0.8572,0.0275,0.7274,0.381,0.3453,0.8251,0.0974,0.7775,0.3467,0.9629,0.398,1.0075,0.1444,0.4331,0.3485,0.4737,0.2284,0.6429,0.9642,0.699,0.5326,0.2607,0.6593,0.5793,0.166,0.7078,0.5242,0.6108,0.9313,0.7128,0.4304,0.7822,0.6132,0.4243,0.5521,0.8757,0.5146,0.0331,0.6496,0.2943,0.8013,0.4294,0.5424,-0.0034,0.3915,0.2245,0.3442,0.8694,0.0305,0.4252,0.3498,0.797,0.7191,0.9252,0.8937,0.6594,0.6152,0.2826,0.2712,0.5726,0.6001,0.7677,0.6246,0.0231,0.1566,0.7771,0.9911,0.0537,0.1562,0.8046,0.2073,0.3835,0.0935,0.6209,0.3651,0.9025,0.0773,0.2797,0.1046,0.955,0.5066,0.0631,0.7589,0.9457,0.5224,0.1425,0.0035,0.1614,0.5194,0.6561,0.3803,0.9922,0.6545,0.9627,0.8703,0.0179,0.1511,0.1664,0.247,0.2594,0.3732,0.7649,0.6767,0.6637,0.1188,0.6606,0.6956,0.4478,0.0453,0.7806,0.4063,0.1795,0.7321,0.717,0.1356,0.145,0.6977,0.7667,0.4016,0.3275,0.5271,0.6993,0.3554,0.7391,0.178,0.6228,0.5406,0.0503,0.3348,0.3523,0.2505,0.4657,0.2836,0.4031,0.665,0.2096,0.8906,0.2091,0.5547,0.7829,0.5919,0.4257,0.4304,0.0956,0.6702,0.0983,0.2243,0.2974,0.2472,0.717,0.3517,0.0318,0.0836,0.4237,0.8192,0.4799,0.6506,0.2249,0.7596,0.5066,0.7149,0.4212,0.899,0.2631,0.5762,0.3698,0.4011,0.7023,0.0221,0.481,0.2847,0.3826,0.3301,0.4424,0.4463,0.3777,0.5974,0.2157,0.2905,0.0282,0.8187,0.5558,0.2862,0.5537,0.032,0.3018,0.7,0.2912,0.4162,0.0176,0.9532,0.6073,0.2733,0.5556,0.579,0.6856,0.484,0.5999,0.071,0.5252,0.8503,0.4696,0.2588,0.0212,0.9236,0.9972,0.4936,0.3582,0.3327,0.6019,0.6314,0.1598,0.2185,0.0318,0.5613,0.5305,0.1526,0.993,0.6927,0.0749,0.0747,0.1198,0.329,0.6665,0.0885,0.1776,0.171,0.9916,0.542,0.3377,0.7483,0.4713,0.527,0.0496,0.1494,0.7303,0.6502,0.4977,0.1339,0.2226,0.1911,0.2065,0.7546,0.1867,0.1496,0.0456,0.1876,0.8813,0.9051,0.404,0.9582,0.975,1,1,1,1];

    var EXbiases = [0,0,-0.8195,-0.9244,-0.1785,0.7234,-0.7313,-0.1405,0.669,-0.2786,-0.1031,0.7732,-0.1529,0.1072,-0.3266,0.4496,0.2094,-0.3766,-0.9713,-0.8031,0.6444,0.2611,-0.8511,0.3825,-0.5494,-0.971,-0.3537,-0.8255,-0.6946,0.3817,0.4619,-0.6486,-0.2264,-0.4532,0.6557,0.2808,0.2268,0.8977,0];

    var EXinputArray = [0,1];
    var EXexpectedOutput = [0]

    var EXNeuralNetwork = makeNewNeuralNetwork(EXnetworkStructure,EXmultipliers,EXbiases);
    var EXOutput = RunNeuralNetwork(EXNeuralNetwork,EXinputArray);
    var EXCrummyness = calculateCrummynessLevel(EXexpectedOutput,EXOutput)
    console.log(`Network input: [${EXinputArray}] -> Network output: [${EXOutput}]`)
    console.log(`Crummyness level: ${EXCrummyness}`)
}