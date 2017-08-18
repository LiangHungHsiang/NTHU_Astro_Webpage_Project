//導覽列自動收起//
////////////////

var bodyClass = document.body.classList,
    lastScrollY = 0;
window.addEventListener('scroll', function(){
  var st = this.scrollY;
  // 判斷是向上捲動，而且捲軸超過 200px
  if( st < lastScrollY) {
    bodyClass.remove('hideUp');
  }else{
    bodyClass.add('hideUp');
  }
  lastScrollY = st;
});

//星空藝廊相片輪播器//
///////////////////
$(document).ready( function() {
    $('#myCarousel').carousel({
		interval:   4000
	});
	
	var clickEvent = false;
	$('#myCarousel').on('click', '.nav a', function() {
			clickEvent = true;
			$('.nav li').removeClass('active');
			$(this).parent().addClass('active');		
	}).on('slid.bs.carousel', function(e) {
		if(!clickEvent) {
			var count = $('.nav').children().length -1;
			var current = $('.nav li.active');
			current.removeClass('active').next().addClass('active');
			var id = parseInt(current.data('slide-to'));
			if(count == id) {
				$('.nav li').first().addClass('active');	
			}
		}
		clickEvent = false;
	});
});

//天文營網址自動更新
/////////////////
var today = new Date();
var astrocamp_url = "http://my.nthu.edu.tw/~res9202/astrocamp/{{year}}";
var this_year = (today.getYear() < 1900) ? (1900 + today.getYear()) : today.getYear();
var astrocamp_current_url = astrocamp_url.replace("{{year}}", this_year);
$("a.astrocamp").attr("href", astrocamp_current_url);

//Smooth Scroll//
/////////////////
// Select all links with hashes
$('a[href*="#"]')
  // Remove links that don't actually link to anything
  .not('[href="#"]')
  .not('[href="#0"]')
  .click(function(event) {
    // On-page links
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
      && 
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000, function() {
          // Callback after animation
          // Must change focus!
          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) { // Checking if the target was focused
            return false;
          } else {
            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
          };
        });
      }
    }
  });

//skrollr初始化//
////////////////
var isMobile = false; //initiate as false
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;

if(isMobile == false){
  var s = skrollr.init();
}else{
  var s = 0;
}

//自動更新行事曆//
////////////////
var eventTemplate = "<li data-bottom-top='transform: translateY(-50px);opacity: 0' data-center='transform: translateY(0px);opacity: 1'><div class='timeline-badge danger'><i class='glyphicon glyphicon-thumbs-up'></i></div><div class='timeline-panel'><div class='timeline-heading'><h4 class='timeline-title'>{{StartYear}}.{{StartMonth}}.{{StartDay}} {{StartHour}}:{{StartMin}} ~ {{EndMonth}}.{{EndDay}} {{EndHour}}:{{EndMinute}}</h4></div><div class='timeline-body'><p>{{EventName}}</p></div></div></li>";
var eventInvertedTemplate = "<li class='timeline-inverted' data-bottom-top='transform: translateY(-50px);opacity: 0' data-center='transform: translateY(0px);opacity: 1'><div class='timeline-badge warning'><i class='glyphicon glyphicon-thumbs-up'></i></div><div class='timeline-panel'><div class='timeline-heading'><h4 class='timeline-title'>{{StartYear}}.{{StartMonth}}.{{StartDay}} {{StartHour}}:{{StartMin}} ~ {{EndMonth}}.{{EndDay}} {{EndHour}}:{{EndMinute}}</h4></div><div class='timeline-body'><p>{{EventName}}</p></div></div></li>";
var data_url = "http://my.nthu.edu.tw/~res9202/jsonEventList.json"
var eventData;

$.ajax(
  {
    url: data_url,
    success: function(res){
      eventData = JSON.parse(res);
      for(var i = 0; i < eventData.length; i++){
        var item = eventData[i];

        if(i%2 == 0){
          var now_item = 
            eventTemplate.replace("{{StartYear}}", item.DTSTART.Year)
                         .replace("{{StartMonth}}", item.DTSTART.Month)
                         .replace("{{StartDay}}", item.DTSTART.Day)
                         .replace("{{StartHour}}", item.DTSTART.Hour)
                         .replace("{{StartMin}}", item.DTSTART.Minute)
                         .replace("{{EndMonth}}", item.DTEND.Month)
                         .replace("{{EndDay}}", item.DTEND.Day)
                         .replace("{{EndHour}}", item.DTEND.Hour)
                         .replace("{{EndMinute}}", item.DTEND.Minute)
                         .replace("{{EventName}}", item.SUMMARY); 
        }
        if(i%2 != 0){
          var now_item = 
            eventInvertedTemplate.replace("{{StartYear}}", item.DTSTART.Year)
                                 .replace("{{StartMonth}}", item.DTSTART.Month)
                                 .replace("{{StartDay}}", item.DTSTART.Day)
                                 .replace("{{StartHour}}", item.DTSTART.Hour)
                                 .replace("{{StartMin}}", item.DTSTART.Minute)
                                 .replace("{{EndMonth}}", item.DTEND.Month)
                                 .replace("{{EndDay}}", item.DTEND.Day)
                                 .replace("{{EndHour}}", item.DTEND.Hour)
                                 .replace("{{EndMinute}}", item.DTEND.Minute)
                                 .replace("{{EventName}}", item.SUMMARY);
        }
        $("ul.timeline").append(now_item);
      }
    }
  }
)









