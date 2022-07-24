

$(document).ready(function () {
  $("#btn").click(function () {
    $("#add_products").toggle();
  });

  $('#cls').click(function () {
    $('#add_products').hide();
  })

  $("#signup_btn").click(function () {
    $("#signup_form").toggle();
  });

  $("#edit").click(function () {
    $("#myModal").toggle();
  });

  $('#cls').click(function () {
    $('#myModal').hide();
  })
 




  $("#formid").submit(function (event) {

    /* stop form from submitting normally */
    event.preventDefault();

    $.ajax({
      url: '/admin/add-address',
      method: 'post',
      data: $("#formid").serialize(),
      success: (response) => {
        let address = response.added
        $('#formid').hide()
        $('#addressid').text(address.fname + address.lname + address.address)
       // console.log(response.data)
        
        
        
      }
    })
  });

  $("#orderSummary").click(function () {

    

    $.ajax({
      url: '/admin/order-summary',
      method: 'post',
      data: {
        status:true
      },
      success: (response) => {
        
          
        
      }
    })
  });
  


  $('.tab-link').click(function(){
    var contClass = $(this).data('div');
    $('.content').hide().filter('.' + contClass).show()
    
 })

})


function myFunction(event) {

  document.getElementById('img-s').src = URL.createObjectURL(event.target.files[0])
}



function addToCart(ProId) {
  $.ajax({
    url: '/admin/add-to-cart/' + ProId,
    method: 'get',
    success: (response) => {

      if (response.status) {
        let count = $('#cart-count').html()
        count = parseInt(count) + 1
        $('#cart-count').html(count)
      }
    }

  })
}

function changeQuantity(cartId, proId, counte) {
  $.ajax({
    url: '/admin/change-product-quantity/',
    data: {
      cart: cartId,
      product: proId,
      count: counte
    },
    method: 'post',
    success: (data) => {

      if (data.item == proId) {

        $('#' + data.item).val(data.quantity)
        $("#total").text(data.total);
        //$('#total').innerHTML=data.total
        if (data.quantity <= 1) {
          $('#dec' + data.item).hide()
        } else {
          $('#dec' + data.item).show()
        }
      }


    }

  })
}

