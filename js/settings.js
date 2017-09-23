var Settings = {};
var setting = new ggr2Settings();

var makeOption = function (text, value) {
    var option = $(document.createElement('option'));
    option.attr({ 'value': value }).text(text);

    return option;
};
// var console = {
//     log: function(text) {
//         $('#debug').text(text);
//     }
// };

function loadSettingFromDisk()
{
    if (System.Gadget.Settings.read("SettingsExist"))
    {
        this.car_model = System.Gadget.Settings.readString("car_model");
        this.car_color = System.Gadget.Settings.readString("car_color");
    }
};
function saveSettingToDisk()
{
    System.Gadget.Settings.write("SettingsExist", true);
    System.Gadget.Settings.writeString("car_model", this.car_model);
    System.Gadget.Settings.writeString("car_color", this.car_color);
};

////////////////////////////////////////////////////////////////////////////////
//
// create ggr2 setting object
//
////////////////////////////////////////////////////////////////////////////////
function ggr2Settings()
{   
    this.save = saveSettingToDisk;
    this.load = loadSettingFromDisk;
    this.car_model = '';
    this.car_color = '';
}

Settings.SettingsClosing = function(event) {
    var $car_model = $('#car_model');
    var $car_color = $('#car_color');

    if (event.closeAction == event.Action.commit)
    {
        setting.car_model = $car_model.val();
        setting.car_color = setting.car_model == '' ? '' : $car_color.val();

        setting.save();
    }
};

Settings.SettingsLoad = function() {
    var $car_model = $('#car_model');
    var $car_color = $('#car_color');
    
    setting.load();
    
    var resetCarColor = function() {
        switch ($car_model.val()) {
            case 'g2':
                $car_color.append(makeOption('白色', 'g2-white'));
                $car_color.append(makeOption('灰色', 'g2-black'));
                break;
            case 'g2plus':
                $car_color.append(makeOption('白色', 'g2plus-white'));
                $car_color.append(makeOption('灰色', 'g2plus-black'));
                $car_color.append(makeOption('藍色', 'g2plus-blue'));
                $car_color.append(makeOption('黃色', 'g2plus-green'));
                $car_color.append(makeOption('橘色', 'g2plus-orange'));
                $car_color.append(makeOption('紅色', 'g2plus-red'));
                break;
            default:
        }

        $car_color.val(setting.car_color);
    };
    $car_model.change(function(){
        $car_color.find('option').remove();

        //console.log('car_model changed : ' + $car_model.val());

        resetCarColor();
    });

    $car_model.val(setting.car_model);
    resetCarColor();

    System.Gadget.onSettingsClosing = Settings.SettingsClosing;
};