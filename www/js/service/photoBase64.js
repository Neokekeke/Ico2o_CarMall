/**
 * Created by Happy Every Day on 2016/9/22.
 */
angular.module('ico2o.services.photo', [])
  .service('Util', function($q) {
  var dataURItoBlob = function(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
    else
      byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {
      type: mimeString
    });
  };

  var resizeFile = function(file) {
    var deferred = $q.defer();
    var img = document.createElement("img");
    try {
      var reader = new FileReader();
      reader.onload = function(e) {
        img.src = e.target.result;

        //resize the image using canvas
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var MAX_WIDTH = 800;
        var MAX_HEIGHT = 800;
        var width = img.width;
        var height = img.height;
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        //change the dataUrl to blob data for uploading to server
        var dataURL = canvas.toDataURL('image/jpeg');
        var blob = dataURItoBlob(dataURL);

        deferred.resolve(blob);
      };
      reader.readAsDataURL(file);
    } catch (e) {
      deferred.resolve(e);
    }
    return deferred.promise;

  };
  return {
    resizeFile: resizeFile
  };

});
