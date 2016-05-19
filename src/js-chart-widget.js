(function(){
    var chartLibLocation = (
        'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.3/Chart.js'
    );
    var _chart;

    var dataLocation = 'fake-data-source.json';
    var data = {};

    init();

    function init(){
        if( typeof Chart !== 'object' ) {
            loadScript(chartLibLocation, main);
        } else {
            main();
        }
    }

    function main(){
        _chart = Chart;

        var elements = document.getElementsByClassName("js-chart-widget");
        var elementsLength = elements.length;
        var ids = [];

        for( var i = 0; i < elementsLength; i++ ){
            ids.push(elements[i].getAttribute('data-identifier'));
        }

        loadData(ids, function(){
            renderCharts(elements);
        });
    }

    function renderCharts( elements ){
        var elementsLength = elements.length;

        for( var i = 0; i < elementsLength; i++ ){
            new Chart(elements[i], {
                type: 'line',
                data: {
                    labels: data[elements[i].getAttribute('data-identifier')].labels,
                    datasets: [{
                        label: (
                            '# of Votes for element '
                            + elements[i].getAttribute('data-identifier')
                        ),
                        data: data[elements[i].getAttribute('data-identifier')].points
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

    function loadScript(script, callback){
        var script_tag = document.createElement('script');
        script_tag.setAttribute("type","text/javascript");
        script_tag.setAttribute("src", script);

        // non-standard browsers
        if (script_tag.readyState) {
            script_tag.onreadystatechange = function () { // For old versions of IE
                if (this.readyState == 'complete' || this.readyState == 'loaded') {
                    callback();
                }
            };
        } else { // standard browsers
            script_tag.onload = callback;
        }

        // Try to find the head, otherwise default to the documentElement
        (
            document.getElementsByTagName("head")[0]
            || document.documentElement
        ).appendChild(script_tag);
    }

    function loadData(ids, callback){
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', dataLocation, true);
        xobj.onreadystatechange = function() {
            if (xobj.readyState == 4 && xobj.status == "200") {
                var json = JSON.parse(xobj.responseText);
                for( var k in json ){
                    data[k] = json[k];
                }

                console.log(data);

                callback();
            }
        };
        xobj.send(null);
    }
})();
