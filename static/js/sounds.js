  function init() {
    var sound = new Howl({
        src: ['static/sounds/pink_panther.mp3'],
        volume: 0.05
      });
      
      sound.play();
      sound.fade(0.05, 0.0, 5000);
}

init();