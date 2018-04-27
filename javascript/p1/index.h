class _boardcontroller
{
    element-array holes; //the holes
    imgelement-array holeImgs; //the holes' images

    element score; //the score element
    int scorenum; //the score int

    int currentUp; //index of current up hole

    element timer; //the timer element
    int time;
    interval timerfunction; //interval function of timer

    /*0: not started
      1: on going
      2: paused*/
    int gamestate;

    int highscore;
    element highscoree;

    int spawnspeed;
    interval spawnfunction;

    void holeEvents();
    void setupbuttons();

    //decrement the timer, if 0, run game over actions
    void runTimer();
    void resetGame();
    void startGameAction();
    void molespawn();

    //make random mole go up. sets the currentup
    void randomUp();
    void setHoleState(int index,int state);

    void setspawnspeed(int speed); //set new spawn speed
}