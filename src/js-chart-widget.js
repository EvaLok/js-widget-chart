var __js_chart_widget = {};

(function(){
    var chartLibLocation = (
        'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.3/Chart.js'
    );
    var _chart;

    var dataLocation = 'fake-data-source.json';
    var data = {};
    __js_chart_widget = {
        init: init
    };

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

        if( requestIds.length > 0 ){
            loadData(requestIds, function(){
                renderCharts(elements, ids);
            });
        } else {
            renderCharts(elements, ids);
        }
    }

    function renderCharts( elements, ids ){
        var elementsLength = elements.length;

        for( var i = 0; i < elementsLength; i++ ){
            var element = elements[i];
            var identifier = element.getAttribute('data-identifier');
            var chartType = element.getAttribute('data-chart-type');
            var params = data[ids[i]];

            switch( chartType ){
                case 'chartjs':
                    renderChartChartjs({
                        element: element,
                        type: params.type,
                        labels: params.labels,
                        datasets: params.datasets
                    });
                    break;

                default:
                    renderChartDefault({
                        element: element,
                        title: ids[i],
                        labels: params.labels,
                        points: params.points
                    });
            }
        }
    }

    function renderChartChartjs( _params ){
        var params = _params;

        if( typeof params.options !== 'object' ){
            params.options = {};
        }

        new Chart(params.element, {
            type: 'line',
            data: {
                labels: params.labels,
                datasets: params.datasets
            },
            options: params.options
        });
    }

    function renderChartDefault( params ){
        new Chart(params.element, {
            type: 'line',
            data: {
                labels: params.labels,
                datasets: [{
                    label: params.title,
                    data: params.points
                }]
            }
        });
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
