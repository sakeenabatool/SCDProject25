const readline = require('readline');
const db = require('./db');
require('./events/logger'); // Initialize event logger

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function menu() {
  console.log(`
===== NodeVault =====
1. Add Record
2. List Records
3. Update Record
4. Delete Record
5. Search Records
6. Sort Records
7. Export Data
8. Create Backup     
9. Exit
=====================
  `);

  rl.question('Choose option: ', ans => {
    switch (ans.trim()) {
      case '1':
        rl.question('Enter name: ', name => {
          rl.question('Enter value: ', value => {
            db.addRecord({ name, value });
            console.log('✅ Record added successfully!');
            menu();
          });
        });
        break;

      case '2':
        const records = db.listRecords();
        if (records.length === 0) console.log('No records found.');
        else records.forEach(r => console.log(`ID: ${r.id} | Name: ${r.name} | Value: ${r.value}`));
        menu();
        break;

      case '3':
        rl.question('Enter record ID to update: ', id => {
          rl.question('New name: ', name => {
            rl.question('New value: ', value => {
              const updated = db.updateRecord(Number(id), name, value);
              console.log(updated ? '✅ Record updated!' : '❌ Record not found.');
              menu();
            });
          });
        });
        break;

      case '4':
        rl.question('Enter record ID to delete: ', id => {
          const deleted = db.deleteRecord(Number(id));
          console.log(deleted ? '🗑️ Record deleted!' : '❌ Record not found.');
          menu();
        });
        break;

      case '5':  // NEW CASE FOR SEARCH
        rl.question('Enter search keyword: ', keyword => {
          const db = require('./db');
          const results = db.searchRecords(keyword);
          
          if (results.length === 0) {
            console.log('No records found.');
          } else {
            console.log(`Found ${results.length} matching record(s):`);
            results.forEach((record, index) => {
              console.log(`${index + 1}. ID: ${record.id} | Name: ${record.name} | Value: ${record.value}`);
            });
          }
          menu();
        });
      break;

      case '6': 
        rl.question('Choose field to sort by (name/date): ', field => {
          const validFields = ['name', 'date'];
          if (!validFields.includes(field.toLowerCase())) {
            console.log('Invalid field. Please choose "name" or "date".');
            menu();
            return;
          }
          
          rl.question('Choose order (ascending/descending): ', order => {
            const validOrders = ['ascending', 'descending'];
            if (!validOrders.includes(order.toLowerCase())) {
              console.log('Invalid order. Please choose "ascending" or "descending".');
              menu();
              return;
            }
            
            const db = require('./db');
            const sortedRecords = db.sortRecords(field.toLowerCase(), order.toLowerCase());
            
            console.log(`\nSorted Records (${field} - ${order}):`);
            if (sortedRecords.length === 0) {
              console.log('No records found.');
            } else {
              sortedRecords.forEach((record, index) => {
                const date = new Date(record.id).toISOString().split('T')[0];
                console.log(`${index + 1}. ID: ${record.id} | Name: ${record.name} | Created: ${date}`);
              });
            }
            menu();
          });
        });
        break;

      case '7': 
        const db = require('./db');
        const result = db.exportToTextFile();
        
        if (result.success) {
          console.log(`Data exported successfully to export.txt`);
          console.log(`Total records exported: ${result.recordCount}`);
        } else {
          console.log(`Export failed: ${result.error}`);
        }
        menu();
        break;
        
      case '8': 
        const db = require('./db');
        console.log('Creating manual backup...');
        result = db.createManualBackup();
        
        if (result.success) {
          console.log(`Backup created successfully!`);
          console.log(`File: ${result.filePath}`);
          console.log(`Records backed up: ${result.recordCount}`);
        }
        menu();
        break;
        
      case '9':  // Changed from 8 to 9
        console.log('Exiting NodeVault...');
        rl.close();
        break;
      default:
        console.log('Invalid option.');
        menu();
    }
  });
}

menu();
