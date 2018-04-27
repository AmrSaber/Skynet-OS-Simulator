class Task{
    constructor(id, _string){
        this.$canvas = $("#canvas" + id);
        this.string = _string;
        this.progress = 0;
        
        this.updateID = function(newID){
            this.$canvas = $("#canvas" + newID);
        }
        
        this.advance = function(update){
            this.progress += update;
            var offset = 50;
            this.$canvas.drawText({
                text: this.string,
                //fontFamily: 'cursive',
                fontSize: 60,
                x: "140",
                y: "80",
                fillStyle: 'lightblue',
                strokeStyle: 'blue',
                strokeWidth: 2
            });
            
            offset += this.progress;
            this.$canvas.drawRect({
                fillStyle: '#fff',
                x: 0,
                y: offset,
                fromCenter: false,
                width: "500",
                height: "160"
            });
        }
        
        this.reset = function(){
            this.progress = 0;
            this.$canvas.drawRect({
                fillStyle: '#fff',
                x: 0,
                y: 0,
                fromCenter: false,
                width: "1000",
                height: "1000"
            });
        }
        
        this.done = function(){
            return this.progress >= 60;
        }
    }
}

var speed, quantum, doneCount, isPlaying;
var tasks = [];//[new Task(0, "OS"), new Task(1, "Project"), new Task(2, "Task"), new Task(3, "Sync")];
if(localStorage.getItem("isLogedin") != "1") location.replace("Login.html");
$(function(){
    speed = 100;
    quantum = 50;
    doneCount = 0;
    isPlaying = 0;
    init_items();
    document.addEventListener('contextmenu', event => event.preventDefault());
    //loop(0);
    //execute(tasks[0], 5000, 0);
});

function loop(i){
    if(!isPlaying) return;
    var ni = (i+1)%tasks.length;
    
    if(!tasks[i].done()){
        execute(tasks[i]);
    }else{
        ++doneCount;
    }
    
    if(doneCount != tasks.length) setTimeout(function(){loop(ni)}, quantum);
    else{   //dnoe
        $("#myRightPanel *").prop("disabled", false);
        isPlaying = 0;
        doneCount = 0;
    }
}

function execute(task, lapsedTime){
    if(!isPlaying) return;
    task.advance(1);
    var myTime = 101 - speed;
    if(!lapsedTime) lapsedTime = 0;
    if(lapsedTime < quantum) setTimeout(function(){execute(task, lapsedTime+myTime)}, myTime);
}

function updateTime(){
    speed = $('#speedSlider').slider('value');
}

function updateQuantum(){
   quantum = $('#quantumSlider').slider('value');
}

function updateView(){
    for(var i = 0 ; i < tasks.length ; ++i){
        tasks[i].updateID(i);
        tasks[i].reset();
    }
    if(tasks.length == 4) $("#addTask, #word").prop("disabled", true);
    if(tasks.length < 4) $("#canvas3").slideUp();
    if(tasks.length < 3) $("#canvas2").slideUp();
    if(tasks.length < 2) $("#canvas1").slideUp();
    if(tasks.length < 1) $("#canvas0").slideUp();

    if(tasks.length > 0) $("#canvas0").slideDown();
    if(tasks.length > 1) $("#canvas1").slideDown();
    if(tasks.length > 2) $("#canvas2").slideDown();
    if(tasks.length > 3) $("#canvas3").slideDown();
}

function init_items(){                
    $('#speedSlider').slider({
      orientation: "horizontal",
      min: 0,
      max: 100,
      value: 50,
      slide: updateTime,
      change: updateTime
    });
    
    $('#quantumSlider').slider({
      orientation: "horizontal",
      min: 10,
      max: 500,
      value: 260,
      slide: updateQuantum,
      change: updateQuantum
    });
    
    $('.circle').hover(function(){
        $('.circle').clearQueue();
        var circleColor, iconColor;
        if($(this).css("background-color") == 'rgb(0, 0, 0)'){
            circleColor = "#fff";
            iconColor = "#000";
        }else{
            circleColor = "#000";
            iconColor = "#fff";
        }
        $(this).animate({
            'background-color': circleColor
        });
        $(this).children('.fa').animate({
            'color': iconColor
        });
    });
    
    $('#play').click(function(){
        if(!tasks.length) return;
        $("#myRightPanel *").prop("disabled", true);
        isPlaying = 1;
        for(var i = 0 ; i < tasks.length ; ++i) tasks[i].reset();
        loop(0); 
    });
    
    $('#pause').click(function(){
        $("#myRightPanel *").prop("disabled", false);
        isPlaying = 0;
    });
    
    $('#stop').click(function(){
        $("#myRightPanel *").prop("disabled", false);
        isPlaying = 0;
        doneCount = 0;
        for(var i = 0 ; i < tasks.length ; ++i){
            tasks[i].reset();
        }
    });
    
    $("#titleExit").click(function(){
       location.replace("Desktop.html");
    });
    
    $("#word").val("");
    $('#addTask').click(function(){
        var nxt = tasks.length;
        var string = $('#word').val();
        if(string == "") return;
        
        $('#word').val("");
        tasks.push(new Task(nxt, string));

        $(".strings").append(
            $("<li>").addClass("list-group-item").data("word", string).append(string).append(
                $("<a>").attr("href", "#").addClass("badge").append("X").click(function(){
                    if(isPlaying) return;

                    isPlaying = 1;
                    
                    var $prnt = $(this).parent();
                    var word = $prnt.data('word');
                    
                    for(var i = 0 ; i < tasks.length ; ++i){
                        tasks[i].reset();
                        if(tasks[i].string == word) tasks.splice(i, 1);
                    }
                    
                    $prnt.slideUp();
                    $prnt.remove();
                    updateView();
                    $("#addTask, #word").prop("disabled", false);
                    
                    isPlaying = 0;
                })
            )
        );
        
        updateView();
    });
    
    $("#word").keypress(function(e){
       if(e.which == 13){
           $("#addTask").click();
       } 
    }); 
}
