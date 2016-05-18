(function(){
    var _chart;

    init();

    function init(){
        if( typeof Chart !== 'object' ) {
            var script_tag = document.createElement('script');
            script_tag.setAttribute("type","text/javascript");
            script_tag.setAttribute("src",
                "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.3/Chart.js");

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

        var element = document.getElementById("demoChart1");
        var chart = new Chart(element, {
            type: 'bar',
            data: {
                labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                datasets: [{
                    label: '# of Votes',
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
})();
