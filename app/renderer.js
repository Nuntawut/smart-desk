var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
window.api.receiveFromMain('data-from-main', (data) => {
  console.log(data.message); // Output: Hello from Main!
  
  player = new YT.Player('player', {
    width: '100%',
    height: data.height,
    videoId: data.message,
    playerVars: {
      'playsinline': 1,
      'disablekb': 1,
      'modestbranding': 1,
      'rel': 0,
      'fs': 0,
      'controls': 0
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });

});

function onPlayerReady(event) {
  event.target.playVideo();
}

var done = false;

function onPlayerStateChange(event) {

  const totalDuration = player.getDuration();

  if (event.data === YT.PlayerState.ENDED && !done) {
    done = true

    console.log('Video has finished!');

    const data = {
      status: done,
      totalDuration: totalDuration,
    };

    window.api.sendToMain('data-from-renderer', data)
  }

  if (event.data === YT.PlayerState.PLAYING) {
    updateTimer();
  }
}

function updateTimer() {

  const totalDuration = player.getDuration();

  // Get the current playback time of the video
  const currentTime = player.getCurrentTime();
  
  // Calculate the time left in seconds
  const timeLeft = Math.ceil(totalDuration - currentTime);

  // Update the time left or countdown on the UI
  const timeLeftElement = document.getElementById('timeLeft');
  timeLeftElement.innerText = `เวลาที่เหลือ : ${timeLeft} วินาที`;

  // Call this function again after 1 second (1000 ms) to update the countdown
  if (timeLeft > 0) {
    setTimeout(updateTimer, 1000);
  }
}