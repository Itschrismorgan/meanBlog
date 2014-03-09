/**
 * Created by chris on 3/1/14.
 */


var tempPhotoStreamObject = {'photos':[{'photoUrl': 'http://farm4.staticflickr.com/3827/11094852386_2387a11198_z.jpg'},
    {'photoUrl': 'http://farm3.staticflickr.com/2889/11094860174_3dcdf90d63_z.jpg'},
    {'photoUrl': 'http://farm6.staticflickr.com/5539/11094934023_4e4a155141_z.jpg'},
    {'photoUrl': 'http://farm6.staticflickr.com/5488/11094905163_53e18936d6_z.jpg'},
    {'photoUrl': 'http://farm3.staticflickr.com/2842/11094751766_855791f5ba_z.jpg'},
    {'photoUrl': 'http://farm6.staticflickr.com/5526/11094650065_4aac3cae28_z.jpg'}
]};

exports.photos = function(req, res){
    res.render('photos', tempPhotoStreamObject);
};
