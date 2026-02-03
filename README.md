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
GET /calls : Returns call history in JSON format.

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
```

# 📞 AI-PBX Integration Gateway – Setup Guide

This guide explains how to configure FreePBX, Asterisk, and AI Middleware.

---

## 📌 Prerequisites

- Debian 12 with FreePBX 17
- Node.js (v18+)
- Git
- SIP Phones / Softphones
- Sudo/root access

---

## ⚙️ Step 3: Configure Extensions

### FreePBX GUI

Go to:

```
Applications → Extensions → Add Extension
```

Create:

| Extension | Protocol |
|-----------|----------|
| 101       | PJSIP     |
| 102       | PJSIP     |

Register phones using generated credentials.

---

## 🔐 Step 4: Enable AMI

Edit file:

```bash
sudo nano /etc/asterisk/manager_custom.conf
```

Add:

```ini
[aiuser]
secret=yourpassword
read=all
write=all
```

Reload:

```bash
fwconsole reload
```

---

## 🌐 Step 5: Enable ARI

### FreePBX GUI

Go to:

```
Settings → Asterisk REST Interface Users
```

Create user:

| Field      | Value        |
|------------|--------------|
| Username   | aiuser       |
| Password   | yourpassword |
| Read/Write | Yes          |

Verify:

```bash
asterisk -rx "ari show status"
```

---

## 📞 Step 6: Configure Dialplan

Edit:

```bash
sudo nano /etc/asterisk/extensions_custom.conf
```

Add:

```ini
[ai-stasis]
exten => 777,1,NoOp(AI Bridge)
 same => n,Answer()
 same => n,Stasis(ai-bridge)
 same => n,Hangup()
```

Reload:

```bash
asterisk -rx "dialplan reload"
```

---

## 📂 Step 7: Clone Repository

```bash
git clone <your-repo-url>
cd AI-PBX/backend
```

---

## 📦 Step 8: Install Dependencies

```bash
npm install
```

---

## 📝 Step 9: Configure Environment

Create `.env` file:

```bash
nano .env
```

Add:

```env
ARI_USER=aiuser
ARI_PASS=yourpassword
AMI_USER=aiuser
AMI_PASS=yourpassword
DB_URL=your_db_url
```

---

## 🎙️ Step 10: Create Recording Directory

```bash
mkdir -p /var/spool/asterisk/recording
chown asterisk:asterisk /var/spool/asterisk/recording
chmod 775 /var/spool/asterisk/recording
```

---

## ▶️ Step 11: Start Middleware

```bash
node index.js
```

Expected Output:

```
AMI Connected
ARI Connected
API running on port 3000
AI-PBX Middleware Started
```

---

## 🧪 Step 12: Test System

### Make Call

Dial:

```
777
```

### Check API

```bash
curl http://localhost:3000/calls
```

### Check Stasis App

```bash
curl -u aiuser:password http://localhost:8088/ari/applications
```

---

## 🔄 Reconnection Testing

Restart Asterisk:

```bash
fwconsole restart
```

Middleware reconnects automatically.

---

## ✅ Expected Result

- Extensions register successfully
- AI bridge works on 777
- AMI and ARI connected
- Calls visible via API
- Recordings saved
- Auto-reconnect works

---
