const { connectToDatabase } = require("../../../lib/mongodb");
const ObjectId = require("mongodb").ObjectId;

export default async function handler(req, res) {
  switch (req.method) {
    case "GET": {
      return getSlots(req, res);
    }

    case "POST": {
      return addSlot(req, res);
    }

    case "PUT": {
      return updateSlot(req, res);
    }

    case "DELETE": {
      return deleteSlot(req, res);
    }
  }
}

async function getSlots(req, res) {
  try {
    let { db } = await connectToDatabase();
    if (req.query && req.query.user) {
      let slots = await db
        .collection("slots")
        .find({ user: req.query.user })
        .toArray();
      return res.json({
        message: JSON.parse(JSON.stringify(slots)),
        success: true,
      });
    }
    let slots = await db.collection("slots").find({}).limit(20).toArray();
    return res.json({
      message: JSON.parse(JSON.stringify(slots)),
      success: true,
    });
  } catch (error) {
    return res.json({
      message: new Error(error).message,
      success: false,
    });
  }
}

async function addSlot(req, res) {
  try {
    let { db } = await connectToDatabase();
    await db.collection("slots").insertOne(req.body);
    return res.json({
      message: "slot added successfully",
      success: true,
    });
  } catch (error) {
    return res.json({
      message: new Error(error).message,
      success: false,
    });
  }
}

async function updateSlot(req, res) {
  try {
    let { db } = await connectToDatabase();

    await db.collection("slots").updateOne(
      {
        _id: new ObjectId(req.body._id),
      },
      { $set: { parent: req.body.parent } }
    );
    return res.json({
      message: "slot updated successfully",
      success: true,
    });
  } catch (error) {
    return res.json({
      message: new Error(error).message,
      success: false,
    });
  }
}

async function deleteSlot(req, res) {
  try {
    let { db } = await connectToDatabase();

    await db.collection("slots").deleteOne({
      _id: new ObjectId(req.body),
    });

    return res.json({
      message: "slot deleted successfully",
      success: true,
    });
  } catch (error) {
    return res.json({
      message: new Error(error).message,
      success: false,
    });
  }
}
