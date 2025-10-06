const fs = require('fs');
const { Command } = require('commander');

const program = new Command();

program
  .option('-i, --input <path>', 'шлях до вхідного файлу')
  .option('-o, --output <path>', 'шлях для вихідного файлу')
  .option('-d, --display', 'вивести результат у консоль')
  .option('-m, --mfo', 'відображати код МФО банку')
  .option('-n, --normal', 'фільтрувати за статусом "Нормальний"');

program.parse(process.argv);
const options = program.opts();

if (!options.input) {
  console.error('Please, specify input file');
  process.exit(1);
}

try {
  const data = fs.readFileSync(options.input, 'utf8');
  const banks = JSON.parse(data);

  let filteredBanks = banks;
  if (options.normal) {
    filteredBanks = banks.filter(bank => bank.COD_STATE === 1);
  }

  const result = filteredBanks.map(bank => {
    if (options.mfo) {
      return `${bank.ID_NBU} ${bank.SHORTNAME}`;
    }
    return bank.SHORTNAME;
  }).join('\n');

  if (options.display && result) {
    console.log(result);
  }

  if (options.output && result) {
    fs.writeFileSync(options.output, result);
  }

} catch (error) {
  if (error.code === 'ENOENT') {
    console.error('Cannot find input file');
  } else {
    console.error('Помилка обробки даних:', error.message);
  }
  process.exit(1);
}