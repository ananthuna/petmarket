

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
        $('#addressid').text(address.fname + ' ' + address.lname + ',' + address.address)

        $("#orderSummary").click(function () {



          $.ajax({
            url: '/admin/order-summary',
            method: 'post',
            data: {
              status: true
            },
            success: (response) => {

              $("#paymentid").submit(function (event) {

                /* stop form from submitting normally */
                event.preventDefault();


                $.ajax({
                  url: '/admin/payment-method',
                  method: 'post',
                  data: {
                    paymethod: $("#paymentid").serialize(),
                    address

                  },
                  success: (response) => {
                    if (response.method == 'COD') {
                      window.location.href = '/admin/orderList'
                    }else{
                      razorpay(response)
                    
                    }

                  }
                })
              });


            }
          })
        });



      }
    })
  });
  function razorpay(order){
    
    
    var options = {
      "key": "rzp_test_0qmnQXZx2avPrO", // Enter the Key ID generated from the Dashboard
      "amount": "amount", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      "currency": "INR",
      "name": "PetMarket",
      "description": "Test Transaction",
      "image": "https://example.com/your_logo",
      "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      "handler": function (response){
          alert(response.razorpay_payment_id);
          alert(response.razorpay_order_id);
          alert(response.razorpay_signature);
          verifyPayment(response,order)
      },
      "prefill": {
          "name": "Gaurav Kumar",
          "email": "gaurav.kumar@example.com",
          "contact": "9999999999"
      },
      "notes": {
          "address": "Razorpay Corporate Office"
      },
      "theme": {
          "color": "#3399cc"
      }
  };
  console.log(options)
  var rzp1 = new Razorpay(options);
  rzp1.open();
  }

  function verifyPayment(payment,order){
    $.ajax({
        url:'/admin/verify_payment',
        method:'post',
        data:{
          payment,
          order
        }
    })
  }








  $('.tab-link').click(function () {
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

