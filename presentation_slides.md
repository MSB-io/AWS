# Slide Deck: FanEngage Sports Fan Platform
## AWS Cloud Case Study & Viva Defense Guide
> **Presenter Slide Notes & Visual Outlines**

---

## Slide 1: Title Slide
### FanEngage Sports Fan Platform Cloud
*   **Case Study**: 133
*   **Institution**: ITM Skills University
*   **Core Theme**: Enterprise Cloud Architecture & Automation
*   **Presenter**: B.Tech CSE (2024–2028)

**🎙️ Presenter Notes**:
> "Good afternoon, examiners. Today I am presenting Case Study 133: the cloud migration and automation of the FanEngage Sports Fan Platform. I will walk you through the business problem, my custom AWS architecture, the DevOps automation scripts, and my pricing strategy."

---

## Slide 2: The Business Problem
### Disconnected Systems to Scalable Cloud
*   **Current State**: Scattered spreadsheets, disconnected servers, and manual database backups.
*   **Scaling Surge**: Sudden traffic spikes during major live matches (Cricket, Football, Kabaddi).
*   **The Goal**: Establish a scalable, high-availability cloud architecture with centralized analytics, secure access controls, and automated disaster recovery.

**🎙️ Presenter Notes**:
> "FanEngage is a sports media platform that experiences extreme traffic peaks during live events. Before this cloud setup, operations relied on manual workflows and disconnected files. The goal was to migrate this setup to AWS to ensure scalability, security, and automated operations."

---

## Slide 3: AWS Network Topology
### Decoupled Tier Architecture
*   **VPC Boundary**: `10.0.0.0/16` isolated network.
*   **Public Tier (`10.0.1.0/24`)**: Houses the EC2 Web Server running Nginx, Node.js API, and the React app.
*   **Private Tier (`10.0.2.0/24` & `10.0.3.0/24`)**: Houses the Amazon RDS MySQL database across two availability zones (AZs) for failover protection.
*   **Gateway**: Internet Gateway (IGW) attached only to the Public Subnet route table.

**🎙️ Presenter Notes**:
> "Here is my cloud network design. I set up a custom VPC divided into tiers. The web client resides in the Public Subnet to handle internet traffic, while the database is locked away in Private Subnets across two Availability Zones, preventing public access."

---

## Slide 4: Infrastructure Security
### Stateful Firewalls & Access Controls
*   **VPC Security Groups**:
    *   *EC2 Web SG*: Permitting Inbound ports 22 (SSH), 80 (HTTP), 443 (HTTPS), and 5001 (Node API) from the public web.
    *   *RDS DB SG*: Permitting MySQL port 3306 **only** when requested by the EC2 Security Group ID.
*   **Host Firewall (UFW)**: Denies all host-level incoming traffic by default, except for SSH and HTTP/S ports.

**🎙️ Presenter Notes**:
> "Security is a core focus. The database is protected by an RDS Security Group that acts as a port-level firewall. It rejects all traffic except port 3306 queries originating from the EC2 instance's security group. All public database access is blocked."

---

## Slide 5: DevOps & Linux Automation
### Cron Services & Systemd
*   **Package Management**: Provisioned Ubuntu 22.04 LTS host with Docker, Nginx, PM2, and AWS CLI.
*   **Backup Automation (`backup-db.sh`)**: Runs daily at 2:00 AM. Automatically runs `mysqldump`, compresses the SQL file, uploads it to Amazon S3, and deletes local files older than 7 days.
*   **Health Metric Daemon (`monitor.sh`)**: Runs every 5 minutes. Pulls CPU, Memory, and Disk usage stats and pushes them to AWS CloudWatch Custom Metrics.

**🎙️ Presenter Notes**:
> "I automated server maintenance with shell scripts. A backup job runs daily at 2:00 AM to upload database dumps to S3. A monitoring job runs every 5 minutes, collecting system usage metrics and pushing them directly to Amazon CloudWatch."

---

## Slide 6: Docker Containerization
### Standardized Runtimes
*   **Decoupled Services**:
    *   *Backend container*: Runs Node.js Express API on port 5001.
    *   *Frontend container*: Multi-stage build compiles React assets and serves them via Nginx Alpine on port 80.
*   **Orchestration**: Docker Compose manages container networking, dependencies, and environment configurations.

**🎙️ Presenter Notes**:
> "To simplify deployment and scaling, the frontend and backend are containerized using Docker. Nginx serves the compiled React build and proxies API requests on port 80 to the backend container, eliminating port conflicts."

---

## Slide 7: Pricing Strategy & TCO
### Total Cost of Ownership Optimization
*   **Base Cost (ap-south-1 Mumbai)**: ~$98.36 / month (EC2, RDS MySQL, GP3 Storage, Data Transfer).
*   **Disaster Recovery (SLA Tiers)**:
    *   *Standard DR ($5/mo)*: Daily S3 database backups (RPO: 24h, RTO: 1h).
    *   *Enterprise DR ($25/mo)*: Point-in-Time-Recovery (RPO: 5m, RTO: 15m).
*   **Optimization Recommendations**: Compute Savings Plans (30-50% savings), S3 Glacier Lifecycle transitions (60% storage savings), and Auto Scaling Groups.

**🎙️ Presenter Notes**:
> "Our production setup is calculated at $98.36/month. To support different business SLAs, I designed a Standard DR tier with a 24-hour RPO and a Premium Enterprise DR tier with a 5-minute RPO. We can reduce these costs using Compute Savings Plans and S3 Lifecycle rules."

---

## Slide 8: Live Demonstration
### End-to-End Verification
*   **Deployed URL**: Deployed and active at `http://13.201.63.160`
*   **Role-Based Panels**:
    *   *Admin*: Monitor AWS instance statuses and active IAM security policies.
    *   *Manager*: Manage match schedules and resolve system warnings.
    *   *Fan*: Interactive dashboard displaying match tickets and occupancy.
*   **Persistence Test**: Demonstrates that adding events dynamically writes to the RDS MySQL instance.

**🎙️ Presenter Notes**:
> "Let's look at the live deployment. By visiting this IP, you can see the FanEngage application running on AWS. The dashboard, match scheduling, alert handling, and analytics charts are fully operational and query the RDS database in real time."

---

## Slide 9: Summary & Key Takeaways
### Viva Quick Review
*   **Why VPC Subnet Division?** Restricts the database to private subnets while keeping the web server public.
*   **Why CloudWatch Custom Metrics?** Provides resource visibility to trigger alert emails or auto-scaling rules.
*   **Why Docker Compose?** Packages the app environment for reliable deployments on any virtual machine.

**🎙️ Presenter Notes**:
> "In summary, the FanEngage platform is now fully secure, automated, and ready to scale. I am now open to your questions. Thank you."
