import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class MazeGameProcessing extends PApplet {

//2021-07-07 Going to try to recreate my maze game in Processing
Wall[] daWalls = new Wall[2];
int[] gameBounds = {100,350,600,100};
Goal theGoal;
int moveCounter;
boolean gameWon = false;

Player player;
//Player ai;

//test arraylists
ArrayList<ArrayList> testInts;
ArrayList<String> actStrings;
ArrayList<String> actStrings2;

//test neural networks
ArrayList<Integer> nnConfig;
ArrayList<Float> nnMultipliers;
ArrayList<Float> nnBiases;
NeuralNetwork testNeuralNet;

int empty;

AIcore aiTestbot;

public void setup()
{
    //test arraylists
    actStrings = new ArrayList <String>();
    actStrings2 = new ArrayList <String>();
    actStrings.add("actStr0");
    actStrings.add("actStr1");
    actStrings2.add("2actStr0");
    actStrings2.add("2actStr1");
    testInts = new ArrayList <ArrayList>();
    testInts.add(actStrings);
    testInts.add(actStrings2);
    println(testInts);
    println(testInts.get(0).get(1));




    //test neural networks
    int[] nnConfig = { 8,4 };
    println("nnConfig: "+nnConfig);
    printArray(nnConfig);

    //Generate a random neural net (confined to config defined above)
    float[] nnMultipliers = generateRandomNN_Multipliers(40); //new float[40];
    // for(int m = 0; m < 40; m++) {
    //     nnMultipliers[m] = 0.5;
    // }

    // println("nnMultipliers: -----------------------------------");
    // printArray(nnMultipliers);

    float[] nnBiases = generateRandomNN_Biases(12); //new float[12];
    // for(int b = 0; b < 12; b++) {
    //     nnBiases[b] = 0.1;
    // }

    // println("nnBiases: ----------------");
    // printArray(nnBiases);

    testNeuralNet = new NeuralNetwork(nnConfig,nnMultipliers,nnBiases);
    // float[] inputs = { 1, 10, 1, 10.5, 1, 11, 1, 9.6};
    // printArray(inputs);
    // testNeuralNet.runNeuralNetwork(inputs);

    

    // //ArrayList version
    // //test neural networks
    // nnConfig = new ArrayList <Integer>();
    // nnConfig.add(8);
    // nnConfig.add(4);
    // println("nnConfig: "+nnConfig);

    // nnMultipliers = new ArrayList <Float>();
    // for(int m = 0; m < 40; m++) {
    //     nnMultipliers.add(0.5);
    // }
    // println("nnMultipliers: "+nnMultipliers);

    // nnBiases = new ArrayList <Float>();
    // for(int b = 0; b < 12; b++) {
    //     nnBiases.add(0.1);
    // }
    // println("nnBiases: "+nnBiases);

    // testNeuralNet = new NeuralNetwork(nnConfig,nnMultipliers,nnBiases);
    // println("empty: "+empty);
    // float e = exp(1);
    // float squish = 1 /(1 + exp(8.5));
    // println("squishy = "+squish);

    // float x = 5.936;
    // int cas = (int) x;
    // println("cast = "+cas);





    frameRate(1);

    
    background(100);
    daWalls[0] = new Wall(0,150,3,1);
    daWalls[1] = new Wall(50,300,4,1);

    theGoal = new Goal(100,0);
    moveCounter = 0;

    player = new Player(150,400,76,145,156);
    // ai = new Player(150,400,76,0,156);

    //test AI - give it the randomly generated neural net from above
    aiTestbot = new AIcore(testNeuralNet);
    
}

public void draw()
{
    background(100);

    //Draw static text
    textSize(20);
    text("Move # "+moveCounter,50,40);
    text("Position 0: "+player.checkPositionValid(player.xPos,player.yPos-50)+" "+calculateDistance(player.xPos,player.yPos-50,theGoal.x,theGoal.y)/50,425,70);
    text("Position 1: "+player.checkPositionValid(player.xPos+50,player.yPos)+" "+calculateDistance(player.xPos+50,player.yPos,theGoal.x,theGoal.y)/50,425,90);
    text("Position 2: "+player.checkPositionValid(player.xPos,player.yPos+50)+" "+calculateDistance(player.xPos,player.yPos+50,theGoal.x,theGoal.y)/50,425,110);
    text("Position 3: "+player.checkPositionValid(player.xPos-50,player.yPos)+" "+calculateDistance(player.xPos-50,player.yPos,theGoal.x,theGoal.y)/50,425,130);
    text("Game Won: "+gameWon,425,150);
    text("Goal location x: "+theGoal.x+" y: "+theGoal.y,425,170);
    text("Player location x: "+player.xPos+" y: "+player.yPos,425,190);


    //draw the boundaries
    fill(50);
    rect(50,50,350,600);
    fill(100);
    rect(100,100,250,500);

    if(gameWon == true)
    {
        fill(3,252,23);
        rect(50,50,350,600);
        fill(100);
        rect(100,100,250,500);
    }

    //draw the walls
    for(int i = 0; i < daWalls.length; i++)
    {
        daWalls[i].draw();
    }

    //draw the goal
    theGoal.draw();

    //draw the Players
    player.draw();
    
    aiTestbot.draw();
    aiTestbot.makeMoveAI();

    gameWon = theGoal.checkIfCollided(player.xPos,player.yPos);

    if(player.checkPositionValid(player.xPos,player.yPos) == false)
    {
        player.teleport(150,400);
    }
    if(aiTestbot.checkSelfPositionValid() == false)
    {
        //ai has hit a wall.
        aiTestbot.killAI();
    }
}

public void keyPressed()
{
    //pause simulation
    if(key == 'p')
    {
        if(looping) noLoop();
        else        loop();
    }
    //Arrowkeys
    if (key == CODED)
    {
        if (keyCode == LEFT)
        { 
            player.move(3);
        }
        else if (keyCode == RIGHT)
        {
            player.move(1);
        }
        else if (keyCode == UP)
        {
            player.move(0);
        }
        else if (keyCode == DOWN)
        {
            player.move(2);
        }
    }
}

public float calculateDistance(int x1, int y1, int x2, int y2)
{
    int xDist = x1 - x2;
    int yDist = y1 - y2;
    float distance = sqrt(xDist*xDist+yDist*yDist);
    return distance;
}
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
    public void makeMoveAI()
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
    public void draw()
    {
        aiCharacter.draw();
    }
    public boolean checkSelfPositionValid()
    {
        boolean positionValid = aiCharacter.checkPositionValid(aiCharacter.xPos,aiCharacter.yPos);
        return positionValid;
    }
    public void killAI()
    {
        aiCoreIsAlive = false;
        aiCharacter.teleport(150,400);
    }
}
class Goal
{
    int x;
    int y;

