document.getElementById('uploadImage').addEventListener('change', handleImageUpload);
document.getElementById('applyFilter').addEventListener('click', applyFilter);

const canvas = document.getElementById('photoCanvas');
const ctx = canvas.getContext('2d');
let image = new Image();

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            image.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

image.onload = function () {
    canvas.width = image.width / 2;
    canvas.height = image.height / 2;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
};

function applyFilter() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] = data[i] * 1.2; // Red
        data[i + 1] = data[i + 1] * 1.1; // Green
        data[i + 2] = data[i + 2] * 0.9; // Blue
    }

    ctx.putImageData(imageData, 0, 0);
}
