<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="node_modules/cropperjs/dist/cropper.min.css">
    <style>
        #cropper__result {
            width: 300px;
            height: 400px;
            position: relative;
            margin-top: 100px;
        }

        #cropper__result img {
            width: 300px;
            height: 400px;
        }

        #cropper__wrapper, #cropper__preview {
            width: 300px;
            height: 400px;
            background: #f2f2f2;
            border: 1px solid #ccc;
            overflow: hidden;
            margin-top: 100px;
            position: relative;
        }

        #cropper__wrapper img {
            max-width: 300px;
            max-height: 400px;
        }

        #cropper__wrapper input {
            position: absolute;
            cursor: pointer;
            opacity: 0;
            width: 100%;
            height: 100%;
        }

        #cropper__control {
            width: 300px;
            text-align: center;
        }

        #cropper__control a {
            cursor: pointer;
        }

        #cropper__control .breadcrumb {
            border-radius: 0;
            border: 1px solid #ccc;
            border-top: 0;
        }
    </style>
</head>
<body>

<div class="container">
    <div class="row">
        <div class="col-md-4">
            <div id="cropper__wrapper">
                <div></div>
                <input type="file">
            </div>
            <div id="cropper__control" class="text-center">
                <ol class="breadcrumb">
                    <li><a id="cropper__save">сохранить</a></li>
                    <li><a id="cropper__rotate">повернуть</a></li>
                    <li><a id="cropper__destroy">очистить</a></li>
                </ol>
            </div>
        </div>
        <div class="col-md-4">
            <div id="cropper__preview"></div>
        </div>
        <div class="col-md-4">
            <div id="cropper__result">

            </div>
        </div>
    </div>
</div>

<script src="node_modules/jquery/dist/jquery.min.js"></script>
<script src="node_modules/cropperjs/dist/cropper.min.js"></script>
<script src="node_modules/jquery-cropper/dist/jquery-cropper.min.js"></script>
<script>

    var image = '';
    var cropper;

    $(function () {

        let wrapper = $('#cropper__wrapper'), input = wrapper.find('[type="file"]'), control = $('#cropper__control'),
            save = $('#cropper__save'), rotate = $('#cropper__rotate'), destroy = $('#cropper__destroy');
        input.change(function () {
            let file = $(this)[0].files[0];
            if (file !== undefined) {
                handleFileSelect(file, function () {
                    wrapper.find('div').html('<img id="cropper__image" src="' + image + '">');
                    cropper = new Cropper($('#cropper__image')[0], {
                        cropBoxResizable: false,
                        dragMode: 'none',
                        minCropBoxWidth: 300,
                        minCropBoxHeight: 400,
                        minCanvasWidth: 300,
                        minCanvasHeight: 400,
                        minContainerWidth: 300,
                        minContainerHeight: 400,
                        preview: '#cropper__preview'
                    });
                });
            }
        })

        // сброс кроппера
        destroy.click(function () {
            console.log('destroy');
            cropper.destroy();
            clearImage();
        });

        // повернуть изображение
        rotate.click(function () {
            cropper.rotate(90);
        });

        save.click(function () {
            cropper.crop();
            let cropped = cropper.getCroppedCanvas().toDataURL();
            $('#cropper__result').html('<img src="'+cropped+'">');
            destroy.click();
        });
    });

    function handleFileSelect(f, process) {
        var reader = new FileReader();
        reader.onload = (function (theFile) {
            return function (e) {
                var binaryData = e.target.result;
                var base64String = window.btoa(binaryData);
                image = 'data:' + f.type + ';base64,' + base64String;
                process();
            };
        })(f);
        reader.readAsBinaryString(f);
    }

    function clearImage() {
        $('#cropper__image').remove();
    }
</script>
</body>
</html>