    Goal(int xPos, int yPos)
    {
        x = xPos+gameBounds[3];
        y = yPos+gameBounds[0];
    }

    public void draw() {
        fill(242, 188, 61);
        rect(x,y,50,50);
    }

    public boolean checkIfCollided(int playerXpos,int playerYpos)
    {
        if(playerXpos == x && playerYpos == y)
        {
            return true;
        } else {
            return false;
        }
    }
}
class NeuralNetwork
{
    NeuralNetLayer[] neuralNetwork;
    float[] outputArray;

    //constructor - build a new neural network
    NeuralNetwork(int[] nueralNetLayerConfig, float[] neuralNetMultipliers, float[] neuralNetBiases)
    {
        neuralNetwork = new NeuralNetLayer[nueralNetLayerConfig.length];
        //Start at the input layer
        int neuronID = 0;     //used for the biases
        int connectionID = 0; //used for the multipliers
        //do all the layers
        for(int l = 0; l < nueralNetLayerConfig.length; l++)
        {
            //create an array to hold the amount of neurons in that layer
            Neuron[] neuralNetLayer = new Neuron[nueralNetLayerConfig[l]];

            //do all the neurons in the layer
            for(int n = 0; n < nueralNetLayerConfig[l]; n++)
            {
                Neuron neuron;
                //for each neuron, gather an array of all its inputs (neurons of the previous layer)
                int amountOfNeuronInputs;
                //Amount of neural connects = 1 for input neurons, and for all other neurons its the amount of neurons in the previous layer
                if(l == 0) { amountOfNeuronInputs = 1; }
                else { amountOfNeuronInputs = nueralNetLayerConfig[l-1]; }

                neuronInput[] neuronInputs = new neuronInput[amountOfNeuronInputs];

                for(int c = 0; c < amountOfNeuronInputs; c++)
                {
                    //make the connection and add it to an array that will eventually given to the neuron on creation
                    neuronInput connection;
                    int cLayer = l-1;

                    connection = new neuronInput(cLayer,c,neuralNetMultipliers[connectionID]);
                    neuronInputs[c] = connection;
                    connectionID++;
                }
                //now create the neuron with the array of inputs and the bias
                neuron = new Neuron(neuronInputs,neuralNetBiases[neuronID]);
                neuralNetLayer[n] = neuron;
            }
            neuralNetwork[l] = new NeuralNetLayer(neuralNetLayer);
        }

        //print the newly created neural network
        println("the Nerual Network: "+neuralNetwork);
    }

