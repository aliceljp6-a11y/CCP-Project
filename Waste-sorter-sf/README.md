# Recology Waste Sorter

A kid-friendly web app for 4th graders to learn San Francisco waste sorting. Point your camera at an item and the app tells you which bin (Green, Blue, or Black) it belongs in using a Teachable Machine model.

## How to Run

The app needs to be served over HTTP/HTTPS (camera and model loading don't work with `file://`). Options:

1. **Python**: `python -m http.server 8000` then open http://localhost:8000
2. **Node.js**: `npx serve .` or `npx http-server`
3. **VS Code**: Use the "Live Server" extension

## Requirements

- Modern browser with camera access (Chrome, Safari, Firefox, Edge)
- HTTPS or localhost (browsers require secure context for camera)
