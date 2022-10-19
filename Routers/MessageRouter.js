const router = require("express").Router();

const Message = require("../Models/Message");


//post a messsage

router.post("/", async (req, res)=>{
    const createMessage = new Message(req.body);
    try{
        const Message = await createMessage.save();
        res.status(200).json(Message);
    }catch(error){
        res.status(500).json(error);
    }
})



//get a message

router.get("/getMessage/:receiverID", async (req, res) => {
  try {
    const getMessage = await Message.find({ recipientID : req.params.receiverID});
    res.status(200).json(getMessage);
  } catch (error) {
    res.status(500).json(error);
  }
});


//delete a message


router.delete("/delete/:id", async (req, res)=>{
    try{
        const deleteMessage = await Message.findByIdAndDelete(req.params.id);
        res.status(200).json(deleteMessage);
    }catch(err){
        res.status(500).json(err);
    }
})



module.exports = router;