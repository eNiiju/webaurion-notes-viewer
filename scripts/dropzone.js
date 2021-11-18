function onDragEnter(event) {
    $$('.dropzone').forEach(e => e.classList.add('dragover'));
}

function onDragOver(event) {
    event.preventDefault();
    if (!$$('.dropzone').forEach(e => e.classList.contains('dragover')))
        $$('.dropzone').forEach(e => e.classList.add('dragover'));
}

function onDragLeave(event) {
    event.preventDefault();
    $$('.dropzone').forEach(e => e.classList.remove('dragover'));
}

function onDrop(event) {
    $$('.dropzone').forEach(e => e.classList.remove('dragover'));
    $$('.dropzone').forEach(e => e.classList.add('dragover'));
}

$$('.dropzone').forEach(e => e.addEventListener('dragenter', onDragEnter));
$$('.dropzone').forEach(e => e.addEventListener('dragover', onDragOver));
$$('.dropzone').forEach(e => e.addEventListener('dragleave', onDragLeave));
$$('.dropzone').forEach(e => e.addEventListener('drop', onDrop));
