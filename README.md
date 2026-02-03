#  AI-PBX Integration Gateway

##  Overview

This project implements an **AI-PBX Integration Gateway** using **FreePBX 17 on Debian 12** and a **Node.js middleware**.  
The system bridges live telephony events with an AI processing layer using **AMI and ARI**, enabling:

- Real-time call tracking  
- Voice recording  
- Mock AI transcription  

---

##  Methodology

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


### Components

#### 1️. AMI (Asterisk Manager Interface)

- Listens for Newstate and Hangup events  
- Captures call start and end time  
- Calculates call duration  
- Stores metadata  

---

#### 2️. ARI (Asterisk REST Interface)

- WebSocket-based real-time events  
- Handles Stasis application `ai-bridge`  
- Answers calls  
- Plays prompt  
- Records audio  
- Triggers mock AI processing  

---

#### 3️. Node.js Middleware

- Manages AMI and ARI connections  
- Automatic reconnection  
- Call-to-recording mapping  
- Async event processing  

---

#### 4️. Database

Stores:

- Caller ID  
- Destination  
- Start time  
- End time  
- Duration  
- AI transcription status  

---

#### 5️. REST API

**Endpoint:**  
GET /calls
Returns call history in JSON format.

---

##  Key Design Decisions

- WebSocket-based ARI connection  
- Async/Await architecture  
- In-memory channel mapping  
- Auto-reconnect logic  
- WAV recording format  
- Modular structure  

---

## Setup Instructions

---

### 1️. Prerequisites

- Debian 12  
- FreePBX 17  
- Node.js v18+  
- PostgreSQL / SQLite  
- Two SIP phones or softphones  

---

### 2️. Install FreePBX

```bash
wget http://mirror.freepbx.org/modules/packages/freepbx/freepbx-17.0-latest.tgz
tar xvf freepbx-17.0-latest.tgz
cd freepbx
./start_asterisk start
./install -n
