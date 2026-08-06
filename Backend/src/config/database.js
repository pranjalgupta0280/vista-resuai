const mongoose = require('mongoose');
const dns = require('dns');

// Fallback to Google and Cloudflare DNS to fix querySrv ECONNREFUSED issue on local network DNS
try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
    // Ignore if custom DNS cannot be set
}

async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("connected to database");
    } catch (err) {
        console.error("failed to connect to database:", err.message || err);
    }
}

module.exports = connectToDB;