const fs = require('fs');
const path = require('path');

function createBackup(data) {
  try {
    // Create backups directory if it doesn't exist
    const backupDir = path.join(__dirname, '..', 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    // Generate timestamp for filename
    const timestamp = new Date().toISOString()
      .replace(/:/g, '-')
      .replace(/\..+/, '');
    const backupFile = path.join(backupDir, `backup_${timestamp}.json`);
    
    // Create backup content
    const backupContent = {
      metadata: {
        backupCreated: new Date().toISOString(),
        totalRecords: data.length,
        source: 'NodeVault Auto-Backup'
      },
      records: data
    };
    
    // Write backup file
    fs.writeFileSync(backupFile, JSON.stringify(backupContent, null, 2));
    
    console.log(`✅ Backup created: ${backupFile}`);
    return { success: true, filePath: backupFile, recordCount: data.length };
    
  } catch (error) {
    console.error(`❌ Backup failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

module.exports = { createBackup };