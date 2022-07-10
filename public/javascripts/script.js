$(document).ready(function(){
    $("#btn").click(function(){
        $("#add_products").toggle();
      });

    $('#cls').click(function(){
        $('#add_products').hide();
    })

    $("#signup_btn").click(function(){
        $("#signup_form").toggle();
      });

      $("#edit").click(function(){
        $("#myModal").toggle();
      });

    $('#cls').click(function(){
        $('#myModal').hide();
    })

})