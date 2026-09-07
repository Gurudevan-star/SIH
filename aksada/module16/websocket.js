export function connectInvestigationSocket(
  investigationId,
  onMessage,
  onError,
  onClose
) {
  const baseUrl =
    import.meta.env.VITE_WS_URL || "ws://localhost:8000";

  const socket = new WebSocket(
    `${baseUrl}/ws/investigations/${investigationId}`
  );

  socket.onopen = () => {
    console.log("CryptoTrace WebSocket connected");
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      if (onMessage) {
        onMessage(data);
      }
    } catch (error) {
      console.error("Invalid WebSocket message:", error);
    }
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);

    if (onError) {
      onError(error);
    }
  };

  socket.onclose = () => {
    console.log("CryptoTrace WebSocket disconnected");

    if (onClose) {
      onClose();
    }
  };

  return socket;
}