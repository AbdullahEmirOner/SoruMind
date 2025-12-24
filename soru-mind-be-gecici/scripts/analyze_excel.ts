
import * as XLSX from 'xlsx';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'Cozumlu_Sonuc.xlsx');
console.log(`Reading file from: ${filePath}`);

try {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  // Get headers
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
  if (data && data.length > 0) {
    console.log('Headers:', JSON.stringify(data[0]));
    if (data.length > 1) {
        console.log('Sample Row 1:', JSON.stringify(data[1]));
    }
  } else {
    console.log('Sheet is empty or invalid.');
  }

} catch (error) {
  console.error('Error reading file:', error);
}
