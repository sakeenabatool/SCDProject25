const fs = require('fs');
const path = require('path');
const fileDB = require('./file');
const recordUtils = require('./record');
const vaultEvents = require('../events');
const backupUtils = require('./backup');
function addRecord({ name, value }) {
  recordUtils.validateRecord({ name, value });
  const data = fileDB.readDB();
  const newRecord = { id: recordUtils.generateId(), name, value };
  data.push(newRecord);
  fileDB.writeDB(data);
  
  backupUtils.createBackup(data);
  
  vaultEvents.emit('recordAdded', newRecord);
  return newRecord;
}

function searchRecords(searchTerm) {
  const data = fileDB.readDB();
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  return data.filter(record => 
    record.name.toLowerCase().includes(lowerSearchTerm) ||
    record.id.toString().includes(searchTerm)
  );
}

function sortRecords(sortBy, sortOrder) {
  const data = fileDB.readDB();
  
  return data.sort((a, b) => {
    let compareA, compareB;
    
    if (sortBy === 'name') {
      compareA = a.name.toLowerCase();
      compareB = b.name.toLowerCase();
    } else if (sortBy === 'date') {
      compareA = new Date(a.id); // Using ID as creation date timestamp
      compareB = new Date(b.id);
    } else {
      return 0;
    }
    
    if (sortOrder === 'ascending') {
      return compareA < compareB ? -1 : compareA > compareB ? 1 : 0;
    } else {
      return compareA > compareB ? -1 : compareA < compareB ? 1 : 0;
    }
  });
}

function listRecords() {
  return fileDB.readDB();
}

function createManualBackup() {
  const data = fileDB.readDB();
  return backupUtils.createBackup(data);
}

function updateRecord(id, newName, newValue) {
  const data = fileDB.readDB();
  const record = data.find(r => r.id === id);
  if (!record) return null;
  record.name = newName;
  record.value = newValue;
  fileDB.writeDB(data);
  
  backupUtils.createBackup(data);
  
  vaultEvents.emit('recordUpdated', record);
  return record;
}

function exportToTextFile() {
  const data = fileDB.readDB();
  const exportDir = path.join(__dirname, '..');
  const exportFile = path.join(exportDir, 'export.txt');
  
  let content = `=== NodeVault Data Export ===\n`;
  content += `Export Date: ${new Date().toLocaleString()}\n`;
  content += `Total Records: ${data.length}\n`;
  content += `File: export.txt\n`;
  content += `===============================\n\n`;
  
  if (data.length === 0) {
    content += 'No records found in the vault.\n';
  } else {
    data.forEach((record, index) => {
      const createdDate = new Date(record.id).toLocaleString();
      content += `Record #${index + 1}:\n`;
      content += `  ID: ${record.id}\n`;
      content += `  Name: ${record.name}\n`;
      content += `  Value: ${record.value}\n`;
      content += `  Created: ${createdDate}\n`;
      content += `-----------------------------\n`;
    });
  }
  
  try {
    fs.writeFileSync(exportFile, content);
    return { success: true, filePath: exportFile, recordCount: data.length };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function deleteRecord(id) {
  let data = fileDB.readDB();
  const record = data.find(r => r.id === id);
  if (!record) return null;
  data = data.filter(r => r.id !== id);
  fileDB.writeDB(data);
  
  backupUtils.createBackup(data);
  
  vaultEvents.emit('recordDeleted', record);
  return record;
}

function getVaultStatistics() {
  const data = fileDB.readDB();
  
  if (data.length === 0) {
    return {
      totalRecords: 0,
      message: "Vault is empty"
    };
  }
  
  // Find longest name
  let longestName = "";
  let longestNameLength = 0;
  
  // Find earliest and latest dates
  let earliestDate = new Date();
  let latestDate = new Date(0);
  
  // Find last modification time (from data file)
  let lastModified = null;
  try {
    const fs = require('fs');
    const path = require('path');
    const dbFile = path.join(__dirname, '..', 'data', 'vault.json');
    const stats = fs.statSync(dbFile);
    lastModified = stats.mtime;
  } catch (error) {
    lastModified = new Date();
  }
  
  data.forEach(record => {
    // Check for longest name
    if (record.name.length > longestNameLength) {
      longestNameLength = record.name.length;
      longestName = record.name;
    }
    
    // Check for earliest and latest dates
    const recordDate = new Date(record.id);
    if (recordDate < earliestDate) earliestDate = recordDate;
    if (recordDate > latestDate) latestDate = recordDate;
  });
  
  return {
    totalRecords: data.length,
    lastModified: lastModified.toLocaleString(),
    longestName: `${longestName} (${longestNameLength} characters)`,
    earliestRecord: earliestDate.toISOString().split('T')[0],
    latestRecord: latestDate.toISOString().split('T')[0],
    nameLength: longestNameLength,
    dateRange: `${earliestDate.toISOString().split('T')[0]} to ${latestDate.toISOString().split('T')[0]}`
  };
}

module.exports = { 
  addRecord, 
  listRecords, 
  updateRecord, 
  deleteRecord, 
  searchRecords,
  sortRecords,
  exportToTextFile,
  createManualBackup,
  getVaultStatistics 
};