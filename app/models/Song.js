import { model, models, Schema } from "mongoose";

const SongSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  length: {
    type: Number,
    min: 0,
  },
});

const Song = models.Song || model("Song", SongSchema);
export default Song;
