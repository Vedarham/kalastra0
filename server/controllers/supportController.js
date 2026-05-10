export const submitSupportTicket = async (req, res) => {
  try {
    const { subject, message, email } = req.body;

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Subject and message are required"
      });
    }

    console.log(`[SUPPORT TICKET] From: ${email || req.user?.email || "Anonymous"} | Subject: ${subject} | Message: ${message}`);

    return res.status(200).json({
      success: true,
      message: "Support ticket submitted successfully. Our team will get back to you shortly."
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to submit support ticket",
      error: error.message
    });
  }
};