    //simulate neuralnet ---------------------------------------------------------------------------------------------
    public void runNeuralNetwork(float[] nnInputs)
    {
        //do the input layers first - plug the provided nnInputs into the nn input neurons
        println("Simulate the Nerual Network INPUT: ");
        printArray(nnInputs);

        //do all the neurons in the first layer first
        for(int n = 0; n < neuralNetwork[0].getNNlayer().length; n++)
        {
            //for each input neuron, insert its corrisponding input, then call its update function to have its output calculated
            neuralNetwork[0].getNNlayer()[n].setNeuronInput(nnInputs[n]);
            //neuralNetwork.get(0).get(n).neuronInputs.get(0).inputValue = nnInputs.get(n);
            neuralNetwork[0].getNNlayer()[n].updateNeuron();
        }
        
        //do the rest of the layers
        for(int l = 1; l < neuralNetwork.length; l++)
        {
            //do all the neurons in the layer
            for(int n = 0; n < neuralNetwork[l].getNNlayer().length; n++)
            {
                //for each neuron, process each of its inputs then add them all up
                for(int c = 0; c < neuralNetwork[l].getNNlayer()[n].neuronInputs.length; c++)
                {
                    //process the input - for each input, reference its source neuron's output and set it as this connections input value
                    int sourceNeuronLayer = l-1;
                    int sourceNeuronIndex = neuralNetwork[l].getNNlayer()[n].neuronInputs[c].inputNeuronLayerLocation;

                    neuralNetwork[l].getNNlayer()[n].neuronInputs[c].inputValue = neuralNetwork[sourceNeuronLayer].getNNlayer()[sourceNeuronIndex].getNeuronOutput();
                }
                //with all the connection input values set, call the neurons update function to calculate its own output
                neuralNetwork[l].getNNlayer()[n].updateNeuron();
            }
        }

        //now return the output values of all the output neurons
        int amountOfOutputNeurons = neuralNetwork[neuralNetwork.length-1].getNNlayer().length;
        float[] outArray = new float[amountOfOutputNeurons];

        for(int i = 0; i < amountOfOutputNeurons; i++)
        {
            outArray[i] = neuralNetwork[neuralNetwork.length-1].getNNlayer()[i].output;
        }

        println("Simulate the Nerual Network OUTPUT: ");
        printArray(outArray);

        outputArray = outArray;
    }
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------------

class NeuralNetLayer
{
    Neuron[] layer;

    //Constructor
    NeuralNetLayer(Neuron[] nLayer)
    {
        layer = nLayer;
    }
    public Neuron[] getNNlayer()
    {
        return layer;
    }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------

class Neuron
{
    //Neuron variables
    neuronInput[] neuronInputs;
    float bias;
    float output;

