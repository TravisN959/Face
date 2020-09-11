const video = document.getElementById('video')

//Get models from folder and loads, once all loaded then starts video
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/weights'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/weights'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/weights'),
  faceapi.nets.faceExpressionNet.loadFromUri('/weights')
]).then(startVideo)

//Start video
function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}


//Will play video and draw respected faces
video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 100)
})

//Add jokes api to get jokes
fetch("https://dad-jokes.p.rapidapi.com/random/jokes", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "dad-jokes.p.rapidapi.com",
		"x-rapidapi-key": "75ffc45666msh54041ad9a0f1f22p1bdc2fjsn4851a6dbd8e2"
	}
})
.then(response => {
	console.log(response);
})
.catch(err => {
	console.log(err);
});