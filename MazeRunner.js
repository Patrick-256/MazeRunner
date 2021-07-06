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
TESTcreateNeuralNetwork()

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

function makeNewNeuralNetwork(NeuralNetStructure,NeuralNetMultipliers) // Example: [2,3,3,2] , [0.5,0.5,0.43,0.65, ... , 0.91] 
{
    // var InputLayer = [makeNewNeuron([0,0],['in_1'],0.5,true),makeNewNeuron([0,1],['in_2'],0.5,true)];
    // var HiddenLayer1 = [makeNewNeuron([1,0],InputLayer,0.5,false),makeNewNeuron([1,1],InputLayer,0.5,false),makeNewNeuron([1,2],InputLayer,0.5,false)]
    // var HiddenLayer2 = [makeNewNeuron([2,0],HiddenLayer1,0.5,false),makeNewNeuron([2,1],HiddenLayer1,0.5,false),makeNewNeuron([2,2],HiddenLayer1,0.5,false)]
    // var OutputLayer = [makeNewNeuron([3,0],HiddenLayer2,0.5,false),makeNewNeuron([3,1],HiddenLayer2,0.5,false)]

    var newNeuralNetwork = []
    //Input layer first
    var InputLayer = []
    for(let n = 0; n < NeuralNetStructure[0]; n++)
    {
        //create each neuron and push to Input Layer
        var neuronID = [0,n];
        var neuronConnection = ['in_'+neuronID[1]];
        
        var newInputNeuron = makeNewNeuron(neuronID,neuronConnection,0.5,true)
        InputLayer.push(newInputNeuron)
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
            
            var newNeuron = makeNewNeuron(neuronID,neuronConnections,0.5,false)
            ThisLayer.push(newNeuron)
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
function makeNewNeuron(newNeuronID,ArrayOfInputNeurons,startingMultiplier,IsInputNeuron)
{
    var newNeuron = {
        neuronID:newNeuronID,
        neuronResultValue:null,
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
    for(let l = 0; l < neuralNetStructure.length; l++)
    {
        for(let n = 0; n < neuralNetStructure[l]; n++)
        {
            if(l == 0) {
                TotalNetworkMultipliers++
            } else {
                TotalNetworkMultipliers += (neuralNetStructure[l-1])
            }
        }
    }
   
    //Now that we know how many multipliers there are, total possible configurations = 10^(#decPointsPrecison * #multipliers)
    console.log(`==============================================================`)
    console.log(`Training Neural Network:`)
    console.log(JSON.stringify(neuralNetStructure,null,4))
    console.log(`-----------------------------------------------------------------`)
    console.log(`Total Neural Network Multipliers: ${TotalNetworkMultipliers}`)
    console.log("")

    //Generate and run the first batch of 1000 neural networks and save their results in an array
    var Gen1BestNeuralNetResults = {networkID:[0],crummynessLevel:16};

    for(let n = 0; n < 1000000; n++)
    {
        var TestSubjectCrummyness = 0 //lower is better

        var randomMultiplierSet = generateRandomSetOfNeuralNetMultipliers(TotalNetworkMultipliers)

        //run for each input scenario
        for(let i = 0; i < ArrayOfinputArrays.length; i++)
        {
            var TestSubjectNeuralNetwork = makeNewNeuralNetwork(neuralNetStructure,randomMultiplierSet)
            //console.log("TEST SUBJECT NEURAL NETWORK:")
            //console.log(randomMultiplierSet)
            //console.log(JSON.stringify(TestSubjectNeuralNetwork,null,4))
            var TestSubjectResultArray = RunNeuralNetwork(TestSubjectNeuralNetwork,ArrayOfinputArrays[i])
            TestSubjectCrummyness += calculateCrummynessLevel(ArrayOfdesiredOutputArrays[i],TestSubjectResultArray)
        }
        //Now save the results and move on to the next test subject
        if(TestSubjectCrummyness < Gen1BestNeuralNetResults.crummynessLevel)
        {
            Gen1BestNeuralNetResults = {networkID:randomMultiplierSet,crummynessLevel:TestSubjectCrummyness};
        }
        //console.log(`Network Test ${n} crummyness: ${TestSubjectCrummyness} multiplierSet: ${randomMultiplierSet}`)
    }

    //keep the best 5 and generate 200 more using similar settings for each champion
    //Gen1NeuralNetResults = sortArray(Gen1NeuralNetResults,'crummynessLevel')
    //var top5NeuralNetIDs = Gen1NeuralNetResults.splice(0,5)
    console.log(`Generation 1: Simulation Complete! Best NeuralNets:`)
    console.log(Gen1BestNeuralNetResults)

    //now run the neural network to see its outputs

    var outputArray = RunNeuralNetwork(makeNewNeuralNetwork(neuralNetStructure,Gen1BestNeuralNetResults.networkID),[0,0])
    
    for(let i = 0; i < ArrayOfinputArrays.length; i++)
    {
        var BestNeuralNetwork = makeNewNeuralNetwork(neuralNetStructure,Gen1BestNeuralNetResults.networkID)
        
        var BestNeuralNetworkResults = RunNeuralNetwork(BestNeuralNetwork,ArrayOfinputArrays[i])
        console.log(`Network input: [${ArrayOfinputArrays[i]} -> Network output: ${BestNeuralNetworkResults}`)
    }

    console.log(`Simulating generation 2...`)
    //Now slightly adjust each value
    var gen2best = simulateNeuralNetGeneration(Gen1BestNeuralNetResults,neuralNetStructure,ArrayOfinputArrays,ArrayOfdesiredOutputArrays)
    console.log(`Generation 2: Simulation Complete! Best NeuralNets:`)
    console.log(gen2best)

    console.log(`Simulating generation 3...`)
    //Now slightly adjust each value
    var gen3best = simulateNeuralNetGeneration(gen2best,neuralNetStructure,ArrayOfinputArrays,ArrayOfdesiredOutputArrays)
    console.log(`Generation 3: Simulation Complete! Best NeuralNets:`)
    console.log(gen3best)

    console.log(`Simulating generation 4...`)
    //Now slightly adjust each value
    var gen4best = simulateNeuralNetGeneration(gen3best,neuralNetStructure,ArrayOfinputArrays,ArrayOfdesiredOutputArrays)
    console.log(`Generation 4: Simulation Complete! Best NeuralNets:`)
    console.log(gen4best)

    console.log(`Simulating generation 5...`)
    //Now slightly adjust each value
    var gen5best = simulateNeuralNetGeneration(gen4best,neuralNetStructure,ArrayOfinputArrays,ArrayOfdesiredOutputArrays)
    console.log(`Generation 3: Simulation Complete! Best NeuralNets:`)
    console.log(gen5best)

    //repeat until lameness level is sufficiently low

}
function simulateNeuralNetGeneration(theBest,neuralNetStructure,ArrayOfinputArrays,ArrayOfdesiredOutputArrays)
{
    for(let n = 0; n < 1000000; n++)
    {
        var TestSubjectCrummyness = 0 //lower is better

        var modifiedMultiplierSet = SlightlyAdjustRandomSetOfNeuralNetMultipliers(theBest.networkID)

        //run for each input scenario
        for(let i = 0; i < ArrayOfinputArrays.length; i++)
        {
            var TestSubjectNeuralNetwork = makeNewNeuralNetwork(neuralNetStructure,modifiedMultiplierSet)
            //console.log("TEST SUBJECT NEURAL NETWORK:")
            //console.log(randomMultiplierSet)
            //console.log(JSON.stringify(TestSubjectNeuralNetwork,null,4))
            var TestSubjectResultArray = RunNeuralNetwork(TestSubjectNeuralNetwork,ArrayOfinputArrays[i])
            TestSubjectCrummyness += calculateCrummynessLevel(ArrayOfdesiredOutputArrays[i],TestSubjectResultArray)
        }
        //Now save the results and move on to the next test subject
        if(TestSubjectCrummyness < theBest.crummynessLevel)
        {
            theBest = {networkID:modifiedMultiplierSet,crummynessLevel:TestSubjectCrummyness};
        }
        //console.log(`Gen2 Network Test ${n} crummyness: ${TestSubjectCrummyness} multiplierSet: ${modifiedMultiplierSet}`)
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
function SlightlyAdjustRandomSetOfNeuralNetMultipliers(Multipliers)
{
    
    for(let i = 0; i < Multipliers.length; i++)
    {
        var randomNumber = Math.random();
        if(randomNumber < 0.3333333333) {
            Multipliers[i] -= 0.0001;
            Multipliers[i] = Number((Multipliers[i]).toFixed(4))
        } else if(randomNumber > 0.666666666) {
            Multipliers[i] += 0.0001;
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






function sortArray(ArrayToSort, thingToSortBy)
{
    //quickly check everything in the array for compliance
    for(let i = 0; i < ArrayToSort.length; i++)
    {
        if(ArrayToSort[i][thingToSortBy] == null)
        {
            ArrayToSort[i][thingToSortBy] = 0;
        }
    }
    //bubble sort!
    var ArraySorted = false;
    while(ArraySorted == false)
    {
        var activeTBsort = 0;
        var numOfSwaps = 0;
        while(activeTBsort+1 < ArrayToSort.length)
        {
            //Bubble Sort!
            //look at the price of the first item and if it is lower than the next item, then swap places. else, move to next item
            var currentItem = ArrayToSort[activeTBsort]
            var nextItem = ArrayToSort[activeTBsort+1]

            if(currentItem[thingToSortBy] > nextItem[thingToSortBy])
            {
                //swap these bots
                ArrayToSort[activeTBsort] = nextItem;
                ArrayToSort[activeTBsort+1] = currentItem;
                numOfSwaps++
            }
            activeTBsort++;
        }
        if(numOfSwaps == 0)
        {
            ArraySorted = true;
            return ArrayToSort
        }
    }
}


function TESTcreateNeuralNetwork()
{
    var neuralNetStructure = [2,3,3,2];
    // var neuralNetMultipliers = [
    //     0.5,0.5, //input layer
    //     0.73,0.51,0.21,0.63,0.52,0.94, //layer1
    //     0.53,0.23,0.67,0.51,0.34,0.78,0.67,0.95,0.12, //layer2
    //     0.54,0.93,0.23,0.74,0.23,0.65 //output layer
    // ];
    // var inputArray = [0,1];
    // console.log(`Creating neural network ${neuralNetStructure} with multipliers: ${neuralNetMultipliers}`)
    // var theNeuralNetwork = makeNewNeuralNetwork(neuralNetStructure,neuralNetMultipliers);
    // console.log(`Network has been simulated with input [${inputArray}] and its output array is: ${RunNeuralNetwork(theNeuralNetwork,inputArray)} Below is the result Neural Network:`)

    // console.log(`Now attempting to train neural network...`)
    trainNeuralNetwork(neuralNetStructure,[[0,0],[0,1],[1,0],[1,1]],[[1,1],[1,0],[0,1],[0,0]])
}