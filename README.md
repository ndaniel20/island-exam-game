# Island Exam Game
This is a 2D game that uses AI pathway where 2 teams compete on an uninhabitable island and compete at getting the most points possible. 
2 teams with 3 members in each team, some members roam the island by themselves, whilst others may want to go in groups.
The goal is the go through each checkpoint in the island and do either a mental or physical task which they will be graded on at the end


The island is marked with liners to mark the walkable path for the members, where the orange are the open paths, red are the most challenging path for exceptional members, and purple are restricted paths
![Island with path marks](https://i.imgur.com/cxBRfAv.png)

To play the game, head to `output.png` and run the following command in the terminal:
```
node game.js
```
And watch the members of both teams roam around the island trying to get through each check point before night time.
The results of their activites in each check point will be determined by their Intelligence and Physical stats that is added on `candidates.json`

![Results can be shown at every interval](https://i.imgur.com/gwcMEqQ.png)

You also have the option to change the member faces and abilities on `candidates.json`
