export class VideoFrameExtractor {
  constructor(videoUrl) {
    this.videoUrl = videoUrl;
    this.video = null;
    this.canvas = null;
    this.ctx = null;
  }

  async initialize() {
    return new Promise((resolve, reject) => {
      this.video = document.createElement("video");
      this.video.src = this.videoUrl;
      this.video.crossOrigin = "anonymous";

      this.video.addEventListener("loadedmetadata", () => {
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
        this.ctx = this.canvas.getContext("2d");
        resolve(this);
      });

      this.video.addEventListener("error", reject);
      this.video.load();
    });
  }

  async extractFrame(timeInSeconds) {
    return new Promise((resolve, reject) => {
      this.video.currentTime = timeInSeconds;

      this.video.addEventListener(
        "seeked",
        () => {
          this.ctx.drawImage(this.video, 0, 0);
          this.canvas.toBlob(
            (blob) => {
              resolve(blob);
            },
            "image/jpeg",
            0.95
          );
        },
        { once: true }
      );

      this.video.addEventListener("error", reject);
    });
  }

  async extractThumbnails(count = 10) {
    const duration = this.video.duration;
    const interval = duration / count;
    const thumbnails = [];

    for (let i = 0; i < count; i++) {
      const time = i * interval;
      const blob = await this.extractFrame(time);
      thumbnails.push({
        time,
        blob,
        url: URL.createObjectURL(blob),
      });
    }

    return thumbnails;
  }

  getDuration() {
    return this.video?.duration || 0;
  }

  getDimensions() {
    return {
      width: this.video?.videoWidth || 0,
      height: this.video?.videoHeight || 0,
    };
  }

  destroy() {
    if (this.video) {
      this.video.src = "";
      this.video = null;
    }
    this.canvas = null;
    this.ctx = null;
  }
}