    //Constructor
    Neuron(neuronInput[] nNeuronInputs, float nBias)
    {
        neuronInputs = nNeuronInputs;
        bias = nBias;
    }

    //Set new input multipliers for the neuron
    public void updateInputMultipliers(neuronInput[] uNeuronInputs)
    {
        neuronInputs = uNeuronInputs;
    }
    //set new bias for the neuron
    public void updateBias(float uBias)
    {
        bias = uBias;
    }
    //set neuron input - used for input neurons
    public void setNeuronInput(float sNeuronInputValue)
    {
        neuronInputs[0].setInputValue(sNeuronInputValue);
    }
    //loop through its inputs, and calculate this neurons output
    public void updateNeuron()
    {
        float total = 0;
        //add up all the inputs multiplied by their multipliers
        for(int c = 0; c < neuronInputs.length; c++)
        {
            total += neuronInputs[c].inputValue * neuronInputs[c].multiplier;
        }
        //add the bias
        total += bias;
        //now feed the result through the sigmoid function and set the neuron output
        output = 1 / (1 + exp(total));
    }
    //get output
    public float getNeuronOutput()
    {
        return output;
    }
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------------

class neuronInput
{
    //Neuron Input variables
    int inputNeuronLayerIndex;
    int inputNeuronLayerLocation;
    float inputValue;
    float multiplier;

