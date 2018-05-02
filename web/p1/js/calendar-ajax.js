$(document).ready(function() {

  // for adding events
  $("#event-create").dialog({
    autoOpen: false,
    height: 275,
    width: 350,
    modal: true,
    buttons: {
      // callback for actually adding
      'Create Event': function() {
        // date regex in MM-DD-YYYY form
        var regex = /^\s*(0?[1-9]|10|11|12)\/(0?[1-9]|[12]\d|3[01])\/(\d{4})\s*$/;
        var from = regex.exec($('#from-create').val());
        var to = regex.exec($('#to-create').val());
        // if happy with input...
        if(from && to && $.trim($('#title-create').val()) != '') {
          // ...do ajax post to server
          $.ajax({
            url: SERVER_SIDE_SCRIPT,
            type: 'POST',
            dataType: 'json',
            data: {
              'action': 'create',
              'title': $('#title-create').val(),
              // start == 00:00:00 of selected day, end = 23:59:50 of stop day
              'start': new Date(parseInt(from[3],10), parseInt(from[1],10) - 1, parseInt(from[2],10)).getTime() / 1000,
              'end': new Date(parseInt(to[3],10), parseInt(to[1],10) - 1, parseInt(to[2],10), 23, 59, 59).getTime() / 1000
            },
            // if we get a response
            success: function(response) {
              // if that response is good
              if(response.result) {
                $('#event-create').dialog('close');
                $('#calendar').fullCalendar('refetchEvents');
              // otherwise error
              } else {
                $('#error-message').html(response.message).dialog('open');
              }
            },
            // if anything goes wrong during request process
            error: function(request, status) {
              $('#error-message').html(status).dialog('open');
            }
          });
        // yell at user for bad input
        } else {
          $('#error-message').html('Please enter a valid title and dates').dialog('open');
        }
      },
      // simply close the window on a cancel
      'Cancel': function() {
        $(this).dialog('close');
      }
    }
  });

  // for displaying exiting events (entry point for delete)
  $("#event-details").dialog({
    autoOpen: false,
    height: 275,
    width: 350,
    modal: true,
    buttons: {
      // simply dismiss if canceling
      'Close': function() {
        $(this).dialog('close');
      },
      // initialite delete
      'Delete Event': function() {
        $('#event-delete').text('Delete "' + $('#title-details').val() + '"?').dialog('open');
      }
    }
  });

  // delete confirmation
  $('#event-delete').dialog({
    autoOpen: false,
    resizable: false,
    height: 140,
    modal: true,
    buttons: {
      // attempt delete post on click
      'Delete': function() {
        $.ajax({
          url: SERVER_SIDE_SCRIPT,
          type: 'POST',
          dataType: 'json',
          data: {
            'action': 'delete',
            'id': $('#id-details').val()
          },
          // if we get a response 
          success: function(response) {
            $('#event-delete').dialog('close');
            // successful delete
            if(response.result) {
              $('#event-details').dialog('close');
              $('#calendar').fullCalendar('refetchEvents');
            // something went wrong
            } else {
              $('#error-message').html(response.message).dialog('open');
            }
          },
          // something went wrong in request
          error: function(request, status) {
            $('#event-delete').dialog('close');
            $('#error-message').html(status).dialog('open');
          }
        }); 
      },
      // simply dismiss on cancel
      'Cancel': function() {
        $(this).dialog('close');
      }
    }
  });

  // used for displaying error messages
  $("#error-message").dialog({
    autoOpen: false,
    modal: true,
    buttons: {
      OK: function() {
       $(this).dialog('close');
      }
    }
  });
    

  // setup full calendar
  $('#calendar').fullCalendar({
    // do ajax/json requests against server script
    events: SERVER_SIDE_SCRIPT,
    header: {
      left: 'prev,next',
      center: 'title',
      right: 'today'
    },
    // clicking an event brings up detail window, ability to delete it
    eventClick: function(event, jsEvent, view) {
      $('#title-details').val(event.title);
      $('#id-details').val(event.id);
      $('#from-details').val($.fullCalendar.formatDate(event.start, 'MM/dd/yyyy'));
      $('#to-details').val($.fullCalendar.formatDate(event.end || event.start, 'MM/dd/yyyy'));
      $('#event-details').dialog('open');
    },
    // clicking a day brings up add window
    dayClick: function(date, allDay, jsEvent, view ) {
      $('#title-create').val('');
      $('#from-create,#to-create').val($.fullCalendar.formatDate(date, 'MM/dd/yyyy'));
      $('#event-create').dialog('open');
    }
  });
		
});
