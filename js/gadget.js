var ajax_intervalId = -1;

var console = {
    log: function(text) {
        $('#widget_text .text').text($('#widget_text .text').text() + ', ' + text);
    }
};

function loadMain()
{
    System.Gadget.settingsUI        = "settings.html";
    System.Gadget.onSettingsClosed  = settingsClosed;
    
    initialControl();
}

function initialControl()
{
    widget_bg.src = "url(images/cover_small.png)";

    car_bg.src = "url(images/ggr-logo.png)";
    car_bg.opacity = 50;

    widget_text.style.visibility = "hidden";

    settingsChanged();
}

function renderDate(dateString) {
    var index = dateString.indexOf('-');

    //console.log(index);

    if (index > -1) {
        var year = dateString.substring(0, index);
        var date = dateString.substring(index + 1);

        renderYearDate(year, date);
    }
}

function renderYearDate(year, date) {
    $('#widget_text .year').text(year);
    $('#widget_text .date').text(date);
}

function renderText() {
    if (setting.car_color) {
        car_bg.src = "url(images/" + setting.car_color + ".png)";
        car_bg.opacity = 30;

        widget_text.style.visibility = 'visible';

        loadDeliveryDate();
    }
}

function loadDeliveryDate() {
    $('#widget_text .text').text('讀取中...');
    renderYearDate('--', '--');

    jQuery.support.cors = true;
    var jqxhr = $.getJSON('http://gogoro2-delivery-json.herokuapp.com/json/get', function (data) {
        $('#widget_text .text').text('目前交車至');

        var find = {};
        switch (setting.car_color) {
            case 'g2-white':
                find.name = 'Gogoro 2';
                find.color = '白色';
                break;
            case 'g2-black':
                find.name = 'Gogoro 2';
                find.color = '灰色';
                break;
            case 'g2plus-white':
                find.name = 'Gogoro 2 Plus';
                find.color = '白色';
                break;
            case 'g2plus-black':
                find.name = 'Gogoro 2 Plus';
                find.color = '灰色';
                break;
            case 'g2plus-red':
                find.name = 'Gogoro 2 Plus';
                find.color = '紅色';
                break;
            case 'g2plus-blue':
                find.name = 'Gogoro 2 Plus';
                find.color = '藍色';
                break;
            case 'g2plus-green':
                find.name = 'Gogoro 2 Plus';
                find.color = '黃色';
                break;
            case 'g2plus-orange':
                find.name = 'Gogoro 2 Plus';
                find.color = '橘色';
                break;
        }

        $.each(data, function(index, item) {
            if (item.name == find.name && item.color == find.color) {
                renderDate(item.date);
            }
        });
    }).fail(function(jqxhr, status, error) {
        $('#widget_text .text').text('讀取發生錯誤');
        renderYearDate('--', '--');
    });
    
    jqxhr.complete(function() {
        if (ajax_intervalId != -1) {
            window.clearTimeout(ajax_intervalId);
        }

        var interval = 60 * 60 * 1000;
        ajax_intervalId = window.setTimeout(loadDeliveryDate, interval);
    });
}

function settingsClosed() {
    settingsChanged();
}

function settingsChanged() {
    setting.load();

    renderText();
}