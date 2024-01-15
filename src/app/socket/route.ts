import { NextApiRequest, NextApiResponse } from "next";
import { Server } from "Socket.IO";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Create a WebSocket server
  const wss = new Server({ noServer: true });

  // Handle WebSocket connection
  wss.on("connection", (ws) => {
    // Handle incoming messages
    ws.on("message", (message) => {
      console.log("Received message:", message);

      // Send a response back to the client
      ws.send("Hello from the server!");
    });

    // Handle WebSocket disconnection
    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });
  });

  // Upgrade the HTTP request to a WebSocket connection
  if (req.headers.upgrade === "websocket") {
    wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
      wss.emit("connection", ws, req);
    });
  } else {
    res.status(400).send("Invalid request");
  }
}
