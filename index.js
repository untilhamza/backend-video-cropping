const express = require("express");
const bodyParser = require("body-parser");
const ffmpeg = require("fluent-ffmpeg");

const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.post("/crop-video", (req, res) => {
  const video = new Buffer.from(
    req.body.video.replace(/^data:video\/\w+;base64,/, ""),
    "base64"
  );
  const captureRect = req.body.captureRect;

  ffmpeg(video)
    .videoFilter(
      "crop",
      `${captureRect.width}x${captureRect.height}+${captureRect.x}+${captureRect.y}`
    )
    .toBuffer((err, buffer) => {
      if (err) {
        return res.status(500).send({ error: "Error cropping the video" });
      }

      //TODO: You can return the cropped video to the client
      res
        .status(200)
        .send({ video: `data:video/mp4;base64,${buffer.toString("base64")}` });

      //TODO: Or you can upload the cropped video to S3
      // s3.upload({ Body: buffer }, (uploadErr, data) => {
      //   if (uploadErr) {
      //     return res.status(500).send({ error: 'Error uploading the video to S3' });
      //   }
      //   res.status(200).send({ video: data.Location });
      // });
    });
});

app.listen(3000, () => console.log("Server listening on port 3000"));
