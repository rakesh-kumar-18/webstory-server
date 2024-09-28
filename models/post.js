const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    slides: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Slide",
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Post", postSchema);
