import $ from 'jquery';
import slick from 'slick-carousel';
import '../../node_modules/@fancyapps/fancybox/dist/jquery.fancybox.min';
import '../../src/js/lib/jquery.event.move';
import '../../src/js/lib/jquery.twentytwenty';
import '../../node_modules/jquery-popup-overlay/jquery.popupoverlay';
import '../../node_modules/jquery-validation/dist/jquery.validate.min';
import '../../node_modules/jquery-mask-plugin/dist/jquery.mask.min';


let navigationMenu = document.querySelector('.drp-btn__menu');
let menuButton = document.querySelector('#nav');
menuButton.addEventListener('click', function() {
  navigationMenu.classList.toggle('active');
  menuButton.classList.toggle('active');
});

$(document).ready(function() {
  //---- TWENTY-TWENTY ----
  $('#reviews').twentytwenty();
  //---- DROP-MENU ----
  $('.faq-screen__head').click(function() {
    if ($(this).hasClass('active')) {
      $(this).removeClass('active');
    }
    else {
      $('.faq-screen__head').removeClass('active');
      $(this).addClass('active');
    }
    $('.faq-scree__toggle').addClass('.faq-scree__toggle_active');
    $(this).next().slideToggle();
    $('.faq-screen__toggle').not($(this).next()).slideUp();
  });

  //---- SLIDER - PARTNERS ----
  $('.slider-screen__partners_wrapper').slick({
    dots: true,
    arrows: false,
    slidesToShow: 3,
    slidesToScroll: 3,
    rows: 2,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 9,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 2,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
          dots: true
        }
      }
    ]
  });
  //---- SLIDER - REVIEWS ----
  $('.reviews__slider').slick({
    arrows: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  });
  //---- SLIDER - TABS ----
  $('.slider-for').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    asNavFor: '.slider-nav'
  });
  $('.slider-nav').slick({
    slidesToShow: 2,
    slidesToScroll: 1,
    asNavFor: '.slider-for',
    arrows: false,
    focusOnSelect: true
  });
  $('div[data-slide]').click(function(e) {
    e.preventDefault();
    var slideno = $(this).data('slide');
    $('.slider-nav').slick('slickGoTo', slideno - 1);
    $('.slider-for').slick('slickGoTo');
  });
  //---- TABS ----
  $('.slider-screen__tabs_content .tab_item').not(':first').hide();
  $('.slider-screen__tabs_nav .tab').click(function() {
    $('.slider-screen__tabs_nav .tab').removeClass('active').eq($(this).index()).addClass('active');
    $('.slider-screen__tabs_content .tab_item').hide().eq($(this).index()).fadeIn();
  }).eq(0).addClass('active');
  //---- MODAL ----
  $('input[type="tel"]').mask('+7 (000) 000-00-00');
  jQuery.validator.addMethod('phoneno', function(phone_number, element) {
    return this.optional(element) || phone_number.match(/\+[0-9]{1}\s\([0-9]{3}\)\s[0-9]{3}-[0-9]{2}-[0-9]{2}/);
  }, 'Введите Ваш телефон');

  $('.form').each(function(index, el) {
    $(el).addClass('form-' + index);

    $('.form-' + index).validate({
      rules: {
        phone: {
          required: true,
          phoneno: true
        },
        name: 'required',
      },
      messages: {
        name: 'Введите Ваше имя',
        tel: 'Введите Ваш телефон',
      },
      submitHandler: function(form) {
        var t = $('.form-' + index).serialize();
        ajaxSend('.form-' + index, t);
      }
    });
    $('.modal').popup({
      transition: 'all 0.3s',
      outline: true, // optional
      focusdelay: 400, // optional
      vertical: 'top', //optional
      onclose: function() {
        $(this).find('label.error').remove();
      }
    });
  });
  function ajaxSend(formName, data) {
    jQuery.ajax({
      type: 'POST',
      url: 'sendmail.php',
      data: data,
      success: function() {
        $('.modal').popup('hide');
        $('#thanks').popup('show');
        setTimeout(function() {
          $(formName).trigger('reset');
        }, 2000);
      }
    });
  };

  function calc() {
    var $choose     = parseInt($('#choose option:selected').val(), 10),
      $people     = parseInt($('#people').val(), 10),
      $night      = parseInt($('#night').val(), 10),
      $priceToDay = $('#price-to-day'),
      $fullPrice  = $('#full-price'),
      $payToDay,
      $fullPay;

    function step1() {
      var stepOne,itog,price;

      if ($choose === 3) {price = 220;}
      if ($choose === 15) {price = 180;}
      if ($choose === 4) {price = 220;}
      if ($choose === 5) {price = 230;}
      if ($choose === 6) {price = 230;}
      if ($choose === 13) {price = 240;}

      if ($night < 5 ) stepOne = price * 1.5;
      if ($night >= 5 && $night < 10) stepOne = price * 1.4;
      if ($night >= 10 && $night < 15) stepOne = price * 1.3;
      if ($night >= 15 && $night < 20) stepOne = price * 1.2;
      if ($night >= 20 && $night < 25) stepOne = price * 1.1;
      if ($night >= 25) stepOne = price * 1;
      itog = stepOne * $night;
      return itog;
    }

    function step2() {
      var stepTwo,itog;
      if ($people <= 50) stepTwo = step1() * 1;
      if ($people >= 51 && $people <= 99) stepTwo = step1() * 0.95;
      if ($people >=100) stepTwo = step1() * 0.9;
      itog = stepTwo * $people;
      return itog;
    }
    return step2();
  }
  $('#night, #people').on('keyup, change', function() {
    if ( $('#night').val() === 0 || $('#people').val() === 0) {
      $('#full-price').html('0');
      $('#price-to-day').html('0');
    } else {
      $('#full-price').html(calc().toFixed(0));
      $('#price-to-day').html((calc() / $('#night').val() / $('#people').val()).toFixed(0));
    }
  });
  $('#choose').on('keyup, change', function() {
    //
    if ( $('#night').val() === 0 || $('#people').val() === 0) {
      $('#full-price').html('0');
      $('#price-to-day').html('0');
    } else {
      // debugger;
      $('#full-price').html(calc().toFixed(0));
      $('#price-to-day').html((calc() / $('#night').val() / $('#people').val()).toFixed(0));
    }
  });
});
