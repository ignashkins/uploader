let input = $('#uploader__input');
let config = {
    url: 'server.php',
    maxSize: 100, // размер файла в MB
    allowedFileTypes: ['jpg','jpeg','png','txt'],
    mimeTypes: [],
    convertToBase64: false,
    init: function() {
        axios.get('mime_types.json').then(function(response) { 
            config.mimeTypes = response.data; 
            config.allowedMimeTypes = response.data.filter(function(mimeType) {
                return config.allowedFileTypes.indexOf(mimeType.extension) != -1;
            });
        });

        this.maxSize = this.maxSize * 1024 * 1024;
    },
};
config.init();

console.log(config);

console.log();

// обработка файлов
input.change(config,processFiles);

async function processFiles()
{
    // получить все выбранные файлы
    let files = Array.from(Object.values( $(this).get(0).files ));

    // если выбран хотя бы один
    if (!_.isEmpty(files)) 
    {
        let process;

        // проверка файлов
        process = await validate(files, config);

        // конвертирование в base64
        if (config.convertToBase64) {
            process = await convert(process, config);
        }
        

        // отправка файлов на сервер
        process = await send(process, config);

    }
}

async function convert(files, config) {
    console.groupCollapsed('Конвертация');

    let data = [];
    for (f in files) {
        let pFile = files[f];
        data.push(await new Promise(function(resolve) {
            let reader = new FileReader();
            reader.onload = function(e) {
                console.log('Обработка файла ', pFile);
                resolve({
                    string: 'data:' + pFile.type + ';base64,' + window.btoa(e.target.result), 
                    file: pFile
                });
            }
            reader.readAsBinaryString(pFile);
        }));    
    }

    console.groupEnd();

    return data;
}

async function validate(files, config) {
    console.groupCollapsed('Проверка файлов');
    
    let filtered = await files.filter(function(pFile) 
    {
        let errors = [];
        // проверка размера файла
        pFile.size < config.maxSize ? true : errors.push('Размер файла '+pFile.name+' больше разрешенного.');

        // проверка разрешенных типов файлов
        _.findIndex(config.allowedMimeTypes, { mime: pFile.type }) != -1 ? true : errors.push('Файл ' + pFile.name + ' имеет неразрешенный тип файла ('+ pFile.type +') для загрузки.');

        return errors.length == 0 ? true : console.log(errors);
    });

    console.table('Отфильтрованные файлы: ', filtered);
    console.groupEnd();

    return filtered;
}

async function send(files, config) {
    
    console.groupCollapsed('Отправка файлов');
    let data = [];
    
        
    for (f in files) 
    {
        let pFile = files[f];
        let fd = new FormData();
        let fileData = {};
        // если это File
        if (files[0] instanceof File) {
            fileData = {
                uploadedFile: pFile,
                name: pFile.name,
                type: pFile.type,
                size: pFile.size
            };
        }

        // если это base64
        if (files[0] instanceof String) {
            fileData = {
                uploadedFile: pFile.string,
                name: pFile.file.name,
                type: pFile.file.type,
                size: pFile.file.size
            };
        }

        fd.append('uploadedFile', fileData.uploadedFile);
        fd.append('name', fileData.name);
        fd.append('type', fileData.type);
        fd.append('size', fileData.size);

        data.push(await new Promise(async function(resolve) {
            console.log('Загрузка файла ' + fileData.name);
            await axios.post(config.url, fd, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json'
                }
            }).then(function(response) {
                console.log(response);
                console.log('Файл успешно загружен');
                resolve(response);
            }).catch(function(error,e) {
                console.log('Загрузка выполнена с ошибкой: ' + error);
                console.log(error);
                console.log(e);
            });
        }));
    }

    console.groupEnd();

    return data;
}