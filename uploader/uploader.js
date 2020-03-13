let input = $('#uploader__input');
let config = {
    url: 'server.php',
    maxSize: 100000
};


// обработка файлов
input.change(config,processFiles);

async function processFiles()
{
    console.log(config);
    // получить все выбранные файлы
    let files = Array.from(Object.values( $(this).get(0).files ));

    // если выбран хотя бы один
    if (!_.isEmpty(files)) 
    {
        let process;

        // проверка файлов
        process = await validate(files, config);

        // конвертирование в base64
        process = await convert(process, config);

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
    
    let filtered = await files.filter(function(pFile) {
        let check = pFile.size < 100000;
        check ? true : console.log('Размер файла '+pFile.name+' больше разрешенного.');
        return check;
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
        fd.append('string', pFile.string);
        fd.append('name', pFile.file.name);
        fd.append('type', pFile.file.type);
        fd.append('size', pFile.file.size);

        data.push(await new Promise(async function(resolve) {
            console.log('Загрузка файла ' + pFile.file.name);
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