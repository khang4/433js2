class _boardcontroller
{
    constructor()
    {
        this.holes=document.querySelectorAll(".board-row .span4");
        this.holeImgs=document.querySelectorAll(".board-row .span4 img");

        this.score=document.querySelector(".score");
        this.currentUp=0;
        this.scorenum=0;

        this.timer=document.querySelector(".timer");
        this.time=0;
        this.timerfunction;

        /*0: not started
          1: on going
          2: paused*/
        this.gamestate=0;

        this.highscore=0;
        this.highscoree=document.querySelector(".highscore");

        var getscore=window.localStorage.getItem("highscore");
        if (getscore)
        {
            this.highscore=getscore;
        }

        this.highscoree.innerText=this.highscore;

        this.spawnspeed=800;

        this.holeEvents();
        this.setupbuttons();
    }

    //setup holes
    holeEvents()
    {
        for (var x=0;x<9;x++)
        {
            this.holes[x].state=0;
            this.holes[x].index=x;
            this.holes[x].addEventListener("mousedown",(e)=>{
                if (this.gamestate==0)
                {
                    alert("you must start the game");
                    return;
                }

                if (!e.currentTarget.state)
                {
                    return;
                }

                this.scorenum++;
                this.score.innerText=this.scorenum;
                this.setHoleState(e.currentTarget.index,0);
            });
        }
    }

    setupbuttons()
    {
        document.querySelector(".start-btn").addEventListener("click",(e)=>{
            this.startgameaction();
        });
    }

    //randomly raise a hole
    randomUp()
    {
        this.currentUp=Math.floor(Math.random()*9);
        this.setHoleState(this.currentUp,1);
    }

    //set a hole at index to state 0 or 1
    setHoleState(index,state)
    {
        this.holes[index].state=state;

        if (state)
        {
            this.holeImgs[index].src="img/up.png";
        }

        else
        {
            this.holeImgs[index].src="img/down.png";
        }
    }

    runTimer()
    {
        if (this.gamestate==2)
        {
            return;
        }

        this.time--;

        //game over actions
        if (this.time<=0)
        {
            for (var x=0;x<9;x++)
            {
                this.setHoleState(x,0);
            }

            this.gamestate=0;
            this.timer.innerText="game over";
            clearInterval(this.timerfunction);
            clearInterval(this.spawnfunction);

            if (this.scorenum>this.highscore)
            {
                this.highscore=this.scorenum;
                this.highscoree.innerText=this.highscore;
                window.localStorage.setItem("highscore",this.highscore);
            }
        }

        else
        {
            this.timer.innerText=this.time;
        }
    }

    resetGame()
    {
        if (this.timerfunction)
        {
            clearInterval(this.timerfunction);
        }

        if (this.spawnfunction)
        {
            clearInterval(this.spawnfunction);
        }

        this.gamestate=0;
        this.time=0;
        this.timer.innerText=0;
        this.scorenum=0;
        this.score.innerText=0;
        for (var x=0;x<9;x++)
        {
            this.setHoleState(x,0);
        }
    }

    startgameaction()
    {
        if (this.gamestate==0)
        {
            this.scorenum=0;
            this.score.innerText=0;
            this.time=30;
            this.timer.innerText=30;
            this.gamestate=1;

            this.timerfunction=setInterval(()=>{
                this.runTimer();
            },1000);

            this.spawnfunction=setInterval(()=>{
                this.molespawn();
            },this.spawnspeed);

            this.randomUp();
        }

        else if (this.gamestate==1)
        {
            this.gamestate=2;
            if (confirm("start over?"))
            {
                this.gamestate=0;
                this.resetGame();
                this.startgameaction();
            }

            else
            {
                this.gamestate=1;
            }
        }
    }

    molespawn()
    {
        if (this.gamestate==1)
        {
            this.setHoleState(this.currentUp,0);
            this.randomUp();
        }
    }

    setspawnspeed(speed)
    {
        this.spawnspeed=speed;
    }
}

var boardcontroller;
window.onload=()=>{
    boardcontroller=new _boardcontroller;
};