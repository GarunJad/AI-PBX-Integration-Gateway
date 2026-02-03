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
```

## AI-PBX Setup 

```yaml

  step_3_configure_extensions:
    location: "FreePBX GUI → Applications → Extensions → Add Extension"
    extensions:
      - id: 101
        protocol: PJSIP
      - id: 102
        protocol: PJSIP
    note: "Register phones using generated credentials"

  step_4_enable_ami:
    file: "/etc/asterisk/manager_custom.conf"
    config:
      aiuser:
        secret: yourpassword
        read: all
        write: all
    reload_command: "fwconsole reload"

  step_5_enable_ari:
    location: "FreePBX → Settings → Asterisk REST Interface Users"
    user:
      username: aiuser
      password: yourpassword
      permissions: read_write
    verify_command: "asterisk -rx \"ari show status\""

  step_6_configure_dialplan:
    file: "/etc/asterisk/extensions_custom.conf"
    context: ai-stasis
    extension: 777
    dialplan:
      - "NoOp(AI Bridge)"
      - "Answer()"
      - "Stasis(ai-bridge)"
      - "Hangup()"
    reload_command: "asterisk -rx \"dialplan reload\""

  step_7_clone_repository:
    commands:
      - "git clone <your-repo-url>"
      - "cd AI-PBX/backend"

  step_8_install_dependencies:
    command: "npm install"

  step_9_configure_environment:
    file: ".env"
    variables:
      ARI_USER: aiuser
      ARI_PASS: yourpassword
      AMI_USER: aiuser
      AMI_PASS: yourpassword
      DB_URL: your_db_url

  step_10_create_recording_directory:
    directory: "/var/spool/asterisk/recording"
    commands:
      - "mkdir -p /var/spool/asterisk/recording"
      - "chown asterisk:asterisk /var/spool/asterisk/recording"
      - "chmod 775 /var/spool/asterisk/recording"

  step_11_start_middleware:
    command: "node index.js"
    expected_output:
      - "AMI Connected"
      - "ARI Connected"
      - "API running on port 3000"
      - "AI-PBX Middleware Started"

  step_12_test_system:
    make_call:
      dial: "777"

    check_api:
      command: "curl http://localhost:3000/calls"

    check_stasis_app:
      command: "curl -u aiuser:password http://localhost:8088/ari/applications"

  reconnection_testing:
    restart_command: "fwconsole restart"
    behavior: "Middleware automatically reconnects"
```
