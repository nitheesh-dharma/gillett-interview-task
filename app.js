"use strict"; 

// Array to store decayed information 
var decayInfo = []; 

// Variable to store the modal pop container
var modalCont; 
// Variable to store the form 
var form;
var modalBack; 

/* 
  Function to open the modal popup
*/
function openModal(){
  // Rerieve the container, the form and background
  modalCont =  document.getElementById("modal-container");
  modalBack= document.getElementById("modal-background");
  form = document.querySelector("form");

  modalCont.style.display = "block";
  modalBack.style.display = "block"; 
  form.style.cssText = "animation:slideIn .5s ease; animation-fill-mode: forwards;";
}

// Close the pop up if any where on the window is clicked 
window.addEventListener('click', (e) => {
	if (e.target == modalBack){
    closeModal();
  }
});

/* 
  Function to close the modal popup
*/
function closeModal(){
  modalBack.style.display = "none";
  form.style.cssText ="animation:slideOut .5s ease; animation-fill-mode: forwards;";
  setTimeout(() => {
		modalCont.style.display = "none";
	}, 500);
  
  // Clear the form
  document.getElementById("nname").value = ""; 
  document.getElementById("half-life").value = ""; 
  document.getElementById("activity").value = ""; 
}

/* 
  Function to update information in the table and the total time for decay
*/
function updateNuclideInfo() {
  // Retrive data from form
  var nName = document.getElementById("nname").value; 
  var halfLife = parseFloat(document.getElementById("half-life").value); 
  var startActivity = parseFloat(document.getElementById("activity").value); 
  
  // Calculate decay for repsective number of days rounded to two decimal places
  var decayDayOne = calcDecay(1,startActivity,halfLife).toFixed(2);
  var decayDayTen = calcDecay(10,startActivity,halfLife).toFixed(2);
  var decayDayHundred = calcDecay(100,startActivity,halfLife).toFixed(2);
  var decayDayThousand = calcDecay(1000,startActivity,halfLife).toFixed(2);

  // Calculate number of days for element to decay to less than 1 unit
  var timeLessOne = timeLessThanOne(1,startActivity,halfLife); 

  // Retrieve table element
  var table = document.getElementById("table_data");
  // Insert Row into the table
  var row = table.insertRow(-1);
  // Update table after 500 ms

  row.insertCell(0).innerHTML = nName; 
  row.insertCell(1).innerHTML = halfLife; 
  row.insertCell(2).innerHTML = startActivity; 
  row.insertCell(3).innerHTML = decayDayOne; 
  row.insertCell(4).innerHTML = decayDayTen; 
  row.insertCell(5).innerHTML = decayDayHundred;  
  row.insertCell(6).innerHTML = decayDayThousand;
  row.insertCell(7).innerHTML = timeLessOne; 
  
  // Push the current nuclide information into the array
  decayInfo.push([startActivity,halfLife,timeLessOne]); 

  // Find the maximum time taken for activity to decay to less than one amongst exsisting nuclides 
  var maxDecayLessOne = 0; 
  for(let i = 0; i<decayInfo.length; i++){
    maxDecayLessOne = Math.max(decayInfo[i][2],maxDecayLessOne);
  }
  // Find time take for all activity to reduce to less than one 
  var totalDecayTime = timeLessThanOne(maxDecayLessOne,0,0,decayInfo);

  // Update the text to dispaly the total time taken
  document.getElementById("tot-days").innerHTML = "Time for total activity to decay: " + totalDecayTime.toString();
  
  

  // Close the form 
  closeModal();
}

/*  
  Fuction to calculate decayed activity after a specific number of days
*/
function calcDecay( days,initActivity, halfLife){
   return initActivity * (0.5 ** (days/halfLife)); 
}

/* 
  Function to calculate time (in days) it takes for acticity to decay to less than one unit
*/
function timeLessThanOne(start_time,startActivity=0,halfLife = 0 ,decayInfo = []){
  // Declare upper and lowe bound
  var lower = start_time; 
  var upper = 1 * (10**6); 

  // Potential number of days
  var pot_num_days = 0; 
  // Number of days 
  var num_days = 0; 

  while (lower <= upper){
    // Update potential number of days to the midpoint of the bounds
    pot_num_days = parseFloat(((lower + upper) / 2).toFixed(3)); 
    // Store the activity
    var activity = 0;
    if (decayInfo.length == 0){
      // Calculate activity after potenial number of days
      activity = calcDecay(pot_num_days,startActivity,halfLife);
    }
    else{
      // Calculate combined activity for all nuclides after potential numbr of days
      for(let i =0; i<decayInfo.length; i++){
        activity += calcDecay(pot_num_days, decayInfo[i][0], decayInfo[i][1]);  
      }
    } 

    if (activity <1.00) {
      // Set number of days to potential number of days
      num_days = pot_num_days;
      // Lower to upper bownd to look for potentially lower number of days 
      upper =  pot_num_days - 0.001;
      
    }
    else if (activity >= 1.00){
      // Increase the lower bound 
      lower = pot_num_days + 0.001; 
    }
  }
  return Math.ceil(num_days); 
}