    //constructor
    neuronInput(int nLayerIndex, int nLayerLocation,float nMutliplier)
    {
        inputNeuronLayerIndex = nLayerIndex;       //Which layer the neuron is in within the neural net
        inputNeuronLayerLocation = nLayerLocation; //the index the neuron is within its layer
        multiplier = nMutliplier;
    }
    //set input value manually - used by input neurons
    public void setInputValue(float nInputValue)
    {
        inputValue = nInputValue;
    }
    // //find the input value from provided NN - will be used by all neurons except input neurons
    // void findInputValue(NeuralNetwork theNeuralNetwork)
    // {
    //     Neuron theTargetNeuron = theNeuralNetwork.neuralNetwork.get(inputNeuronLayerIndex).get(inputNeuronLayerLocation);
    // }
}










//2021-07-18
//ArrayList version. doesnt seem to work becasue I cant seem to access function within objects that are within an arraylist which is inside another arraylist within an object

// class NeuralNetwork
// {
//     ArrayList<ArrayList> neuralNetwork;

//     //constructor - build a new neural network
//     NeuralNetwork(ArrayList<Integer> nueralNetLayerConfig, ArrayList<Float> neuralNetMultipliers, ArrayList<Float> neuralNetBiases)
//     {
//         neuralNetwork = new ArrayList <ArrayList>();
//         //Start at the input layer
//         int neuronID = 0;     //used for the biases
//         int connectionID = 0; //used for the multipliers
//         //do all the layers
//         for(int l = 0; l < nueralNetLayerConfig.size(); l++)
//         {
//             ArrayList<Neuron> neuralNetLayer = new ArrayList <Neuron>();

//             //do all the neurons in the layer
//             for(int n = 0; n < nueralNetLayerConfig.get(l); n++)
//             {
//                 Neuron neuron;
//                 //for each neuron, gather an array of all its inputs (neurons of the previous layer)
//                 ArrayList<neuronInput> neuronInputs = new ArrayList <neuronInput>();
//                 int amountOfNeuronInputs;
//                 //Amount of neural connects = 1 for input neurons, and for all other neurons its the amount of neurons in the previous layer
//                 if(l == 0) { amountOfNeuronInputs = 1; }
//                 else { amountOfNeuronInputs = nueralNetLayerConfig.get(l-1); }

//                 for(int c = 0; c < amountOfNeuronInputs; c++)
//                 {
//                     //make the connection and add it to an array that will eventually given to the neuron on creation
//                     neuronInput connection;
//                     int cLayer = l-1;

//                     connection = new neuronInput(cLayer,c,neuralNetMultipliers.get(connectionID));
//                     neuronInputs.add(connection);
//                     connectionID++;
//                 }
//                 //now create the neuron with the array of inputs and the bias
//                 neuron = new Neuron(neuronInputs,neuralNetBiases.get(neuronID));
//                 neuralNetLayer.add(neuron);
//             }
//             neuralNetwork.add(neuralNetLayer);
//         }

//         //print the newly created neural network
//         println("the Nerual Network: "+neuralNetwork);
//     }

    
// }

// //simulate neuralnet ---------------------------------------------------------------------------------------------
// ArrayList runNeuralNetwork(ArrayList<Float> nnInputs, ArrayList<ArrayList> neuralNetwork)
// {
//     //do the input layers first - plug the provided nnInputs into the nn input neurons
    
//     //do all the neurons in the first layer first
//     for(int n = 0; n < neuralNetwork.get(0).size(); n++)
//     {
//         //for each input neuron, insert its corrisponding input, then call its update function to have its output calculated
//         neuralNetwork.get(0).get(n).setNeuronInput(nnInputs.get(n));
//         //neuralNetwork.get(0).get(n).neuronInputs.get(0).inputValue = nnInputs.get(n);
//         neuralNetwork.get(0).get(n).updateNeuron();
//     }
    
//     //do the rest of the layers
//     for(int l = 1; l < neuralNetwork.size(); l++)
//     {
//         //do all the neurons in the layer
//         for(int n = 0; n < neuralNetwork.get(l).size(); n++)
//         {
//             //for each neuron, process each of its inputs then add them all up
//             for(int c = 0; c < neuralNetwork.get(l).get(n).neuronInputs.size(); c++)
//             {
//                 //process the input - for each input, reference its source neuron's output and set it as this connections input value
//                 int sourceNeuronLayer = l-1;
//                 int sourceNeuronIndex = neuralNetwork.get(l).get(n).neuronInputs.get(c).inputNeuronLayerLocation;

//                 neuralNetwork.get(l).get(n).neuronInputs.get(c).inputValue = neuralNetwork.get(sourceNeuronLayer).get(sourceNeuronIndex).getNeuronOutput();
//             }
//             //with all the connection input values set, call the neurons update function to calculate its own output
//             neuralNetwork.get(l).get(n).updateNeuron();
//         }
//     }
// }

// //---------------------------------------------------------------------------------------------------------------------------------------------------------------

// class Neuron
// {
//     //Neuron variables
//     ArrayList<neuronInput> neuronInputs;
//     float bias;
//     float output;

//     //Constructor
//     Neuron(ArrayList<neuronInput> nNeuronInputs, float nBias)
//     {
//         neuronInputs = nNeuronInputs;
//         bias = nBias;
//     }

//     //Set new input multipliers for the neuron
//     void updateInputMultipliers(ArrayList<neuronInput> uNeuronInputs)
//     {
//         neuronInputs = uNeuronInputs;
//     }
//     //set new bias for the neuron
//     void updateBias(float uBias)
//     {
//         bias = uBias;
//     }
//     //set neuron input - used for input neurons
//     void setNeuronInput(float sNeuronInputValue)
//     {
//         neuronInputs.get(0).setInputValue(sNeuronInputValue);
//     }
//     //loop through its inputs, and calculate this neurons output
//     void updateNeuron()
//     {
//         float total = 0;
//         //add up all the inputs multiplied by their multipliers
//         for(int c = 0; c < neuronInputs.size(); c++)
//         {
//             total += neuronInputs.get(c).inputValue * neuronInputs.get(c).multiplier;
//         }
//         //add the bias
//         total += bias;
//         //now feed the result through the sigmoid function and set the neuron output
//         output = 1 / (1 + exp(total));
//     }
//     //get output
//     float getNeuronOutput()
//     {
//         return output;
//     }
// }

// //---------------------------------------------------------------------------------------------------------------------------------------------------------------

// class neuronInput
// {
//     //Neuron Input variables
//     int inputNeuronLayerIndex;
//     int inputNeuronLayerLocation;
//     float inputValue;
//     float multiplier;

//     //constructor
//     neuronInput(int nLayerIndex, int nLayerLocation,float nMutliplier)
//     {
//         inputNeuronLayerIndex = nLayerIndex;       //Which layer the neuron is in within the neural net
//         inputNeuronLayerLocation = nLayerLocation; //the index the neuron is within its layer
//         multiplier = nMutliplier;
//     }
//     //set input value manually - used by input neurons
//     void setInputValue(float nInputValue)
//     {
//         inputValue = nInputValue;
//     }
//     // //find the input value from provided NN - will be used by all neurons except input neurons
//     // void findInputValue(NeuralNetwork theNeuralNetwork)
//     // {
//     //     Neuron theTargetNeuron = theNeuralNetwork.neuralNetwork.get(inputNeuronLayerIndex).get(inputNeuronLayerLocation);
//     // }
// }
class Player
{
    int xPos;
    int yPos;

