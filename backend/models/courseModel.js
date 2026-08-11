import mongoose from "mongoose";

export const courseSchema = new mongoose.Schema(
  {
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image:{
        public_id: {
            type: String,
            required: true,
    },
    url: {
        type: String,
        required: true,}
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
    }

      }  )

      const Course = mongoose.model("Course", courseSchema);
      export default Course;