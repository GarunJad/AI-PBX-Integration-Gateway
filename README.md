# ✅ AI-PBX Integration Gateway

## 📌 Overview

This project implements an **AI-PBX Integration Gateway** using **FreePBX 17 on Debian 12** and a **Node.js middleware**.  
The system bridges live telephony events with an AI processing layer using **AMI and ARI**, enabling:

- Real-time call tracking  
- Voice recording  
- Mock AI transcription  

---

## 📊 Methodology

The project was implemented in three major phases:

---

### 🔹 Phase 1: PBX Setup

- Installed FreePBX 17 on Debian 12 using the official script  
- Configured two PJSIP extensions (101 and 102)  
- Enabled AMI and ARI  
- Created a Stasis application (`ai-bridge`)  
- Configured dialplan to route `777` to the Stasis application  

---

### 🔹 Phase 2: Middleware Development

- Developed Node.js middleware to connect with Asterisk  
- Used AMI to monitor call events  
- Used ARI WebSocket for call control and audio processing  
- Implemented:
  - Call answering
  - Prompt playback
  - Recording
  - Mock AI processing
- Stored call metadata in a database  

---

### 🔹 Phase 3: Reliability & API

- Implemented automatic reconnection for AMI and ARI  
- Created REST API to expose call history  
- Tested resilience against Asterisk restarts  

---