    int pcRED;
    int pcBLU;
    int pcGRE;

    Player(int initX, int initY, int pcR, int pcB, int pcG) {
        xPos = initX + gameBounds[3];
        yPos = initY + gameBounds[0];
        pcRED = pcR;
        pcBLU = pcB;
        pcGRE = pcG;
    }
    public void move(int direction) {
        if(direction == 0) {
            //move up
            yPos -= 50;
        } 
        else if(direction == 1) {
            //move right
            xPos += 50;
        }
        else if(direction == 2) {
            //move down
            yPos += 50;
        }
        else if(direction == 3) {
            //move left
            xPos -= 50;
        }  
        moveCounter++;
    }

    public boolean checkPositionValid(int checkX, int checkY) {
        boolean positionValid = true;
        //check bounds
        if(checkX < gameBounds[3] || checkX >= gameBounds[1] || checkY < gameBounds[0] || checkY >= gameBounds[2])
        {
            positionValid = false;
        }

        //check walls
        for(int i = 0; i < daWalls.length; i++)
        {
            //calculate pixel boundaries of the wall
            int wallTopEdge = daWalls[i].y + gameBounds[0];
            int wallLeftEdge = daWalls[i].x + gameBounds[3];
            int wallBottomEdge = daWalls[i].y + daWalls[i].yUnits*50 + gameBounds[0];
            int wallRightEdge = daWalls[i].x + daWalls[i].xUnits*50 + gameBounds[3];
            
            if(checkY >= wallTopEdge && checkY < wallBottomEdge && checkX >= wallLeftEdge && checkX < wallRightEdge)
            {
                positionValid = false;
            }
        }
        return positionValid;
    }

    public void teleport(int destinationX, int destinationY)
    {
        xPos = gameBounds[3] + destinationX;
        yPos = gameBounds[0] + destinationY;
        moveCounter = 0;
    }

    public void draw() {
        //player body (just a blue square)
        //fill(76, 145, 156);
        fill(pcRED,pcBLU,pcGRE);
        rect(xPos,yPos,50,50);
        //Player face details
        fill(0);
        ellipse(xPos+15,yPos+23,8,8);
        ellipse(xPos+35,yPos+23,8,7);
        line(xPos+15,yPos+40,xPos+35,yPos+40);
        line(xPos+35,yPos+40,xPos+38,yPos+37);    
    }
}
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

    public void draw() {
        fill(140, 107, 83);
        rect(x + gameBounds[3],y + gameBounds[0],50*xUnits,50*yUnits);
    }
}
public float[] generateRandomNN_Multipliers(int amount)
{
    float[] randNNmultipliers = new float[amount];

    for(int i = 0; i < amount; i++)
    {
        randNNmultipliers[i] = random(1);
    }

    return randNNmultipliers;
}

public float[] generateRandomNN_Biases(int amount)
{
    float[] randNNbiases = new float[amount];

    for(int i = 0; i < amount; i++)
    {
        randNNbiases[i] = random(1);
    }

    return randNNbiases;
}
  public void settings() {  size(900,700); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "MazeGameProcessing" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
