import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

//Initializes a new Express application.
const app = express();
const prisma = new PrismaClient();

//Parses the JSON body from incoming API requests.
app.use(express.json());

//Adds CORS support for communication with the frontend axios
app.use(cors());

app.get("/api/notes", async (req, res) => {
  res.json({ message: "success!" });
});

//getting notes from the database
app.get("/api/notes", async (req, res) => {
  const notes = await prisma.note.findMany();
  res.json(notes);
});

//API for posting data into the database...
app.post("/api/notes", async (req, res) => {
  //to extract title and content from the req.body
  //This is what the UI will send when a user submits the "Add Note" form.
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).send("title and content fields required");
  }

  try {
    const note = await prisma.note.create({
      data: { title, content },
    });
    res.json(note);
  } catch (error) {
    res.status(500).send("Oops, something went wrong");
  }
});

//API for updating the notes
app.put("/api/notes/:id", async (req, res) => {
  const { title, content } = req.body;
  //The major difference is the :id parameter in the URL. This acts as a placeholder,
  // allowing you to specify the ID of the note you wish to update.
  const id = parseInt(req.params.id);

  if (!title || !content) {
    return res.status(400).send("title and content fields required");
  }

  if (!id || isNaN(id)) {
    return res.status(400).send("ID must be a valid number");
  }

  try {
    const updatedNote = await prisma.note.update({
      where: { id },
      data: { title, content },
    });
    res.json(updatedNote);
  } catch (error) {
    res.status(500).send("Oops, something went wrong");
  }
});

//deleting the notes posts...
app.delete("/api/notes/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  if (!id || isNaN(id)) {
    return res.status(400).send("ID field required");
  }

  try {
    await prisma.note.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).send("Oops, something went wrong");
  }
});


//This starts the server listening on port 5000.
app.listen(5000, () => {
  console.log("server running on localhost:5000");
});