const fs = require('fs');
const { Command } = require('commander');

const program = new Command();

program
  .option('-i, --input <path>', 'шлях до вхідного файлу')
  .option('-o, --output <path>', 'шлях для вихідного файлу')
  .option('-d, --display', 'вивести результат у консоль');

program.parse(process.argv);
const options = program.opts();

// Ручна перевірка обов'язкового параметра
if (!options.input) {
  console.error('Please, specify input file');
  process.exit(1);
}

// Решта вашого коду залишається без змін
try {
  const data = fs.readFileSync(options.input, 'utf8');
  const jsonData = JSON.parse(data);
  
  console.log('Файл успішно прочитано!');
  console.log(`Знайдено записів: ${jsonData.length}`);
  
  if (options.display) {
    console.log('\nПерші 2 записи:');
    console.log(JSON.stringify(jsonData.slice(0, 2), null, 2));
  }
  
  if (options.output) {
    fs.writeFileSync(options.output, JSON.stringify(jsonData.slice(0, 2), null, 2));
    console.log(`Результат записано у файл: ${options.output}`);
  }
  
} catch (error) {
  if (error.code === 'ENOENT') {
    console.error('Cannot find input file');
  } else {
    console.error('Помилка читання файлу:', error.message);
  }
  process.exit(1);
}