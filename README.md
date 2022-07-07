# Snake
![snake game](./img/snake_game.PNG)
*Created in 2017*<br>
2 player version of the well known classic game [Snake](https://en.wikipedia.org/wiki/Snake_(video_game_genre)).<br>
Written in `javascript` and `html`.<br>
Using the [p5.js](https://p5js.org/) library for the game objects and the game rendering.

# How to run
You can run this game by opening the [index.html](./index.html) in your browser or you can run a simple http server in the root folder of this repo e.g. (in python) `python -m http.server`

# Controls
`arrow keys` navigate your snake through the field.<br>
`f` toggle full screen.<br>
`p` pause the game.<br>
`r` restart the game when it is Game Over.<br>
`a` toggle player statistics.<br>
`1` set to gamemode 1: one snake is controlled by the player, the other one by the AI.<br>
`2` set to gamemode 2: both snakes are controlled by a player. Controls for the second player:<br>
    `z` move snake upwards.<br>
    `s` move snake downwards.<br>
    `q` move snake to the left.<br>
    `d` move snake to the right.<br>

`3` set to gamemode 3: both snakes are controlled by the AI.<br>

There are 2 types of food:
1. :green_apple: green adds 1 blocks to your snake.
2. :grapes: purple adds 3 blocks to your snake.
