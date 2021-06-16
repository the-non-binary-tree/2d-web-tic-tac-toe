# 2d-web-tic-tac-toe
2d turn-based game using JavaScript

## Project goals
1. Getting comfortable using JavaScript
2. Designing algorithm for Tic-Tac-Toe that facilitates dynamic board
3. Build project workflow

### Goal 1. JavaScript
- Recognized personal uncomfort when facing JavaScript, I forced myself to a project primarily using it.
- Concepts used in the project:
  - Canvas
  - Template creating for symbols
  - Event handler: mouseClick
  - Elements' visibility
- My current new goal is to focus on React library for user interface  
*(also see 'Goal 3. Workflow' for more reasons to focus on React)*.

### Goal 2. Algorithm
- MiniMax algorithm
- Genetic algorithm:
  - Time complexity grows significantly when increase number of dimensions and edge length  
  - The algorithm takes significantly more cycles to reach a conlusion when the board grows past 4 dimensions 
  - Descendent algorithms cannot accumulate enough wins to replace ancestor algorithms

- With the goal of making the game playable on board dynamic in both size and dimension,  
and keeping the project managable at the time, I designed an algorithm based on strategy  
of a nominal human player.

### Goal 3. Workflow
