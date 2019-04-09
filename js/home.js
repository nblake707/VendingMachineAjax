function setId(itemId){
  $('#itemIdCenter').val("");
  var newItem = $('#itemIdCenter');
  return newItem.val(itemId);

}

function getItemId(){
  var itemId = $('#itemIdCenter').val();
  return itemId;
}

function setWallet(){
  var wallet = $('#number').val();
  return wallet;
}

function resetValues(){

  $('#number').val('0');
  $('#itemIdCenter').val('');
  $('#changeMessage').val('');
  $('#messageCenter').val('');
}


function machineButton(itemNumber, itemName, itemPrice, itemQuantity) {
  var data = `<div class="col-md-4 item" data-itemId="1">
    <div class="itemInfo">
    <button onClick="setId(${itemNumber})" type="button" class="btn btn-warning" id="${itemNumber}">
    ${itemNumber}
    <br/>
    ${itemName}
    <br/>
    ${itemPrice}
    <br/>
    ${itemQuantity}
    <br/>
    </button>
  </div>`;


  return data;
}


function loadItems(){

  $.ajax({
    type:'GET',
    url:"http://localhost:8080/items",
    success: function(data){
      var vendButton = $('#items');
      //go through each item in the items array
      //the second parameter is the function that will run on each item from the itemsArray
                      //function(index,itemInfo)
                      vendButton.empty();
      $.each(data,function(index, item){

        var itemNumber = item.id;
        var itemName = item.name;
        var itemPrice = item.price;
        var itemQuantity = item.quantity;

        vendButton.append(machineButton(itemNumber,itemName, itemPrice, itemQuantity));


      });
    },

  });
}

function vend(event){
  event.preventDefault();
  // access moneyinput screen to grab price and id# of selected button
  var amount = setWallet();
  var id = getItemId();



  $.ajax({
      type:'GET',
      url:'http://localhost:8080/money/' + amount + '/item/' + id,
      success: function(data){
        var changeReturn = $('#changeMessage');
        var messageCenter = $('#messageCenter');

          //isolate each Value

          var quarters = data.quarters;
          var nickels = data.nickels;
          var dimes = data.dimes;
          var pennies = data.pennies;

          //append each of the values to the change return input window
          changeReturn.val(displayChange(quarters,nickels,dimes,pennies));

          messageCenter.val('Thank You!');

          loadItems();
        },
        error:function(message){
          $('#messageCenter').val(message.responseJSON.message);
        }

        });
      }


function displayChange (quarters, nickels, dimes, pennies){
  var data = `You have: ${quarters} quarters, ${nickels} nickels, ${dimes} dimes, and ${pennies}`;
  return data;

}


$(document).ready(function() {

  $('#addDollars').click(function() {
    var value = parseFloat (document.getElementById('number').value);
    value++;
    document.getElementById('number').value = value.toFixed(2);
    return value;
   });

   $('#AddQuarter').click(function() {
     var value = parseFloat (document.getElementById('number').value);
     value += .25;
     document.getElementById('number').value = value.toFixed(2);
     return value;
    });

    $('#addNickel').click(function() {
      var value = parseFloat (document.getElementById('number').value);
      value += .05;
      document.getElementById('number').value = value.toFixed(2);
      return value;
     });

     $('#addDime').click(function() {
       var value = parseFloat (document.getElementById('number').value);
       value += .10;
       document.getElementById('number').value = value.toFixed(2);
       return value;
      });

      loadItems();

      //vend function will run on submit click
      $(document).on("click", '#submit',vend);

      //also need reset/changeReturn function
      //this should reset the value of the money input field
      //should also call load again so that new values are displayed after
      //program interacts with the server
      $(document).on("click", '#changeReturn',resetValues);




 });
