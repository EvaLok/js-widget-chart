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
        var requestIds = [];

        for( var i = 0; i < elementsLength; i++ ){
            var identifier = elements[i].getAttribute('data-identifier');
            var rawData = elements[i].getAttribute('data-raw');

            // use raw data
            if( rawData ){
                data[identifier] = JSON.parse(rawData);
            }

            // load from resource
            else {
                requestIds.push(identifier);
            }

            ids.push(identifier);
        }

        loadData(requestIds, function(){
            renderCharts(elements, ids);
        });
    }

    function renderCharts( elements, ids ){
        var elementsLength = elements.length;

        for( var i = 0; i < elementsLength; i++ ){
            var identifier = elements[i].getAttribute('data-identifier');

            new Chart(elements[i], {
                type: 'line',
                data: {
                    labels: data[ids[i]].labels,
                    datasets: [{
                        label: (
                            'a chart for element '
                            + ids[i]
                        ),
                        data: data[ids[i]].points
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
        xobj.open('GET', dataLocation + '?ids=' + ids.join(','), true);
        xobj.onreadystatechange = function() {
            if (xobj.readyState == 4 && xobj.status == "200") {
                var json = JSON.parse(xobj.responseText);
                for( var k in json ){
                    data[k] = json[k];
                }

                callback();
            }
        };
        xobj.send(null);
    }
})();
