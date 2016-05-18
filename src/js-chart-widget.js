(function(){
    var chartLibLocation = (
        'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.3/Chart.js'
    );
    var _chart;

    init();

    function init(){
        if( typeof Chart !== 'object' ) {
            var script_tag = document.createElement('script');
            script_tag.setAttribute("type","text/javascript");
            script_tag.setAttribute("src", chartLibLocation);

            // non-standard browsers
            if (script_tag.readyState) {
                script_tag.onreadystatechange = function () { // For old versions of IE
                    if (this.readyState == 'complete' || this.readyState == 'loaded') {
                        main();
                    }
                };
            } else { // standard browsers
                script_tag.onload = main;
            }
            // Try to find the head, otherwise default to the documentElement
            (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
        } else {
            main();
        }
    }

    function main(){
        _chart = Chart;

        var elements = document.getElementsByClassName("js-chart-widget");
        var elementsLength = elements.length;

        for( var i = 0; i < elementsLength; i++ ){
            new Chart(elements[i], {
                type: 'line',
                data: {
                    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                    datasets: [{
                        label: (
                            '# of Votes for element '
                            + elements[i].getAttribute('data-identifier')
                        ),
                        data: [12, 19, 3, 5, 2, 3]
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:true
                            }
                        }]
                    }
                }
            });
        }
    }
})();
