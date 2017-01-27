(function() {
  function generateDashboardWidget(element) {
    var element = jQuery(element)
    var container = element.find('.inside')
    jQuery('.chart').addClass('hidden')
    // Adding a class to the widget element so that classes are only used in the stylesheet
    jQuery('#tinypng_dashboard_widget').addClass('tiny_dashboard_widget')
    attachHandlers(container);
    retrieveStats(container);
  }

  function retrieveStats(container) {
    jQuery.ajax({
      url: ajaxurl,
      type: 'POST',
      data: {
        _nonce: tinyCompress.nonce,
        action: 'tiny_get_optimization_statistics',
        id: '#tinypng_dashboard_widget'
      },
      success: function(data) {
        if (data == 0) {
          container.append("<p> An error occured. </p>")
        } else {
          renderWidget(data, container);
        }
      },
      error: function() {
        container.append("<p> An error occured. </p>")
      }
    })
  }

  function attachHandlers(container) {
   setContainerClass(container);
   jQuery(window).resize(function(){setContainerClass(container)});
   jQuery('#tinypng_dashboard_widget .hndle').click(function() {
    jQuery(this).siblings('.inside').removeClass('mobile')
   })
  }

  function setContainerClass(container) {
     if (jQuery(container).width() < 400) {
        jQuery(container).addClass('mobile')
     } else if (jQuery(container).width() < 490 && jQuery(container).width() >= 400) {
        jQuery(container).addClass('tablet')
        jQuery(container).removeClass('mobile')
     } else if (jQuery(container).width() >= 490) {
        jQuery(container).removeClass('tablet').removeClass('mobile')
     }
  }

  function renderWidget(data, container) {
    var stats = jQuery.parseJSON(data);
    var savings = savingsPercentage(stats);
    var libraryOptimized = optimizedPercentage(stats);
    renderContent(libraryOptimized, stats, savings);
    renderChart(savings);
    jQuery('#optimization-chart').show();
    jQuery('#widget-spinner').attr('class', 'hidden');
  }

  function renderPercentage(percentage) {
    jQuery('#savings-percentage').find('span').html(percentage)
  }

  function renderContent(percentage, stats, savingsPercentage) {
    renderPercentage(savingsPercentage);
    if ( 0 == stats['uploaded-images'] + stats['available-unoptimised-sizes'] ) {
      jQuery('#tinypng_dashboard_widget').addClass('no-images-uploaded')
    } else if ( percentage == 0 ) {
       jQuery('#tinypng_dashboard_widget').addClass('not-optimized')
    } else if ( percentage == 100 ) {
      jQuery('#tinypng_dashboard_widget').addClass('full-optimized')
      jQuery('#ie8-compressed').find('span').html(savingsPercentage)
    } else {
      jQuery("#uploaded-images").html( stats['uploaded-images'] )
      jQuery("#unoptimised-sizes").html( stats['available-unoptimised-sizes'] )
      jQuery('#tinypng_dashboard_widget').addClass('half-optimized')
    }
  }

  function chartOptions(percentage) {
    chart = {};
    chart['size'] = 160;
    chart['radius'] = chart['size'] / 2 * 0.9;
    chart['main-radius'] = chart['radius'] * 0.88;
    chart['circle-size'] = 2 * Math.PI * chart['main-radius'];
    chart['dash-array-size'] = percentage / 100 * chart['circle-size'];
    return chart
  }

  function optimizedPercentage(stats) {
    if ( 0 != stats['unoptimized-library-size'] ) {
      return Math.round((stats['optimized-image-sizes'] / (stats['optimized-image-sizes'] + stats['available-unoptimised-sizes']) * 100), 0);
    } else {
      return 0
    }
  }

  function savingsPercentage(stats) {
    if ( 0 != stats['unoptimized-library-size'] ) {
      return 100 - Math.round((stats['optimized-library-size'] / stats['unoptimized-library-size'] * 1000))/ 10;
    } else {
      return 0
    }
  }

  function renderChart(savingsPercentage) {
    chart = chartOptions(savingsPercentage);
    jQuery('#optimization-chart svg circle.main').css('stroke-dasharray', chart['dash-array-size'] + ' ' + chart['circle-size'])
    style =
            " @keyframes shwoosh {" +
              " from { stroke-dasharray: 0 " + chart['circle-size'] + "}" +
              " to { stroke-dasharray:" + chart['dash-array-size'] + " " + chart['circle-size'] + "}}"

    // JQuery bug where you cannot append to style tag https://bugs.jquery.com/ticket/9832
    try {
      jQuery('#tinypng_dashboard_widget .inside style').append(style);
    } catch(err) {

    }
  }

  // Check if widget is loaded
  if (jQuery('#tinypng_dashboard_widget').length) {
    generateDashboardWidget('#tinypng_dashboard_widget')
  }
}).call()
