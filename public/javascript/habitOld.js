
$(document).ready(function () {
    var habitInput = $(".new-habit-name")

    var url = window.location.href
    var userIdArray = url.split("=")
    var userId = userIdArray[1]
    //console.log(url)
    //console.log(userId)
    // var userId = sessionStorage.getItem("user-id")

    $(document).on("click", "#makeSubmit", handleHabitFormSubmit);
    $(document).on("click", "#breakSubmit", handleHabitFormSubmit);

    //Get data to show in chart
    var streaks = [];
    var habits;
    $.get("/habitCurStreak/"+userId, function (userHabits) {
        //console.log(userHabits);
        //console.log(userHabits.length);
        addData(userHabits);
    });


    //Add data to table
    function addData(userHabits, streaks){
        //console.log(userHabits);
        //console.log(userHabits[0].Progresses);

        for(var i=0;i<userHabits.length;i++){
            var name = userHabits[i].name;
            $("#habitsList").append("<tr><td>"+name+"</td></tr>");
            //If new habit with no progress, only add name
            //console.log(userHabits[i].Progresses);
            if(userHabits[i].Progresses.length !== 0 ){
                //else add more details
                var curStreak = userHabits[i].Progresses[userHabits[i].Progresses.length-1].consec_days;
                var date = moment(userHabits[i].Progresses[userHabits[i].Progresses.length-1].date).format('MM-DD-YYYY');
                var longStreak = 0;
                for(var j=0;j<userHabits[i].Progresses.length;j++){
                    if(userHabits[i].Progresses[j].consec_days > longStreak){
                        longStreak = userHabits[i].Progresses[j].consec_days;
                    }
                }
                var doneValue=0;
                if(curStreak >= 21){
                    doneValue = "✔";
                } else {
                    doneValue = "x";
                }
                //console.log("done value= "+ doneValue);

                $("#currentStreak").append("<tr><td>"+curStreak+"</td></tr>");
                $("#longestStreak").append("<tr><td>"+longStreak+"</td></tr>");
                $("#lastUpdated").append("<tr><td>"+date+"</td></tr>");
                $("#completedHabit").append("<tr><td>"+doneValue+"</td></tr>");
            }
        }
    }   


    function handleHabitFormSubmit(event) {
        event.preventDefault();
        var bMake = this.value;
        var iMake = 3;

        //get whether it is a good or bad habbit
        if (bMake === 'good') {
            habitInput = $("#entergoodHabit").val();
            //console.log("setting good");
            iMake = 1;
        } else {
            habitInput = $("#enterbadHabit").val();
            //console.log("setting bad");
            iMake = 0;
        }
        //Check again here if empty, if it is don't do anything
        if (!habitInput.trim()) {
            //console.log("empty string");
            return;
        }

        //console.log(bMake);
        //console.log(userId)
        //console.log(habitInput);

        //double-check we don't have the invalid message before continuing
        if(habitInput !== "Please enter habit before submitting"){
            //create data object to add
            upsertHabit(
                {
                    name: habitInput,
                    make: iMake,
                    UserId: userId
                },
            );
        }

    }

    //Call post api to create teh new habit
    function upsertHabit(habitData) {
        $.post("/api/createhabit", habitData);
        location.reload();
    }
})